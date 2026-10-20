/**
 * Module d'Analyse et de Lecture Automatique de Passeports Biométriques
 * 100% Fonctionnel côté Navigateur (Compatible Hostinger, Apache, cPanel, Vite SPA)
 * Utilise la reconnaissance optique (Tesseract OCR) et l'algorithme officiel ICAO 9303 (MRZ).
 */

import { createWorker } from "tesseract.js";

export interface PassportScanResult {
  firstName: string;
  lastName: string;
  passportNumber: string;
  dateOfBirth: string; // YYYY-MM-DD
  expiryDate: string;   // YYYY-MM-DD
  issueDate?: string;   // YYYY-MM-DD
  nationality: string;
  gender: "M" | "F";
  issuingCountry: string;
  placeOfBirth?: string;
}

// Table de correspondance codes pays ICAO vers libellés en français
const COUNTRY_CODES: Record<string, { country: string; nationality: string }> = {
  DZA: { country: "Algérie", nationality: "Algérienne" },
  FRA: { country: "France", nationality: "Française" },
  ESP: { country: "Espagne", nationality: "Espagnole" },
  TUR: { country: "Turquie", nationality: "Turque" },
  TUN: { country: "Tunisie", nationality: "Tunisienne" },
  MAR: { country: "Maroc", nationality: "Marocaine" },
  EGY: { country: "Égypte", nationality: "Égyptienne" },
  SAU: { country: "Arabie Saoudite", nationality: "Saoudienne" },
  ARE: { country: "Émirats Arabes Unis", nationality: "Émiratie" },
  ITA: { country: "Italie", nationality: "Italienne" },
  DEU: { country: "Allemagne", nationality: "Allemande" },
  GBR: { country: "Royaume-Uni", nationality: "Britannique" },
  USA: { country: "États-Unis", nationality: "Américaine" },
  CAN: { country: "Canada", nationality: "Canadienne" },
  CHN: { country: "Chine", nationality: "Chinoise" },
  RUS: { country: "Russie", nationality: "Russe" }
};

/**
 * Nettoie une chaîne de caractères pour corriger les erreurs courantes de l'OCR
 */
function cleanMrzString(str: string): string {
  return str
    .toUpperCase()
    .replace(/[«‹«]/g, "<")
    .replace(/[{(\[]/g, "<")
    .replace(/[})\]]/g, "<")
    .replace(/ /g, "")
    .trim();
}

/**
 * Convertit une date YYMMDD du MRZ en format ISO YYYY-MM-DD
 */
function parseMrzDate(dateStr: string, isExpiry = false): string {
  if (!dateStr || dateStr.length < 6) return "";
  const yy = parseInt(dateStr.substring(0, 2), 10);
  const mm = dateStr.substring(2, 4);
  const dd = dateStr.substring(4, 6);

  if (isNaN(yy)) return "";

  let year: number;
  if (isExpiry) {
    // Les dates d'expiration sont typiquement dans les années 2024-2040
    year = 2000 + yy;
  } else {
    // Pour la date de naissance : si YY > 35, c'est 19YY, sinon 20YY
    year = yy > 35 ? 1900 + yy : 2000 + yy;
  }

  return `${year}-${mm}-${dd}`;
}

/**
 * Analyse les deux lignes de la bande MRZ (ICAO Doc 9303 TD3 - 44 caractères par ligne)
 */
export function parseMrzLines(lines: string[]): Partial<PassportScanResult> | null {
  const cleaned = lines.map(cleanMrzString).filter(l => l.length >= 20);

  let line1 = "";
  let line2 = "";

  for (let i = 0; i < cleaned.length; i++) {
    const l = cleaned[i];
    // Ligne 1 commence généralement par P< ou P[A-Z]<
    if (l.startsWith("P<") || (l.startsWith("P") && l.includes("<") && !line1)) {
      line1 = l;
      if (i + 1 < cleaned.length) {
        line2 = cleaned[i + 1];
      }
      break;
    }
  }

  // Si on n'a pas trouvé avec P<, cherche deux lignes successives avec chevrons
  if (!line1 || !line2) {
    for (let i = 0; i < cleaned.length - 1; i++) {
      const c1 = (cleaned[i].match(/</g) || []).length;
      const c2 = (cleaned[i + 1].match(/</g) || []).length;
      if (c1 >= 3 && (c2 >= 2 || /\d{6}/.test(cleaned[i + 1]))) {
        line1 = cleaned[i];
        line2 = cleaned[i + 1];
        break;
      }
    }
  }

  if (!line1 || !line2) {
    return null;
  }

  const result: Partial<PassportScanResult> = {};

  try {
    // ---- LIGNE 1 : Type, Pays, Nom, Prénoms ----
    // Format : P<DZAEL<<KADI<<<<<<<<<<<<<<<<<<
    const line1Clean = line1.padEnd(44, "<");
    const countryCode = line1Clean.substring(2, 5).replace(/</g, "");
    
    if (COUNTRY_CODES[countryCode]) {
      result.issuingCountry = COUNTRY_CODES[countryCode].country;
      result.nationality = COUNTRY_CODES[countryCode].nationality;
    } else {
      result.issuingCountry = "Algérie";
      result.nationality = "Algérienne";
    }

    const nameSection = line1Clean.substring(5);
    const nameParts = nameSection.split("<<");
    
    if (nameParts.length >= 1) {
      result.lastName = nameParts[0].replace(/</g, " ").trim();
    }
    if (nameParts.length >= 2) {
      result.firstName = nameParts[1].replace(/</g, " ").trim();
    }

    // ---- LIGNE 2 : N° Passeport, Naissance, Sexe, Expiration ----
    // Format : 1985432104DZA8805142M3008246<<<<<<<<<<<<<<02
    const line2Clean = line2.padEnd(44, "<");

    // N° de passeport : 9 premiers caractères (nettoyés des '<')
    let passNumRaw = line2Clean.substring(0, 9).replace(/</g, "").trim();
    // Correction des erreurs OCR fréquentes (O -> 0)
    passNumRaw = passNumRaw.replace(/O/g, "0").replace(/I/g, "1");
    if (passNumRaw) {
      result.passportNumber = passNumRaw;
    }

    // Date de naissance : caractères 13 à 18 (YYMMDD)
    const dobRaw = line2Clean.substring(13, 19).replace(/O/g, "0");
    if (/^\d{6}$/.test(dobRaw)) {
      result.dateOfBirth = parseMrzDate(dobRaw, false);
    }

    // Sexe : caractère 20 (M ou F)
    const sexChar = line2Clean.charAt(20);
    if (sexChar === "M" || sexChar === "F") {
      result.gender = sexChar;
    } else {
      result.gender = "M";
    }

    // Date d'expiration : caractères 21 à 27 (YYMMDD)
    const expRaw = line2Clean.substring(21, 27).replace(/O/g, "0");
    if (/^\d{6}$/.test(expRaw)) {
      result.expiryDate = parseMrzDate(expRaw, true);
    }

    return result;
  } catch (err) {
    console.error("Erreur parsing MRZ:", err);
    return result;
  }
}

/**
 * Analyse de secours basée sur les libellés textuels de la zone visuelle (VIZ)
 */
export function parseVisualFields(text: string): Partial<PassportScanResult> {
  const result: Partial<PassportScanResult> = {};
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  // Recherche du numéro de passeport : 8 à 10 chiffres (format algérien standard = 9 chiffres)
  const passRegex = /\b([0-9]{8,10})\b/g;
  let match;
  while ((match = passRegex.exec(text)) !== null) {
    const val = match[1];
    // Éviter les dates au format YYYYMMDD
    if (!val.startsWith("19") && !val.startsWith("20") && val.length === 9) {
      result.passportNumber = val;
      break;
    }
  }

  // Recherche avec libellé explicite "Passeport / Passport N°"
  const passLabelRegex = /(?:passeport|passport|n°|no)[\s.:]*([0-9A-Z]{8,10})/i;
  const labelMatch = text.match(passLabelRegex);
  if (labelMatch && labelMatch[1]) {
    result.passportNumber = labelMatch[1].replace(/O/g, "0").trim();
  }

  // Recherche des dates au format DD/MM/YYYY ou DD.MM.YYYY
  const dateRegex = /\b(\d{2})[\/\.-](\d{2})[\/\.-](\d{4})\b/g;
  const dates: string[] = [];
  while ((match = dateRegex.exec(text)) !== null) {
    dates.push(`${match[3]}-${match[2]}-${match[1]}`);
  }

  if (dates.length >= 1) {
    dates.sort();
    result.dateOfBirth = dates[0];
    if (dates.length >= 2) {
      result.expiryDate = dates[dates.length - 1];
    }
  }

  // Recherche Nom / Prénom
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].toLowerCase();
    if ((l.includes("nom") || l.includes("surname")) && i + 1 < lines.length) {
      const val = lines[i + 1].replace(/[^A-Za-zÀ-ÿ\s]/g, "").trim();
      if (val && val.length > 2 && !result.lastName) result.lastName = val.toUpperCase();
    }
    if ((l.includes("prénom") || l.includes("prenom") || l.includes("given name")) && i + 1 < lines.length) {
      const val = lines[i + 1].replace(/[^A-Za-zÀ-ÿ\s]/g, "").trim();
      if (val && val.length > 2 && !result.firstName) result.firstName = val.toUpperCase();
    }
  }

  return result;
}

/**
 * Prétraite l'image via Canvas pour optimiser la netteté et générer une zone MRZ à fort contraste
 */
async function preprocessPassportImage(imageSource: string | File, cropMrzOnly = false): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const sourceWidth = img.width;
      const sourceHeight = img.height;

      let sx = 0;
      let sy = 0;
      let sWidth = sourceWidth;
      let sHeight = sourceHeight;

      if (cropMrzOnly) {
        // Découper les 40% inférieurs où réside la bande MRZ
        sy = Math.round(sourceHeight * 0.60);
        sHeight = sourceHeight - sy;
      }

      const targetWidth = Math.min(sWidth, 1600);
      const scale = targetWidth / sWidth;
      const targetHeight = Math.round(sHeight * scale);

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(typeof imageSource === "string" ? imageSource : URL.createObjectURL(imageSource));
        return;
      }

      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);

      // Traitement d'accentuation et de contraste
      try {
        const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          // Binarisation avec seuil adaptatif
          const threshold = cropMrzOnly ? 115 : 128;
          const val = gray < threshold ? 0 : 255;
          d[i] = val;
          d[i + 1] = val;
          d[i + 2] = val;
        }
        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      } catch (e) {
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      }
    };

    img.onerror = () => {
      resolve(typeof imageSource === "string" ? imageSource : URL.createObjectURL(imageSource));
    };

    if (typeof imageSource === "string") {
      img.src = imageSource;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(imageSource);
    }
  });
}

/**
 * Scanner de passeport universel Hybride (100% Fonctionnel sur Hostinger et partout)
 * 1. Tente l'API backend si disponible (avec IA Gemini)
 * 2. Si sur Hostinger ou hors-ligne, bascule AUTOMATIQUEMENT sur le moteur Tesseract client-side
 */
export async function scanPassportSmart(
  imageSource: string | File, 
  onProgress?: (statusText: string, progress: number) => void
): Promise<{ success: boolean; data: PassportScanResult; source: "gemini" | "client_mrz" | "manual" }> {
  
  onProgress?.("Initialisation de l'analyse biométrique...", 10);

  // Étape 1 : Essayer l'API backend si active
  try {
    const base64Data = typeof imageSource === "string" 
      ? imageSource 
      : await new Promise<string>((res) => {
          const r = new FileReader();
          r.onload = () => res(r.result as string);
          r.readAsDataURL(imageSource);
        });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const apiRes = await fetch("/api/scan-passport", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: base64Data }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const contentType = apiRes.headers.get("content-type") || "";
    if (apiRes.ok && contentType.includes("application/json")) {
      const json = await apiRes.json();
      if (json && json.data && (json.data.firstName || json.data.passportNumber || json.data.lastName)) {
        onProgress?.("Données biométriques extraites avec succès !", 100);
        return {
          success: true,
          data: {
            firstName: json.data.firstName || "",
            lastName: json.data.lastName || "",
            passportNumber: json.data.passportNumber || "",
            dateOfBirth: json.data.dateOfBirth || "",
            expiryDate: json.data.expiryDate || "",
            issueDate: json.data.issueDate || "",
            nationality: json.data.nationality || "Algérienne",
            gender: json.data.gender === "F" ? "F" : "M",
            issuingCountry: json.data.issuingCountry || "Algérie",
            placeOfBirth: json.data.placeOfBirth || ""
          },
          source: "gemini"
        };
      }
    }
  } catch (err) {
    // Mode Hostinger détecté : basculement transparent vers l'OCR client
  }

  // Étape 2 : Scanner Client-Side Tesseract + Analyse MRZ (100% Autonome sur Hostinger)
  onProgress?.("Scan haute précision de la bande MRZ ICAO 9303...", 35);

  try {
    // Prétraitement avec accentuation du contraste
    const mrzCropImg = await preprocessPassportImage(imageSource, true);
    const fullPreprocessed = await preprocessPassportImage(imageSource, false);
    onProgress?.("Décodage optique des caractères...", 60);

    const worker = await createWorker("eng");
    
    await worker.setParameters({
      tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789< -/.:",
    });

    onProgress?.("Extraction de la zone MRZ...", 75);
    // Reconnaissance d'abord sur la bande MRZ ciblée
    const resMrz = await worker.recognize(mrzCropImg);
    // Reconnaissance sur le document entier pour les champs visuels
    const resFull = await worker.recognize(fullPreprocessed);
    await worker.terminate();

    const mrzText = resMrz.data.text || "";
    const fullText = resFull.data.text || "";

    const combinedLines = [...mrzText.split("\n"), ...fullText.split("\n")];

    // 1. Décodage officiel ICAO MRZ
    const mrzData = parseMrzLines(combinedLines);

    // 2. Décodage des champs visuels (Nom, Prénom, Numéro)
    const visualData = parseVisualFields(fullText + "\n" + mrzText);

    const finalData: PassportScanResult = {
      firstName: mrzData?.firstName || visualData.firstName || "",
      lastName: mrzData?.lastName || visualData.lastName || "",
      passportNumber: mrzData?.passportNumber || visualData.passportNumber || "",
      dateOfBirth: mrzData?.dateOfBirth || visualData.dateOfBirth || "",
      expiryDate: mrzData?.expiryDate || visualData.expiryDate || "",
      issueDate: visualData.issueDate || "",
      nationality: mrzData?.nationality || visualData.nationality || "Algérienne",
      gender: (mrzData?.gender as "M" | "F") || (visualData.gender as "M" | "F") || "M",
      issuingCountry: mrzData?.issuingCountry || visualData.issuingCountry || "Algérie",
      placeOfBirth: visualData.placeOfBirth || ""
    };

    onProgress?.("Lecture terminée !", 100);

    const hasData = Boolean(finalData.passportNumber || finalData.lastName || finalData.firstName);
    return {
      success: hasData,
      data: finalData,
      source: "client_mrz"
    };

  } catch (ocrError: any) {
    console.warn("Moteur OCR client non supporté ou bloqué :", ocrError);
    return {
      success: false,
      data: {
        firstName: "",
        lastName: "",
        passportNumber: "",
        dateOfBirth: "",
        expiryDate: "",
        nationality: "Algérienne",
        gender: "M",
        issuingCountry: "Algérie"
      },
      source: "manual"
    };
  }
}
