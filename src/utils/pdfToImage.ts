/**
 * Convertisseur universel de PDF en Image Haute Définition côté client.
 * Permet l'affichage des aperçus et l'analyse OCR biométrique directe même à partir de scans PDF.
 */
import * as pdfjsLib from "pdfjs-dist";

// Configuration du worker PDF.js avec fallback automatique
if (typeof window !== "undefined") {
  try {
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }
  } catch (e) {
    console.warn("Worker PDF.js non initialisé:", e);
  }
}

export async function convertPdfPageToImage(
  pdfSource: File | ArrayBuffer | string,
  pageNumber = 1,
  scale = 2.0
): Promise<{ dataUrl: string; width: number; height: number } | null> {
  try {
    let data: ArrayBuffer | Uint8Array;

    if (pdfSource instanceof File) {
      data = await pdfSource.arrayBuffer();
    } else if (typeof pdfSource === "string") {
      if (pdfSource.startsWith("data:")) {
        const base64Str = pdfSource.includes(",") ? pdfSource.split(",")[1] : pdfSource;
        const binary = atob(base64Str.replace(/[\s\r\n]+/g, ""));
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        data = bytes.buffer;
      } else {
        const response = await fetch(pdfSource);
        data = await response.arrayBuffer();
      }
    } else {
      data = pdfSource;
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(data),
      useSystemFonts: true,
      standardFontDataUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`
    });

    const pdf = await loadingTask.promise;
    if (pdf.numPages < pageNumber) {
      pageNumber = 1;
    }

    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!ctx) return null;

    const renderContext = {
      canvasContext: ctx as any,
      viewport: viewport
    };

    await (page.render(renderContext as any) as any).promise;

    const dataUrl = canvas.toDataURL("image/jpeg", 0.90);
    return {
      dataUrl,
      width: viewport.width,
      height: viewport.height
    };
  } catch (err) {
    console.warn("Échec de conversion PDF vers image:", err);
    return null;
  }
}
