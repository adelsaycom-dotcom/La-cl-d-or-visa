const fs = require('fs');
const content = `import { useState } from "react";
import { useAppStore, Application } from "../../src/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Search, Clock, CheckCircle2, AlertCircle, XCircle, 
  ChevronRight, ArrowLeft, Download, Send, MessageSquare 
} from "lucide-react";

export function AgencyApplications() {
  const { applications, addApplicationTimelineEntry } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const selectedApp = applications.find(a => a.id === selectedAppId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved": return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Approuvée</Badge>;
      case "Rejected": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Rejetée</Badge>;
      case "Processing": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200"><Clock className="w-3 h-3 mr-1" /> En traitement</Badge>;
      case "ActionRequired": return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200"><AlertCircle className="w-3 h-3 mr-1 animate-pulse" /> Action Requise</Badge>;
      default: return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200"><Clock className="w-3 h-3 mr-1" /> En attente</Badge>;
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
    const matchesSearch = app.travelerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.passportNumber.toLowerCase().includes(searchTerm.toLowerCase());
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

  if (selectedApp) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setSelectedAppId(null)} className="h-10 w-10 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              Dossier: {selectedApp.travelerName}
              {getStatusBadge(selectedApp.status)}
            </h2>
            <p className="text-slate-500 font-medium">Soumis le {new Date(selectedApp.submissionDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Timeline & Messages */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Action Required Banner */}
            {selectedApp.status === 'ActionRequired' && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
                <AlertCircle className="w-8 h-8 text-amber-500 shrink-0" />
                <div>
                  <h3 className="font-bold text-amber-800 text-lg mb-1">Action requise de votre part</h3>
                  <p className="text-amber-700 mb-4">L'administration a besoin d'informations complémentaires ou d'un document corrigé pour poursuivre le traitement.</p>
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white font-bold">Fournir les documents</Button>
                </div>
              </div>
            )}

            {/* Approved Banner */}
            {selectedApp.status === 'Approved' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-800 text-lg">Dossier finalisé avec succès !</h3>
                    <p className="text-emerald-700">Le document de votre client est prêt à être téléchargé.</p>
                  </div>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-6 shrink-0 w-full sm:w-auto shadow-lg shadow-emerald-600/20">
                  <Download className="w-5 h-5 mr-2" /> Télécharger E-Visa
                </Button>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
              <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" /> Suivi & Communication
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 custom-scrollbar">
                {(!selectedApp.timeline || selectedApp.timeline.length === 0) ? (
                  <div className="text-center py-12 text-slate-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Aucun message pour le moment.</p>
                  </div>
                ) : (
                  selectedApp.timeline.map(entry => (
                    <div key={entry.id} className={\`flex flex-col \${entry.sender === 'Agency' ? 'items-end' : entry.sender === 'System' ? 'items-center' : 'items-start'}\`}>
                      <div className={\`max-w-[80%] rounded-2xl p-4 \${
                        entry.sender === 'Agency' ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20' : 
                        entry.sender === 'Admin' ? 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm' :
                        'bg-slate-200 text-slate-600 text-sm py-2 rounded-full'
                      }\`}>
                        {entry.sender !== 'System' && (
                          <div className={\`text-[10px] font-bold uppercase mb-1 \${entry.sender === 'Agency' ? 'text-blue-200' : 'text-slate-400'}\`}>
                            {entry.sender === 'Admin' ? 'Administration' : 'Vous'} • {new Date(entry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        )}
                        <div>{entry.message}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 bg-white border-t border-slate-100 flex gap-3">
                <Input 
                  placeholder="Écrire à l'administration..." 
                  className="bg-slate-50 h-12 rounded-xl"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={selectedApp.status === 'Approved' || selectedApp.status === 'Rejected'}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={selectedApp.status === 'Approved' || selectedApp.status === 'Rejected' || !replyMessage.trim()}
                  className="h-12 w-12 rounded-xl bg-blue-600 hover:bg-blue-700 shrink-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar - Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-gold" /> Informations du Dossier
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Service</div>
                  <div className="font-semibold text-slate-800">{selectedApp.serviceType} - {selectedApp.country}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Voyageur</div>
                  <div className="font-semibold text-slate-800">{selectedApp.travelerName}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Passeport</div>
                  <div className="font-semibold text-slate-800">{selectedApp.passportNumber}</div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-500 uppercase">Coût du service</div>
                  <div className="text-xl font-black text-slate-900">{selectedApp.price.toLocaleString()} DZD</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Suivi des Dossiers</h1>
          <p className="text-slate-500 font-medium">Gérez et suivez l'avancement de vos demandes.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64 bg-slate-50 border-slate-200 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
        {['ALL', 'ActionRequired', 'Processing', 'Approved', 'Pending', 'Rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={\`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all \${
              filter === status 
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }\`}
          >
            {status === 'ALL' ? 'Tous les dossiers' : 
             status === 'ActionRequired' ? 'Action Requise' :
             status === 'Processing' ? 'En traitement' :
             status === 'Approved' ? 'Approuvés' :
             status === 'Pending' ? 'En attente' : 'Rejetés'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredApps.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun dossier trouvé</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Vous n'avez aucun dossier correspondant à ces critères. Créez une nouvelle demande pour commencer.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredApps.map((app) => (
              <div 
                key={app.id} 
                onClick={() => setSelectedAppId(app.id)}
                className={\`p-4 sm:p-6 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 \${getStatusColor(app.status)}\`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <div className="hidden sm:flex w-12 h-12 bg-slate-100 rounded-2xl items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-slate-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-slate-900 text-lg">{app.travelerName}</h3>
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="text-sm font-medium text-slate-500 flex flex-wrap items-center gap-3">
                      <span>{app.serviceType} • {app.country}</span>
                      <span className="hidden sm:inline-block w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{app.passportNumber}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="text-left sm:text-right">
                    <div className="text-xs font-bold text-slate-400 uppercase">Soumis le</div>
                    <div className="font-medium text-slate-700">{new Date(app.submissionDate).toLocaleDateString()}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
`;
fs.writeFileSync('components/agency/AgencyApplications.tsx', content);
