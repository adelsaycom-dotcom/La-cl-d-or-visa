import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MessageSquare, AlertCircle, Plus, Send, ArrowLeft, Search, CheckCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "../../src/store/useAppStore";
import { auth } from "../../src/firebase";

export function AgencySupport() {
  const { supportTickets, addSupportTicket, updateSupportTicket } = useAppStore();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  
  const [replyText, setReplyText] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedTicket = supportTickets.find(t => t.id === selectedTicketId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedTicket?.messages, selectedTicketId]);

  const handleSubmit = () => {
    if(!subject || !description) return;
    addSupportTicket({
      agencyId: auth.currentUser?.uid || "mock-id",
      agencyName: auth.currentUser?.email || "mock-agency",
      subject,
      description,
      status: "OPEN",
      isUrgent,
      category: "Général",
      priority: isUrgent ? "Haute" : "Moyenne",
      messages: []
    });
    setIsNewTicketOpen(false);
    setSubject("");
    setDescription("");
    setIsUrgent(false);
  };

  const handleReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    const newMessages = [...(selectedTicket.messages || []), {
      sender: 'agency',
      text: replyText.trim(),
      date: new Date().toISOString()
    }];
    updateSupportTicket(selectedTicket.id, { messages: newMessages });
    setReplyText("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN": return <Badge className="bg-amber-100 text-amber-800 border-none">En attente</Badge>;
      case "IN_PROGRESS": return <Badge className="bg-blue-100 text-blue-800 border-none">En cours</Badge>;
      case "RESOLVED": return <Badge className="bg-green-100 text-green-800 border-none">Résolu</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const filteredTickets = supportTickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const isArchived = t.status === "RESOLVED";
    const matchesTab = activeTab === "active" ? !isArchived : isArchived;
    return matchesSearch && matchesTab;
  }).sort((a, b) => {
    // Sort by open/in-progress first, then date
    if (a.status !== 'RESOLVED' && b.status === 'RESOLVED') return -1;
    if (a.status === 'RESOLVED' && b.status !== 'RESOLVED') return 1;
    return new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime();
  });

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col -m-4 sm:m-0 sm:h-[calc(100vh-120px)] bg-white sm:rounded-2xl sm:border border-gray-200 overflow-hidden shadow-sm max-w-[1600px] mx-auto">
      <div className="flex flex-1 overflow-hidden h-full">
        
        {/* Left Sidebar - Ticket List */}
        <div className={`w-full lg:w-[380px] flex-col border-r border-gray-200 bg-gray-50/50 flex shrink-0 ${selectedTicketId ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-white space-y-4 shrink-0">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-gray-900">Support B2B</h2>
                <p className="text-xs text-gray-500 mt-1">Vos tickets d'assistance.</p>
              </div>
              <Button 
                onClick={() => setIsNewTicketOpen(true)} 
                className="bg-black hover:bg-gray-800 text-white rounded-xl h-10 w-10 p-0 shrink-0"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Chercher un ticket..." 
                className="pl-9 bg-gray-50 border-gray-200 rounded-xl" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-colors ${activeTab === 'active' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`} 
                onClick={() => setActiveTab('active')}
              >
                Actifs
              </button>
              <button 
                className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-colors ${activeTab === 'archived' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`} 
                onClick={() => setActiveTab('archived')}
              >
                Archivés
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200 mb-3 shadow-sm">
                  <MessageSquare className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-700">Aucun ticket</p>
                <p className="text-xs mt-1">Vous n'avez pas encore contacté le support.</p>
                <Button 
                  onClick={() => setIsNewTicketOpen(true)}
                  variant="outline"
                  className="mt-4 rounded-xl border-gray-300 font-bold"
                >
                  Ouvrir un ticket
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredTickets.map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`w-full text-left p-4 sm:p-5 transition-all hover:bg-white focus:outline-none ${selectedTicketId === t.id ? 'bg-white border-l-4 border-l-primary-gold' : 'border-l-4 border-l-transparent'}`}
                  >
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <span className="font-bold text-sm text-gray-900 line-clamp-1">{t.subject}</span>
                      <span className="shrink-0">{getStatusBadge(t.status)}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1 mb-3">
                      {t.messages && t.messages.length > 0 ? t.messages[t.messages.length - 1].text : t.description}
                    </p>
                    <div className="flex justify-between items-center text-[10px] font-medium text-gray-400">
                      <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{t.id}</span>
                      <div className="flex gap-2 items-center">
                         {t.isUrgent && <span className="text-red-500 font-bold">URGENT</span>}
                         <span>{new Date(t.createdAt || t.date || 0).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Content - Active Chat */}
        <div className={`flex-1 flex-col bg-white overflow-hidden ${!selectedTicketId ? 'hidden lg:flex' : 'flex w-full'}`}>
          {!selectedTicket ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
              <div className="w-16 h-16 bg-white border border-gray-100 shadow-sm rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-gray-300" />
              </div>
              <p className="font-medium text-gray-600">Sélectionnez un ticket</p>
              <p className="text-sm mt-1">Ou ouvrez un nouveau ticket pour contacter le support.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-[72px] shrink-0 border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between bg-white z-10 shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden w-full">
                  <button 
                    className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors shrink-0"
                    onClick={() => setSelectedTicketId(null)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="font-bold text-gray-900 truncate text-base sm:text-lg leading-tight">{selectedTicket.subject}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">{selectedTicket.id}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0"></span>
                      <span className="text-xs text-gray-400 font-medium shrink-0">Créé le {new Date(selectedTicket.createdAt || selectedTicket.date || 0).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-6">
                
                {/* Initial Request */}
                <div className="flex flex-col items-end max-w-[85%] lg:max-w-[75%] ml-auto">
                  <div className="flex items-center gap-2 mb-1.5 mr-1 flex-row-reverse">
                    <div className="w-6 h-6 rounded-full bg-primary-gold text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      VO
                    </div>
                    <span className="text-xs font-bold text-gray-600">Vous</span>
                    <span className="text-[10px] font-medium text-gray-400">{new Date(selectedTicket.createdAt || selectedTicket.date || 0).toLocaleString()}</span>
                  </div>
                  <div className="bg-[var(--color-text-dark)] text-white border border-transparent rounded-2xl rounded-tr-none p-4 shadow-sm text-sm leading-relaxed whitespace-pre-wrap text-left">
                    {selectedTicket.description || "Aucune description"}
                  </div>
                </div>

                {/* Replies */}
                {(selectedTicket.messages || []).map((msg: any, idx: number) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div key={idx} className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}>
                      <div className={`flex items-center gap-2 mb-1.5 ${isAdmin ? 'ml-1' : 'mr-1 flex-row-reverse'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 uppercase ${isAdmin ? 'bg-black text-white' : 'bg-primary-gold text-white'}`}>
                          {isAdmin ? 'AD' : 'VO'}
                        </div>
                        <span className="text-xs font-bold text-gray-600">{isAdmin ? 'Support B2B' : 'Vous'}</span>
                        <span className="text-[10px] font-medium text-gray-400">{new Date(msg.date).toLocaleString()}</span>
                      </div>
                      <div className={`max-w-[85%] lg:max-w-[75%] ${isAdmin ? 'bg-white border border-gray-200 rounded-tl-none text-gray-800' : 'bg-[var(--color-text-dark)] text-white rounded-tr-none'} rounded-2xl p-4 shadow-sm text-sm leading-relaxed whitespace-pre-wrap text-left`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} className="h-1" />
              </div>

              {/* Chat Input */}
              {selectedTicket.status !== "RESOLVED" ? (
                <div className="p-4 sm:p-5 bg-white border-t border-gray-200 shrink-0">
                  <div className="max-w-4xl mx-auto flex items-end gap-3 bg-gray-50 rounded-2xl border border-gray-200 p-2 focus-within:ring-2 focus-within:ring-primary-gold focus-within:border-primary-gold transition-all shadow-sm">
                    <Textarea 
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Tapez votre réponse pour le support..."
                      className="border-none bg-transparent shadow-none focus-visible:ring-0 resize-none min-h-[44px] max-h-[200px] py-3 text-sm"
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
                      disabled={!replyText.trim()}
                      className="w-11 h-11 rounded-xl bg-[var(--color-text-dark)] hover:bg-[var(--color-accent-bronze)] text-white flex items-center justify-center shrink-0 mb-0.5 mr-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5 ml-1" />
                    </button>
                  </div>
                  <div className="max-w-4xl mx-auto mt-2 flex justify-between items-center px-1">
                    <p className="text-[10px] text-gray-400 font-medium hidden sm:block">Appuyez sur <kbd className="px-1 py-0.5 bg-gray-100 rounded border font-mono">Entrée</kbd> pour envoyer</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-gray-50 text-center text-gray-500 text-sm font-medium border-t border-gray-200 shrink-0 flex flex-col items-center gap-2">
                   <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                     <CheckCircle className="w-5 h-5 text-gray-500" />
                   </div>
                   Ce ticket a été marqué comme résolu par le support et est maintenant fermé.
                </div>
              )}
            </>
          )}
        </div>

      </div>

      {/* New Ticket Dialog */}
      <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden sm:rounded-3xl border-0 shadow-2xl">
          <div className="bg-[var(--color-text-dark)] p-6 sm:p-8 text-white">
             <h3 className="text-2xl font-black mb-2">Nouveau Ticket</h3>
             <p className="text-gray-300 text-sm font-medium">Notre équipe de support vous répondra dans les plus brefs délais.</p>
          </div>
          <div className="p-6 sm:p-8 space-y-6 bg-white">
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-900">Sujet de la demande</label>
              <Input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Ex: Problème de paiement sur la demande VISA-123" className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white h-12" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-900">Description détaillée</label>
              <Textarea value={description} onChange={e=>setDescription(e.target.value)} rows={5} placeholder="Décrivez votre problème en détail..." className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white resize-none" />
            </div>
            
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
               <input type="checkbox" id="urgent" checked={isUrgent} onChange={e=>setIsUrgent(e.target.checked)} className="mt-1 w-4 h-4 rounded text-red-600 focus:ring-red-500 border-red-300 cursor-pointer" />
               <label htmlFor="urgent" className="text-sm font-bold text-red-800 block cursor-pointer">
                  Marquer ce ticket comme Urgent
                  <span className="block text-xs text-red-600/80 mt-1 font-medium font-normal">À utiliser uniquement pour les problèmes de paiement ou les dossiers bloqués à moins de 24h du départ.</span>
               </label>
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" className="rounded-xl h-12 px-6 border-gray-200" onClick={() => setIsNewTicketOpen(false)}>Annuler</Button>
              <Button className="bg-[var(--color-text-dark)] hover:bg-gray-800 text-white rounded-xl h-12 px-8 font-bold" onClick={handleSubmit}>Soumettre</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
