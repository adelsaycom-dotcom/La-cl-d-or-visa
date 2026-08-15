import re

with open('components/admin/FinancesManagement.tsx', 'r') as f:
    content = f.read()

# Make it entirely a new content
new_content = """import { useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAppStore } from "../../src/store/useAppStore";
import { CheckCircle2, XCircle, FileText, Check, X, Search } from "lucide-react";

export function FinancesManagement() {
  const { rechargeRequests, updateRechargeRequestStatus, addTransaction, transactions, agencies } = useAppStore();
  const recharges = (rechargeRequests || []).filter(r => r.status.toLowerCase() === 'pending');
  const rechargesHistory = (rechargeRequests || []).filter(r => r.status.toLowerCase() !== 'pending').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const allTransactions = [...(transactions || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "history" | "transactions">("pending");
  const [searchTerm, setSearchTerm] = useState("");

  const handleApprove = () => {
    if (!creditAmount) return;
    updateRechargeRequestStatus(selectedReq.id, 'Approved');

    // Mettre à jour le solde
    const userRef = doc(db, 'users', selectedReq.agencyId);
    getDoc(userRef).then(docSnap => {
      if(docSnap.exists()) {
        updateDoc(userRef, { balance: (docSnap.data().balance || 0) + Number(creditAmount) });
      }
    });

    addTransaction({
      agencyId: selectedReq.agencyId,
      agencyName: selectedReq.agencyName,
      type: 'credit',
      amount: Number(creditAmount),
      date: new Date().toISOString(),
      ref: selectedReq.note || 'RECHARGE',
      note: 'Recharge Approuvée'
    } as any);

    setSelectedReq(null);
    setCreditAmount("");
  };

  const handleReject = (id: string) => {
    updateRechargeRequestStatus(id, 'Rejected');
  };

  const totalBalances = agencies.reduce((acc, a) => acc + (a.balance || 0), 0);
  const totalProcessed = allTransactions.filter(t => t.type === 'debit').reduce((acc, t) => acc + (t.amount || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Approuvée</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Rejetée</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">En attente</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">{status}</Badge>;
    }
  };

  const filteredTransactions = allTransactions.filter(t => 
    (t.agencyName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
    (t.ref?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (t.note?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-text-dark">Finances & Soldes</h2>
        <p className="text-gray-500 mt-1">Gérez les demandes de rechargement et suivez l'historique financier complet.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
          <div className="text-sm text-blue-600 font-bold mb-1">Passif du système (Dette globale)</div>
          <div className="text-4xl font-black tracking-tight text-blue-900">{totalBalances.toLocaleString()} DA</div>
          <p className="text-xs text-blue-500 mt-2 font-medium">Somme totale présente dans les portefeuilles de toutes les agences</p>
        </div>
        <div className="bg-green-50 p-6 rounded-2xl border border-green-100 shadow-sm">
          <div className="text-sm text-green-600 font-bold mb-1">Total Dépensé (Débits)</div>
          <div className="text-4xl font-black tracking-tight text-green-900">{totalProcessed.toLocaleString()} DA</div>
          <p className="text-xs text-green-500 mt-2 font-medium">Valeur totale des achats effectués sur la plateforme</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
          <div className="flex gap-6 overflow-x-auto w-full">
            <button 
              className={`pb-1 border-b-2 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'pending' ? 'border-primary-gold text-primary-gold' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveTab('pending')}
            >
              Demandes de recharge ({recharges.length})
            </button>
            <button 
              className={`pb-1 border-b-2 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'history' ? 'border-primary-gold text-primary-gold' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveTab('history')}
            >
              Historique des recharges
            </button>
            <button 
              className={`pb-1 border-b-2 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'transactions' ? 'border-primary-gold text-primary-gold' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveTab('transactions')}
            >
              Toutes les transactions
            </button>
          </div>
          
          {activeTab === 'transactions' && (
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Rechercher..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 h-10 bg-white text-sm" 
              />
            </div>
          )}
        </div>

        <div className="p-0">
          {activeTab === 'pending' && (
            recharges.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-400 mb-4" />
                <p className="font-medium text-lg text-text-dark">Aucune demande en attente</p>
                <p className="text-sm">Toutes les recharges ont été traitées.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Agence</TableHead>
                      <TableHead>Date / Preuve</TableHead>
                      <TableHead className="text-right">Montant demandé</TableHead>
                      <TableHead className="text-right w-[250px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recharges.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-bold text-text-dark">{req.agencyName}</TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{new Date(req.date).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">{req.note}</div>
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-blue-600 text-lg">
                          {req.amount.toLocaleString()} DA
                        </TableCell>
                        <TableCell className="text-right flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={() => handleReject(req.id)}>
                            <X className="w-4 h-4 mr-1"/> Rejeter
                          </Button>
                          <Button size="sm" onClick={() => { setSelectedReq(req); setCreditAmount(req.amount.toString()); }} className="bg-text-dark hover:bg-primary-gold text-white">
                            <Check className="w-4 h-4 mr-1"/> Valider
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}

          {activeTab === 'history' && (
            rechargesHistory.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="font-medium text-lg text-text-dark">Aucun historique</p>
                <p className="text-sm">Les demandes traitées apparaîtront ici.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Agence</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Preuve / Note</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                      <TableHead className="text-right">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rechargesHistory.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-bold text-text-dark">{req.agencyName}</TableCell>
                        <TableCell className="text-sm">{new Date(req.date).toLocaleDateString()} à {new Date(req.date).toLocaleTimeString()}</TableCell>
                        <TableCell className="text-sm text-gray-600 max-w-xs truncate" title={req.note}>{req.note || '-'}</TableCell>
                        <TableCell className="text-right font-mono font-bold">
                          {req.amount.toLocaleString()} DA
                        </TableCell>
                        <TableCell className="text-right">
                          {getStatusBadge(req.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}

          {activeTab === 'transactions' && (
            filteredTransactions.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="font-medium text-lg text-text-dark">Aucune transaction trouvée</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Agence</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                          {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString()}
                        </TableCell>
                        <TableCell className="font-bold text-text-dark">{tx.agencyName || 'Inconnue'}</TableCell>
                        <TableCell>
                           {tx.type === 'credit' ? (
                             <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Crédit (+)</Badge>
                           ) : (
                             <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Débit (-)</Badge>
                           )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{tx.description || tx.note || tx.ref}</TableCell>
                        <TableCell className={`text-right font-mono font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'credit' ? '+' : '-'}{tx.amount?.toLocaleString()} DA
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}
        </div>
      </div>

      <Dialog open={!!selectedReq} onOpenChange={(o) => !o && setSelectedReq(null)}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedReq && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-text-dark">Valider la Recharge</h3>
                <p className="text-gray-500 text-sm mt-1">{selectedReq.agencyName}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2 border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Note de l'agence:</span>
                  <span className="font-bold text-text-dark">{selectedReq.note}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Demande originale:</span>
                  <span className="font-mono font-bold text-blue-600 text-lg">{selectedReq.amount.toLocaleString()} DA</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-text-dark">Montant réel reçu (DA)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">DA</span>
                  <Input 
                    type="number" 
                    className="pl-12 h-14 text-xl font-mono bg-white border-gray-200 focus:border-primary-gold" 
                    value={creditAmount} 
                    onChange={e => setCreditAmount(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500 font-medium">Vous pouvez ajuster le montant si le virement reçu diffère de la demande initiale.</p>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <Button variant="outline" onClick={() => setSelectedReq(null)} className="h-12 border-gray-200 hover:bg-gray-50 text-gray-600">Annuler</Button>
                <Button onClick={handleApprove} className="h-12 bg-text-dark hover:bg-primary-gold text-white px-8 font-bold">Confirmer le crédit</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
"""

with open('components/admin/FinancesManagement.tsx', 'w') as f:
    f.write(new_content)
