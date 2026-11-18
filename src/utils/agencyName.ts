import type { Agency } from "../store/useAppStore";

const PLACEHOLDER_NAMES = new Set([
  "mon agence b2b",
  "mon agence",
  "mon agence partenaire",
  "agence b2b",
  "agence partenaire",
  "agence sans nom",
  "agence",
  "une agence",
  "my agency",
  "agency",
  "unknown",
  "inconnue",
  "non spécifiée",
  "non specifiee",
  "n/a",
  "none",
  "null",
  "undefined",
]);

export function isPlaceholderAgencyName(value?: string | null): boolean {
  if (!value || typeof value !== "string") return true;
  const normalized = value.trim().toLowerCase().replace(/\s+/g, " ");
  if (!normalized) return true;
  return PLACEHOLDER_NAMES.has(normalized);
}

function cleanNonPlaceholder(value?: string | null): string {
  if (!value || typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed || isPlaceholderAgencyName(trimmed)) return "";
  return trimmed;
}

function isEmailLike(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Retourne le vrai nom commercial d'une agence à partir de son profil et d'un éventuel nom de repli.
 * Ignore systématiquement les libellés génériques ("Mon Agence B2B", "Mon Agence", etc.).
 */
export function getAgencyDisplayName(
  agency?: Partial<Agency> | null,
  fallbackName?: string | null,
  fallbackDefault = "Agence Partenaire"
): string {
  const candidates = [
    agency?.agencyName,
    agency?.companyName,
    agency?.name,
    agency?.managerName,
  ];

  for (const raw of candidates) {
    const clean = cleanNonPlaceholder(raw);
    if (clean && !isEmailLike(clean)) {
      return clean;
    }
  }

  const cleanFallback = cleanNonPlaceholder(fallbackName);
  if (cleanFallback && !isEmailLike(cleanFallback)) {
    return cleanFallback;
  }

  const emailCandidate = cleanNonPlaceholder(agency?.email) || cleanFallback;
  if (emailCandidate) {
    return emailCandidate;
  }

  return fallbackDefault;
}

export function buildAgenciesLookup(
  agencies: Partial<Agency>[] = []
): Map<string, Partial<Agency>> {
  const map = new Map<string, Partial<Agency>>();
  for (const agency of agencies) {
    if (!agency) continue;
    if (agency.id) {
      map.set(agency.id, agency);
    }
    if (agency.email) {
      map.set(agency.email.trim().toLowerCase(), agency);
    }
  }
  return map;
}

/**
 * Résout le nom réel d'une agence sur un dossier, une réservation, un ticket ou une transaction,
 * même si l'enregistrement stocké contient encore un ancien libellé générique ou un email.
 */
export function resolveRecordAgencyName(
  record: { agencyId?: string; agencyName?: string; agency?: string } | null | undefined,
  agenciesLookupOrList: Map<string, Partial<Agency>> | Partial<Agency>[],
  fallbackDefault = "Agence Partenaire"
): string {
  if (!record) return fallbackDefault;

  const lookup =
    agenciesLookupOrList instanceof Map
      ? agenciesLookupOrList
      : buildAgenciesLookup(agenciesLookupOrList);

  const rawStored = record.agencyName || record.agency || "";
  const storedTrimmed = typeof rawStored === "string" ? rawStored.trim() : "";

  const matchedAgency =
    (record.agencyId ? lookup.get(record.agencyId) : undefined) ||
    (storedTrimmed && isEmailLike(storedTrimmed)
      ? lookup.get(storedTrimmed.toLowerCase())
      : undefined);

  if (matchedAgency) {
    return getAgencyDisplayName(matchedAgency, storedTrimmed, fallbackDefault);
  }

  const cleanStored = cleanNonPlaceholder(storedTrimmed);
  if (cleanStored) {
    return cleanStored;
  }

  return fallbackDefault;
}
