import { FileText, type LucideIcon } from "lucide-react";
import { AGENCY_SERVICES, type AgencyServiceConfig } from "../constants/servicesConfig";
import type { PrestationService, ServiceType } from "../store/useAppStore";

export interface ServiceCategoryMeta {
  id: string;
  name: string;
  icon: LucideIcon;
  badgeBg: string;
  badgeText: string;
  badge: string;
}

/**
 * Normalise un identifiant/libellé de famille pour la comparaison.
 */
function normalizeText(value: string | undefined | null): string {
  return (value || "").toLowerCase().trim();
}

/**
 * Recherche la famille officielle correspondant au paramètre d'URL ou à une chaîne libre.
 */
export function findFamilyByParam(param: string | null | undefined): AgencyServiceConfig | null {
  if (!param) return null;
  const p = normalizeText(param);
  if (!p) return null;

  return (
    AGENCY_SERVICES.find(
      (s) =>
        s.id === p ||
        s.name.toLowerCase() === p ||
        s.name.toLowerCase().includes(p) ||
        (s.nameEn && (s.nameEn.toLowerCase() === p || s.nameEn.toLowerCase().includes(p))) ||
        s.matchKeys.some(
          (k) =>
            k.toLowerCase() === p ||
            p.includes(k.toLowerCase()) ||
            k.toLowerCase().includes(p)
        )
    ) || null
  );
}

/**
 * Détermine de façon rigoureuse et déterministe si une prestation appartient à une famille du dashboard.
 * Priorité : 1) Correspondance exacte type/id, 2) MatchKeys sur type, 3) Fallback sur titre uniquement si type générique/vide.
 */
export function doesServiceMatchFamily(
  service: PrestationService,
  family: AgencyServiceConfig
): boolean {
  const sType = normalizeText(service.type);
  const targetName = normalizeText(family.name);
  const targetId = normalizeText(family.id);

  if (sType === targetName || sType === targetId) return true;

  if (
    family.matchKeys.some((k) => {
      const key = k.toLowerCase();
      return sType === key || sType.includes(key);
    })
  ) {
    return true;
  }

  if (!sType || sType === "service" || sType === "demande") {
    const sTitle = normalizeText(service.title);
    return family.matchKeys.some((k) => sTitle.includes(k.toLowerCase()));
  }

  return false;
}

/**
 * Version par identifiant d'onglet (ALL ou id de famille).
 */
export function doesServiceMatchTab(service: PrestationService, tabId: string): boolean {
  if (tabId === "ALL") return true;
  const target = AGENCY_SERVICES.find((srv) => srv.id === tabId);
  if (!target) return true;
  return doesServiceMatchFamily(service, target);
}

/**
 * Retourne les métadonnées visuelles et le libellé exact d'une prestation.
 */
export function getServiceCategoryMeta(type: string, title?: string): ServiceCategoryMeta {
  const typeLower = normalizeText(type);

  const exact = AGENCY_SERVICES.find(
    (srv) => srv.id === typeLower || srv.name.toLowerCase() === typeLower
  );
  if (exact) {
    return {
      id: exact.id,
      name: exact.name,
      icon: exact.icon,
      badgeBg: exact.bgColor,
      badgeText: exact.textColor,
      badge: exact.badge
    };
  }

  const matchType = AGENCY_SERVICES.find((srv) =>
    srv.matchKeys.some((k) => {
      const key = k.toLowerCase();
      return typeLower === key || typeLower.includes(key);
    })
  );
  if (matchType) {
    return {
      id: matchType.id,
      name: matchType.name,
      icon: matchType.icon,
      badgeBg: matchType.bgColor,
      badgeText: matchType.textColor,
      badge: matchType.badge
    };
  }

  if (!typeLower || typeLower === "service" || typeLower === "demande") {
    const titleLower = normalizeText(title);
    const matchTitle = AGENCY_SERVICES.find((srv) =>
      srv.matchKeys.some((k) => titleLower.includes(k.toLowerCase()))
    );
    if (matchTitle) {
      return {
        id: matchTitle.id,
        name: matchTitle.name,
        icon: matchTitle.icon,
        badgeBg: matchTitle.bgColor,
        badgeText: matchTitle.textColor,
        badge: matchTitle.badge
      };
    }
  }

  return {
    id: "other",
    name: type || "Visa B2B",
    icon: FileText,
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    badge: "Standard"
  };
}

/**
 * Calcule en une seule passe O(N) le nombre de prestations par famille.
 */
export function computeFamilyCounts(
  services: PrestationService[]
): Record<string, { total: number; active: number }> {
  const counts: Record<string, { total: number; active: number }> = {
    ALL: { total: 0, active: 0 }
  };

  for (const srv of AGENCY_SERVICES) {
    counts[srv.id] = { total: 0, active: 0 };
  }

  for (const service of services) {
    counts.ALL.total += 1;
    if (service.active) counts.ALL.active += 1;

    for (const family of AGENCY_SERVICES) {
      if (doesServiceMatchFamily(service, family)) {
        counts[family.id].total += 1;
        if (service.active) counts[family.id].active += 1;
      }
    }
  }

  return counts;
}

/**
 * Calcule le tarif public B2C et la marge nette à partir du tarif B2B.
 */
export function computeB2cPricing(b2bPrice: number, marginPercent: number): {
  clientPrice: number;
  marginAmount: number;
} {
  const safeMargin = marginPercent || 15;
  const clientPrice = Math.round(b2bPrice * (1 + safeMargin / 100));
  const marginAmount = Math.round(b2bPrice * (safeMargin / 100));
  return { clientPrice, marginAmount };
}

/**
 * Normalise le type de prestation vers l'union stricte `ServiceType` du store.
 */
export function resolveApplicationServiceType(rawType: string): ServiceType {
  const lower = normalizeText(rawType);
  if (lower.includes("invitation")) return "Invitation";
  if (lower.includes("rendez") || lower.includes("rdv")) return "Rendez-vous";
  if (lower.includes("résidence") || lower.includes("residence")) return "Residence";
  if (lower.includes("permis")) return "Permis";
  if (lower.includes("assurance")) return "Assurance";
  if (lower.includes("etude") || lower.includes("étude")) return "Etude";
  if (lower.includes("dossier")) return "Dossier";
  return "Evisa";
}
