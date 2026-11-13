/**
 * Utilitaires de cybersécurité et assainissement des entrées utilisateurs.
 * Protège l'application contre les attaques XSS, injections de balises et surcharge volumétrique.
 */

/**
 * Nettoie une chaîne de caractères en supprimant les balises HTML et les scripts malveillants.
 */
export function sanitizeString(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') return '';
  
  // Suppression des balises HTML et encodage sécurisé
  const clean = input
    .replace(/<[^>]*>/g, '') // Supprime les balises HTML complètes
    .replace(/javascript\s*:/gi, '') // Supprime le protocole javascript:
    .replace(/on\w+\s*=/gi, '') // Supprime les gestionnaires d'événements inline (onerror=, onload=)
    .trim();

  // Tronque à la longueur maximale autorisée pour éviter la surcharge mémoire/Firestore
  return clean.substring(0, maxLength);
}

/**
 * Assainit un numéro de passeport (majuscules, alphanumérique strict, max 15 caractères).
 */
export function sanitizePassportNumber(passport: unknown): string {
  if (typeof passport !== 'string') return '';
  return passport.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
}

/**
 * Assainit un numéro de téléphone (chiffres, +, espaces, tirets uniquement).
 */
export function sanitizePhone(phone: unknown): string {
  if (typeof phone !== 'string') return '';
  return phone.replace(/[^0-9+\s\-()]/g, '').slice(0, 25);
}

/**
 * Assainit une adresse email (minuscules, sans espaces, validation de format basique).
 */
export function sanitizeEmail(email: unknown): string {
  if (typeof email !== 'string') return '';
  const cleaned = email.toLowerCase().trim().slice(0, 120);
  // Vérification de base pour éviter les injections d'en-tête
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
    return cleaned.replace(/[^\w.@+-]/g, '');
  }
  return cleaned;
}

/**
 * Assainit récursivement un objet de formulaire avant de le transmettre à Firebase.
 */
export function sanitizeFormObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;

  const result: any = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      if (key.toLowerCase().includes('email')) {
        result[key] = sanitizeEmail(value);
      } else if (key.toLowerCase().includes('passport')) {
        result[key] = sanitizePassportNumber(value);
      } else if (key.toLowerCase().includes('phone')) {
        result[key] = sanitizePhone(value);
      } else {
        result[key] = sanitizeString(value, key.toLowerCase().includes('note') || key.toLowerCase().includes('desc') ? 2000 : 500);
      }
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeFormObject(value);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
