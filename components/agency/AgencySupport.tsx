import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, MessageSquare, AlertCircle, Clock, CheckCircle2, Ticket } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const MOCK_TICKETS: any[] = [];

export function AgencySupport() {
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const stats = [
    { label: "Tickets ouverts", value: "2", icon: Ticket, color: "text-amber-500", bg: "bg-amber-100" },
    { label: "En cours", value: "1", icon: Clock, color: "text-blue-500", bg: "bg-blue-100" },
    { label: "Résolus", value: "45", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-100" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN": return <Badge className="bg-amber-100 text-amber-800 border-none font-bold px-3 py-1">Ouvert</Badge>;
      case "IN_PROGRESS": return <Badge className="bg-blue-100 text-blue-800 border-none font-bold px-3 py-1">En Cours</Badge>;
      case "RESOLVED": return <Badge className="bg-gray-100 text-gray-600 border-none font-bold px-3 py-1">Résolu</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Support Technique</h2>
          <p className="text-gray-500 mt-2 font-medium max-w-xl">Une équipe d'experts à votre écoute pour résoudre vos problèmes le plus rapidement possible.</p>
        </div>
        <Button onClick={() => setIsNewTicketOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 rounded-xl px-6 py-6 h-auto text-lg font-bold transition-all hover:scale-105">
          <Plus className="w-5 h-5 mr-2" /> Créer un ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-gray-500 font-medium text-sm">{stat.label}</div>
              <div className="text-3xl font-black text-gray-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Ticket List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold border-l-4 border-amber-500 pl-3 text-lg text-gray-900">Demandes récentes</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {tickets.map((t) => (
            <div key={t.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex gap-4 items-start w-full">
                <div className="pt-1">
                  {t.isUrgent ? (
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                    <span className="font-bold text-gray-900 text-lg truncate">{t.subject}</span>
                    {t.isUrgent && <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 text-xs px-2 py-0 border-none">Urgent</Badge>}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 font-medium">
                    <span className="text-gray-900 font-mono text-xs bg-gray-100 px-2 rounded-md py-0.5">{t.id}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Créé le {t.date}</span>
                    <span className="text-amber-500">{t.lastReply}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between w-full sm:w-auto gap-4 mt-2 sm:mt-0 pl-14 sm:pl-0">
                {getStatusBadge(t.status)}
                <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-100 text-gray-700 bg-white shadow-sm" onClick={() => setSelectedTicket(t)}>
                  Ouvrir <MessageSquare className="w-4 h-4 ml-2 opacity-50" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Ticket Dialog */}
      <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl">
          <div className="p-8 bg-gray-50 border-b border-gray-100">
            <h3 className="text-2xl font-black text-gray-900">Ouvrir un nouveau ticket</h3>
            <p className="text-gray-500 mt-2 font-medium">Décrivez votre problème en détail pour que notre équipe puisse vous aider rapidement.</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-900">Sujet détaillé</label>
              <Input placeholder="Ex: Problème de paiement sur la demande VISA-123" className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white h-12" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-900">Description du problème</label>
              <Textarea rows={6} placeholder="Décrivez votre problème en détail. Des captures d'écran peuvent être attachées plus tard..." className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white resize-none" />
            </div>
            
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
               <input type="checkbox" id="urgent" className="mt-1 w-4 h-4 rounded text-red-600 focus:ring-red-500 border-red-300" />
               <div>
                  <label htmlFor="urgent" className="text-sm font-bold text-red-800 block cursor-pointer">
                    Marquer ce ticket comme Urgent
                  </label>
                  <p className="text-xs text-red-600/80 mt-1 font-medium">À utiliser uniquement pour les problèmes de paiement ou les dossiers bloqués à moins de 24h du départ.</p>
               </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" className="rounded-xl py-6 px-6 border-gray-200" onClick={() => setIsNewTicketOpen(false)}>Annuler</Button>
              <Button className="bg-[var(--color-text-dark)] hover:bg-[var(--color-accent-bronze)] text-white rounded-xl py-6 px-8 font-bold" onClick={() => setIsNewTicketOpen(false)}>Soumettre le ticket</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* View Ticket Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(o) => !o && setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl">
          {selectedTicket && (
            <div className="flex flex-col h-[80vh] md:h-[600px]">
               {/* Head */}
               <div className="p-6 border-b border-gray-100 bg-white shrink-0">
                 <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-2 font-medium">
                        <Badge variant="outline" className="bg-gray-100 border-none text-gray-600 rounded-md font-mono">{selectedTicket.id}</Badge>
                        <span>Créé le {selectedTicket.date}</span>
                        {selectedTicket.isUrgent && <span className="flex items-center text-red-500 text-xs font-bold bg-red-50 px-2 py-0.5 rounded-full"><AlertCircle className="w-3 h-3 mr-1" /> URGENT</span>}
                      </div>
                      <h3 className="text-xl font-black text-gray-900 leading-tight">{selectedTicket.subject}</h3>
                    </div>
                    <div>{getStatusBadge(selectedTicket.status)}</div>
                 </div>
               </div>
               
               {/* Chat body */}
               <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6">
                 {/* Fake Message 1 */}
                 <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-500 shrink-0">VO</div>
                   <div>
                     <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
                       <p className="text-gray-700 text-sm font-medium leading-relaxed">Bonjour, j'ai effectué un paiement pour la demande mais le statut ne s'est pas mis à jour dans mon tableau de bord.</p>
                     </div>
                     <span className="text-[10px] font-bold text-gray-400 mt-2 ml-1 block">{selectedTicket.date} - Vous</span>
                   </div>
                 </div>

                 {/* Fake Admin Reply */}
                 <div className="flex gap-4 flex-row-reverse">
                   <div className="w-10 h-10 rounded-full bg-[var(--color-text-dark)] flex items-center justify-center font-bold text-white shrink-0">
                     <img src="https://ui-avatars.com/api/?name=Support&background=0a192f&color=fff" alt="Support" className="rounded-full" />
                   </div>
                   <div className="flex flex-col items-end">
                     <div className="bg-[var(--color-text-dark)] text-white rounded-2xl rounded-tr-none p-4 shadow-md">
                       <p className="text-sm font-medium leading-relaxed">Bonjour, nous vérifions le problème avec la passerelle de paiement en ce moment. Nous vous tenons au courant d'ici 30 minutes.</p>
                     </div>
                     <span className="text-[10px] font-bold text-gray-400 mt-2 mr-1 block">Aujourd'hui, 09:30 - Support Client</span>
                   </div>
                 </div>
               </div>
               
               {/* Footer / Input */}
               {selectedTicket.status !== "RESOLVED" ? (
                 <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                   <div className="flex items-end gap-3 bg-gray-50 rounded-2xl border border-gray-200 p-2 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all">
                     <Textarea 
                        placeholder="Tapez votre réponse ici..." 
                        className="border-none bg-transparent shadow-none focus-visible:ring-0 resize-none min-h-[44px] py-3 font-medium placeholder:font-normal"
                        rows={1}
                     />
                     <Button className="bg-[var(--color-text-dark)] hover:bg-[var(--color-accent-bronze)] text-white rounded-xl h-11 px-6 shrink-0 font-bold mb-1 mr-1">
                       Envoyer
                     </Button>
                   </div>
                 </div>
               ) : (
                  <div className="p-6 bg-gray-100 text-center text-gray-500 text-sm font-medium border-t border-gray-200 shrink-0">
                     Ce ticket a été marqué comme résolu et est maintenant fermé.
                  </div>
               )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
