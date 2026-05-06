import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WalletCards, ArrowDownRight, ArrowUpRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MOCK_TRANSACTIONS = [
  { id: "TX-1", type: "DEBIT", amount: 150, date: "2024-05-05 14:30:00", ref: "APP-004", note: "Demande Visa (EAU - Touriste)" },
  { id: "TX-2", type: "CREDIT", amount: 5000, date: "2024-05-04 10:00:00", ref: "Banque TR-110", note: "Recharge Admin" },
  { id: "TX-3", type: "DEBIT", amount: 350, date: "2024-05-01 09:15:00", ref: "APP-002, APP-003", note: "Demandes Visa (Lot)" },
];

export function AgencyWallet() {
  const [rechargeOpen, setRechargeOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Portefeuille & Facturation</h2>
          <p className="text-sm text-gray-500 mt-1">Gérez votre solde prépayé et votre historique de transactions.</p>
        </div>
        <Button onClick={() => setRechargeOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
          <WalletCards className="w-4 h-4 mr-2" /> Demander une Recharge
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0a192f] text-white p-6 rounded-2xl shadow-lg md:col-span-1 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
             <WalletCards className="w-32 h-32" />
           </div>
           <div className="relative z-10">
             <div className="text-sm text-gray-300 font-medium mb-2 uppercase tracking-wide">Solde Disponible</div>
             <div className="text-5xl font-bold font-mono tracking-tight">4,500 <span className="text-2xl">DA</span></div>
             <div className="mt-8 text-xs text-gray-400">
               Seuil de solde bas: 500 DA
             </div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-2 space-y-4">
           <h3 className="font-semibold border-b pb-2 flex items-center justify-between">
             Demandes de Recharge en Attente
             <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-50">1 En Attente</Badge>
           </h3>
           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="font-medium text-sm">Détails du transfert envoyés à l'Admin</div>
                  <div className="text-xs text-gray-500">Soumis le 5 Mai 2024 à 08:00</div>
                </div>
              </div>
              <div className="font-mono font-bold text-lg text-orange-600">2,000 DA</div>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <h3 className="font-semibold p-4 border-b bg-gray-50">Historique des Transactions</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Date / Heure</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="whitespace-nowrap">Description</TableHead>
              <TableHead>Référence</TableHead>
              <TableHead className="text-right whitespace-nowrap">Montant (DA)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_TRANSACTIONS.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="text-sm text-gray-600 whitespace-nowrap">{tx.date}</TableCell>
                <TableCell>
                  {tx.type === "CREDIT" ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none flex w-min items-center gap-1">
                      <ArrowDownRight className="w-3 h-3" /> Crédit
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-none flex w-min items-center gap-1">
                      <ArrowUpRight className="w-3 h-3 text-red-500" /> Débit
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="font-medium text-sm whitespace-nowrap">{tx.note}</TableCell>
                <TableCell className="font-mono text-xs text-gray-500 whitespace-nowrap">{tx.ref}</TableCell>
                <TableCell className={`text-right font-mono font-bold whitespace-nowrap ${tx.type === "CREDIT" ? "text-green-600" : "text-gray-900"}`}>
                  {tx.type === "CREDIT" ? "+" : "-"}{tx.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={rechargeOpen} onOpenChange={setRechargeOpen}>
        <DialogContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Demander une Recharge</h3>
              <p className="text-sm text-gray-500">Informez l'admin que vous avez effectué un virement bancaire ou un paiement par chèque.</p>
            </div>
            
            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm border border-blue-100">
              <p className="font-semibold mb-1">Coordonnées Bancaires pour le Virement :</p>
              <p className="font-mono text-xs">Banque: BNA | RIB: 001 00000 0000000000 00 | Bénéficiaire: Visa Platform B2B</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Montant de le Recharge (DA)</label>
                <Input type="number" placeholder="ex: 10000" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Note / Référence de Paiement</label>
                <Input placeholder="ex: Reçu de transfert #49281" />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t">
              <Button variant="outline" onClick={() => setRechargeOpen(false)}>Annuler</Button>
              <Button className="bg-black text-white" onClick={() => setRechargeOpen(false)}>Soumettre la Demande</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
