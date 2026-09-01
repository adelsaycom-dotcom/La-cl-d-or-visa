const fs = require('fs');
const content = `import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "../../src/store/useAppStore";
import { 
  CheckCircle, XCircle, AlertCircle, 
  Info, Clock, Send, UploadCloud, FileText, User, MapPin, MessageSquare
} from "lucide-react";

export function ApplicationManagement() {
  const { applications, updateApplication, addApplicationTimelineEntry } = useAppStore();
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [replyMessage, setReplyMessage] = useState("");
  const [finalDocUrl, setFinalDocUrl] = useState("");

  const selectedApp = applications.find((a) => a.id === selectedAppId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-bold border-emerald-200 px-3 py-1"><CheckCircle className="w-3 h-3 mr-1" /> Approuvée</Badge>;
      case "Rejected":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 font-bold border-red-200 px-3 py-1"><XCircle className="w-3 h-3 mr-1" /> Rejetée</Badge>;
      case "Processing":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-bold border-blue-200 px-3 py-1"><Clock className="w-3 h-3 mr-1" /> En traitement</Badge>;
      case "ActionRequired":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 font-bold border-amber-200 px-3 py-1"><AlertCircle className="w-3 h-3 mr-1 animate-pulse" /> Action Requise</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 font-bold border-slate-200 px-3 py-1"><Info className="w-3 h-3 mr-1" /> En attente</Badge>;
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    const matchesSearch = 
      app.travelerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.passportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.agencyName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (newStatus: any) => {
    if (!selectedApp) return;
    
    await updateApplication(selectedApp.id, { status: newStatus });
    await addApplicationTimelineEntry(selectedApp.id, {
      title: "Changement de statut",
      message: \`Le dossier est passé en statut : \${newStatus === 'Processing' ? 'En traitement' : newStatus === 'ActionRequired' ? 'Action requise' : newStatus === 'Approved' ? 'Approuvé' : newStatus === 'Rejected' ? 'Rejeté' : 'En attente'}\`,
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

  const handleApproveWithDoc = async () => {
    if (!selectedApp) return;
    
    const updates: any = { status: "Approved" };
    if (finalDocUrl.trim()) {
      updates.finalDocument = finalDocUrl.trim();
    }
    
    await updateApplication(selectedApp.id, updates);
    await addApplicationTimelineEntry(selectedApp.id, {
      title: "Dossier Approuvé",
      message: finalDocUrl.trim() ? "Le document final est disponible au téléchargement." : "Le dossier a été approuvé avec succès.",
      sender: "System"
    });
    setFinalDocUrl("");
  };

  const isImageBase64 = (str: any) => typeof str === 'string' && str.startsWith('data:image/');

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Traitement des Dossiers</h2>
          <p className="text-slate-500 font-medium">Gérez le pipeline de vos demandes B2B.</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left Column - List of applications (Takes ~30% width) */}
        <div className={\`flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 \${selectedApp ? 'w-1/3 hidden lg:flex shrink-0 max-w-[400px]' : 'w-full'}\`}>
          <div className="p-4 border-b border-slate-100 space-y-4 shrink-0 bg-slate-50/50">
            <Input
              placeholder="Rechercher nom, passeport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white"
            />
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {['ALL', 'Pending', 'Processing', 'ActionRequired', 'Approved', 'Rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={\`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors \${
                    statusFilter === status 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }\`}
                >
                  {status === 'ALL' ? 'Tous' : 
                   status === 'Pending' ? 'En attente' :
                   status === 'Processing' ? 'En traitement' :
                   status === 'ActionRequired' ? 'Action Requise' :
                   status === 'Approved' ? 'Approuvés' : 'Rejetés'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar bg-slate-50/30">
            {filteredApps.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-medium">Aucun dossier trouvé.</div>
            ) : (
              filteredApps.map(app => (
                <div 
                  key={app.id} 
                  onClick={() => setSelectedAppId(app.id)}
                  className={\`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md \${
                    selectedAppId === app.id 
                      ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-200' 
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }\`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-slate-900 truncate pr-2">{app.travelerName}</div>
                    <div className="shrink-0">{getStatusBadge(app.status)}</div>
                  </div>
                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5 truncate"><User className="w-3 h-3 shrink-0" /> <span className="truncate">{app.agencyName}</span></div>
                    <div className="flex items-center gap-1.5 truncate"><MapPin className="w-3 h-3 shrink-0" /> <span className="truncate">{app.country} - {app.serviceType}</span></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column - Detail & Workspace (Takes ~70% width) */}
        {selectedApp ? (
          <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-0">
            
            {/* Header / Actions */}
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-black text-2xl text-slate-900">{selectedApp.travelerName}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedAppId(null)} className="lg:hidden h-8 px-2">
                    Fermer
                  </Button>
                </div>
                <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                  <User className="w-4 h-4" /> {selectedApp.agencyName}
                </p>
              </div>
              
              <div className="flex flex-col items-start sm:items-end gap-3">
                {getStatusBadge(selectedApp.status)}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleStatusChange("Processing")} className="font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200">
                    En traitement
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleStatusChange("ActionRequired")} className="font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200">
                    Action requise
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleStatusChange("Rejected")} className="font-bold text-red-700 bg-red-50 hover:bg-red-100 border-red-200">
                    Rejeter
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleStatusChange("Pending")} className="font-bold text-slate-700 bg-white">
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Body: 2 Sub-columns (Data vs Timeline) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/30 custom-scrollbar">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                {/* Left Side: Data & Documents */}
                <div className="space-y-6">
                  {/* Final Delivery */}
                  {selectedApp.status !== "Approved" && (
                    <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 shadow-sm">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" /> Finaliser & Approuver
                      </h4>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Lien du E-Visa ou document final..." 
                          value={finalDocUrl}
                          onChange={(e) => setFinalDocUrl(e.target.value)}
                          className="bg-white border-emerald-200"
                        />
                        <Button onClick={handleApproveWithDoc} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shrink-0">
                          Approuver
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* General Info */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" /> Informations Générales
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Service</div>
                        <div className="font-medium text-slate-900">{selectedApp.serviceType} - {selectedApp.country}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Soumission</div>
                        <div className="font-medium text-slate-900">{new Date(selectedApp.submissionDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Passeport</div>
                        <div className="font-medium text-slate-900">{selectedApp.passportNumber}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Montant</div>
                        <div className="font-medium text-slate-900">{selectedApp.price.toLocaleString()} DZD</div>
                      </div>
                    </div>
                  </div>

                  {/* Custom Forms / Documents Base64 Handler */}
                  {selectedApp.customFormData && Object.keys(selectedApp.customFormData).length > 0 && (
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <h4 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                        <UploadCloud className="w-4 h-4 text-slate-400" /> Documents & Données
                      </h4>
                      <div className="space-y-4">
                        {Object.entries(selectedApp.customFormData).map(([key, val]: any) => (
                          <div key={key}>
                            <div className="text-xs font-bold text-slate-500 mb-1.5">{key}</div>
                            {isImageBase64(val) ? (
                              <div className="border border-slate-200 rounded-xl bg-slate-50 p-2 overflow-hidden flex justify-center">
                                <img 
                                  src={val} 
                                  alt={key} 
                                  className="max-w-full h-auto max-h-[300px] object-contain rounded-lg" 
                                />
                              </div>
                            ) : (
                              <div className="text-sm text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                                {val || '-'}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Timeline & Messages */}
                <div className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[500px] xl:h-auto xl:max-h-[800px]">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-500" /> Journal & Messagerie
                    </h4>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                    {(!selectedApp.timeline || selectedApp.timeline.length === 0) ? (
                      <div className="text-center py-10 text-slate-400">
                        <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Aucun historique pour ce dossier.</p>
                      </div>
                    ) : (
                      selectedApp.timeline.map(entry => (
                        <div key={entry.id} className={\`p-4 rounded-xl border \${
                          entry.sender === 'Admin' ? 'bg-blue-50 border-blue-100 ml-6 shadow-sm' : 
                          entry.sender === 'Agency' ? 'bg-white border-slate-200 mr-6 shadow-sm' :
                          'bg-slate-50 border-slate-100 mx-10 text-center'
                        }\`}>
                          <div className={\`text-[10px] font-bold uppercase tracking-wider mb-1.5 \${
                            entry.sender === 'Admin' ? 'text-blue-700' :
                            entry.sender === 'System' ? 'text-slate-400' : 'text-slate-500'
                          }\`}>
                            {entry.sender === 'System' ? 'Système' : entry.sender === 'Admin' ? 'Vous (Admin)' : 'Agence'} • {new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                          <div className="text-sm text-slate-800 whitespace-pre-wrap">{entry.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-slate-100 bg-white shrink-0 flex gap-2">
                    <Input 
                      placeholder="Message à l'agence..." 
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="bg-slate-50"
                    />
                    <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
              </div>
            </div>

          </div>
        ) : (
          <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm text-center p-12">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Sélectionnez un dossier</h3>
            <p className="text-slate-500 max-w-sm">
              Cliquez sur un dossier dans la liste à gauche pour afficher ses détails, visualiser ses documents et interagir avec l'agence.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
`;
fs.writeFileSync('components/admin/ApplicationManagement.tsx', content);
