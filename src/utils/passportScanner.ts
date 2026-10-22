/**
 * Module d'Analyse et de Lecture Automatique de Passeports Biométriques
 * 100% Fonctionnel côté Navigateur (Optimisé pour Hostinger, VPS, Apache, cPanel, Nginx)
 * Utilise la reconnaissance optique locale, le prétraitement Canvas avancé et le décodage officiel ICAO 9303 (MRZ).
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

// Table de correspondance codes pays ICAO vers libellés
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
 * Nettoie une chaîne de caractères pour corriger les erreurs courantes de l'OCR dans la bande MRZ
 */
function cleanMrzString(str: string): string {
  return str
    .toUpperCase()
    .replace(/[«‹»]/g, "<")
    .replace(/[{(\[]/g, "<")
    .replace(/[})\]]/g, "<")
    .replace(/\|/g, "<")
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
    year = 2000 + yy;
  } else {
    // Pour la date de naissance : si YY > 35, c'est 19YY, sinon 20YY
    year = yy > 35 ? 1900 + yy : 2000 + yy;
  }

  const mmNum = parseInt(mm, 10);
  const ddNum = parseInt(dd, 10);
  if (mmNum < 1 || mmNum > 12 || ddNum < 1 || ddNum > 31) return "";

  return `${year}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

/**
 * Analyse les deux lignes de la bande MRZ (ICAO Doc 9303 TD3 - 44 caractères par ligne)
 */
export function parseMrzLines(lines: string[]): Partial<PassportScanResult> | null {
  const cleaned = lines.map(cleanMrzString).filter(l => l.length >= 15);

  let line1 = "";
  let line2 = "";

  for (let i = 0; i < cleaned.length; i++) {
    const l = cleaned[i];
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
      if (c1 >= 2 && (c2 >= 2 || /\d{6}/.test(cleaned[i + 1]))) {
        line1 = cleaned[i];
        line2 = cleaned[i + 1];
        break;
      }
    }
  }

  if (!line1 && !line2) {
    return null;
  }

  const result: Partial<PassportScanResult> = {};

  try {
    // ---- LIGNE 1 : Type, Pays, Nom, Prénoms ----
    if (line1) {
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
    }

    // ---- LIGNE 2 : N° Passeport, Naissance, Sexe, Expiration ----
    if (line2) {
      const line2Clean = line2.padEnd(44, "<");

      // N° de passeport : 9 premiers caractères (nettoyés des '<')
      let passNumRaw = line2Clean.substring(0, 9).replace(/</g, "").trim();
      passNumRaw = passNumRaw.replace(/O/g, "0").replace(/o/g, "0").replace(/I/g, "1");
      if (passNumRaw && passNumRaw.length >= 6) {
        result.passportNumber = passNumRaw;
      }

      // Date de naissance : caractères 13 à 18 (YYMMDD)
      const dobRaw = line2Clean.substring(13, 19).replace(/O/g, "0").replace(/o/g, "0");
      if (/^\d{6}$/.test(dobRaw)) {
        const parsedDob = parseMrzDate(dobRaw, false);
        if (parsedDob) result.dateOfBirth = parsedDob;
      }

      // Sexe : caractère 20 (M ou F)
      const sexChar = line2Clean.charAt(20);
      if (sexChar === "M" || sexChar === "F") {
        result.gender = sexChar;
      } else {
        result.gender = "M";
      }

      // Date d'expiration : caractères 21 à 27 (YYMMDD)
      const expRaw = line2Clean.substring(21, 27).replace(/O/g, "0").replace(/o/g, "0");
      if (/^\d{6}$/.test(expRaw)) {
        const parsedExp = parseMrzDate(expRaw, true);
        if (parsedExp) result.expiryDate = parsedExp;
      }
    }

    return result;
  } catch (err) {
    console.error("Erreur parsing MRZ:", err);
    return result;
  }
}

/**
 * Analyse de secours basée sur les libellés textuels et expressions régulières de la zone visuelle
 */
export function parseVisualFields(text: string): Partial<PassportScanResult> {
  const result: Partial<PassportScanResult> = {};
  const cleanText = text.replace(/\r/g, "\n");
  const lines = cleanText.split("\n").map(l => l.trim()).filter(Boolean);

  // 1. Recherche du numéro de passeport :
  // Passeports algériens : 9 chiffres (ex: 161234567, 190245678, 201234567, 230123456)
  // Autres formats internationaux : 2 chiffres + 7 lettres/chiffres ou 9 caractères
  const passRegexAlg = /\b(1[0-9]{8}|2[0-9]{8}|[0-9]{9})\b/g;
  let match = passRegexAlg.exec(cleanText);
  if (match) {
    result.passportNumber = match[1];
  } else {
    // Format générique avec mot-clé
    const passLabelRegex = /(?:passeport|passport|n°|no|numéro|number)[\s.:]*([0-9A-Z]{8,10})/i;
    const labelMatch = cleanText.match(passLabelRegex);
    if (labelMatch && labelMatch[1]) {
      result.passportNumber = labelMatch[1].replace(/O/g, "0").trim();
    }
  }

  // 2. Recherche des dates au format DD/MM/YYYY, DD.MM.YYYY ou DD-MM-YYYY
  const dateRegex = /\b(\d{2})[\/\.-](\d{2})[\/\.-](\d{4})\b/g;
  const dates: { raw: string; iso: string; year: number }[] = [];
  while ((match = dateRegex.exec(cleanText)) !== null) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1930 && year <= 2045) {
      dates.push({
        raw: match[0],
        iso: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        year
      });
    }
  }

  if (dates.length >= 1) {
    // Trier par année croissante
    dates.sort((a, b) => a.year - b.year);
    // La date la plus ancienne est la date de naissance (typiquement 1940-2015)
    const birthDates = dates.filter(d => d.year <= 2018);
    const futureDates = dates.filter(d => d.year >= 2024);

    if (birthDates.length > 0) {
      result.dateOfBirth = birthDates[0].iso;
    }
    if (futureDates.length > 0) {
      result.expiryDate = futureDates[futureDates.length - 1].iso;
    }
  }

  // 3. Détection du sexe
  if (/\b(SEXE|SEX)[\s.:]*(F|FEM|FEMALE|FÉMININ)\b/i.test(cleanText) || /\bF\b/.test(cleanText)) {
    result.gender = "F";
  } else {
    result.gender = "M";
  }

  // 4. Détection Nom & Prénom
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].toLowerCase();
    
    // Recherche du Nom
    if ((l.includes("nom") || l.includes("surname")) && !l.includes("prénom") && !l.includes("given") && i + 1 < lines.length) {
      const nextLine = lines[i + 1].replace(/[^A-Za-zÀ-ÿ\s-]/g, "").trim();
      if (nextLine && nextLine.length >= 2 && !result.lastName && !/^(nom|surname|passeport|passport)/i.test(nextLine)) {
        result.lastName = nextLine.toUpperCase();
      }
    }
    
    // Recherche du Prénom
    if ((l.includes("prénom") || l.includes("prenom") || l.includes("given name")) && i + 1 < lines.length) {
      const nextLine = lines[i + 1].replace(/[^A-Za-zÀ-ÿ\s-]/g, "").trim();
      if (nextLine && nextLine.length >= 2 && !result.firstName && !/^(prénom|prenom|given)/i.test(nextLine)) {
        result.firstName = nextLine.toUpperCase();
      }
    }
  }

  return result;
}

/**
 * Prétraite l'image via HTML5 Canvas pour rehausser le contraste sans dégradation destructive
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
        // Cibler la bande MRZ : 45% inférieurs de la page (large marge pour ne jamais couper le P< initial)
        sy = Math.round(sourceHeight * 0.55);
        sHeight = sourceHeight - sy;
      }

      // Largeur optimale pour l'OCR de police OCR-B
      const targetWidth = Math.max(1200, Math.min(sWidth * (cropMrzOnly ? 1.5 : 1), 2000));
      const scale = targetWidth / sWidth;
      const targetHeight = Math.round(sHeight * scale);

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      if (!ctx) {
        resolve(typeof imageSource === "string" ? imageSource : URL.createObjectURL(imageSource));
        return;
      }

      // Lissage de haute qualité
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);

      try {
        const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const d = imgData.data;
        // Rehaussement de contraste optimisé pour le texte noir sur fond clair de passeport
        const contrast = 1.45; // Augmente le contraste de 45%
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for (let i = 0; i < d.length; i += 4) {
          // Niveaux de gris pondérés
          const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          // Rehaussement de contraste
          const adjusted = factor * (gray - 128) + 128;
          const finalVal = Math.min(255, Math.max(0, adjusted));

          d[i] = finalVal;
          d[i + 1] = finalVal;
          d[i + 2] = finalVal;
        }
        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      } catch {
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
 * Scanner de passeport biométrique autonome pour Hostinger
 * 1. Tente l'API locale /api/scan-passport avec un timeout ultra-court (1.2s) sans jamais bloquer si 404/indisponible.
 * 2. Bascule instantanément sur l'analyseur client Canvas + OCR autonome avec tolérance totale.
 */
export async function scanPassportSmart(
  imageSource: string | File, 
  onProgress?: (statusText: string, progress: number) => void
): Promise<{ success: boolean; data: PassportScanResult; source: "gemini" | "client_mrz" | "manual" }> {
  
  onProgress?.("Initialisation de l'analyse biométrique...", 15);

  // Étape 1 : Si un backend Node est présent (ex: environnement dev), test rapide non bloquant
  try {
    const base64Data = typeof imageSource === "string" 
      ? imageSource 
      : await new Promise<string>((res) => {
          const r = new FileReader();
          r.onload = () => res(r.result as string);
          r.readAsDataURL(imageSource);
        });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

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
        onProgress?.("Données biométriques reconnues avec succès !", 100);
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
  } catch {
    // Mode Hostinger détecté : passage direct à l'analyseur client
  }

  // Étape 2 : Scanner Client-Side Tesseract + Analyse MRZ ICAO (100% Autonome sur Hostinger)
  onProgress?.("Prétraitement de la zone MRZ du passeport...", 35);

  try {
    const mrzCropImg = await preprocessPassportImage(imageSource, true);
    const fullPreprocessed = await preprocessPassportImage(imageSource, false);
    
    onProgress?.("Reconnaissance optique des caractères (OCR)...", 60);

    let mrzText = "";
    let fullText = "";

    // Tentative OCR avec gestion robuste et timeout de sécurité (max 9s)
    try {
      const ocrTask = async () => {
        const worker = await createWorker("eng", 1, {
          logger: (m) => {
            if (m.status === "recognizing text" && m.progress) {
              onProgress?.(`Lecture optique... ${Math.round(m.progress * 100)}%`, 60 + Math.round(m.progress * 30));
            }
          }
        });

        await worker.setParameters({
          tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789< -/.:",
        });

        const resMrz = await worker.recognize(mrzCropImg);
        mrzText = resMrz.data.text || "";

        // Si le MRZ n'a pas suffi, scanner la page complète
        if (!mrzText.includes("P<") && !mrzText.includes("<<")) {
          const resFull = await worker.recognize(fullPreprocessed);
          fullText = resFull.data.text || "";
        }

        await worker.terminate();
      };

      // Timeout de protection de 9 secondes
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("OCR timeout")), 9000)
      );

      await Promise.race([ocrTask(), timeoutPromise]);
    } catch (workerErr) {
      console.warn("Worker OCR ou timeout :", workerErr);
    }

    onProgress?.("Extraction et validation des champs...", 90);

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

    const hasData = Boolean(finalData.passportNumber || finalData.lastName || finalData.firstName);

    onProgress?.(hasData ? "Champs reconnus avec succès !" : "Scan terminé", 100);

    return {
      success: hasData,
      data: finalData,
      source: "client_mrz"
    };

  } catch (ocrError: any) {
    console.warn("Erreur analyse OCR client :", ocrError);
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
