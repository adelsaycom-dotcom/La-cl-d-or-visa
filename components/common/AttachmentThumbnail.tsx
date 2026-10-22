import { useState, useEffect } from "react";
import { FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { resolveAttachmentData } from "../../src/utils/fileUpload";

export interface AttachmentItem {
  id?: string;
  name: string;
  category?: string;
  type?: string;
  dataUrl?: string;
  url?: string;
  storageId?: string;
  size?: number;
}

interface AttachmentThumbnailProps {
  attachment: AttachmentItem;
  size?: "sm" | "md" | "lg";
  onOpenPreview?: (src: string, title: string, type?: string) => void;
}

export function AttachmentThumbnail({
  attachment,
  size = "md",
  onOpenPreview
}: AttachmentThumbnailProps) {
  const isPdf = 
    attachment.type?.includes("pdf") || 
    attachment.name?.toLowerCase().endsWith(".pdf") ||
    (attachment.dataUrl && attachment.dataUrl.startsWith("data:application/pdf"));

  const isImg = 
    !isPdf && (
      attachment.type?.includes("image") ||
      /\.(jpe?g|png|webp|gif|bmp)$/i.test(attachment.name || "") ||
      (attachment.dataUrl && attachment.dataUrl.startsWith("data:image/")) ||
      attachment.category?.toLowerCase().includes("passport") ||
      attachment.category?.toLowerCase().includes("scan") ||
      attachment.category?.toLowerCase().includes("photo")
    );

  const initialSrc = 
    attachment.dataUrl && attachment.dataUrl.startsWith("data:image/") 
      ? attachment.dataUrl 
      : (attachment.url && attachment.url.startsWith("http") ? attachment.url : "");

  const [resolvedSrc, setResolvedSrc] = useState<string>(initialSrc);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(isImg && !initialSrc);

  useEffect(() => {
    let isMounted = true;

    if (!isImg) {
      setIsLoading(false);
      return;
    }

    if (attachment.dataUrl && attachment.dataUrl.startsWith("data:image/")) {
      setResolvedSrc(attachment.dataUrl);
      setIsLoading(false);
      setLoadError(false);
      return;
    }

    setIsLoading(true);
    resolveAttachmentData(attachment)
      .then((data) => {
        if (!isMounted) return;
        if (data && (data.startsWith("data:image/") || data.startsWith("http"))) {
          setResolvedSrc(data);
          setLoadError(false);
        } else {
          setLoadError(true);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (isMounted) {
          setLoadError(true);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [attachment, isImg]);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10 sm:w-11 sm:h-11",
    lg: "w-12 h-12 sm:w-14 sm:h-14"
  }[size];

  if (isPdf) {
    const handlePdfClick = async () => {
      if (!onOpenPreview) return;
      if (attachment.dataUrl) {
        onOpenPreview(attachment.dataUrl, attachment.category || attachment.name, "application/pdf");
      } else {
        const resolved = await resolveAttachmentData(attachment);
        onOpenPreview(resolved || attachment.url || "", attachment.category || attachment.name, "application/pdf");
      }
    };

    return (
      <div 
        onClick={handlePdfClick}
        className={`${sizeClasses} rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200 shadow-sm transition-colors ${onOpenPreview ? 'cursor-pointer hover:border-rose-400' : ''}`}
        title={`${attachment.name} (Cliquer pour prévisualiser le PDF)`}
      >
        <FileText className="w-5 h-5 text-rose-600" />
      </div>
    );
  }

  if (isImg) {
    if (isLoading) {
      return (
        <div className={`${sizeClasses} rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 animate-pulse`}>
          <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
        </div>
      );
    }

    if (!loadError && resolvedSrc) {
      return (
        <div 
          onClick={() => onOpenPreview && onOpenPreview(resolvedSrc, attachment.category || attachment.name)}
          className={`${sizeClasses} rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 hover:border-[#7B1B38]/50 shadow-sm transition-all ${onOpenPreview ? 'cursor-pointer hover:opacity-90' : ''}`}
          title={attachment.name}
        >
          <img 
            src={resolvedSrc} 
            alt="" 
            onError={() => setLoadError(true)} 
            className="w-full h-full object-cover" 
          />
        </div>
      );
    }

    // Fallback propre en cas d'erreur de chargement de l'image (évite l'icône d'image brisée du navigateur)
    return (
      <div 
        className={`${sizeClasses} rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200`}
        title={attachment.name}
      >
        <ImageIcon className="w-5 h-5 text-slate-400" />
      </div>
    );
  }

  // Document générique
  return (
    <div 
      className={`${sizeClasses} rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200 shadow-sm`}
      title={attachment.name}
    >
      <FileText className="w-5 h-5 text-slate-500" />
    </div>
  );
}
