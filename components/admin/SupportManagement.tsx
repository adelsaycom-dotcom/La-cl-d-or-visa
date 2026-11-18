import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare, AlertCircle, Send, ArrowLeft, Search, CheckCircle,
  Paperclip, X, Eye, FileText, Building2, RotateCcw
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  useAppStore,
  type SupportTicketAttachment,
  type SupportTicketMessage,
  type Application
} from "../../src/store/useAppStore";
import { useLanguage } from "../../src/i18n/LanguageContext";
import { useToast } from "@/components/ui/toast";
import { TablePagination } from "../common/TablePagination";
import { DocumentPreviewModal, type PreviewDocData } from "../common/DocumentPreviewModal";
import {
  filterAndSortTickets,
  hasTicketAttachments,
  isTicketResolved,
  useSupportAttachmentUploader
} from "../../src/hooks/useSupportChat";
import { buildAgenciesLookup, resolveRecordAgencyName } from "../../src/utils/agencyName";

const TICKETS_PAGE_SIZE = 12;

export function SupportManagement() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const toast = useToast();

  // Sélecteurs Zustand atomiques
  const rawTickets = useAppStore((s) => s.supportTickets);
  const agencies = useAppStore((s) => s.agencies);
  const updateSupportTicket = useAppStore((s) => s.updateSupportTicket);
  const applications = useAppStore((s) => s.applications);

  const agenciesLookup = useMemo(() => buildAgenciesLookup(agencies || []), [agencies]);
  const tickets = useMemo(
    () =>
      rawTickets.map((t) => ({
        ...t,
        agencyName: resolveRecordAgencyName(t, agenciesLookup, "Agence Partenaire"),
      })),
    [rawTickets, agenciesLookup]
  );

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Reply state
  const [replyText, setReplyText] = useState("");
  const [replyAttachments, setReplyAttachments] = useState<SupportTicketAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Filters, search & pagination
  const [filter, setFilter] = useState("ACTIVE");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [previewDoc, setPreviewDoc] = useState<PreviewDocData | null>(null);
  const [viewDossierModal, setViewDossierModal] = useState<Application | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFiles, isMountedRef } = useSupportAttachmentUploader("SupportAdmin", "admin_att");

  const applicationsById = useMemo(() => {
    const map = new Map<string, Application>();
    for (let i = 0; i < applications.length; i++) {
      map.set(applications[i].id, applications[i]);
    }
    return map;
  }, [applications]);

  const selectedTicket = useMemo(
    () => tickets.find((t) => t.id === selectedTicketId) ?? null,
    [tickets, selectedTicketId]
  );

  const linkedAppForSelectedTicket = useMemo(
    () => (selectedTicket?.applicationId ? applicationsById.get(selectedTicket.applicationId) ?? null : null),
    [selectedTicket?.applicationId, applicationsById]
  );

  const filteredTickets = useMemo(
    () => filterAndSortTickets(tickets, { statusFilter: filter, categoryFilter, search }),
    [tickets, filter, categoryFilter, search]
  );

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / TICKETS_PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, categoryFilter, search]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * TICKETS_PAGE_SIZE;
    return filteredTickets.slice(start, start + TICKETS_PAGE_SIZE);
  }, [filteredTickets, currentPage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket?.messages?.length, selectedTicketId]);

  const handleReplyFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      setIsUploading(true);

      try {
        const newAttachments = await uploadFiles(files);
        if (newAttachments && isMountedRef.current) {
          setReplyAttachments((prev) => [...prev, ...newAttachments]);
        }
      } catch (err: unknown) {
        if (isMountedRef.current) {
          toast.error(
            isEn ? "Upload failed" : "Erreur de téléversement",
            err instanceof Error ? err.message : (isEn ? "Unable to upload file." : "Impossible d'envoyer la pièce jointe.")
          );
        }
      } finally {
        if (isMountedRef.current) {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      }
    },
    [uploadFiles, isMountedRef, toast, isEn]
  );

  const handleReply = useCallback(() => {
    if ((!replyText.trim() && replyAttachments.length === 0) || !selectedTicket) return;

    const newMsg: SupportTicketMessage = {
      sender: "admin",
      text: replyText.trim(),
      date: new Date().toISOString(),
      ...(replyAttachments.length > 0 ? { attachments: replyAttachments } : {}),
    };

    const newMessages = [...(selectedTicket.messages || []), newMsg];

    updateSupportTicket(selectedTicket.id, {
      messages: newMessages,
      status: selectedTicket.status === "OPEN" ? "IN_PROGRESS" : selectedTicket.status,
    });

    setReplyText("");
    setReplyAttachments([]);
  }, [replyText, replyAttachments, selectedTicket, updateSupportTicket]);

  const updateStatus = useCallback(
    (status: string) => {
      if (!selectedTicket) return;
      updateSupportTicket(selectedTicket.id, { status });
    },
    [selectedTicket, updateSupportTicket]
  );

  const handleOpenAttachmentPreview = useCallback((att: SupportTicketAttachment) => {
    setPreviewDoc({
      src: att.dataUrl,
      title: att.name,
      type: att.type,
    });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
      case "Ouvert":
        return <Badge className="bg-amber-100 text-amber-800 border-none font-bold">{isEn ? "New" : "Nouveau"}</Badge>;
      case "IN_PROGRESS":
      case "En cours":
        return <Badge className="bg-blue-100 text-blue-800 border-none font-bold">{isEn ? "In Progress" : "En cours"}</Badge>;
      case "RESOLVED":
      case "Résolu":
        return <Badge className="bg-emerald-100 text-emerald-800 border-none font-bold">{isEn ? "Resolved" : "Résolu"}</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-800 border-none font-bold">{status}</Badge>;
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col -m-6 sm:m-0 sm:h-[calc(100vh-120px)] bg-white sm:rounded-2xl sm:border border-slate-200 overflow-hidden shadow-sm">
      <div className="flex flex-1 overflow-hidden h-full">
        {/* ============================================================ */}
        {/* Panneau gauche : File des Tickets Agences                     */}
        {/* ============================================================ */}
        <div className={`w-full lg:w-[410px] flex-col border-r border-slate-200 bg-slate-50/60 flex shrink-0 ${selectedTicketId ? "hidden lg:flex" : "flex"}`}>
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-white space-y-3 shrink-0">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tight text-slate-900">{isEn ? "B2B Client Support" : "Support Client B2B"}</h2>
                <Badge variant="outline" className="border-slate-300 text-slate-600 font-mono text-[10px]">
                  {filteredTickets.length} {isEn ? "ticket(s)" : "ticket(s)"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isEn ? "Technical assistance and consular requests from partner agencies." : "Assistance technique et demandes consulaires des agences partenaires."}
              </p>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder={isEn ? "Search agency, file, traveler..." : "Chercher agence, dossier, voyageur..."}
                  className="pl-9 bg-slate-50 border-slate-200 text-xs h-9 rounded-xl focus:bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full bg-slate-50 border-slate-200 text-xs h-9 rounded-xl">
                    <SelectValue placeholder={isEn ? "Active Tickets" : "Tickets Actifs"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE" className="text-xs">{isEn ? "Active Tickets" : "Tickets Actifs"}</SelectItem>
                    <SelectItem value="ALL" className="text-xs">{isEn ? "All Statuses" : "Tous les statuts"}</SelectItem>
                    <SelectItem value="URGENT" className="text-xs font-bold text-red-600">{isEn ? "Urgent Priority" : "Priorité Urgente"}</SelectItem>
                    <SelectItem value="OPEN" className="text-xs">{isEn ? "New (Open)" : "Nouveau (Ouvert)"}</SelectItem>
                    <SelectItem value="IN_PROGRESS" className="text-xs">{isEn ? "In Progress" : "En cours"}</SelectItem>
                    <SelectItem value="RESOLVED" className="text-xs">{isEn ? "Resolved / Archived" : "Résolus / Archivés"}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full bg-slate-50 border-slate-200 text-xs h-9 rounded-xl">
                    <SelectValue placeholder={isEn ? "All Categories" : "Toutes catégories"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs">{isEn ? "All categories" : "Toutes catégories"}</SelectItem>
                    <SelectItem value="Dossier & Démarche" className="text-xs">{isEn ? "Consular Dossier" : "Dossier consulaire"}</SelectItem>
                    <SelectItem value="Délai de traitement anormal" className="text-xs">{isEn ? "Abnormal Delay" : "Délai anormal"}</SelectItem>
                    <SelectItem value="Paiement, Solde & Facturation" className="text-xs">{isEn ? "Payment / Balance" : "Paiement / Solde"}</SelectItem>
                    <SelectItem value="Modification voyageur / Document erroné" className="text-xs">{isEn ? "Data Correction" : "Correction données"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-bold text-slate-700">Aucun ticket trouvé</p>
                <p className="text-xs text-slate-400 mt-1">Ajustez vos filtres ou effectuez une autre recherche.</p>
              </div>
            ) : (
              paginatedTickets.map((ticket) => {
                const isSelected = selectedTicketId === ticket.id;
                const hasAtt = hasTicketAttachments(ticket);

                return (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`w-full text-left p-4 transition-all hover:bg-white focus:outline-none relative group ${isSelected ? "bg-white shadow-sm ring-1 ring-slate-900/5" : ""}`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${isSelected ? "bg-slate-900" : ticket.isUrgent ? "bg-red-500" : "bg-transparent"}`} />

                    <div className="pl-1">
                      <div className="flex justify-between items-start mb-1.5 gap-2">
                        <span className="font-bold text-xs text-slate-900 truncate flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {ticket.agencyName || ticket.agency || "Agence Partenaire"}
                        </span>
                        <span className="shrink-0">{getStatusBadge(ticket.status)}</span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mb-1 group-hover:text-blue-700 transition-colors">
                        {ticket.subject}
                      </h4>

                      {ticket.applicationRef && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded w-fit mb-2">
                          <FileText className="w-3 h-3 text-blue-600" />
                          <span>{ticket.applicationRef}</span>
                          {ticket.applicationSummary?.travelerName && (
                            <span className="text-blue-900 font-medium truncate max-w-[140px]">• {ticket.applicationSummary.travelerName}</span>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-slate-500 line-clamp-1 mb-2.5">
                        {ticket.messages && ticket.messages.length > 0 ? ticket.messages[ticket.messages.length - 1].text : ticket.description}
                      </p>

                      <div className="flex justify-between items-center text-[10px] font-medium text-slate-400 pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">#{ticket.id.substring(0, 6)}</span>
                          {hasAtt && (
                            <span className="flex items-center gap-0.5 text-slate-500" title="Contient des pièces jointes">
                              <Paperclip className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {ticket.isUrgent && (
                            <span className="flex items-center gap-1 text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-bold">
                              <AlertCircle className="w-3 h-3" /> URGENT
                            </span>
                          )}
                          <span>{new Date(ticket.createdAt || ticket.date || 0).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={filteredTickets.length}
            pageSize={TICKETS_PAGE_SIZE}
            onPageChange={setCurrentPage}
            isCompact
            itemLabel="tickets"
            className="shrink-0"
          />
        </div>

        {/* ============================================================ */}
        {/* Panneau droit : Traitement Admin du Ticket                   */}
        {/* ============================================================ */}
        <div className={`flex-1 flex-col bg-white overflow-hidden ${!selectedTicketId ? "hidden lg:flex" : "flex w-full"}`}>
          {!selectedTicket ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/40 p-6 text-center">
              <div className="w-16 h-16 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center justify-center mb-4 text-slate-700">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Sélectionnez une demande</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Consultez les requêtes des agences, examinez les pièces jointes et apportez une réponse consulaire ou technique.
              </p>
            </div>
          ) : (
            <>
              {/* En-tête de traitement */}
              <div className="shrink-0 border-b border-slate-200 px-4 sm:px-6 py-3.5 bg-white z-10 shadow-xs">
                <div className="flex items-center justify-between gap-3 flex-wrap">
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
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 flex-wrap">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {selectedTicket.agencyName || selectedTicket.agency || "Agence"}
                        </span>
                        <span>•</span>
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 text-[10px]">
                          #{selectedTicket.id.substring(0, 8)}
                        </span>
                        <span>•</span>
                        <span>Catégorie: {selectedTicket.category || "Général"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contrôles de statut rapide */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!isTicketResolved(selectedTicket.status) ? (
                      <>
                        {selectedTicket.status === "OPEN" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus("IN_PROGRESS")}
                            className="h-8 text-xs font-bold border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg"
                          >
                            {isEn ? "Take in Charge" : "Prendre en charge"}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => updateStatus("RESOLVED")}
                          className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1 shadow-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> {isEn ? "Close / Resolved" : "Clôturer / Résolu"}
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus("IN_PROGRESS")}
                        className="h-8 text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> {isEn ? "Reopen" : "Rouvrir"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Bannière dossier lié */}
                {(selectedTicket.applicationRef || selectedTicket.applicationId) && (
                  <div className="mt-3 p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-blue-950">Dossier lié :</span>
                          <span className="font-mono font-bold text-blue-800 bg-white/90 px-1.5 py-0.5 rounded border border-blue-200">
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
                            <span>Demande rattachée au dossier d'immigration</span>
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
                        <span>Voir dossier</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Messages du ticket */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/70 space-y-6">
                {/* Requête initiale de l'agence */}
                <div className="flex flex-col items-start max-w-[90%] lg:max-w-[78%]">
                  <div className="flex items-center gap-2 mb-1 ml-1 text-xs">
                    <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-[10px] font-black text-slate-700 shrink-0 uppercase">
                      {(selectedTicket.agencyName || selectedTicket.agency || "A").substring(0, 2)}
                    </div>
                    <span className="font-bold text-slate-700">{selectedTicket.agencyName || selectedTicket.agency || "Agence Partenaire"}</span>
                    <span className="text-[10px] text-slate-400">{new Date(selectedTicket.createdAt || selectedTicket.date || 0).toLocaleString()}</span>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-none p-4 shadow-xs text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap w-full">
                    {selectedTicket.description}

                    {/* Pièces jointes initiales de l'agence */}
                    {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedTicket.attachments.map((att) => (
                          <div
                            key={att.id}
                            onClick={() => handleOpenAttachmentPreview(att)}
                            className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors border border-slate-200"
                          >
                            {att.type.startsWith("image/") ? (
                              <img src={att.dataUrl} alt={att.name} className="w-10 h-10 rounded-lg object-cover bg-slate-200 shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-slate-700" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold text-slate-900 truncate">{att.name}</p>
                              <p className="text-[10px] text-slate-500">{(att.size / 1024).toFixed(0)} Ko • Cliquer pour agrandir</p>
                            </div>
                            <Eye className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Historique des échanges */}
                {(selectedTicket.messages || []).map((msg, idx) => {
                  const isAdmin = msg.sender === "admin";
                  return (
                    <div key={msg.id || idx} className={`flex flex-col ${isAdmin ? "items-end max-w-[90%] lg:max-w-[78%] ml-auto" : "items-start max-w-[90%] lg:max-w-[78%]"}`}>
                      <div className={`flex items-center gap-2 mb-1 ${isAdmin ? "mr-1 flex-row-reverse" : "ml-1"} text-xs`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 uppercase shadow-xs ${isAdmin ? "bg-slate-900 text-white" : "bg-slate-200 border border-slate-300 text-slate-700"}`}>
                          {isAdmin ? "AD" : (selectedTicket.agencyName || selectedTicket.agency || "A").substring(0, 2)}
                        </div>
                        <span className="font-bold text-slate-700">{isAdmin ? "Vous (Support B2B)" : (selectedTicket.agencyName || selectedTicket.agency)}</span>
                        <span className="text-[10px] text-slate-400">{new Date(msg.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>

                      <div className={`rounded-2xl p-4 shadow-xs text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-left w-full ${
                        isAdmin
                          ? "bg-slate-900 text-white rounded-tr-none"
                          : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                      }`}>
                        {msg.text}

                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className={`mt-3 pt-3 border-t ${isAdmin ? "border-white/20" : "border-slate-100"} grid grid-cols-1 sm:grid-cols-2 gap-2`}>
                            {msg.attachments.map((att) => (
                              <div
                                key={att.id}
                                onClick={() => handleOpenAttachmentPreview(att)}
                                className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-colors border ${
                                  isAdmin
                                    ? "bg-white/10 hover:bg-white/20 border-white/10"
                                    : "bg-slate-50 hover:bg-slate-100 border-slate-200"
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
                                  <p className={`text-[11px] font-bold truncate ${isAdmin ? "text-white" : "text-slate-900"}`}>{att.name}</p>
                                  <p className={`text-[10px] ${isAdmin ? "text-white/70" : "text-slate-500"}`}>
                                    {(att.size / 1024).toFixed(0)} Ko • Voir fichier
                                  </p>
                                </div>
                                <Eye className={`w-4 h-4 shrink-0 mr-1 ${isAdmin ? "text-white/70" : "text-slate-400"}`} />
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

              {/* Saisie réponse Admin */}
              {!isTicketResolved(selectedTicket.status) ? (
                <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0 space-y-2">
                  {replyAttachments.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      {replyAttachments.map((att) => (
                        <div key={att.id} className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg pl-2 pr-1 py-1 text-xs shrink-0">
                          {att.type.startsWith("image/") ? (
                            <img src={att.dataUrl} alt={att.name} className="w-5 h-5 rounded object-cover" />
                          ) : (
                            <FileText className="w-4 h-4 text-slate-600" />
                          )}
                          <span className="font-medium text-slate-700 max-w-[120px] truncate">{att.name}</span>
                          <button
                            onClick={() => setReplyAttachments((prev) => prev.filter((x) => x.id !== att.id))}
                            className="p-1 hover:text-red-600 text-slate-400"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end gap-2 bg-slate-50 rounded-2xl border border-slate-200 p-2 focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-slate-900 transition-all">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleReplyFileUpload}
                      multiple
                      accept="image/*,.pdf"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      title="Joindre un justificatif, reçu ou document officiel"
                      className="w-10 h-10 rounded-xl hover:bg-slate-200/70 text-slate-500 hover:text-slate-800 flex items-center justify-center shrink-0 transition-colors"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>

                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Tapez la réponse officielle pour l'agence..."
                      className="border-none bg-transparent shadow-none focus-visible:ring-0 resize-none min-h-[40px] max-h-[140px] py-2.5 text-xs sm:text-sm text-slate-900"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleReply();
                        }
                      }}
                    />

                    <button
                      onClick={handleReply}
                      disabled={(!replyText.trim() && replyAttachments.length === 0) || isUploading}
                      className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 px-1">
                    <span>Appuyez sur <kbd className="px-1 py-0.5 bg-slate-100 rounded border font-mono">Entrée</kbd> pour envoyer</span>
                    {isUploading && <span className="text-blue-600 font-bold">Envoi de la pièce jointe...</span>}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50/60 text-center text-emerald-800 text-xs font-semibold border-t border-emerald-200 shrink-0 flex items-center justify-between px-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Ce ticket est résolu et clôturé.</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus("IN_PROGRESS")}
                    className="h-7 text-xs font-bold border-emerald-300 text-emerald-800 hover:bg-emerald-100 rounded-lg"
                  >
                    Rouvrir le ticket
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Visionneuse universelle Images & PDF */}
      <DocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />

      {/* Modal Détails du Dossier Lié (Admin) */}
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
                    <span className="text-[10px] text-slate-400 font-bold block">Agence émettrice</span>
                    <span className="font-bold text-slate-900">
                      {resolveRecordAgencyName(viewDossierModal, agenciesLookup, "Agence Partenaire")}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Passeport</span>
                    <span className="font-bold text-slate-900">{viewDossierModal.passportNumber || "Non renseigné"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Formule consulaire</span>
                    <span className="font-bold text-slate-900">{viewDossierModal.visaType || "Standard"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Tarif B2B facturé</span>
                    <span className="font-bold text-slate-900">{viewDossierModal.price?.toLocaleString()} DZD</span>
                  </div>
                </div>

                {viewDossierModal.timeline && viewDossierModal.timeline.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 block">Dernières étapes :</span>
                    <div className="border-l-2 border-slate-300 pl-3 space-y-2">
                      {viewDossierModal.timeline.slice(-3).map((item, idx) => (
                        <div key={item.id || idx} className="space-y-0.5">
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
