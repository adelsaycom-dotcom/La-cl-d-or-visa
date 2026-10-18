import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  MessageSquare, AlertCircle, Plus, Send, ArrowLeft, Search, CheckCircle, 
  Clock, Paperclip, Image as ImageIcon, X, Download, Eye, FileText, 
  ChevronRight, User, Globe, AlertTriangle, ShieldCheck, Sparkles, 
  Filter, ExternalLink, Calendar, Plane
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore, SupportTicketAttachment, Application } from "../../src/store/useAppStore";
import { auth } from "../../src/firebase";
import { uploadFileToServer } from "../../src/utils/fileUpload";

export function AgencySupport() {
  const { supportTickets, addSupportTicket, updateSupportTicket, applications, currentAgency } = useAppStore();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  // New ticket state
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Dossier & Démarche");
  const [isUrgent, setIsUrgent] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string>("none");
  const [attachments, setAttachments] = useState<SupportTicketAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Chat reply state
  const [replyText, setReplyText] = useState("");
  const [replyAttachments, setReplyAttachments] = useState<SupportTicketAttachment[]>([]);
  const [isReplyingUploading, setIsReplyingUploading] = useState(false);
  
  // Search & Filter state
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "all" | "archived" | "urgent">("active");
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);
  const [viewDossierModal, setViewDossierModal] = useState<Application | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replyFileInputRef = useRef<HTMLInputElement>(null);

  // Current agency applications
  const myApplications = applications.filter(app => {
    if (!currentAgency?.id && !auth.currentUser?.uid) return true;
    return app.agencyId === currentAgency?.id || app.agencyId === auth.currentUser?.uid;
  });

  const selectedTicket = supportTickets.find(t => t.id === selectedTicketId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedTicket?.messages, selectedTicketId]);

  // Handle file uploads for new ticket
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      const newAttachments: SupportTicketAttachment[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadFileToServer(file, "Support");
        newAttachments.push({
          id: `att_${Date.now()}_${i}`,
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
          dataUrl: res.url
        });
      }
      setAttachments(prev => [...prev, ...newAttachments]);
    } catch (err) {
      console.error("Erreur lors de l'upload :", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Handle file uploads for chat reply
  const handleReplyFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsReplyingUploading(true);

    try {
      const newAttachments: SupportTicketAttachment[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadFileToServer(file, "Support");
        newAttachments.push({
          id: `att_${Date.now()}_${i}`,
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
          dataUrl: res.url
        });
      }
      setReplyAttachments(prev => [...prev, ...newAttachments]);
    } catch (err) {
      console.error("Erreur lors de l'upload :", err);
    } finally {
      setIsReplyingUploading(false);
      if (replyFileInputRef.current) replyFileInputRef.current.value = "";
    }
  };

  // Submit new ticket
  const handleSubmit = () => {
    if (!subject.trim() || !description.trim()) return;

    const ticketData: any = {
      agencyId: auth.currentUser?.uid || currentAgency?.id || "agency-default",
      agencyName: currentAgency?.agencyName || currentAgency?.name || auth.currentUser?.email || "Mon Agence",
      subject: subject.trim(),
      description: description.trim(),
      status: "OPEN",
      isUrgent: Boolean(isUrgent),
      category: category || "Dossier & Démarche",
      priority: isUrgent ? "Critique" : category === "Délai de traitement anormal" ? "Haute" : "Moyenne",
      messages: []
    };

    if (selectedAppId && selectedAppId !== "none") {
      const linkedApp = myApplications.find(a => a.id === selectedAppId);
      if (linkedApp) {
        ticketData.applicationId = linkedApp.id;
        ticketData.applicationRef = `DOSS-${linkedApp.id.substring(0, 6).toUpperCase()}`;
        ticketData.applicationSummary = {
          travelerName: linkedApp.travelerName || "",
          destination: linkedApp.country || "",
          serviceType: linkedApp.serviceType || "",
          status: linkedApp.status || ""
        };
      }
    }

    if (attachments && attachments.length > 0) {
      ticketData.attachments = attachments;
    }

    addSupportTicket(ticketData);

    setIsNewTicketOpen(false);
    setSubject("");
    setDescription("");
    setIsUrgent(false);
    setSelectedAppId("none");
    setCategory("Dossier & Démarche");
    setAttachments([]);
  };

  // Reply to ticket
  const handleReply = () => {
    if ((!replyText.trim() && replyAttachments.length === 0) || !selectedTicket) return;
    
    const newMsg: any = {
      sender: 'agency',
      text: replyText.trim(),
      date: new Date().toISOString()
    };
    if (replyAttachments && replyAttachments.length > 0) {
      newMsg.attachments = replyAttachments;
    }

    const newMessages = [...(selectedTicket.messages || []), newMsg];

    updateSupportTicket(selectedTicket.id, { 
      messages: newMessages,
      status: selectedTicket.status === 'RESOLVED' ? 'OPEN' : selectedTicket.status
    });

    setReplyText("");
    setReplyAttachments([]);
  };

  // Auto-fill template
  const handleSelectTemplate = (templateTitle: string, templateText: string) => {
    setSubject(templateTitle);
    setDescription(templateText);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
      case "Ouvert":
        return <Badge className="bg-amber-100 text-amber-800 border-none font-semibold px-2.5 py-0.5">En attente support</Badge>;
      case "IN_PROGRESS":
      case "En cours":
        return <Badge className="bg-blue-100 text-blue-800 border-none font-semibold px-2.5 py-0.5">En cours de traitement</Badge>;
      case "RESOLVED":
      case "Résolu":
        return <Badge className="bg-emerald-100 text-emerald-800 border-none font-semibold px-2.5 py-0.5">Résolu</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-800 border-none">{status}</Badge>;
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "Délai de traitement anormal":
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full"><Clock className="w-3 h-3" /> Délai</span>;
      case "Paiement, Solde & Facturation":
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">Solde & Paiement</span>;
      case "Modification voyageur / Document erroné":
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">Rectification</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">Dossier</span>;
    }
  };

  // Filtering tickets
  const filteredTickets = supportTickets.filter(t => {
    const q = search.toLowerCase();
    const matchesSearch = 
      t.subject.toLowerCase().includes(q) || 
      t.id.toLowerCase().includes(q) ||
      (t.applicationRef && t.applicationRef.toLowerCase().includes(q)) ||
      (t.applicationSummary?.travelerName && t.applicationSummary.travelerName.toLowerCase().includes(q));

    const isResolved = t.status === "RESOLVED" || t.status === "Résolu";
    if (activeTab === "active") return matchesSearch && !isResolved;
    if (activeTab === "archived") return matchesSearch && isResolved;
    if (activeTab === "urgent") return matchesSearch && t.isUrgent;
    return matchesSearch;
  }).sort((a, b) => {
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;
    return new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime();
  });

  const linkedAppForSelectedTicket = selectedTicket?.applicationId 
    ? applications.find(a => a.id === selectedTicket.applicationId) 
    : null;

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col -m-4 sm:m-0 sm:h-[calc(100vh-120px)] bg-white sm:rounded-2xl sm:border border-slate-200 overflow-hidden shadow-sm max-w-[1600px] mx-auto">
      <div className="flex flex-1 overflow-hidden h-full">
        
        {/* ============================================================ */}
        {/* Panneau gauche : Liste des Tickets                          */}
        {/* ============================================================ */}
        <div className={`w-full lg:w-[410px] flex-col border-r border-slate-200 bg-slate-50/70 flex shrink-0 ${selectedTicketId ? 'hidden lg:flex' : 'flex'}`}>
          
          {/* En-tête panneau gauche */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-white space-y-3.5 shrink-0">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black tracking-tight text-slate-900">Support Dédié</h2>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#7B1B38]/10 text-[#7B1B38] rounded-full">B2B Pro</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Assistance consulaire et technique prioritaire</p>
              </div>
              <Button 
                onClick={() => setIsNewTicketOpen(true)} 
                className="bg-[#7B1B38] hover:bg-[#63142c] text-white rounded-xl h-10 px-3.5 shadow-sm shadow-[#7B1B38]/20 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau ticket</span>
              </Button>
            </div>

            {/* Barre de recherche */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="Rechercher sujet, réf dossier, voyageur..." 
                className="pl-9 bg-slate-50 border-slate-200 rounded-xl text-xs h-9 focus:bg-white transition-colors" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Onglets de filtrage */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              <button 
                className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg transition-all ${activeTab === 'active' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`} 
                onClick={() => setActiveTab('active')}
              >
                En cours
              </button>
              <button 
                className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg transition-all ${activeTab === 'urgent' ? 'bg-red-50 text-red-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`} 
                onClick={() => setActiveTab('urgent')}
              >
                Urgents
              </button>
              <button 
                className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg transition-all ${activeTab === 'archived' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`} 
                onClick={() => setActiveTab('archived')}
              >
                Résolus
              </button>
              <button 
                className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg transition-all ${activeTab === 'all' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`} 
                onClick={() => setActiveTab('all')}
              >
                Tous
              </button>
            </div>
          </div>
          
          {/* Liste des tickets */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-200 mb-3 shadow-sm">
                  <MessageSquare className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-800">Aucun ticket correspondant</p>
                <p className="text-xs text-slate-500 mt-1 max-w-[240px]">
                  {search ? "Modifiez votre recherche ou réinitialisez les filtres." : "Vous n'avez aucun ticket dans cette catégorie."}
                </p>
                <Button 
                  onClick={() => setIsNewTicketOpen(true)}
                  variant="outline"
                  className="mt-4 rounded-xl border-slate-300 font-bold text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Ouvrir une demande
                </Button>
              </div>
            ) : (
              filteredTickets.map(t => {
                const isSelected = selectedTicketId === t.id;
                const hasAttachments = (t.attachments && t.attachments.length > 0) || (t.messages && t.messages.some(m => m.attachments && m.attachments.length > 0));
                
                return (
                  <button 
                    key={t.id} 
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`w-full text-left p-4 transition-all hover:bg-white focus:outline-none relative group ${isSelected ? 'bg-white shadow-sm ring-1 ring-slate-900/5' : ''}`}
                  >
                    {/* Barre latérale active */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r transition-colors ${isSelected ? 'bg-[#7B1B38]' : t.isUrgent ? 'bg-red-500' : 'bg-transparent'}`} />

                    <div className="pl-1">
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <span className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-[#7B1B38] transition-colors">
                          {t.subject}
                        </span>
                        <span className="shrink-0">{getStatusBadge(t.status)}</span>
                      </div>

                      {/* Dossier lié s'il existe */}
                      {t.applicationRef && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded-md w-fit mb-2">
                          <FileText className="w-3 h-3 text-blue-600" />
                          <span>{t.applicationRef}</span>
                          {t.applicationSummary?.travelerName && (
                            <span className="text-blue-900 font-medium truncate max-w-[140px]">• {t.applicationSummary.travelerName}</span>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-slate-500 line-clamp-1 mb-2.5">
                        {t.messages && t.messages.length > 0 
                          ? t.messages[t.messages.length - 1].text || "Pièce jointe envoyée" 
                          : t.description}
                      </p>

                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">#{t.id.substring(0, 6)}</span>
                          {getCategoryBadge(t.category)}
                          {hasAttachments && (
                            <span className="flex items-center gap-0.5 text-slate-500" title="Contient des pièces jointes">
                              <Paperclip className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {t.isUrgent && (
                            <span className="flex items-center gap-0.5 text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                              <AlertCircle className="w-3 h-3" /> Urgent
                            </span>
                          )}
                          <span>{new Date(t.createdAt || t.date || 0).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* Panneau droit : Chat Actif & Dossier Lié                      */}
        {/* ============================================================ */}
        <div className={`flex-1 flex-col bg-white overflow-hidden ${!selectedTicketId ? 'hidden lg:flex' : 'flex w-full'}`}>
          {!selectedTicket ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 p-6 text-center">
              <div className="w-16 h-16 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center justify-center mb-4 text-[#7B1B38]">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Aucun ticket sélectionné</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Sélectionnez une discussion existante dans la colonne de gauche ou ouvrez une nouvelle demande pour votre agence.
              </p>
              <Button 
                onClick={() => setIsNewTicketOpen(true)}
                className="mt-5 bg-[#7B1B38] hover:bg-[#63142c] text-white rounded-xl text-xs font-bold px-5"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Créer un ticket
              </Button>
            </div>
          ) : (
            <>
              {/* En-tête du Chat */}
              <div className="shrink-0 border-b border-slate-200 px-4 sm:px-6 py-3.5 bg-white z-10 shadow-xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <button 
                      className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
                      onClick={() => setSelectedTicketId(null)}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-slate-900 text-sm sm:text-base leading-snug truncate">
                          {selectedTicket.subject}
                        </h3>
                        {selectedTicket.isUrgent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> URGENT
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 flex-wrap">
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold text-[10px]">
                          #{selectedTicket.id.substring(0, 8)}
                        </span>
                        <span>•</span>
                        <span>{selectedTicket.category || "Général"}</span>
                        <span>•</span>
                        <span>Créé le {new Date(selectedTicket.createdAt || selectedTicket.date || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                </div>

                {/* Bannière de dossier lié s'il est rattaché */}
                {(selectedTicket.applicationRef || selectedTicket.applicationId) && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-blue-50/90 to-cyan-50/60 border border-blue-200/80 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-blue-950">Dossier Associé :</span>
                          <span className="font-mono font-bold text-blue-700 bg-white/80 px-1.5 py-0.5 rounded border border-blue-200">
                            {selectedTicket.applicationRef || selectedTicket.applicationId}
                          </span>
                        </div>
                        <div className="text-slate-600 truncate mt-0.5">
                          {selectedTicket.applicationSummary?.travelerName ? (
                            <>
                              <span className="font-bold text-slate-900">{selectedTicket.applicationSummary.travelerName}</span>
                              <span className="mx-1.5">•</span>
                              <span>{selectedTicket.applicationSummary.destination} ({selectedTicket.applicationSummary.serviceType})</span>
                            </>
                          ) : (
                            <span>Demande rattachée au système consulaire</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {linkedAppForSelectedTicket && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewDossierModal(linkedAppForSelectedTicket)}
                        className="h-8 px-2.5 text-xs font-bold text-blue-700 bg-white border-blue-200 hover:bg-blue-50 shrink-0 rounded-lg flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Détails dossier</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Contenu Messages du Chat */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/70 space-y-6">
                
                {/* Message initial (La demande) */}
                <div className="flex flex-col items-end max-w-[90%] lg:max-w-[78%] ml-auto">
                  <div className="flex items-center gap-2 mb-1 mr-1 flex-row-reverse text-xs">
                    <div className="w-6 h-6 rounded-full bg-[#7B1B38] text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-xs">
                      AG
                    </div>
                    <span className="font-bold text-slate-700">Votre Agence</span>
                    <span className="text-[10px] text-slate-400">{new Date(selectedTicket.createdAt || selectedTicket.date || 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="bg-[#7B1B38] text-white rounded-2xl rounded-tr-none p-4 shadow-sm text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-left w-full">
                    {selectedTicket.description}

                    {/* Pièces jointes initiales */}
                    {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedTicket.attachments.map((att) => (
                          <div 
                            key={att.id}
                            onClick={() => setSelectedImageModal(att.dataUrl)}
                            className="flex items-center gap-2 p-2 bg-white/10 hover:bg-white/20 rounded-xl cursor-pointer transition-colors border border-white/10"
                          >
                            {att.type.startsWith("image/") ? (
                              <img src={att.dataUrl} alt={att.name} className="w-10 h-10 rounded-lg object-cover bg-black/20 shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-white" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold text-white truncate">{att.name}</p>
                              <p className="text-[10px] text-white/70">{(att.size / 1024).toFixed(0)} Ko • Cliquer pour agrandir</p>
                            </div>
                            <Eye className="w-4 h-4 text-white/70 shrink-0 mr-1" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Historique des réponses */}
                {(selectedTicket.messages || []).map((msg, idx) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div key={idx} className={`flex flex-col ${isAdmin ? 'items-start max-w-[90%] lg:max-w-[78%]' : 'items-end max-w-[90%] lg:max-w-[78%] ml-auto'}`}>
                      <div className={`flex items-center gap-2 mb-1 ${isAdmin ? 'ml-1' : 'mr-1 flex-row-reverse'} text-xs`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 shadow-xs uppercase ${isAdmin ? 'bg-slate-900 text-white' : 'bg-[#7B1B38] text-white'}`}>
                          {isAdmin ? 'AD' : 'AG'}
                        </div>
                        <span className="font-bold text-slate-700">{isAdmin ? 'Support Plateforme' : 'Votre Agence'}</span>
                        <span className="text-[10px] text-slate-400">{new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div className={`rounded-2xl p-4 shadow-xs text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-left w-full ${
                        isAdmin 
                          ? 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none' 
                          : 'bg-[#7B1B38] text-white rounded-tr-none'
                      }`}>
                        {msg.text}

                        {/* Pièces jointes du message */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className={`mt-3 pt-3 border-t ${isAdmin ? 'border-slate-100' : 'border-white/20'} grid grid-cols-1 sm:grid-cols-2 gap-2`}>
                            {msg.attachments.map((att) => (
                              <div 
                                key={att.id}
                                onClick={() => setSelectedImageModal(att.dataUrl)}
                                className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-colors border ${
                                  isAdmin 
                                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' 
                                    : 'bg-white/10 hover:bg-white/20 border-white/10'
                                }`}
                              >
                                {att.type.startsWith("image/") ? (
                                  <img src={att.dataUrl} alt={att.name} className="w-10 h-10 rounded-lg object-cover bg-black/10 shrink-0" />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5 text-slate-700" />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className={`text-[11px] font-bold truncate ${isAdmin ? 'text-slate-900' : 'text-white'}`}>{att.name}</p>
                                  <p className={`text-[10px] ${isAdmin ? 'text-slate-500' : 'text-white/70'}`}>
                                    {(att.size / 1024).toFixed(0)} Ko • Voir fichier
                                  </p>
                                </div>
                                <Eye className={`w-4 h-4 shrink-0 mr-1 ${isAdmin ? 'text-slate-400' : 'text-white/70'}`} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} className="h-1" />
              </div>

              {/* Zone de saisie de réponse */}
              {selectedTicket.status !== "RESOLVED" && selectedTicket.status !== "Résolu" ? (
                <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0 space-y-2">
                  
                  {/* Prévisualisation des pièces jointes en attente d'envoi */}
                  {replyAttachments.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      {replyAttachments.map(att => (
                        <div key={att.id} className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg pl-2 pr-1 py-1 text-xs shrink-0">
                          {att.type.startsWith("image/") ? (
                            <img src={att.dataUrl} alt={att.name} className="w-5 h-5 rounded object-cover" />
                          ) : (
                            <FileText className="w-4 h-4 text-slate-600" />
                          )}
                          <span className="font-medium text-slate-700 max-w-[120px] truncate">{att.name}</span>
                          <button 
                            onClick={() => setReplyAttachments(prev => prev.filter(x => x.id !== att.id))}
                            className="p-1 hover:text-red-600 text-slate-400"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end gap-2 bg-slate-50 rounded-2xl border border-slate-200 p-2 focus-within:ring-2 focus-within:ring-[#7B1B38] focus-within:border-[#7B1B38] transition-all">
                    {/* Bouton Pièce Jointe */}
                    <input 
                      type="file" 
                      ref={replyFileInputRef}
                      onChange={handleReplyFileUpload}
                      multiple
                      accept="image/*,.pdf"
                      className="hidden" 
                    />
                    <button 
                      type="button"
                      onClick={() => replyFileInputRef.current?.click()}
                      disabled={isReplyingUploading}
                      title="Joindre une capture d'écran ou un fichier"
                      className="w-10 h-10 rounded-xl hover:bg-slate-200/70 text-slate-500 hover:text-slate-800 flex items-center justify-center shrink-0 transition-colors disabled:opacity-50"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>

                    <Textarea 
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Tapez votre réponse ou apportez une précision..."
                      className="border-none bg-transparent shadow-none focus-visible:ring-0 resize-none min-h-[40px] max-h-[140px] py-2.5 text-xs sm:text-sm text-slate-900"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleReply();
                        }
                      }}
                    />

                    <button 
                      onClick={handleReply}
                      disabled={(!replyText.trim() && replyAttachments.length === 0) || isReplyingUploading}
                      className="w-10 h-10 rounded-xl bg-[#7B1B38] hover:bg-[#63142c] text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-[#7B1B38]/20"
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 px-1">
                    <span>Appuyez sur <kbd className="px-1 py-0.5 bg-slate-100 rounded border font-mono">Entrée</kbd> pour envoyer</span>
                    {isReplyingUploading && <span className="text-[#7B1B38] font-bold">Téléversement en cours...</span>}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50/60 text-center text-emerald-800 text-xs font-semibold border-t border-emerald-200 shrink-0 flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Ce ticket a été clôturé et marqué comme résolu par l'équipe support.</span>
                </div>
              )}
            </>
          )}
        </div>

      </div>

      {/* ============================================================ */}
      {/* Dialogue : Nouveau Ticket avec Sélection de Dossier & Upload */}
      {/* ============================================================ */}
      <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden sm:rounded-3xl border-0 shadow-2xl max-h-[92vh] flex flex-col">
          {/* Header modal */}
          <div className="bg-[#7B1B38] p-6 text-white shrink-0">
            <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Assistance Prioritaire B2B</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">Ouvrir un Ticket de Support</h3>
            <p className="text-white/80 text-xs mt-1">
              Notre équipe d'experts consulaires prend en charge votre demande dans les plus brefs délais.
            </p>
          </div>

          <div className="p-6 space-y-5 bg-white overflow-y-auto flex-1">
            
            {/* Sélection du Dossier Référencé */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#7B1B38]" />
                  <span>Lier à un dossier / demande (Recommandé)</span>
                </label>
                <span className="text-[10px] text-slate-400">Optionnel</span>
              </div>

              <Select value={selectedAppId} onValueChange={(val) => {
                setSelectedAppId(val);
                if (val !== "none") {
                  const linked = myApplications.find(a => a.id === val);
                  if (linked && !subject) {
                    setSubject(`Question dossier #${linked.id.substring(0, 6)} - ${linked.travelerName}`);
                  }
                }
              }}>
                <SelectTrigger className="rounded-xl bg-slate-50 border-slate-200 text-xs h-11 focus:ring-[#7B1B38]">
                  <SelectValue placeholder="Sélectionnez un dossier de votre agence..." />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="none" className="text-xs font-semibold text-slate-500">
                    -- Aucun dossier lié (Demande générale / Technique / Solde) --
                  </SelectItem>
                  {myApplications.map(app => (
                    <SelectItem key={app.id} value={app.id} className="text-xs py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#7B1B38]">DOSS-{app.id.substring(0, 6).toUpperCase()}</span>
                        <span className="font-bold text-slate-800">{app.travelerName}</span>
                        <span className="text-slate-400">• {app.country} ({app.serviceType})</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-bold ml-auto">{app.status}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Aperçu rapide du dossier sélectionné */}
              {selectedAppId !== "none" && (() => {
                const app = myApplications.find(a => a.id === selectedAppId);
                if (!app) return null;
                return (
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-blue-950">Voyageur : {app.travelerName} (Passeport: {app.passportNumber || "Non spécifié"})</p>
                      <p className="text-blue-700 text-[11px] mt-0.5">Destination: {app.country} • Prestation: {app.serviceType} {app.visaType && `(${app.visaType})`}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setSelectedAppId("none")}
                      className="text-xs text-blue-700 hover:text-blue-900 font-bold underline shrink-0"
                    >
                      Détacher
                    </button>
                  </div>
                );
              })()}
            </div>

            {/* Catégorie & Urgence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900">Catégorie du problème</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="rounded-xl bg-slate-50 border-slate-200 text-xs h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dossier & Démarche">Dossier & Démarche consulaire</SelectItem>
                    <SelectItem value="Délai de traitement anormal">Délai de traitement anormal</SelectItem>
                    <SelectItem value="Paiement, Solde & Facturation">Paiement, Solde & Facturation</SelectItem>
                    <SelectItem value="Modification voyageur / Document erroné">Modification voyageur / Document</SelectItem>
                    <SelectItem value="Question générale / Autre">Question générale / Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900">Modèles rapides</label>
                <Select onValueChange={(val) => {
                  if (val === "t1") handleSelectTemplate("Retard consulaire sur mon dossier", "Bonjour, le délai de traitement estimé pour ce dossier est dépassé. Pourriez-vous vérifier auprès du centre consulaire s'il manque un document ?");
                  if (val === "t2") handleSelectTemplate("Erreur d'orthographe sur le passeport", "Bonjour, une coquille a été constatée sur les données du passeport soumis. Merci de corriger selon la pièce jointe ci-après.");
                  if (val === "t3") handleSelectTemplate("Problème de validation du paiement solde", "Bonjour, le solde a été débité mais la démarche semble bloquée. Merci de vérifier la transaction.");
                }}>
                  <SelectTrigger className="rounded-xl bg-slate-50 border-slate-200 text-xs h-10">
                    <SelectValue placeholder="Choisir un modèle..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="t1">Retard de traitement consulaire</SelectItem>
                    <SelectItem value="t2">Correction données voyageur</SelectItem>
                    <SelectItem value="t3">Problème paiement ou solde</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sujet du ticket */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900">Sujet clair de la demande</label>
              <Input 
                value={subject} 
                onChange={e => setSubject(e.target.value)} 
                placeholder="Ex: Problème de justificatif sur le dossier Turquie DOSS-123" 
                className="rounded-xl bg-slate-50 border-slate-200 focus:bg-white h-11 text-xs" 
              />
            </div>

            {/* Description détaillée */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900">Description détaillée du problème</label>
              <Textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={4} 
                placeholder="Précisez votre demande en fournissant tous les détails utiles (message d'erreur, consignes de l'ambassade...)" 
                className="rounded-xl bg-slate-50 border-slate-200 focus:bg-white resize-none text-xs" 
              />
            </div>

            {/* Téléversement de pièces jointes (Captures, Reçus, Scans) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#7B1B38]" />
                  <span>Captures d'écran & Justificatifs (Images, PDF)</span>
                </span>
                <span className="text-[10px] text-slate-400">Max 5 Mo / fichier</span>
              </label>

              {/* Zone de drop / upload */}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                accept="image/*,.pdf"
                className="hidden" 
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-[#7B1B38]/50 rounded-2xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#7B1B38] shadow-xs">
                    <Paperclip className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-1">Cliquer pour joindre des captures ou documents</p>
                  <p className="text-[11px] text-slate-500">Formats acceptés : JPG, PNG, WebP, PDF</p>
                </div>
              </div>

              {/* Liste des fichiers uploadés */}
              {attachments.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {attachments.map(att => (
                    <div key={att.id} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl relative group">
                      {att.type.startsWith("image/") ? (
                        <img src={att.dataUrl} alt={att.name} className="w-10 h-10 rounded-lg object-cover bg-slate-200 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-slate-600" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 truncate">{att.name}</p>
                        <p className="text-[10px] text-slate-500">{(att.size / 1024).toFixed(0)} Ko</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setAttachments(prev => prev.filter(x => x.id !== att.id))}
                        className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Option Urgence */}
            <div className="bg-red-50/80 border border-red-200/80 rounded-2xl p-3.5 flex items-start gap-3">
              <input 
                type="checkbox" 
                id="urgent-ticket" 
                checked={isUrgent} 
                onChange={e => setIsUrgent(e.target.checked)} 
                className="mt-1 w-4 h-4 rounded text-red-600 focus:ring-red-500 border-red-300 cursor-pointer" 
              />
              <label htmlFor="urgent-ticket" className="text-xs font-bold text-red-900 block cursor-pointer">
                Déclarer ce ticket comme Priorité Critique / Départ Imminent
                <span className="block text-[11px] text-red-700/90 mt-0.5 font-normal">
                  Réservé aux départs sous 48 heures ou aux blocages bloquant l'embarquement du voyageur.
                </span>
              </label>
            </div>
            
            {/* Actions modal */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <Button 
                variant="outline" 
                className="rounded-xl h-11 px-5 border-slate-200 text-xs font-bold" 
                onClick={() => setIsNewTicketOpen(false)}
              >
                Annuler
              </Button>
              <Button 
                className="bg-[#7B1B38] hover:bg-[#63142c] text-white rounded-xl h-11 px-7 font-bold text-xs shadow-sm shadow-[#7B1B38]/20" 
                disabled={!subject.trim() || !description.trim() || isUploading}
                onClick={handleSubmit}
              >
                {isUploading ? "Téléversement..." : "Envoyer le ticket"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============================================================ */}
      {/* Modal Lightbox pour Agrandir les Images / Captures           */}
      {/* ============================================================ */}
      <Dialog open={!!selectedImageModal} onOpenChange={() => setSelectedImageModal(null)}>
        <DialogContent className="max-w-4xl p-2 bg-slate-950/95 border border-slate-800 text-white rounded-2xl overflow-hidden">
          <div className="flex justify-between items-center p-3 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#7B1B38]" /> Aperçu de la pièce jointe
            </span>
            <div className="flex items-center gap-2">
              {selectedImageModal && (
                <a 
                  href={selectedImageModal} 
                  download="justificatif-support.png"
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
                  title="Télécharger"
                >
                  <Download className="w-4 h-4" />
                </a>
              )}
              <button 
                onClick={() => setSelectedImageModal(null)} 
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-4 flex items-center justify-center max-h-[75vh] overflow-auto">
            {selectedImageModal && (
              <img 
                src={selectedImageModal} 
                alt="Aperçu pièce jointe" 
                className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-2xl" 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ============================================================ */}
      {/* Modal Détails Rapides du Dossier Lié                          */}
      {/* ============================================================ */}
      <Dialog open={!!viewDossierModal} onOpenChange={() => setViewDossierModal(null)}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl border border-slate-200">
          {viewDossierModal && (
            <div>
              <div className="bg-slate-900 text-white p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold bg-white/10 px-2 py-0.5 rounded text-blue-300">
                    DOSS-{viewDossierModal.id.substring(0, 8).toUpperCase()}
                  </span>
                  <Badge className="bg-white/20 text-white border-none font-bold text-xs">{viewDossierModal.status}</Badge>
                </div>
                <h3 className="text-lg font-black">{viewDossierModal.travelerName}</h3>
                <p className="text-xs text-slate-400">{viewDossierModal.country} • Prestation: {viewDossierModal.serviceType}</p>
              </div>

              <div className="p-5 space-y-4 bg-white text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Passeport</span>
                    <span className="font-bold text-slate-900">{viewDossierModal.passportNumber || "Non renseigné"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Date de soumission</span>
                    <span className="font-bold text-slate-900">{viewDossierModal.submissionDate ? new Date(viewDossierModal.submissionDate).toLocaleDateString() : "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Formule</span>
                    <span className="font-bold text-slate-900">{viewDossierModal.visaType || "Standard"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Tarif B2B débité</span>
                    <span className="font-bold text-slate-900">{viewDossierModal.price?.toLocaleString()} DZD</span>
                  </div>
                </div>

                {viewDossierModal.timeline && viewDossierModal.timeline.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 block">Dernières étapes :</span>
                    <div className="border-l-2 border-[#7B1B38]/30 pl-3 space-y-2">
                      {viewDossierModal.timeline.slice(-3).map((item, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <p className="font-bold text-slate-800 text-[11px]">{item.title}</p>
                          <p className="text-[10px] text-slate-500">{item.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button 
                    variant="outline" 
                    className="rounded-xl text-xs font-bold" 
                    onClick={() => setViewDossierModal(null)}
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
