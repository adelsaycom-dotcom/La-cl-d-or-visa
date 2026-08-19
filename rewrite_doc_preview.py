import re

content = """import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, FileDown } from "lucide-react";

// Convert base64 to Blob
function base64ToBlob(base64: string): Blob {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export function DocumentPreview({ url, name }: { url: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string>("");
  
  const isImage = url.startsWith("data:image/") || url.includes("image/");
  const isPdf = url.startsWith("data:application/pdf") || url.includes("pdf");
  
  let extension = "";
  if (isImage) {
    if (url.includes("image/jpeg")) extension = ".jpg";
    else if (url.includes("image/png")) extension = ".png";
    else extension = ".jpg"; 
  } else if (isPdf) {
    extension = ".pdf";
  }

  useEffect(() => {
    let finalUrl = url;
    if (url.startsWith("data:")) {
      try {
        const blob = base64ToBlob(url);
        finalUrl = URL.createObjectURL(blob);
      } catch (e) {
        console.error("Failed to parse base64", e);
      }
    }
    setObjectUrl(finalUrl);
    
    return () => {
      if (finalUrl.startsWith("blob:")) {
        URL.revokeObjectURL(finalUrl);
      }
    };
  }, [url]);

  return (
    <>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} title="Visualiser">
          <Eye className="w-4 h-4 text-blue-600" />
        </Button>
        <a href={objectUrl || url} download={`document_${name.replace(/ /g, '_')}${extension}`} className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-slate-100 h-10 w-10 text-blue-600" title="Télécharger">
          <FileDown className="w-4 h-4" />
        </a>
      </div>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-4 sm:p-6 sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden mt-4 bg-slate-100/50 rounded-xl border border-slate-200 flex items-center justify-center min-h-[60vh] relative">
            {isImage ? (
              <img src={objectUrl || url} alt={name} className="w-full h-full object-contain p-2" />
            ) : isPdf ? (
              <iframe src={objectUrl || url} className="absolute inset-0 w-full h-full border-none" title={name} />
            ) : (
              <div className="text-slate-500 text-center p-8">
                Format de fichier non pris en charge pour la prévisualisation directe. <br/>
                Veuillez télécharger le document.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
"""

with open('components/DocumentPreview.tsx', 'w') as f:
    f.write(content)
