/**
 * Utilitaire de formatage et découpage intelligent des conditions,
 * critères consulaires et prérequis académiques.
 * Transforme n'importe quel format (chaîne unique, sauts de ligne, puces, tirets, point-virgules)
 * en une liste propre et ordonnée de critères distincts.
 */
export function parseConditionsList(input: string | string[] | undefined | null): string[] {
  if (!input) return [];

  const rawList: string[] = Array.isArray(input) ? input : [input];
  const items: string[] = [];

  for (const entry of rawList) {
    if (!entry || typeof entry !== "string") continue;

    // Découpage par sauts de ligne, puces (•, -, *), point-virgules, ou fins de phrase suivies d'une majuscule
    const parts = entry
      .split(/\r?\n|•|;|(?<=[.!?])\s+(?=[A-ZÀ-ÿ0-9])/)
      .map(s => s.trim().replace(/^[-*•]\s*/, '').trim())
      .filter(s => s.length > 2);

    if (parts.length > 0) {
      for (const p of parts) {
        // Éviter les doublons exacts et normaliser la ponctuation finale
        const cleaned = p.replace(/\.+$/, '').trim();
        if (cleaned.length > 2 && !items.includes(cleaned)) {
          items.push(cleaned);
        }
      }
    } else if (entry.trim().length > 2) {
      const single = entry.trim().replace(/^[-*•]\s*/, '').replace(/\.+$/, '').trim();
      if (!items.includes(single)) {
        items.push(single);
      }
    }
  }

  return items;
}
