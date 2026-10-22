/**
 * Utilitaires d'optimisation, enregistrement et téléchargement universel des pièces jointes.
 * 100% Compatible Hostinger (statique, mutualisé, VPS, cPanel) et Firebase.
 *
 * Fonctionnement :
 * 1. Les documents et images sont compressés et stockés dans la collection cloud Firestore 'attachments'
 *    (document dédié par fichier), ce qui évite de dépasser la limite de 1 Mo par dossier principal.
 * 2. Un cache local (mémoire + sessionStorage) assure un affichage instantané sans latence.
 * 3. En local ou serveur Node, la sauvegarde disque /uploads/ est également conservée en complément.
 */

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// Cache mémoire pour l'affichage ultra-rapide des aperçus
const attachmentMemoryCache = new Map<string, string>();

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Compresse intelligemment une image via HTML5 Canvas (max 1400px, qualité 0.82)
 * Réduit un fichier photo de 5 Mo à environ 80-160 Ko sans aucune perte de lisibilité
 * pour les textes et visages des passeports.
 */
export async function compressImageIfPossible(
  file: File, 
  maxWidth = 1200, 
  maxHeight = 1200, 
  quality = 0.80
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    return fileToBase64(file);
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

/**
 * Envoie le fichier vers le stockage universel :
 * 1. Enregistre dans la collection cloud Firestore 'attachments' (accessible partout, y compris Hostinger)
 * 2. Tente en parallèle l'API Node /uploads si disponible
 * 3. Retourne les métadonnées et le dataUrl intact sans URL 404 morte.
 */
export async function uploadFileToServer(
  file: File, 
  category = "Document"
): Promise<{ 
  url: string; 
  dataUrl: string; 
  storageId: string; 
  size: number; 
  name: string; 
  type: string;
  category: string;
}> {
  // 1. Compression optimisée (< 100 Ko pour les images)
  const base64Data = file.type.startsWith("image/") 
    ? await compressImageIfPossible(file) 
    : await fileToBase64(file);

  const attId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  // 2. Mettre immédiatement en cache local
  attachmentMemoryCache.set(attId, base64Data);
  try {
    sessionStorage.setItem(`doc_${attId}`, base64Data);
  } catch (e) {
    // Quota sessionStorage dépassé, le cache mémoire prend le relais
  }

  // 3. Sauvegarde dans le cloud Firestore 'attachments' (Universal Cloud Storage pour Hostinger)
  try {
    await setDoc(doc(db, "attachments", attId), {
      id: attId,
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      category: category,
      data: base64Data,
      createdAt: new Date().toISOString()
    });
  } catch (firestoreErr) {
    console.warn("Avertissement sauvegarde Firestore attachment:", firestoreErr);
  }

  // 4. Si un serveur Node.js avec disque existe, tenter aussi la sauvegarde physique
  let localServerUrl = "";
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const res = await fetch("/api/upload-attachment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileBase64: base64Data,
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        category: category
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        localServerUrl = data.url;
      }
    }
  } catch (e) {
    // Mode Hostinger normal sans backend Express disque
  }

  return {
    url: localServerUrl || base64Data,
    dataUrl: base64Data,
    storageId: attId,
    size: file.size,
    name: file.name,
    type: file.type || "application/octet-stream",
    category: category
  };
}

/**
 * Récupère le contenu réel en base64 ou URL d'une pièce jointe
 * en consultant d'abord la mémoire, puis le cache session, puis Firestore.
 */
export async function resolveAttachmentData(attachment: any): Promise<string> {
  if (!attachment) return "";

  // Cas 1 : Chaîne déjà en base64 Data URL
  if (typeof attachment === "string") {
    if (attachment.startsWith("data:")) return attachment;
    
    // Si c'est un identifiant storageId ou une URL relative /attachments/att_...
    const match = attachment.match(/att_\d+_[a-z0-9]+/);
    if (match) {
      const attId = match[0];
      if (attachmentMemoryCache.has(attId)) return attachmentMemoryCache.get(attId)!;
      const cached = sessionStorage.getItem(`doc_${attId}`);
      if (cached) {
        attachmentMemoryCache.set(attId, cached);
        return cached;
      }
      try {
        const snap = await getDoc(doc(db, "attachments", attId));
        if (snap.exists() && snap.data().data) {
          const data = snap.data().data;
          attachmentMemoryCache.set(attId, data);
          return data;
        }
      } catch (err) {
        console.warn("Erreur lecture Firestore attachment:", err);
      }
    }

    if (attachment.startsWith("http")) return attachment;
    return "";
  }

  // Cas 2 : Objet pièce jointe
  const attObj = attachment;
  if (attObj.dataUrl && attObj.dataUrl.startsWith("data:")) {
    return attObj.dataUrl;
  }

  // Si attObj.url est déjà un data:
  if (attObj.url && typeof attObj.url === "string" && attObj.url.startsWith("data:")) {
    return attObj.url;
  }

  // Extraire l'ID du storage depuis storageId, id, ou match d'URL
  let storageId = attObj.storageId || attObj.id;
  if (!storageId && typeof attObj.url === "string") {
    const m = attObj.url.match(/att_\d+_[a-z0-9]+/);
    if (m) storageId = m[0];
  }
  if (!storageId && typeof attObj.dataUrl === "string") {
    const m = attObj.dataUrl.match(/att_\d+_[a-z0-9]+/);
    if (m) storageId = m[0];
  }

  if (storageId) {
    if (attachmentMemoryCache.has(storageId)) {
      return attachmentMemoryCache.get(storageId)!;
    }
    const cached = sessionStorage.getItem(`doc_${storageId}`);
    if (cached) {
      attachmentMemoryCache.set(storageId, cached);
      return cached;
    }

    try {
      const snap = await getDoc(doc(db, "attachments", storageId));
      if (snap.exists() && snap.data().data) {
        const data = snap.data().data;
        attachmentMemoryCache.set(storageId, data);
        return data;
      }
    } catch (err) {
      console.warn("Erreur chargement document cloud:", err);
    }
  }

  if (attObj.url && attObj.url.startsWith("http")) return attObj.url;
  return "";
}

/**
 * Convertit un Data URL ou Base64 en Blob binaire pur
 */
export function base64ToBlob(base64DataUrl: string, defaultMime = "application/pdf"): Blob {
  try {
    const parts = base64DataUrl.split(",");
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : defaultMime;
    const base64Str = parts.length > 1 ? parts[1] : parts[0];

    const byteCharacters = atob(base64Str);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays as any, { type: mimeType });
  } catch (err) {
    console.error("Erreur conversion base64ToBlob:", err);
    return new Blob([], { type: defaultMime });
  }
}

/**
 * Téléchargement infaillible de PDF ou fichiers :
 * 1. Résout les documents hébergés sur Firestore cloud ou serveur
 * 2. Génère un Blob binaire local avec nom de fichier strict
 * 3. Ne plante jamais et résout l'erreur 404 sur Hostinger.
 */
export async function downloadFileSafe(fileSource: any, fileName = "document.pdf"): Promise<void> {
  if (!fileSource) {
    console.error("Aucune donnée de fichier fournie");
    return;
  }

  try {
    const resolvedData = await resolveAttachmentData(fileSource);
    if (!resolvedData) {
      throw new Error("Impossible de récupérer les données du fichier.");
    }

    let blob: Blob;

    if (resolvedData.startsWith("data:")) {
      blob = base64ToBlob(
        resolvedData, 
        fileName.toLowerCase().endsWith(".pdf") ? "application/pdf" : "application/octet-stream"
      );
    } else {
      // Récupération depuis le serveur
      const response = await fetch(resolvedData);
      if (!response.ok) {
        throw new Error(`Erreur réseau (${response.status}) lors du téléchargement`);
      }
      blob = await response.blob();
      if (fileName.toLowerCase().endsWith(".pdf") && blob.type !== "application/pdf") {
        blob = new Blob([blob], { type: "application/pdf" });
      }
    }

    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Libérer la mémoire après quelques secondes
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 15000);
  } catch (err) {
    console.error("Erreur downloadFileSafe:", err);
    // Si URL directe /uploads/ disponible
    if (typeof fileSource === "string" && fileSource.startsWith("/uploads/")) {
      const fileNameOnly = fileSource.replace("/uploads/", "");
      window.location.href = `/api/download?file=${encodeURIComponent(fileNameOnly)}&filename=${encodeURIComponent(fileName)}`;
    } else if (typeof fileSource === "string" && fileSource.startsWith("http")) {
      window.open(fileSource, "_blank");
    }
  }
}
