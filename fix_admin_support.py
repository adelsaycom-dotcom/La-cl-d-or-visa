import re

with open('components/admin/SupportManagement.tsx', 'r') as f:
    content = f.read()

new_content = """import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, AlertCircle, Send, ArrowLeft, Search, CheckCircle, Clock, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "../../src/store/useAppStore";
import { auth } from "../../src/firebase";

export function SupportManagement() {
  const { supportTickets: tickets, updateSupportTicket } = useAppStore();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedTicket?.messages, selectedTicketId]);

  const handleReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    const newMessages = [...(selectedTicket.messages || []), {
      sender: 'admin',
      text: replyText.trim(),
      date: new Date().toISOString()
    }];
    updateSupportTicket(selectedTicket.id, { 
      messages: newMessages, 
      status: selectedTicket.status === 'OPEN' ? 'IN_PROGRESS' : selectedTicket.status 
    });
    setReplyText("");
  };

  const updateStatus = (status: string) => {
    if (!selectedTicket) return;
    updateSupportTicket(selectedTicket.id, { status });
  };

  const filteredTickets = tickets.filter(t => {
    const matchesFilter = filter === "ALL" || t.status === filter;
    const matchesSearch = (t.agencyName || t.agency || "").toLowerCase().includes(search.toLowerCase()) || 
                          t.id.toLowerCase().includes(search.toLowerCase()) ||
                          t.subject.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    // Sort by urgent first, then by date descending
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;
    return new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime();
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN": return <Badge className="bg-amber-100 text-amber-800 border-none hover:bg-amber-100">Nouveau</Badge>;
      case "IN_PROGRESS": return <Badge className="bg-blue-100 text-blue-800 border-none hover:bg-blue-100">En cours</Badge>;
      case "RESOLVED": return <Badge className="bg-green-100 text-green-800 border-none hover:bg-green-100">Résolu</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col -m-6 sm:m-0 sm:h-[calc(100vh-120px)] bg-white sm:rounded-2xl sm:border border-gray-200 overflow-hidden shadow-sm">
      <div className="flex flex-1 overflow-hidden h-full">
        
        {/* Left Sidebar - Ticket List */}
        <div className={`w-full lg:w-[400px] flex-col border-r border-gray-200 bg-gray-50/50 flex shrink-0 ${selectedTicketId ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-white space-y-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">Support Client</h2>
              <p className="text-sm text-gray-500 mt-1">Gérez les requêtes des agences.</p>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Chercher un ticket, une agence..." 
                  className="pl-9 bg-gray-50 border-gray-200" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les statuts</SelectItem>
                  <SelectItem value="OPEN">Nouveau (Ouvert)</SelectItem>
                  <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                  <SelectItem value="RESOLVED">Résolu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Aucun ticket trouvé.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredTickets.map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`w-full text-left p-4 sm:p-5 transition-all hover:bg-white focus:outline-none ${selectedTicketId === t.id ? 'bg-white border-l-4 border-l-black' : 'border-l-4 border-l-transparent'}`}
                  >
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <span className="font-bold text-sm text-gray-900 truncate">{t.agencyName || t.agency}</span>
                      <span className="shrink-0">{getStatusBadge(t.status)}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-800 line-clamp-1 mb-1">{t.subject}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1 mb-3">
                      {t.messages && t.messages.length > 0 ? t.messages[t.messages.length - 1].text : t.description}
                    </p>
                    <div className="flex justify-between items-center text-[10px] font-medium text-gray-400">
                      <span>{new Date(t.createdAt || t.date || 0).toLocaleDateString()}</span>
                      {t.isUrgent && <span className="flex items-center text-red-500 bg-red-50 px-2 py-0.5 rounded-full"><AlertCircle className="w-3 h-3 mr-1" /> URGENT</span>}
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
            <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-gray-300" />
              </div>
              <p className="font-medium text-gray-500">Sélectionnez un ticket pour l'afficher</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-[72px] shrink-0 border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between bg-white z-10 shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <button 
                    className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors shrink-0"
                    onClick={() => setSelectedTicketId(null)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate text-base sm:text-lg leading-tight">{selectedTicket.subject}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-gray-500 truncate">{selectedTicket.agencyName || selectedTicket.agency}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0"></span>
                      <span className="text-xs text-gray-400 font-mono shrink-0">{selectedTicket.id}</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 ml-4 hidden sm:flex gap-2">
                   {selectedTicket.status !== "RESOLVED" && (
                      <button 
                        onClick={() => updateStatus("RESOLVED")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" /> Résoudre
                      </button>
                   )}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-6">
                
                {/* Initial Request */}
                <div className="flex flex-col items-start max-w-[85%] lg:max-w-[75%]">
                  <div className="flex items-center gap-2 mb-1.5 ml-1">
                    <div className="w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0 uppercase">
                      {(selectedTicket.agencyName || selectedTicket.agency || "A").substring(0,2)}
                    </div>
                    <span className="text-xs font-bold text-gray-600">{selectedTicket.agencyName || selectedTicket.agency}</span>
                    <span className="text-[10px] font-medium text-gray-400">{new Date(selectedTicket.createdAt || selectedTicket.date || 0).toLocaleString()}</span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-4 shadow-sm text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {selectedTicket.description || "Aucune description"}
                  </div>
                </div>

                {/* Replies */}
                {(selectedTicket.messages || []).map((msg: any, idx: number) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div key={idx} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                      <div className={`flex items-center gap-2 mb-1.5 ${isAdmin ? 'mr-1 flex-row-reverse' : 'ml-1'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 uppercase ${isAdmin ? 'bg-black text-white' : 'bg-white border border-gray-300 text-gray-500'}`}>
                          {isAdmin ? 'AD' : (selectedTicket.agencyName || selectedTicket.agency || "A").substring(0,2)}
                        </div>
                        <span className="text-xs font-bold text-gray-600">{isAdmin ? 'Support B2B' : (selectedTicket.agencyName || selectedTicket.agency)}</span>
                        <span className="text-[10px] font-medium text-gray-400">{new Date(msg.date).toLocaleString()}</span>
                      </div>
                      <div className={`max-w-[85%] lg:max-w-[75%] ${isAdmin ? 'bg-black text-white rounded-tr-none' : 'bg-white border border-gray-200 rounded-tl-none'} rounded-2xl p-4 shadow-sm text-sm leading-relaxed whitespace-pre-wrap`}>
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
                  <div className="max-w-4xl mx-auto flex items-end gap-3 bg-gray-50 rounded-2xl border border-gray-200 p-2 focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all shadow-sm">
                    <Textarea 
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Tapez votre réponse pour l'agence..."
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
                      className="w-11 h-11 rounded-xl bg-black hover:bg-gray-800 text-white flex items-center justify-center shrink-0 mb-0.5 mr-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5 ml-1" />
                    </button>
                  </div>
                  <div className="max-w-4xl mx-auto mt-2 flex justify-between items-center px-1">
                    <p className="text-[10px] text-gray-400 font-medium hidden sm:block">Appuyez sur <kbd className="px-1 py-0.5 bg-gray-100 rounded border font-mono">Entrée</kbd> pour envoyer</p>
                    <div className="sm:hidden flex gap-2 w-full">
                       <button 
                        onClick={() => updateStatus("RESOLVED")}
                        className="flex-1 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-bold"
                      >
                        Marquer Résolu
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-gray-50 text-center text-gray-500 text-sm font-medium border-t border-gray-200 shrink-0 flex flex-col items-center gap-2">
                   <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                     <CheckCircle className="w-5 h-5 text-gray-500" />
                   </div>
                   Ce ticket est résolu et archivé.
                   <button 
                     onClick={() => updateStatus("IN_PROGRESS")}
                     className="mt-2 text-blue-600 hover:underline font-bold"
                   >
                     Rouvrir le ticket
                   </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
"""

with open('components/admin/SupportManagement.tsx', 'w') as f:
    f.write(new_content)
