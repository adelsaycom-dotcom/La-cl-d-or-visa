import { useState, useRef } from "react";
import { useAppStore, Application } from "../../src/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Search, Clock, CheckCircle2, AlertCircle, XCircle, 
  ArrowLeft, Download, Send, MessageSquare, UploadCloud, 
  FileCheck, Eye, X, User, ShieldCheck, Loader2
} from "lucide-react";
import { uploadFileToServer, downloadFileSafe, resolveAttachmentData } from "../../src/utils/fileUpload";

export function AgencyApplications() {
  const { applications, updateApplication, addApplicationTimelineEntry } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);
  
  // Action Required Upload State
  const [isUploadingMissingDoc, setIsUploadingMissingDoc] = useState(false);
  const [missingDocCategory, setMissingDocCategory] = useState("Complément de dossier");
  const missingDocInputRef = useRef<HTMLInputElement>(null);

  const selectedApp = applications.find(a => a.id === selectedAppId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved": return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 font-bold"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approuvée</Badge>;
      case "Rejected": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 font-bold"><XCircle className="w-3.5 h-3.5 mr-1" /> Rejetée</Badge>;
      case "Processing": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 font-bold"><Clock className="w-3.5 h-3.5 mr-1" /> En traitement</Badge>;
      case "ActionRequired": return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 font-bold"><AlertCircle className="w-3.5 h-3.5 mr-1 animate-pulse" /> Action Requise</Badge>;
      default: return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200 font-bold"><Clock className="w-3.5 h-3.5 mr-1" /> En attente</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "border-l-4 border-l-emerald-500";
      case "Rejected": return "border-l-4 border-l-red-500";
      case "Processing": return "border-l-4 border-l-blue-500";
      case "ActionRequired": return "border-l-4 border-l-amber-500";
      default: return "border-l-4 border-l-slate-300";
    }
  };

  const filteredApps = applications.filter(app => {
    const tName = (app.travelerName || (app as any).applicantName || "").toLowerCase();
    const pNumber = (app.passportNumber || "").toLowerCase();
    const matchesSearch = tName.includes(searchTerm.toLowerCase()) || 
                          pNumber.includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "ALL" || app.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = async () => {
    if (!selectedApp || !replyMessage.trim()) return;
    
    await addApplicationTimelineEntry(selectedApp.id, {
      title: "Message de l'Agence",
      message: replyMessage,
      sender: "Agency"
    });
    
    setReplyMessage("");
  };

  // Téléchargement sécurisé et universel (Compatible Cloud Firestore & Hostinger)
  const triggerDownload = (fileSource: any, fileName: string) => {
    downloadFileSafe(fileSource, fileName);
  };

  const handleOpenPreview = async (att: any) => {
    const data = await resolveAttachmentData(att);
    setPreviewImage({ src: data || att.dataUrl || att.url, title: att.category || att.name });
  };

  const isImageBase64 = (str: any) => typeof str === 'string' && (str.startsWith('data:image/') || str.endsWith('.png') || str.endsWith('.jpg') || str.endsWith('.jpeg'));
  const isPdfBase64 = (str: any) => typeof str === 'string' && (str.startsWith('data:application/pdf') || str.endsWith('.pdf'));

  // Extraction propre des pièces jointes du dossier
  const getAttachmentsList = () => {
    if (!selectedApp) return [];
    const list: Array<{ id: string; name: string; category: string; type: string; size?: number; dataUrl: string; url?: string; storageId?: string }> = [];

    if (Array.isArray(selectedApp.attachments) && selectedApp.attachments.length > 0) {
      selectedApp.attachments.forEach(att => {
        if (att) {
          list.push({
            id: att.id || "",
            name: att.name || "Document",
            category: att.category || "Justificatif",
            type: att.type || "application/octet-stream",
            size: att.size,
            dataUrl: att.dataUrl || "",
            url: att.url,
            storageId: att.storageId || att.id
          });
        }
      });
    }

    if (selectedApp.customFormData?.attachments && Array.isArray(selectedApp.customFormData.attachments)) {
      selectedApp.customFormData.attachments.forEach((att: any) => {
        if (att && att.dataUrl && !list.some(x => x.dataUrl === att.dataUrl)) {
          list.push(att);
        }
      });
    }

    if (selectedApp.customFormData) {
      Object.entries(selectedApp.customFormData).forEach(([key, val]) => {
        if (key !== "attachments" && key !== "applicantDetails" && key !== "textFields" && typeof val === "string" && (isImageBase64(val) || isPdfBase64(val))) {
          if (!list.some(x => x.dataUrl === val)) {
            list.push({
              id: key,
              name: `${key}.${isPdfBase64(val) ? 'pdf' : 'jpg'}`,
              category: key,
              type: isPdfBase64(val) ? 'application/pdf' : 'image/jpeg',
              dataUrl: val
            });
          }
        }
      });
    }

    return list;
  };

  // Téléversement d'un document manquant si ActionRequired
  const handleUploadMissingDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedApp) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Le fichier dépasse la taille maximale autorisée de 5 Mo.");
      return;
    }

    setIsUploadingMissingDoc(true);
    try {
      const uploadRes = await uploadFileToServer(file, missingDocCategory || "Complément");
      const newAttachment = {
        id: uploadRes.storageId || `doc_supp_${Date.now()}`,
        name: file.name,
        category: missingDocCategory || "Document complémentaire",
        type: file.type || "application/octet-stream",
        size: uploadRes.size,
        dataUrl: uploadRes.dataUrl || uploadRes.url,
        url: uploadRes.url,
        storageId: uploadRes.storageId,
        uploadedAt: new Date().toISOString(),
        uploadedBy: "Agency" as const
      };

      const existingAttachments = selectedApp.attachments || [];
      const updatedAttachments = [...existingAttachments, newAttachment];

      await updateApplication(selectedApp.id, {
        attachments: updatedAttachments,
        status: "Processing" // Repasse en traitement dès que l'agence fournit le document !
      });

      await addApplicationTimelineEntry(selectedApp.id, {
        title: "Pièce complémentaire transmise",
        message: `L'agence a fourni la pièce justificative : « ${file.name} » (${missingDocCategory}). Le dossier repasse en cours d'instruction.`,
        sender: "Agency"
      });

      alert("Votre document a été transmis avec succès à l'administration !");
    } catch (err: any) {
      console.error("Erreur téléversement:", err);
      alert(err.message || "Erreur lors de la transmission du document.");
    } finally {
      setIsUploadingMissingDoc(false);
      if (missingDocInputRef.current) missingDocInputRef.current.value = "";
    }
  };

  const appAttachments = getAttachmentsList();
  const applicantDetails = selectedApp?.customFormData?.applicantDetails;

  // Vue Détails Dossier
  if (selectedApp) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 pb-16">
        {/* Modal Plein écran Image */}
        {previewImage && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-3xl p-4 overflow-hidden flex flex-col items-center" onClick={e => e.stopPropagation()}>
              <div className="w-full flex justify-between items-center mb-3 px-2">
                <span className="font-bold text-white text-sm">{previewImage.title}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setPreviewImage(null)} 
                  className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <img src={previewImage.src} alt={previewImage.title} className="max-w-full max-h-[75vh] object-contain rounded-xl" />
              <div className="mt-3">
                <Button 
                  size="sm" 
                  onClick={() => triggerDownload(previewImage.src, `${previewImage.title}.jpg`)}
                  className="bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold rounded-xl text-xs gap-1.5"
                >
                  <Download className="w-4 h-4" /> Télécharger l'image
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Barre de retour */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setSelectedAppId(null)} 
              className="h-11 w-11 rounded-2xl border-slate-200 hover:bg-slate-100"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">
                  Dossier : {selectedApp.travelerName || (selectedApp as any).applicantName}
                </h2>
                {getStatusBadge(selectedApp.status)}
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Réf : <span className="font-mono text-slate-700 font-bold">{selectedApp.id}</span> • Soumis le {new Date(selectedApp.submissionDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-slate-400 uppercase">Tarif déduit</span>
            <div className="text-lg font-black text-[#7B1B38] font-mono">
              {typeof selectedApp.price === "number" ? selectedApp.price.toLocaleString() : "0"} DZD
            </div>
          </div>
        </div>

        {/* BANNER 1 : Visa Officiel Délivré & Prêt au Téléchargement */}
        {selectedApp.finalDocument && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 md:p-8 shadow-xl shadow-emerald-600/15 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="inline-block bg-white/20 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-1">
                  Document Officiel Validé
                </span>
                <h3 className="text-xl md:text-2xl font-black">Votre Visa est prêt et délivré !</h3>
                <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
                  Fichier : <strong className="text-white font-mono">{selectedApp.finalDocumentName || "Visa_Officiel.pdf"}</strong>
                </p>
              </div>
            </div>

            <Button 
              onClick={() => triggerDownload(selectedApp.finalDocument!, selectedApp.finalDocumentName || `Visa_${selectedApp.travelerName.replace(/\s+/g, '_')}.pdf`)}
              className="bg-white hover:bg-emerald-50 text-emerald-800 font-black text-sm h-14 px-8 rounded-2xl shadow-lg relative z-10 shrink-0 gap-2 w-full md:w-auto"
            >
              <Download className="w-5 h-5 text-emerald-700" /> Télécharger le Visa Officiel
            </Button>
          </div>
        )}

        {/* BANNER 2 : Action Requise (Dépôt immédiat de pièces complémentaires) */}
        {selectedApp.status === 'ActionRequired' && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="font-black text-amber-900 text-lg">Action requise par l'administration consulaire</h3>
                <p className="text-amber-800 text-xs sm:text-sm mt-1">
                  Une précision ou une pièce justificative complémentaire est nécessaire pour continuer le traitement de votre demande. Veuillez vérifier le fil de discussion ci-dessous et transmettre le document requis.
                </p>
              </div>
            </div>

            {/* Zone de téléversement direct du document manquant */}
            <div className="bg-white p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center gap-3">
              <Input 
                value={missingDocCategory}
                onChange={(e) => setMissingDocCategory(e.target.value)}
                placeholder="Intitulé du document (ex: Attestation de travail, Relevé...)"
                className="text-xs h-11 bg-slate-50 rounded-xl"
              />
              <div className="relative w-full sm:w-auto shrink-0">
                <input 
                  ref={missingDocInputRef}
                  type="file" 
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleUploadMissingDoc}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <Button 
                  disabled={isUploadingMissingDoc}
                  className="w-full sm:w-auto bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-xs h-11 px-6 rounded-xl gap-2 pointer-events-none"
                >
                  {isUploadingMissingDoc ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                  Téléverser la pièce demandée
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne Principale (2/3) : Messagerie et Journal du dossier */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
              <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-[#7B1B38]" /> Échanges Directs & Journal d'instruction
                </div>
                <span className="text-[11px] font-semibold text-slate-400">Communication chiffrée</span>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40 custom-scrollbar">
                {(!selectedApp.timeline || selectedApp.timeline.length === 0) ? (
                  <div className="text-center py-16 text-slate-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p className="text-xs">Aucun message pour le moment.</p>
                  </div>
                ) : (
                  selectedApp.timeline.map(entry => (
                    <div 
                      key={entry.id} 
                      className={`flex flex-col ${
                        entry.sender === 'Agency' ? 'items-end' : 
                        entry.sender === 'System' ? 'items-center' : 'items-start'
                      }`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-4 text-xs ${
                        entry.sender === 'Agency' 
                          ? 'bg-[#7B1B38] text-white rounded-br-none shadow-md shadow-[#7B1B38]/15' : 
                        entry.sender === 'Admin' 
                          ? 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm' :
                          'bg-slate-200 text-slate-700 py-2 px-4 rounded-full font-medium text-[11px]'
                      }`}>
                        {entry.sender !== 'System' && (
                          <div className={`text-[10px] font-bold uppercase mb-1 ${
                            entry.sender === 'Agency' ? 'text-rose-200' : 'text-[#7B1B38]'
                          }`}>
                            {entry.sender === 'Admin' ? 'Administration' : 'Votre Agence'} • {new Date(entry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        )}
                        <div className="leading-relaxed whitespace-pre-wrap">{entry.message}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3.5 bg-white border-t border-slate-100 flex gap-2">
                <Input 
                  placeholder="Écrire à l'administration consulaire..." 
                  className="bg-slate-50 h-11 rounded-xl text-xs"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={selectedApp.status === 'Approved' || selectedApp.status === 'Rejected'}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={selectedApp.status === 'Approved' || selectedApp.status === 'Rejected' || !replyMessage.trim()}
                  className="h-11 w-11 rounded-xl bg-[#7B1B38] hover:bg-[#63142c] text-white shrink-0 shadow-md shadow-[#7B1B38]/20"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Colonne Droite (1/3) : Fiche récapitulative & Pièces Jointes */}
          <div className="space-y-6">
            
            {/* Détails du dossier */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm pb-3 border-b border-slate-100">
                <FileText className="w-4 h-4 text-[#7B1B38]" /> Informations du Voyageur
              </h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase block mb-0.5">Service</span>
                  <span className="font-bold text-slate-800">{selectedApp.serviceType} • {selectedApp.country}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block mb-0.5">Voyageur</span>
                  <span className="font-black text-slate-900 text-sm">{selectedApp.travelerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block mb-0.5">Passeport</span>
                  <span className="font-mono font-bold text-slate-900">{selectedApp.passportNumber}</span>
                </div>

                {applicantDetails && (
                  <>
                    {applicantDetails.nationality && (
                      <div>
                        <span className="text-slate-400 font-bold uppercase block mb-0.5">Nationalité</span>
                        <span className="font-bold text-slate-800">{applicantDetails.nationality}</span>
                      </div>
                    )}
                    {applicantDetails.dateOfBirth && (
                      <div>
                        <span className="text-slate-400 font-bold uppercase block mb-0.5">Date de naissance</span>
                        <span className="font-bold text-slate-800">{applicantDetails.dateOfBirth}</span>
                      </div>
                    )}
                    {applicantDetails.phone && (
                      <div>
                        <span className="text-slate-400 font-bold uppercase block mb-0.5">Téléphone</span>
                        <span className="font-bold text-slate-800">{applicantDetails.phone}</span>
                      </div>
                    )}
                  </>
                )}

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase">Coût du service</span>
                  <span className="text-base font-black text-[#7B1B38] font-mono">
                    {typeof selectedApp.price === "number" ? selectedApp.price.toLocaleString() : "0"} DZD
                  </span>
                </div>
              </div>
            </div>

            {/* Pièces transmises */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm">
                  <FileCheck className="w-4 h-4 text-[#7B1B38]" /> Pièces Transmises ({appAttachments.length})
                </h3>
              </div>

              {appAttachments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Aucune pièce attachée à ce dossier.</p>
              ) : (
                <div className="space-y-2.5">
                  {appAttachments.map((att, idx) => {
                    const isPdf = isPdfBase64(att.dataUrl) || att.type?.includes("pdf");
                    const isImg = isImageBase64(att.dataUrl) || att.type?.includes("image");

                    return (
                      <div key={att.id || idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {isImg ? (
                            <div 
                              onClick={() => setPreviewImage({ src: att.dataUrl, title: att.category || att.name })}
                              className="w-10 h-10 rounded-lg bg-slate-200 overflow-hidden cursor-pointer shrink-0 border border-slate-300"
                            >
                              <img src={att.dataUrl} alt={att.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <span className="text-[10px] font-bold text-[#7B1B38] block">{att.category}</span>
                            <p className="text-xs font-bold text-slate-800 truncate max-w-[130px]">{att.name}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {isImg && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleOpenPreview(att)}
                              className="h-7 w-7 p-0 text-slate-500 rounded-lg"
                              title="Aperçu"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => triggerDownload(att, att.name || `${att.category}.${isPdf ? 'pdf' : 'jpg'}`)}
                            className="h-7 px-2 text-[10px] font-bold rounded-lg border-slate-300 text-slate-700"
                            title="Télécharger"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Vue Liste des Dossiers
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#7B1B38] rounded-full"></div>
            Suivi des Dossiers & Visas
          </h1>
          <p className="text-slate-500 font-medium">Gérez vos demandes B2B, consultez les documents et téléchargez vos visas délivrés.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Rechercher voyageur, passeport..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64 bg-slate-50 border-slate-200 rounded-xl text-xs"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
        {['ALL', 'ActionRequired', 'Processing', 'Approved', 'Pending', 'Rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
              filter === status 
                ? 'bg-[#7B1B38] text-white shadow-md shadow-[#7B1B38]/20' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {status === 'ALL' ? 'Tous les dossiers' : status === 'ActionRequired' ? 'Action Requise' : status === 'Processing' ? 'En cours' : status === 'Approved' ? 'Approuvés' : status === 'Pending' ? 'En attente' : 'Rejetés'}
          </button>
        ))}
      </div>

      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-black text-slate-800">Aucun dossier trouvé</h3>
          <p className="text-xs text-slate-500 mt-1">Aucune demande ne correspond à vos critères de recherche actuels.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map(app => (
            <div 
              key={app.id} 
              onClick={() => setSelectedAppId(app.id)}
              className={`bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:border-[#7B1B38]/40 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden flex flex-col ${getStatusColor(app.status)}`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-xs font-bold text-slate-400">{app.id}</span>
                {getStatusBadge(app.status)}
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-black text-slate-900 group-hover:text-[#7B1B38] transition-colors">
                  {app.travelerName || (app as any).applicantName || "Voyageur"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-semibold">
                  Passeport : <span className="font-mono text-slate-800">{app.passportNumber}</span>
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3 text-xs mb-4 flex justify-between items-center border border-slate-100">
                <span className="font-bold text-slate-700">{app.serviceType} • {app.country}</span>
                <span className="font-black text-[#7B1B38] font-mono">{app.price?.toLocaleString()} DZD</span>
              </div>

              {/* Indicateur Visa disponible */}
              {app.finalDocument && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-800 font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Visa délivré disponible
                  </span>
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              )}

              <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{new Date(app.submissionDate).toLocaleDateString()}</span>
                <span className="font-bold text-[#7B1B38] flex items-center gap-1">
                  Ouvrir le dossier &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
