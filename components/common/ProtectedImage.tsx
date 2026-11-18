import { useEffect, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { resolveAttachmentData } from "../../src/utils/fileUpload";

interface ProtectedImageProps {
  src: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
}

export function ProtectedImage({ src, alt = "", className = "", onClick }: ProtectedImageProps) {
  const isDirectSrc = Boolean(
    src && (src.startsWith("data:") || src.startsWith("blob:") || src.startsWith("http"))
  );
  const [resolvedSrc, setResolvedSrc] = useState<string>(isDirectSrc ? src : "");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;
    setHasError(false);

    if (!src) {
      setResolvedSrc("");
      return;
    }

    if (src.startsWith("data:") || src.startsWith("blob:") || src.startsWith("http")) {
      setResolvedSrc(src);
      return;
    }

    resolveAttachmentData(src)
      .then((data) => {
        if (!active) return;
        if (data) {
          setResolvedSrc(data);
        } else {
          setHasError(true);
        }
      })
      .catch(() => {
        if (active) setHasError(true);
      });

    return () => {
      active = false;
    };
  }, [src]);

  if (hasError || !resolvedSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}
        onClick={onClick}
      >
        <ImageIcon className="w-4 h-4" />
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onClick={onClick}
      onError={() => setHasError(true)}
    />
  );
}
