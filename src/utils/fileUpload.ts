/**
 * Utilitaires d'optimisation, enregistrement et téléchargement sécurisé des pièces jointes
 * Permet de stocker les fichiers sur le serveur et de ne conserver que des URLs légères
 * dans Firestore afin d'éviter la limite stricte de 1 048 576 octets (1 Mo) par document.
 */

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Compresse intelligemment une image via HTML5 Canvas (max 1600px, 0.82)
 * Réduit un fichier photo de 5 Mo à environ 150-250 Ko sans perte visuelle.
 */
export async function compressImageIfPossible(file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.82): Promise<string> {
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
 * Envoie le fichier à l'API Express pour sauvegarde sur disque
 * et renvoie l'URL statique (/uploads/...) utilisable par l'admin et l'agence.
 */
export async function uploadFileToServer(
  file: File, 
  category = "Document"
): Promise<{ url: string; size: number; name: string; type: string }> {
  const base64Data = file.type.startsWith("image/") 
    ? await compressImageIfPossible(file) 
    : await fileToBase64(file);

  const res = await fetch("/api/upload-attachment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileBase64: base64Data,
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      category: category
    })
  });

  if (!res.ok) {
    throw new Error("Erreur serveur lors de l'enregistrement du document");
  }

  const data = await res.json();
  return {
    url: data.url,
    size: data.size || file.size,
    name: file.name,
    type: file.type || "application/octet-stream"
  };
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
 * Résout le problème Chrome "Échec de chargement du document PDF"
 * en générant un Blob binaire local avec nom de fichier strict.
 */
export async function downloadFileSafe(fileUrlOrData: string, fileName = "document.pdf"): Promise<void> {
  if (!fileUrlOrData) {
    console.error("Aucune donnée de fichier fournie");
    return;
  }

  try {
    let blob: Blob;

    if (fileUrlOrData.startsWith("data:")) {
      blob = base64ToBlob(fileUrlOrData, fileName.toLowerCase().endsWith(".pdf") ? "application/pdf" : "application/octet-stream");
    } else {
      // Récupération depuis le serveur
      const response = await fetch(fileUrlOrData);
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
    // Fallback: endpoint forcé avec Content-Disposition
    if (fileUrlOrData.startsWith("/uploads/")) {
      const fileNameOnly = fileUrlOrData.replace("/uploads/", "");
      window.location.href = `/api/download?file=${encodeURIComponent(fileNameOnly)}&filename=${encodeURIComponent(fileName)}`;
    } else {
      window.open(fileUrlOrData, "_blank");
    }
  }
}
