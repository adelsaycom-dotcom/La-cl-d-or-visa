import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, FileDown } from "lucide-react";

export function DocumentPreview({ url, name }: { url: string; name: string }) {
  const [open, setOpen] = useState(false);
  const isImage = url.startsWith("data:image/");
  const isPdf = url.startsWith("data:application/pdf");

  let extension = "";
  if (isImage) {
    if (url.includes("image/jpeg")) extension = ".jpg";
    else if (url.includes("image/png")) extension = ".png";
    else extension = ".jpg"; // fallback
  } else if (isPdf) {
    extension = ".pdf";
  }

  return (
    <>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} title="Visualiser">
          <Eye className="w-4 h-4 text-blue-600" />
        </Button>
        <a href={url} download={`document_${name.replace(/ /g, '_')}${extension}`} className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-slate-100 h-10 w-10 text-blue-600" title="Télécharger">
          <FileDown className="w-4 h-4" />
        </a>
      </div>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto mt-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center min-h-[50vh]">
            {isImage ? (
              <img src={url} alt={name} className="max-w-full max-h-full object-contain" />
            ) : isPdf ? (
              <iframe src={url} className="w-full h-full min-h-[60vh] border-none" title={name} />
            ) : (
              <div className="text-slate-500 text-center p-8">
                Format de fichier non pris en charge pour la prévisualisation. <br/>
                Veuillez télécharger le document.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
