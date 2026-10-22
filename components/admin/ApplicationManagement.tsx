import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "../../src/store/useAppStore";
import { 
  CheckCircle, XCircle, AlertCircle, 
  Info, Clock, Send, UploadCloud, FileText, User, 
  MessageSquare, Download, Eye, X, FileCheck, Calendar, Phone, Mail, MapPin
} from "lucide-react";
import { uploadFileToServer, downloadFileSafe, resolveAttachmentData } from "../../src/utils/fileUpload";
import { useLanguage } from "../../src/i18n/LanguageContext";
import { AttachmentThumbnail } from "../common/AttachmentThumbnail";

export function ApplicationManagement() {
  const { language, t } = useLanguage();
  const isEn = language === "en";

  const { applications, updateApplication, addApplicationTimelineEntry } = useAppStore();
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [replyMessage, setReplyMessage] = useState("");
  const [finalDocUrl, setFinalDocUrl] = useState("");
  const [finalDocFile, setFinalDocFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);

  const selectedApp = applications.find((a) => a.id === selectedAppId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-bold border-emerald-200 px-3 py-1"><CheckCircle className="w-3 h-3 mr-1" /> {isEn ? "Approved" : "Approuvée"}</Badge>;
      case "Rejected":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 font-bold border-red-200 px-3 py-1"><XCircle className="w-3 h-3 mr-1" /> {isEn ? "Rejected" : "Rejetée"}</Badge>;
      case "Processing":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-bold border-blue-200 px-3 py-1"><Clock className="w-3 h-3 mr-1" /> {isEn ? "Processing" : "En traitement"}</Badge>;
      case "ActionRequired":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 font-bold border-amber-200 px-3 py-1"><AlertCircle className="w-3 h-3 mr-1 animate-pulse" /> {isEn ? "Action Required" : "Action Requise"}</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 font-bold border-slate-200 px-3 py-1"><Info className="w-3 h-3 mr-1" /> {isEn ? "Pending" : "En attente"}</Badge>;
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    
    const tName = (app.travelerName || (app as any).applicantName || "").toLowerCase();
    const pNumber = (app.passportNumber || "").toLowerCase();
    const aName = (app.agencyName || "").toLowerCase();
    
    const matchesSearch = 
      tName.includes(searchTerm.toLowerCase()) || 
      pNumber.includes(searchTerm.toLowerCase()) ||
      aName.includes(searchTerm.toLowerCase());
      
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (newStatus: any) => {
    if (!selectedApp) return;
    
    await updateApplication(selectedApp.id, { status: newStatus });
    await addApplicationTimelineEntry(selectedApp.id, {
      title: "Changement de statut",
      message: `Le dossier est passé en statut : ${
        newStatus === 'Processing' ? 'En cours de traitement consulaire' : 
        newStatus === 'ActionRequired' ? 'Action requise : documents ou précisions demandés' : 
        newStatus === 'Approved' ? 'Dossier approuvé' : 
        newStatus === 'Rejected' ? 'Dossier rejeté' : 'En attente'
      }`,
      sender: "System"
    });
  };

  const handleSendMessage = async () => {
    if (!selectedApp || !replyMessage.trim()) return;
    
    await addApplicationTimelineEntry(selectedApp.id, {
      title: "Message de l'Administration",
      message: replyMessage,
      sender: "Admin"
    });
    
    setReplyMessage("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Le document dépasse la limite de 5 Mo.");
        return;
      }
      setFinalDocFile(file);
      try {
        const uploadRes = await uploadFileToServer(file, "Visa");
        setFinalDocUrl(uploadRes.dataUrl || uploadRes.url);
      } catch (err) {
        console.error("Erreur enregistrement visa:", err);
        alert("Erreur lors de l'enregistrement du document sur le serveur.");
      }
    }
  };

  const handleApproveWithDoc = async () => {
    if (!selectedApp) return;
    
    const updates: any = { 
      status: "Approved",
      finalDocumentDate: new Date().toISOString()
    };
    if (finalDocUrl.trim()) {
      updates.finalDocument = finalDocUrl.trim();
      updates.finalDocumentName = finalDocFile?.name || "Visa_Officiel.pdf";
    }
    
    await updateApplication(selectedApp.id, updates);
    await addApplicationTimelineEntry(selectedApp.id, {
      title: "Visa Délivré & Dossier Approuvé",
      message: finalDocUrl.trim() 
        ? `Le visa officiel (${updates.finalDocumentName}) a été téléversé et mis à disposition de l'agence.` 
        : "Le dossier a été approuvé avec succès par l'administration.",
      sender: "System"
    });
    setFinalDocUrl("");
    setFinalDocFile(null);
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

  // Extraction propre de la liste des pièces jointes
  const getAttachmentsList = () => {
    if (!selectedApp) return [];
    
    const list: Array<{ id: string; name: string; category: string; type: string; size?: number; dataUrl: string; url?: string; storageId?: string }> = [];

    // 1. Structure moderne attachments
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

    // 2. Pièces dans customFormData.attachments
    if (selectedApp.customFormData?.attachments && Array.isArray(selectedApp.customFormData.attachments)) {
      selectedApp.customFormData.attachments.forEach((att: any) => {
        if (att && att.dataUrl && !list.some(x => x.dataUrl === att.dataUrl)) {
          list.push(att);
        }
      });
    }

    // 3. Fallback pièces encodées en direct dans customFormData
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

  const appAttachments = getAttachmentsList();
  const applicantDetails = selectedApp?.customFormData?.applicantDetails;

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      {/* Modal Zoom Image */}
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

      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#7B1B38] rounded-full"></div>
            {isEn ? "Applications & Visa Operations" : "Traitement des Dossiers"}
          </h2>
          <p className="text-slate-500 font-medium">
            {isEn ? "Manage B2B visa applications and audit agency supporting attachments." : "Gérez les demandes de visa B2B et contrôlez les pièces jointes des agences."}
          </p>
        </div>
      </div>

      {/* Main Grid: Split View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left List: Applications */}
        <div className="lg:col-span-5 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-0">
          <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
            <Input 
              placeholder={isEn ? "Search traveler, passport, agency..." : "Rechercher voyageur, passeport, agence..."} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50"
            />
            
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
              {['ALL', 'ActionRequired', 'Processing', 'Approved', 'Pending', 'Rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors ${
                    statusFilter === status 
                      ? 'bg-[#7B1B38] text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status === 'ALL' ? (isEn ? 'All Applications' : 'Tous les dossiers') : 
                   status === 'ActionRequired' ? (isEn ? 'Action Required' : 'Action Requise') : 
                   status === 'Processing' ? (isEn ? 'Processing' : 'En traitement') : 
                   status === 'Approved' ? (isEn ? 'Approved' : 'Approuvés') : 
                   status === 'Pending' ? (isEn ? 'Pending' : 'En attente') : 
                   (isEn ? 'Rejected' : 'Rejetés')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
            {filteredApps.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>Aucun dossier ne correspond à votre filtre.</p>
              </div>
            ) : (
              filteredApps.map(app => (
                <div 
                  key={app.id} 
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedAppId === app.id ? 'bg-[#7B1B38]/5 border-l-4 border-[#7B1B38]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{app.id}</span>
                    {getStatusBadge(app.status)}
                  </div>
                  <div className="font-black text-slate-900 text-base mb-1">
                    {app.travelerName || (app as any).applicantName || "Voyageur inconnu"}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>{app.serviceType} • {app.country}</span>
                    <span className="font-bold text-slate-700">{app.agencyName}</span>
                  </div>
                  {app.attachments && app.attachments.length > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <FileCheck className="w-3.5 h-3.5" /> {app.attachments.length} pièce(s) jointe(s) reçue(s)
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Details Panel */}
        {selectedApp ? (
          <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-0">
            {/* Header of selected app */}
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 shrink-0">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black text-slate-900">
                    {selectedApp.travelerName || (selectedApp as any).applicantName}
                  </h3>
                  {getStatusBadge(selectedApp.status)}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-semibold flex items-center gap-2">
                  <span>Agence : <strong className="text-slate-800">{selectedApp.agencyName}</strong></span>
                  <span>•</span>
                  <span>Dossier : <strong className="text-slate-800 font-mono">{selectedApp.id}</strong></span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleStatusChange("Processing")} 
                  className="font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200 text-xs"
                >
                  En traitement
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleStatusChange("ActionRequired")} 
                  className="font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200 text-xs"
                >
                  Action requise
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleStatusChange("Rejected")} 
                  className="font-bold text-red-700 bg-red-50 hover:bg-red-100 border-red-200 text-xs"
                >
                  Rejeter
                </Button>
              </div>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/30 custom-scrollbar">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                {/* Left Side: Data & Documents */}
                <div className="space-y-6">
                  
                  {/* Zone de Délivrance du Document Final / Visa */}
                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200/80 shadow-xs">
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 mb-3 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Délivrance du Visa Final pour l'Agence
                    </h4>

                    {selectedApp.finalDocument ? (
                      <div className="bg-white rounded-xl p-4 border border-emerald-300 mb-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                              <FileCheck className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-900">
                                {selectedApp.finalDocumentName || "Visa_Officiel_Délivré.pdf"}
                              </p>
                              <p className="text-[10px] text-emerald-700 font-bold">
                                Document actif disponible au téléchargement par l'agence
                              </p>
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => triggerDownload(selectedApp.finalDocument!, selectedApp.finalDocumentName || "Visa_Officiel.pdf")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg gap-1"
                          >
                            <Download className="w-3.5 h-3.5" /> Télécharger
                          </Button>
                        </div>
                      </div>
                    ) : null}

                    {/* Zone de dépôt pour nouveau visa ou mise à jour */}
                    <div className="space-y-3">
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/jpeg,image/png,image/webp,application/pdf"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className={`flex items-center justify-between p-3.5 border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
                          finalDocFile ? 'border-emerald-500 bg-emerald-100/60' : 'border-emerald-300 hover:border-emerald-500 bg-white'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                              finalDocFile ? 'bg-emerald-200 text-emerald-800' : 'bg-emerald-100 text-emerald-600'
                            }`}>
                              <UploadCloud className="w-5 h-5" />
                            </div>
                            <div className="text-xs">
                              {finalDocFile ? (
                                <p className="font-bold text-emerald-900 truncate max-w-xs">{finalDocFile.name}</p>
                              ) : (
                                <p className="font-bold text-emerald-800">
                                  {selectedApp.finalDocument ? "Remplacer le visa (PDF ou Image...)" : "Déposer le visa officiel pour l'agence (PDF / Image)"}
                                </p>
                              )}
                              <p className="text-[10px] text-emerald-700">Max 5 Mo • Téléchargement immédiat pour l'agence</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button 
                        disabled={!finalDocFile && selectedApp.status === "Approved"}
                        onClick={handleApproveWithDoc} 
                        className="w-full bg-[#7B1B38] hover:bg-[#63142c] text-white font-black text-xs h-11 rounded-xl shadow-md shadow-[#7B1B38]/20"
                      >
                        {selectedApp.finalDocument && finalDocFile 
                          ? "Mettre à jour le visa délivré" 
                          : "Approuver et Transmettre le Visa à l'Agence"}
                      </Button>
                    </div>
                  </div>

                  {/* Fiche Voyageur Complète */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h4 className="font-black text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-[#7B1B38]" /> Fiche Voyageur & Identité
                    </h4>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 font-bold uppercase block mb-0.5">Voyageur</span>
                        <span className="font-black text-slate-900 text-sm">{selectedApp.travelerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold uppercase block mb-0.5">Numéro de Passeport</span>
                        <span className="font-mono font-black text-slate-900 text-sm">{selectedApp.passportNumber}</span>
                      </div>

                      {applicantDetails && (
                        <>
                          <div>
                            <span className="text-slate-400 font-bold uppercase block mb-0.5">Date de naissance</span>
                            <span className="font-bold text-slate-800">{applicantDetails.dateOfBirth || "-"}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold uppercase block mb-0.5">Expiration Passeport</span>
                            <span className="font-bold text-slate-800">{applicantDetails.expiryDate || "-"}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold uppercase block mb-0.5">Nationalité / Sexe</span>
                            <span className="font-bold text-slate-800">
                              {applicantDetails.nationality || "Algérienne"} ({applicantDetails.gender === "F" ? "Femme" : "Homme"})
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold uppercase block mb-0.5">Lieu de naissance</span>
                            <span className="font-bold text-slate-800">{applicantDetails.placeOfBirth || "-"}</span>
                          </div>
                          {applicantDetails.phone && (
                            <div>
                              <span className="text-slate-400 font-bold uppercase block mb-0.5">Téléphone contact</span>
                              <span className="font-bold text-slate-800">{applicantDetails.phone}</span>
                            </div>
                          )}
                          {applicantDetails.email && (
                            <div>
                              <span className="text-slate-400 font-bold uppercase block mb-0.5">Courriel</span>
                              <span className="font-bold text-slate-800 truncate block">{applicantDetails.email}</span>
                            </div>
                          )}
                          {applicantDetails.address && (
                            <div className="col-span-2">
                              <span className="text-slate-400 font-bold uppercase block mb-0.5">Adresse de résidence</span>
                              <span className="font-bold text-slate-800">{applicantDetails.address}</span>
                            </div>
                          )}
                        </>
                      )}

                      <div className="pt-2 border-t border-slate-100 col-span-2 flex justify-between items-center">
                        <div>
                          <span className="text-slate-400 font-bold uppercase block mb-0.5">Service & Destination</span>
                          <span className="font-bold text-slate-800">{selectedApp.serviceType} • {selectedApp.country}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 font-bold uppercase block mb-0.5">Tarif facturé</span>
                          <span className="font-mono font-black text-[#7B1B38] text-sm">{selectedApp.price?.toLocaleString()} DZD</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Galerie des Pièces Jointes reçues de l'Agence */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h4 className="font-black text-slate-800 flex items-center gap-2 text-sm">
                        <UploadCloud className="w-4 h-4 text-[#7B1B38]" /> Pièces Jointes Transmises ({appAttachments.length})
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Documents réels reçus</span>
                    </div>

                    {appAttachments.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        Aucun document téléversé attaché à ce dossier.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {appAttachments.map((att, idx) => {
                          const isPdf = att.type?.includes("pdf") || att.name?.toLowerCase().endsWith(".pdf");

                          return (
                            <div key={att.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 overflow-hidden min-w-0 flex-1">
                                <AttachmentThumbnail 
                                  attachment={att} 
                                  size="md"
                                  onOpenPreview={(src, title) => setPreviewImage({ src, title })}
                                />

                                <div className="overflow-hidden min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-[#7B1B38]/10 text-[#7B1B38] font-bold text-[10px] py-0">
                                      {att.category || "Justificatif"}
                                    </Badge>
                                    {isPdf && <Badge variant="outline" className="text-[9px] py-0 text-rose-600 border-rose-300">PDF</Badge>}
                                  </div>
                                  <p className="text-xs font-bold text-slate-900 truncate mt-1" title={att.name}>{att.name}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleOpenPreview(att)}
                                  className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 rounded-lg"
                                  title="Aperçu"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => triggerDownload(att, att.name || `${att.category}.${isPdf ? 'pdf' : 'jpg'}`)}
                                  className="h-8 px-2.5 text-xs font-bold rounded-lg border-slate-300 hover:bg-slate-200 text-slate-700 gap-1"
                                >
                                  <Download className="w-3.5 h-3.5" /> Télécharger
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Timeline & Messages */}
                <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[550px] xl:h-auto xl:max-h-[800px]">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                      <MessageSquare className="w-4 h-4 text-[#7B1B38]" /> Messagerie Directe avec l'Agence
                    </h4>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/20">
                    {(!selectedApp.timeline || selectedApp.timeline.length === 0) ? (
                      <div className="text-center py-12 text-slate-400">
                        <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p className="text-xs">Aucun message échangé pour le moment.</p>
                      </div>
                    ) : (
                      selectedApp.timeline.map(entry => (
                        <div key={entry.id} className={`p-3.5 rounded-xl border text-xs ${
                          entry.sender === 'Admin' ? 'bg-[#7B1B38]/5 border-[#7B1B38]/20 ml-6 shadow-xs' : 
                          entry.sender === 'Agency' ? 'bg-white border-slate-200 mr-6 shadow-xs' :
                          'bg-slate-100 border-slate-200 mx-6 text-center'
                        }`}>
                          <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                            entry.sender === 'Admin' ? 'text-[#7B1B38]' :
                            entry.sender === 'System' ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {entry.sender === 'System' ? 'Système' : entry.sender === 'Admin' ? 'Vous (Administration)' : 'Agence Partenaire'} • {new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                          <div className="text-slate-800 font-medium whitespace-pre-wrap leading-relaxed">{entry.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="p-3.5 border-t border-slate-100 bg-white shrink-0 flex gap-2">
                    <Input 
                      placeholder="Écrire à l'agence (demande de pièce, précision...)..." 
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="bg-slate-50 text-xs h-10 rounded-xl"
                    />
                    <Button onClick={handleSendMessage} className="bg-[#7B1B38] hover:bg-[#63142c] text-white shrink-0 h-10 px-4 rounded-xl">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
              </div>
            </div>

          </div>
        ) : (
          <div className="hidden lg:flex lg:col-span-7 flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm text-center p-12">
            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100 text-[#7B1B38]">
              <FileText className="w-10 h-10 opacity-40" />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">Sélectionnez un dossier à traiter</h3>
            <p className="text-slate-500 text-xs max-w-sm">
              Choisissez une demande dans la liste à gauche pour contrôler les scans reçus, communiquer avec l'agence et délivrer le visa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
