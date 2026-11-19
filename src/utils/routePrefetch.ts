const prefetchedPaths = new Set<string>();

const ROUTE_CHUNK_LOADERS: Record<string, () => Promise<unknown>> = {
  // Espace Agence
  "/agency": () => import("@/components/agency/Dashboard"),
  "/agency/passport-index": () => import("@/components/agency/PassportIndex"),
  "/agency/apply": () => import("@/components/agency/VisaWizard"),
  "/agency/applications": () => import("@/components/agency/AgencyApplications"),
  "/agency/trips": () => import("@/components/agency/OrganizedTrips"),
  "/agency/study": () => import("@/components/agency/StudyPrograms"),
  "/agency/wallet": () => import("@/components/agency/AgencyWallet"),
  "/agency/support": () => import("@/components/agency/AgencySupport"),
  "/agency/settings": () => import("@/components/agency/AgencySettings"),

  // Espace Admin
  "/admin": () => import("@/components/admin/AdminDashboard"),
  "/admin/countries": () => import("@/components/admin/ServiceCatalog"),
  "/admin/applications": () => import("@/components/admin/ApplicationManagement"),
  "/admin/trips": () => import("@/components/admin/OrganizedTripsManagement"),
  "/admin/study": () => import("@/components/admin/StudyProgramsManagement"),
  "/admin/agencies": () => import("@/components/admin/AgencyManagement"),
  "/admin/finances": () => import("@/components/admin/FinancesManagement"),
  "/admin/support": () => import("@/components/admin/SupportManagement"),
  "/admin/settings": () => import("@/components/admin/AdminSettings"),
};

/**
 * Précharge le chunk JS d'une route spécifique une seule fois (au survol/focus ou en idle).
 */
export function prefetchRouteChunk(path: string): void {
  const normalized = path.split("?")[0];
  if (prefetchedPaths.has(normalized)) return;

  const loader = ROUTE_CHUNK_LOADERS[normalized];
  if (!loader) return;

  prefetchedPaths.add(normalized);
  void loader().catch(() => {
    prefetchedPaths.delete(normalized);
  });
}

function scheduleIdleBatch(paths: string[], delayMs = 250): void {
  if (typeof window === "undefined") return;

  const win = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  };

  const run = () => {
    paths.forEach((p, index) => {
      win.setTimeout(() => prefetchRouteChunk(p), index * 80);
    });
  };

  if (typeof win.requestIdleCallback === "function") {
    win.requestIdleCallback(run, { timeout: 1500 });
  } else {
    win.setTimeout(run, delayMs);
  }
}

export function prefetchAgencyPortalChunks(): void {
  scheduleIdleBatch([
    "/agency",
    "/agency/applications",
    "/agency/apply",
    "/agency/trips",
    "/agency/study",
    "/agency/wallet",
    "/agency/support",
    "/agency/passport-index",
    "/agency/settings",
  ]);
}

export function prefetchAdminPortalChunks(): void {
  scheduleIdleBatch([
    "/admin",
    "/admin/applications",
    "/admin/agencies",
    "/admin/finances",
    "/admin/support",
    "/admin/trips",
    "/admin/study",
    "/admin/countries",
    "/admin/settings",
  ]);
}
