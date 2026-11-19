import { auth } from "../firebase";

export type BackendDatabaseMode = "mysql" | "firestore";

const SESSION_MODE_KEY = "cldor_db_mode";

function readSessionMode(): BackendDatabaseMode | null {
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const val = window.sessionStorage.getItem(SESSION_MODE_KEY);
      if (val === "mysql" || val === "firestore") return val;
    }
  } catch {
    // Ignorer
  }
  return null;
}

let cachedMode: BackendDatabaseMode | null = readSessionMode();
let cachedAt = cachedMode ? Date.now() : 0;
let pendingProbe: Promise<BackendDatabaseMode> | null = null;
const MODE_CACHE_TTL_MS = 5 * 60 * 1000;

export function isMysqlModeCached(): boolean {
  return cachedMode === "mysql";
}

export function getCachedBackendMode(): BackendDatabaseMode {
  return cachedMode || "firestore";
}

export function setCachedBackendMode(mode: BackendDatabaseMode) {
  cachedMode = mode;
  cachedAt = Date.now();
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.setItem(SESSION_MODE_KEY, mode);
    }
  } catch {
    // Ignorer
  }
}

export async function getBackendMode(forceRefresh = false): Promise<BackendDatabaseMode> {
  if (!forceRefresh && cachedMode && Date.now() - cachedAt < MODE_CACHE_TTL_MS) {
    return cachedMode;
  }
  if (pendingProbe) {
    return pendingProbe;
  }

  pendingProbe = (async () => {
    const probeOnce = async (): Promise<BackendDatabaseMode | null> => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);
      try {
        const res = await fetch("/api/health", {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          return data?.database === "mysql" ? "mysql" : "firestore";
        }
      } finally {
        clearTimeout(timer);
      }
      return null;
    };

    try {
      let detected = await probeOnce();
      if (!detected && cachedMode !== "mysql") {
        await new Promise((r) => setTimeout(r, 350));
        detected = await probeOnce();
      }
      if (detected) {
        if (detected === "mysql" || cachedMode !== "mysql" || forceRefresh) {
          setCachedBackendMode(detected);
          return detected;
        }
      }
    } catch {
      // Conserver MySQL si déjà confirmé dans la session (évite toute bascule vers Firestore sur micro-coupure)
      if (cachedMode === "mysql") {
        cachedAt = Date.now();
        return "mysql";
      }
    }

    if (cachedMode === "mysql") {
      return "mysql";
    }
    // Ne pas mettre en cache 'firestore' si la sonde réseau a échoué sans réponse valide
    return "firestore";
  })().finally(() => {
    pendingProbe = null;
  });

  return pendingProbe;
}

export async function getAuthTokenHeader(): Promise<Record<string, string>> {
  try {
    const token = await auth.currentUser?.getIdToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  } catch {
    // Pas de jeton
  }
  return {};
}

export async function apiFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeaders = await getAuthTokenHeader();
  const headers: Record<string, string> = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...authHeaders,
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  let payload: any = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    const errMsg = payload?.error || payload?.message || `Erreur serveur (${res.status})`;
    throw new Error(errMsg);
  }

  return payload as T;
}

const pendingAuthMeByUid = new Map<string, Promise<any>>();

/**
 * Récupère /api/db/auth/me en dédupliquant les appels simultanés (Login.tsx + onAuthStateChanged).
 */
export async function fetchMysqlAuthMe(uid: string): Promise<any | null> {
  const existing = pendingAuthMeByUid.get(uid);
  if (existing) {
    return existing;
  }

  const reqPromise = (async () => {
    try {
      const res = await apiFetch<{ user: any }>("/api/db/auth/me");
      return res?.user || null;
    } catch (err: any) {
      const msg = String(err?.message || "");
      if (msg.toLowerCase().includes("introuvable")) {
        return null;
      }
      throw err;
    }
  })().finally(() => {
    pendingAuthMeByUid.delete(uid);
  });

  pendingAuthMeByUid.set(uid, reqPromise);
  return reqPromise;
}
