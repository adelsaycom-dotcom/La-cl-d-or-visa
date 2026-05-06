import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, MessageSquare, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const MOCK_TICKETS = [
  { id: "T-1001", subject: "Problème avec la demande APP-004", isUrgent: true, status: "OPEN", date: "2024-05-05", lastReply: "En attente du support" },
  { id: "T-1002", subject: "Montant de recharge incorrect", isUrgent: false, status: "IN_PROGRESS", date: "2024-05-04", lastReply: "Admin a répondu y a 2h" },
  { id: "T-1003", subject: "Comment demander un visa de groupe ?", isUrgent: false, status: "RESOLVED", date: "2024-04-28", lastReply: "Résolu" },
];

export function AgencySupport() {
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN": return <Badge className="bg-orange-100 text-orange-800 border-none">Ouvert</Badge>;
      case "IN_PROGRESS": return <Badge className="bg-blue-100 text-blue-800 border-none">En Cours</Badge>;
      case "RESOLVED": return <Badge className="bg-gray-100 text-gray-800 border-none">Résolu</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tickets Support</h2>
          <p className="text-sm text-gray-500 mt-1">Contactez l'administrateur pour de l'aide concernant les demandes ou la facturation.</p>
        </div>
        <Button onClick={() => setIsNewTicketOpen(true)} className="bg-black text-white">
          <Plus className="w-4 h-4 mr-2" /> Nouveau Ticket
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="whitespace-nowrap">ID Ticket</TableHead>
              <TableHead>Sujet</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="whitespace-nowrap">Dernière Activité</TableHead>
              <TableHead className="text-right whitespace-nowrap">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-sm font-medium whitespace-nowrap">{t.id}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <span className="font-medium">{t.subject}</span>
                  {t.isUrgent && <AlertCircle className="w-4 h-4 inline ml-2 text-red-500" />}
                </TableCell>
                <TableCell>{getStatusBadge(t.status)}</TableCell>
                <TableCell className="text-sm text-gray-500 whitespace-nowrap">{t.lastReply}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(t)}>
                    <MessageSquare className="w-4 h-4 mr-2" /> Voir Chat
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* New Ticket Dialog */}
      <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
        <DialogContent>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Ouvrir un Nouveau Ticket</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sujet</label>
              <Input placeholder="Bref résumé du problème..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea rows={5} placeholder="Décrivez votre problème en détail..." />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="urgent" className="rounded text-black" />
              <label htmlFor="urgent" className="text-sm font-medium text-red-600 flex items-center gap-1">
                Marquer comme Urgent <AlertCircle className="w-4 h-4" />
              </label>
            </div>
            <div className="pt-4 flex justify-end gap-2 text-sm text-gray-500">
              Ne marquez comme urgent que pour des problèmes de paiement critiques ou des problèmes de demande sensibles au temps.
            </div>
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button variant="outline" onClick={() => setIsNewTicketOpen(false)}>Annuler</Button>
              <Button className="bg-black text-white" onClick={() => setIsNewTicketOpen(false)}>Soumettre le Ticket</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* View Ticket Dialog (Placeholder) */}
      <Dialog open={!!selectedTicket} onOpenChange={(o) => !o && setSelectedTicket(null)}>
        <DialogContent className="max-w-xl">
          {selectedTicket && (
            <div className="space-y-4">
               <div>
                 <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                   <span>{selectedTicket.id}</span>
                   <span>•</span>
                   <span>{selectedTicket.date}</span>
                   {selectedTicket.isUrgent && <Badge variant="outline" className="text-red-500 border-red-200">Urgent</Badge>}
                 </div>
                 <h3 className="text-xl font-bold">{selectedTicket.subject}</h3>
               </div>
               
               <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] border">
                 <div className="text-center text-sm text-gray-500">L'historique du chat apparaîtra ici.</div>
               </div>
               
               {selectedTicket.status !== "RESOLVED" && (
                 <div className="flex gap-2">
                   <Input placeholder="Tapez votre réponse..." />
                   <Button className="bg-black text-white shrink-0">Envoyer</Button>
                 </div>
               )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
