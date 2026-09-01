import { useState, useMemo } from "react";
import { useAppStore } from "../../src/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "../../src/firebase";
import { doc, collection, runTransaction } from "firebase/firestore";
import { 
  Check, X, FileText, ArrowUpRight, ArrowDownRight, 
  Wallet, History, PlusSquare, Building, AlertCircle
} from "lucide-react";

export function FinancesManagement() {
  const { rechargeRequests, transactions, agencies } = useAppStore();
  const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'manual'>('pending');
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [creditAmount, setCreditAmount] = useState<string>('');
  
  // Manual Adjustment State
  const [manualAgencyId, setManualAgencyId] = useState<string>("");
  const [manualType, setManualType] = useState<"credit" | "debit">("credit");
  const [manualAmount, setManualAmount] = useState("");
  const [manualNote, setManualNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived Data
  const pendingRecharges = useMemo(() => {
    return [...rechargeRequests]
      .filter(r => r.status === 'Pending')
      .sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime());
  }, [rechargeRequests]);
  
  const totalEncaissements = useMemo(() => {
    return rechargeRequests
      .filter(r => r.status === 'Approved')
      .reduce((sum, req) => sum + (req.amount || 0), 0);
  }, [rechargeRequests]);

  const encoursGlobal = useMemo(() => {
    return agencies.reduce((sum, agency) => sum + (agency.balance || 0), 0);
  }, [agencies]);

  const totalPendingAmount = useMemo(() => {
    return pendingRecharges.reduce((sum, req) => sum + (req.amount || 0), 0);
  }, [pendingRecharges]);

  const allTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  const handleApprove = async () => {
    if (!selectedReq || !creditAmount) return;
    const finalAmount = parseFloat(creditAmount);
    if (isNaN(finalAmount) || finalAmount <= 0) return;
    setIsSubmitting(true);
    try {
      await runTransaction(db, async (transaction) => {
        const agencyRef = doc(db, "users", selectedReq.agencyId);
        const reqRef = doc(db, "rechargeRequests", selectedReq.id);
        const agencyDoc = await transaction.get(agencyRef);
        
        if (!agencyDoc.exists()) {
          throw new Error("Agence introuvable");
        }

        const newBalance = (agencyDoc.data().balance || 0) + finalAmount;
        
        transaction.update(agencyRef, { balance: newBalance });
        transaction.update(reqRef, { 
          status: 'Approved',
          amount: finalAmount, 
          updatedAt: new Date().toISOString()
        });

        const txRef = doc(collection(db, "transactions"));
        transaction.set(txRef, {
          id: txRef.id,
          agencyId: selectedReq.agencyId,
          agencyName: selectedReq.agencyName,
          type: 'credit',
          amount: finalAmount,
          description: `Validation de recharge ${selectedReq.note ? '- ' + selectedReq.note : ''}`,
          date: new Date().toISOString()
        });
        
        const notifRef = doc(collection(db, "notifications"));
        transaction.set(notifRef, {
          id: notifRef.id,
          agencyId: selectedReq.agencyId,
          title: 'Recharge Approuvée',
          message: `Votre compte a été crédité de ${finalAmount.toLocaleString()} DZD.`,
          type: 'success',
          read: false,
          createdAt: new Date().toISOString(),
          link: '/agency/wallet'
        });
      });
      setSelectedReq(null);
    } catch(err: any) {
      console.error("Validation error:", err);
      alert("Erreur lors de la validation : " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (reqId: string, agencyId: string, amount: number) => {
    const reason = prompt("Motif du rejet (Obligatoire) :");
    if (!reason) return;

    try {
      await runTransaction(db, async (transaction) => {
        const reqRef = doc(db, "rechargeRequests", reqId);
        transaction.update(reqRef, { 
          status: 'Rejected', 
          note: `Rejeté: ${reason}`,
          updatedAt: new Date().toISOString()
        });
        
        const notifRef = doc(collection(db, "notifications"));
        transaction.set(notifRef, {
          id: notifRef.id,
          agencyId: agencyId,
          title: 'Recharge Rejetée',
          message: `Demande de ${amount} DZD refusée. Motif : ${reason}`,
          type: 'error',
          read: false,
          createdAt: new Date().toISOString(),
          link: '/agency/wallet'
        });
      });
    } catch(err) {
      console.error(err);
      alert("Erreur lors du rejet");
    }
  };

  const handleManualAdjustment = async () => {
    if (!manualAgencyId || !manualAmount || !manualNote) return;
    const amountNum = parseFloat(manualAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    setIsSubmitting(true);
    const agency = agencies.find(a => a.id === manualAgencyId);
    if (!agency) {
      setIsSubmitting(false);
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const agencyRef = doc(db, "users", agency.id);
        const agencyDoc = await transaction.get(agencyRef);
        if (!agencyDoc.exists()) throw new Error("Agence introuvable");
        
        const currentBalance = agencyDoc.data().balance || 0;
        const newBalance = manualType === 'credit' ? currentBalance + amountNum : currentBalance - amountNum;
        
        transaction.update(agencyRef, { balance: newBalance });

        const txRef = doc(collection(db, "transactions"));
        transaction.set(txRef, {
          id: txRef.id,
          agencyId: agency.id,
          agencyName: agency.agencyName || agency.name || "Inconnue",
          type: manualType,
          amount: amountNum,
          description: `Ajustement Manuel (Admin) : ${manualNote}`,
          date: new Date().toISOString()
        });
        
        const notifRef = doc(collection(db, "notifications"));
        transaction.set(notifRef, {
          id: notifRef.id,
          agencyId: agency.id,
          title: `Ajustement Manuel (${manualType === 'credit' ? 'Crédit' : 'Débit'})`,
          message: `Votre compte a été ${manualType === 'credit' ? 'crédité' : 'débité'} de ${amountNum.toLocaleString()} DZD. Motif : ${manualNote}`,
          type: manualType === 'credit' ? 'success' : 'warning',
          read: false,
          createdAt: new Date().toISOString(),
          link: '/agency/wallet'
        });
      });

      setManualAgencyId("");
      setManualAmount("");
      setManualNote("");
      alert("Ajustement effectué avec succès !");
      setActiveTab("history"); // Redirect to history to see it
    } catch(err: any) {
      console.error(err);
      alert("Erreur lors de l'ajustement : " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isImageBase64 = (str: any) => typeof str === 'string' && str.startsWith('data:image/');

  return (
    <div className="space-y-6 pb-20">
      
      {/* HEADER & KPIs */}
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">Trésorerie & Portefeuilles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-xl"><Wallet className="w-6 h-6 text-white" /></div>
            </div>
            <h3 className="text-emerald-100 font-bold mb-1">Encaissements Totaux</h3>
            <div className="text-3xl font-black">{totalEncaissements.toLocaleString()} DZD</div>
            <div className="text-emerald-100/80 text-sm mt-2">Recharges approuvées sur la plateforme</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-xl"><Building className="w-6 h-6 text-white" /></div>
            </div>
            <h3 className="text-blue-100 font-bold mb-1">Encours Global (Agences)</h3>
            <div className="text-3xl font-black">{encoursGlobal.toLocaleString()} DZD</div>
            <div className="text-blue-100/80 text-sm mt-2">Argent actuellement dispo sur les wallets</div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg shadow-amber-500/20">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-xl"><AlertCircle className="w-6 h-6 text-white" /></div>
            </div>
            <h3 className="text-amber-100 font-bold mb-1">En attente de validation</h3>
            <div className="text-3xl font-black">{totalPendingAmount.toLocaleString()} DZD</div>
            <div className="text-amber-100/80 text-sm mt-2">{pendingRecharges.length} demande(s) en attente</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50 overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors relative whitespace-nowrap ${
              activeTab === 'pending' ? 'text-blue-600 bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Wallet className="w-4 h-4" /> Demandes de Recharge
            {pendingRecharges.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">
                {pendingRecharges.length}
              </span>
            )}
            {activeTab === 'pending' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
          </button>
          
          <button 
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors relative whitespace-nowrap ${
              activeTab === 'manual' ? 'text-blue-600 bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <PlusSquare className="w-4 h-4" /> Ajustement Manuel
            {activeTab === 'manual' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
          </button>

          <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors relative whitespace-nowrap ${
              activeTab === 'history' ? 'text-blue-600 bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" /> Grand Livre (Historique)
            {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-0">
          
          {/* TAB 1: PENDING RECHARGES */}
          {activeTab === 'pending' && (
            pendingRecharges.length === 0 ? (
              <div className="p-16 text-center text-slate-500">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-1">Tout est à jour !</h3>
                <p>Aucune demande de recharge en attente de validation.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead>Agence</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Preuve / Note</TableHead>
                      <TableHead className="text-right">Montant Demandé</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRecharges.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-bold text-slate-900">{req.agencyName}</TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{new Date(req.date || req.createdAt).toLocaleDateString()}</div>
                          <div className="text-xs text-slate-500">{new Date(req.date || req.createdAt).toLocaleTimeString()}</div>
                        </TableCell>
                        <TableCell>
                           {isImageBase64(req.note) ? (
                             <div className="cursor-pointer border border-slate-200 rounded-md overflow-hidden w-16 h-16 bg-slate-50 flex items-center justify-center hover:opacity-80 transition" onClick={() => window.open(req.note)}>
                               <img src={req.note} alt="Reçu" className="w-full h-full object-cover" />
                             </div>
                           ) : (
                             <div className="text-sm text-slate-600 max-w-xs truncate" title={req.note}>{req.note || '-'}</div>
                           )}
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-blue-600 text-lg">
                          {req.amount.toLocaleString()} DZD
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={() => handleReject(req.id, req.agencyId, req.amount)}>
                              <X className="w-4 h-4 mr-1"/> Rejeter
                            </Button>
                            <Button size="sm" onClick={() => { setSelectedReq(req); setCreditAmount(req.amount.toString()); }} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                              <Check className="w-4 h-4 mr-1"/> Approuver
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}

          {/* TAB 2: MANUAL ADJUSTMENT */}
          {activeTab === 'manual' && (
            <div className="p-8 max-w-3xl mx-auto">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                    <PlusSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900">Ajustement Manuel</h3>
                    <p className="text-slate-500 text-sm">Créditez ou débitez un portefeuille sans demande préalable (geste commercial, erreur, etc.)</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Sélectionner l'Agence</label>
                      <Select value={manualAgencyId} onValueChange={setManualAgencyId}>
                        <SelectTrigger className="h-14 bg-white border-slate-200 text-base shadow-sm focus:ring-blue-500">
                          <SelectValue placeholder="Choisir une agence..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-80">
                          {agencies.map(a => (
                            <SelectItem key={a.id} value={a.id} className="py-3 cursor-pointer">
                              <div className="flex justify-between items-center w-full gap-4">
                                <span className="font-bold text-slate-900 truncate">{a.agencyName || a.name || 'Agence Inconnue'}</span>
                                <Badge variant="secondary" className="font-mono bg-slate-100 text-slate-600 whitespace-nowrap border border-slate-200">
                                  {(a.balance || 0).toLocaleString()} DZD
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Type d'opération</label>
                      <Select value={manualType} onValueChange={(val: any) => setManualType(val)}>
                        <SelectTrigger className={`h-14 text-base font-bold shadow-sm border-2 ${manualType === 'credit' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500' : 'bg-red-50 text-red-700 border-red-200 focus:ring-red-500'}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit" className="py-3 cursor-pointer">
                            <span className="text-emerald-700 font-bold flex items-center gap-2">
                              <ArrowUpRight className="w-5 h-5"/> Créditer (+)
                            </span>
                          </SelectItem>
                          <SelectItem value="debit" className="py-3 cursor-pointer">
                            <span className="text-red-700 font-bold flex items-center gap-2">
                              <ArrowDownRight className="w-5 h-5"/> Débiter (-)
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Montant (DZD)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Wallet className="h-6 w-6 text-slate-400" />
                      </div>
                      <Input 
                        type="number" 
                        placeholder="Ex: 50000" 
                        className={`pl-12 h-16 text-2xl font-black font-mono shadow-sm border-2 transition-colors focus-visible:ring-0 ${
                          manualType === 'credit' 
                            ? 'focus:border-emerald-500 border-slate-200' 
                            : 'focus:border-red-500 border-slate-200'
                        }`}
                        value={manualAmount}
                        onChange={e => setManualAmount(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-slate-400 font-bold text-lg">DZD</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Motif de l'ajustement (Obligatoire)</label>
                    <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FileText className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input 
                        placeholder="Ex: Remboursement suite à erreur de dossier..." 
                        className="pl-12 h-14 bg-white border-slate-200 shadow-sm text-base"
                        value={manualNote}
                        onChange={e => setManualNote(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-200 flex justify-end">
                    <Button 
                      onClick={handleManualAdjustment}
                      disabled={isSubmitting || !manualAgencyId || !manualAmount || !manualNote}
                      className={`h-14 font-black px-10 text-lg shadow-md transition-all ${manualType === 'credit' ? 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-emerald-500/25' : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-red-500/25'}`}
                    >
                      {isSubmitting ? 'Traitement...' : `Confirmer le ${manualType === 'credit' ? 'Crédit' : 'Débit'}`}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GLOBAL TRANSACTIONS HISTORY */}
          {activeTab === 'history' && (
            allTransactions.length === 0 ? (
              <div className="p-16 text-center text-slate-500">
                <History className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p className="font-medium text-lg text-slate-800">Aucun historique</p>
                <p className="text-sm">Les transactions apparaîtront ici.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Agence</TableHead>
                      <TableHead>Opération</TableHead>
                      <TableHead>Détails</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="text-sm font-medium text-slate-600 whitespace-nowrap">
                          {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </TableCell>
                        <TableCell className="font-bold text-slate-900">{tx.agencyName || 'Inconnue'}</TableCell>
                        <TableCell>
                           {tx.type === 'credit' ? (
                             <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Crédit (+)</Badge>
                           ) : (
                             <Badge className="bg-red-100 text-red-700 border-red-200">Débit (-)</Badge>
                           )}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600 max-w-md truncate" title={tx.description || tx.note || tx.ref}>
                          {tx.description || tx.note || tx.ref}
                        </TableCell>
                        <TableCell className={`text-right font-mono font-bold whitespace-nowrap ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {tx.type === 'credit' ? '+' : '-'}{tx.amount?.toLocaleString()} DZD
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

      {/* MODAL: APPROVE RECHARGE */}
      <Dialog open={!!selectedReq} onOpenChange={(o) => !o && setSelectedReq(null)}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
          {selectedReq && (
            <div>
              <div className="bg-emerald-600 p-6 text-white text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black">Valider la Recharge</h3>
                <p className="text-emerald-100 font-medium">{selectedReq.agencyName}</p>
              </div>
                            
              <div className="p-6 space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
                  {isImageBase64(selectedReq.note) ? (
                    <div className="mb-3 text-center">
                      <span className="text-slate-500 block mb-2 font-bold">Justificatif fourni :</span>
                      <img src={selectedReq.note} className="max-h-32 object-contain mx-auto rounded-lg border border-slate-200 cursor-pointer hover:opacity-80 transition" onClick={() => window.open(selectedReq.note)} alt="Reçu" />
                    </div>
                  ) : (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-500 font-bold">Note de l'agence:</span>
                      <span className="text-slate-900">{selectedReq.note || '-'}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-bold">Demande initiale:</span>
                    <span className="font-mono font-black text-slate-900 text-lg">{selectedReq.amount.toLocaleString()} DZD</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700">Confirmer le montant reçu (DZD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">DZD</span>
                    <Input 
                      type="number" 
                      className="pl-14 h-14 text-xl font-mono font-black bg-white border-slate-300 focus:border-emerald-500" 
                      value={creditAmount} 
                      onChange={e => setCreditAmount(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-slate-500 font-medium text-center">Vous pouvez corriger le montant s'il diffère du justificatif.</p>
                </div>

                <div className="pt-2 flex gap-3">
                  <Button variant="outline" onClick={() => setSelectedReq(null)} className="flex-1 h-12 border-slate-200 text-slate-600 font-bold">Annuler</Button>
                  <Button onClick={handleApprove} disabled={isSubmitting} className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg">
                    {isSubmitting ? '...' : 'Valider'}
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
