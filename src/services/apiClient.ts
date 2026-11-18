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
  if (!forceRefresh && pendingProbe) {
    return pendingProbe;
  }

  pendingProbe = (async () => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
      const res = await fetch("/api/health", {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        const mode: BackendDatabaseMode = data?.database === "mysql" ? "mysql" : "firestore";
        setCachedBackendMode(mode);
        return mode;
      }
    } catch {
      // Conserver MySQL si déjà confirmé dans la session (évite de retomber sur Firestore lors d'une micro-coupure)
      if (cachedMode === "mysql") {
        cachedAt = Date.now();
        return "mysql";
      }
    }
    if (cachedMode === "mysql") {
      return "mysql";
    }
    setCachedBackendMode("firestore");
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
