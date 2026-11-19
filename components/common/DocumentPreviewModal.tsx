import { useState, useEffect } from "react";
import { X, Download, ExternalLink, FileText, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base64ToBlob, downloadFileSafe, resolveAttachmentData } from "../../src/utils/fileUpload";

export interface PreviewDocData {
  src: string;
  title: string;
  type?: string;
}

interface DocumentPreviewModalProps {
  doc: PreviewDocData | null;
  onClose: () => void;
}

export function DocumentPreviewModal({ doc, onClose }: DocumentPreviewModalProps) {
  const [blobUrl, setBlobUrl] = useState<string>("");
  const [resolvedImgSrc, setResolvedImgSrc] = useState<string>("");
  const [resolvedAsPdf, setResolvedAsPdf] = useState<boolean>(false);
  const [isLoadingBlob, setIsLoadingBlob] = useState(false);

  const isPdf = Boolean(
    resolvedAsPdf ||
    (doc && (
      doc.src?.startsWith("data:application/pdf") ||
      doc.type?.includes("pdf") ||
      doc.title?.toLowerCase().endsWith(".pdf") ||
      doc.src?.toLowerCase().includes(".pdf")
    ))
  );

  useEffect(() => {
    let createdBlobUrl = "";
    let isMounted = true;

    const loadPreview = async () => {
      setResolvedAsPdf(false);
      if (!doc || !doc.src) {
        setBlobUrl("");
        setResolvedImgSrc("");
        setIsLoadingBlob(false);
        return;
      }

      const expectsPdf = Boolean(
        doc.src?.startsWith("data:application/pdf") ||
        doc.type?.includes("pdf") ||
        doc.title?.toLowerCase().endsWith(".pdf") ||
        doc.src?.toLowerCase().includes(".pdf")
      );

      if (expectsPdf || doc.src.startsWith("/api/files/") || doc.src.startsWith("deferred:")) {
        setIsLoadingBlob(true);
        setBlobUrl("");
        setResolvedImgSrc("");
        try {
          const resolved = await resolveAttachmentData(doc.src);
          if (!isMounted) return;
          const detectedPdf = expectsPdf || resolved.startsWith("data:application/pdf");
          if (detectedPdf) {
            setResolvedAsPdf(true);
            if (resolved.startsWith("blob:")) {
              setBlobUrl(resolved);
            } else if (resolved) {
              const blob = await base64ToBlob(resolved, "application/pdf");
              if (!isMounted) return;
              if (blob && blob.size > 0) {
                createdBlobUrl = URL.createObjectURL(blob);
                setBlobUrl(createdBlobUrl);
              }
            }
          } else {
            setResolvedImgSrc(resolved || (doc.src.startsWith("deferred:") ? "" : doc.src));
          }
        } catch (e) {
          console.error("Erreur préparation aperçu:", e);
        } finally {
          if (isMounted) setIsLoadingBlob(false);
        }
      } else {
        setBlobUrl("");
        setIsLoadingBlob(false);
        setResolvedImgSrc(doc.src);
      }
    };

    loadPreview();

    return () => {
      isMounted = false;
      if (createdBlobUrl) {
        URL.revokeObjectURL(createdBlobUrl);
      }
    };
  }, [doc]);

  if (!doc) return null;

  const handleDownload = () => {
    const ext = isPdf ? ".pdf" : ".jpg";
    const safeTitle = doc.title.endsWith(ext) ? doc.title : `${doc.title}${ext}`;
    downloadFileSafe(doc.src, safeTitle);
  };

  const handleOpenNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, "_blank", "noopener,noreferrer");
    } else if (doc.src?.startsWith("http")) {
      window.open(doc.src, "_blank", "noopener,noreferrer");
    } else {
      handleDownload();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 overflow-hidden flex flex-col shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden pr-4">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isPdf ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {isPdf ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm sm:text-base truncate">{doc.title}</span>
                <Badge className={isPdf ? "bg-rose-500/20 text-rose-300 border-rose-500/30 text-[10px]" : "bg-blue-500/20 text-blue-300 border-blue-500/30 text-[10px]"}>
                  {isPdf ? "Document PDF" : "Image"}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 truncate">Aperçu direct et consultation sécurisée</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isPdf && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenNewTab}
                className="inline-flex h-9 border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl gap-1.5"
                title="Ouvrir dans un nouvel onglet"
              >
                <ExternalLink className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Plein écran</span>
              </Button>
            )}

            <Button
              size="sm"
              onClick={handleDownload}
              className="h-9 bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-xs rounded-xl gap-1.5 shadow-md shadow-[#7B1B38]/30"
            >
              <Download className="w-3.5 h-3.5" /> <span className="hidden xs:inline">{isPdf ? "Télécharger le PDF" : "Télécharger"}</span><span className="xs:hidden">Télécharger</span>
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full h-9 w-9 ml-1"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Corps de la visualisation */}
        <div className="flex-1 flex items-center justify-center overflow-hidden min-h-[60vh] max-h-[75vh] bg-slate-950/70 rounded-2xl border border-slate-800 relative">
          {isPdf ? (
            isLoadingBlob ? (
              <div className="flex flex-col items-center justify-center gap-3 text-slate-400 p-8">
                <Loader2 className="w-8 h-8 animate-spin text-[#7B1B38]" />
                <span className="text-xs font-semibold">Préparation du document PDF...</span>
              </div>
            ) : blobUrl ? (
              <object 
                data={`${blobUrl}#toolbar=1&navpanes=0`} 
                type="application/pdf"
                className="w-full h-[72vh] border-0 rounded-2xl bg-white"
              >
                <iframe 
                  src={`${blobUrl}#toolbar=1&navpanes=0`} 
                  className="w-full h-[72vh] border-0 rounded-2xl bg-white" 
                  title={doc.title} 
                >
                  <div className="text-center p-8 space-y-3">
                    <FileText className="w-12 h-12 text-rose-400 mx-auto opacity-70" />
                    <p className="text-sm font-bold text-slate-900">Visualiseur PDF intégré</p>
                    <Button onClick={handleOpenNewTab} className="bg-[#7B1B38] text-white font-bold text-xs rounded-xl gap-2">
                      <ExternalLink className="w-4 h-4" /> Ouvrir dans un nouvel onglet
                    </Button>
                  </div>
                </iframe>
              </object>
            ) : (
              <div className="text-center p-8 space-y-3">
                <FileText className="w-12 h-12 text-rose-400 mx-auto opacity-70" />
                <p className="text-sm font-bold text-white">Visualisation intégrée non disponible sur ce navigateur</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Vous pouvez télécharger directement le fichier PDF ou l'ouvrir dans un nouvel onglet.
                </p>
                <Button 
                  onClick={handleDownload} 
                  className="bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-xs rounded-xl gap-2 mt-2"
                >
                  <Download className="w-4 h-4" /> Télécharger le PDF
                </Button>
              </div>
            )
          ) : isLoadingBlob ? (
            <div className="flex flex-col items-center justify-center gap-3 text-slate-400 p-8">
              <Loader2 className="w-8 h-8 animate-spin text-[#7B1B38]" />
              <span className="text-xs font-semibold">Chargement de l'image...</span>
            </div>
          ) : (
            <img 
              src={resolvedImgSrc || (!doc.src?.startsWith("deferred:") ? doc.src : "")} 
              alt={doc.title} 
              className="max-w-full max-h-[72vh] object-contain rounded-xl p-2 select-none" 
            />
          )}
        </div>
      </div>
    </div>
  );
}
