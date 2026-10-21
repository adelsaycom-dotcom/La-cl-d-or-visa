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
import { useLanguage } from "../../src/i18n/LanguageContext";

export function FinancesManagement() {
  const { language, t } = useLanguage();
  const isEn = language === "en";

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
          throw new Error(isEn ? "Agency not found" : "Agence introuvable");
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
          description: isEn 
            ? `Top-up validation ${selectedReq.note ? '- ' + selectedReq.note : ''}`
            : `Validation de recharge ${selectedReq.note ? '- ' + selectedReq.note : ''}`,
          date: new Date().toISOString()
        });
        
        const notifRef = doc(collection(db, "notifications"));
        transaction.set(notifRef, {
          id: notifRef.id,
          agencyId: selectedReq.agencyId,
          title: isEn ? 'Top-up Approved' : 'Recharge Approuvée',
          message: isEn 
            ? `Your wallet has been credited with ${finalAmount.toLocaleString()} DZD.`
            : `Votre compte a été crédité de ${finalAmount.toLocaleString()} DZD.`,
          type: 'success',
          read: false,
          createdAt: new Date().toISOString(),
          link: '/agency/wallet'
        });
      });
      setSelectedReq(null);
    } catch(err: any) {
      console.error("Validation error:", err);
      alert((isEn ? "Validation error: " : "Erreur lors de la validation : ") + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (reqId: string, agencyId: string, amount: number) => {
    const reason = prompt(isEn ? "Reason for rejection (Required):" : "Motif du rejet (Obligatoire) :");
    if (!reason) return;

    try {
      await runTransaction(db, async (transaction) => {
        const reqRef = doc(db, "rechargeRequests", reqId);
        transaction.update(reqRef, { 
          status: 'Rejected', 
          note: isEn ? `Rejected: ${reason}` : `Rejeté: ${reason}`,
          updatedAt: new Date().toISOString()
        });
        
        const notifRef = doc(collection(db, "notifications"));
        transaction.set(notifRef, {
          id: notifRef.id,
          agencyId: agencyId,
          title: isEn ? 'Top-up Rejected' : 'Recharge Rejetée',
          message: isEn 
            ? `Request for ${amount} DZD rejected. Reason: ${reason}`
            : `Demande de ${amount} DZD refusée. Motif : ${reason}`,
          type: 'error',
          read: false,
          createdAt: new Date().toISOString(),
          link: '/agency/wallet'
        });
      });
    } catch(err) {
      console.error(err);
      alert(isEn ? "Error during rejection" : "Erreur lors du rejet");
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
        if (!agencyDoc.exists()) throw new Error(isEn ? "Agency not found" : "Agence introuvable");
        
        const currentBalance = agencyDoc.data().balance || 0;
        const newBalance = manualType === 'credit' ? currentBalance + amountNum : currentBalance - amountNum;

        transaction.update(agencyRef, { balance: newBalance });

        const txRef = doc(collection(db, "transactions"));
        transaction.set(txRef, {
          id: txRef.id,
          agencyId: agency.id,
          agencyName: agency.agencyName || agency.name || (isEn ? "Agency" : "Agence"),
          type: manualType,
          amount: amountNum,
          description: isEn ? `Manual Adjustment: ${manualNote}` : `Ajustement Manuel : ${manualNote}`,
          date: new Date().toISOString()
        });

        const notifRef = doc(collection(db, "notifications"));
        transaction.set(notifRef, {
          id: notifRef.id,
          agencyId: agency.id,
          title: manualType === 'credit' 
            ? (isEn ? 'Account Credited' : 'Compte Crédité') 
            : (isEn ? 'Account Debited' : 'Compte Débité'),
          message: isEn 
            ? `An adjustment of ${amountNum.toLocaleString()} DZD was applied: ${manualNote}`
            : `Un ajustement de ${amountNum.toLocaleString()} DZD a été effectué : ${manualNote}`,
          type: 'info',
          read: false,
          createdAt: new Date().toISOString(),
          link: '/agency/wallet'
        });
      });

      setManualAmount("");
      setManualNote("");
      alert(isEn ? "Adjustment applied successfully!" : "Ajustement effectué avec succès !");
      setActiveTab("history");
    } catch(err: any) {
      console.error(err);
      alert((isEn ? "Error during adjustment: " : "Erreur lors de l'ajustement : ") + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isImageBase64 = (str: any) => typeof str === 'string' && str.startsWith('data:image/');

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      
      {/* HEADER & KPIs */}
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-[#7B1B38] rounded-full"></div>
          {isEn ? "Treasury & Wallets" : "Trésorerie & Portefeuilles"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-xl"><Wallet className="w-6 h-6 text-white" /></div>
            </div>
            <h3 className="text-emerald-100 font-bold mb-1">{isEn ? "Total Collections" : "Encaissements Totaux"}</h3>
            <div className="text-3xl font-black">{totalEncaissements.toLocaleString()} DZD</div>
            <div className="text-emerald-100/80 text-sm mt-2">{isEn ? "Approved top-ups on platform" : "Recharges approuvées sur la plateforme"}</div>
          </div>
          
          <div className="bg-gradient-to-br from-[#7B1B38] to-[#581227] rounded-2xl p-6 text-white shadow-lg shadow-[#7B1B38]/20">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-xl"><Building className="w-6 h-6 text-white" /></div>
            </div>
            <h3 className="text-rose-100 font-bold mb-1">{isEn ? "Total Agency Balances" : "Encours Global (Agences)"}</h3>
            <div className="text-3xl font-black">{encoursGlobal.toLocaleString()} DZD</div>
            <div className="text-rose-100/80 text-sm mt-2">{isEn ? "Funds currently available on wallets" : "Fonds actuellement disponibles sur les wallets"}</div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl p-6 text-white shadow-lg shadow-amber-500/10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-xl"><AlertCircle className="w-6 h-6 text-white" /></div>
            </div>
            <h3 className="text-amber-100 font-bold mb-1">{isEn ? "Awaiting Validation" : "En attente de validation"}</h3>
            <div className="text-3xl font-black">{totalPendingAmount.toLocaleString()} DZD</div>
            <div className="text-amber-100/80 text-sm mt-2">{pendingRecharges.length} {isEn ? "pending request(s)" : "demande(s) en attente"}</div>
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
              activeTab === 'pending' ? 'text-[#7B1B38] bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Wallet className="w-4 h-4" /> {isEn ? "Top-up Requests" : "Demandes de Recharge"}
            {pendingRecharges.length > 0 && (
              <span className="bg-[#7B1B38] text-white text-[10px] px-2 py-0.5 rounded-full ml-1">
                {pendingRecharges.length}
              </span>
            )}
            {activeTab === 'pending' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7B1B38]" />}
          </button>
          
          <button 
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors relative whitespace-nowrap ${
              activeTab === 'manual' ? 'text-[#7B1B38] bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <PlusSquare className="w-4 h-4" /> {isEn ? "Manual Adjustment" : "Ajustement Manuel"}
            {activeTab === 'manual' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7B1B38]" />}
          </button>

          <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors relative whitespace-nowrap ${
              activeTab === 'history' ? 'text-[#7B1B38] bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" /> {isEn ? "General Ledger (History)" : "Grand Livre (Historique)"}
            {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7B1B38]" />}
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
                <h3 className="font-bold text-lg text-slate-800 mb-1">{isEn ? "Everything is up to date!" : "Tout est à jour !"}</h3>
                <p>{isEn ? "No pending top-up requests to review." : "Aucune demande de recharge en attente de validation."}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead>{isEn ? "Date" : "Date"}</TableHead>
                      <TableHead>{isEn ? "Agency" : "Agence"}</TableHead>
                      <TableHead>{isEn ? "Amount" : "Montant"}</TableHead>
                      <TableHead>{isEn ? "Proof / Note" : "Justificatif / Note"}</TableHead>
                      <TableHead className="text-right">{isEn ? "Actions" : "Actions"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRecharges.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="text-sm font-medium text-slate-600 whitespace-nowrap">
                          {new Date(req.date || req.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-bold text-slate-900">{req.agencyName}</TableCell>
                        <TableCell className="font-mono font-bold text-emerald-600 whitespace-nowrap">
                          {req.amount.toLocaleString()} DZD
                        </TableCell>
                        <TableCell className="max-w-xs">
                          {isImageBase64(req.note) ? (
                            <span 
                              className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline cursor-pointer bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100" 
                              onClick={() => {
                                const w = window.open("");
                                if (w) w.document.write(`<img src="${req.note}" style="max-width:100%;" />`);
                              }}
                            >
                              <FileText className="w-3.5 h-3.5" /> {isEn ? "View Receipt" : "Voir Justificatif"}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-600 truncate block">{req.note || "-"}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2 whitespace-nowrap">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleReject(req.id, req.agencyId, req.amount)}
                          >
                            <X className="w-4 h-4 mr-1" /> {isEn ? "Reject" : "Rejeter"}
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                            onClick={() => {
                              setSelectedReq(req);
                              setCreditAmount(req.amount.toString());
                            }}
                          >
                            <Check className="w-4 h-4 mr-1" /> {isEn ? "Approve" : "Valider"}
                          </Button>
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
            <div className="p-8 max-w-xl">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{isEn ? "Manual Balance Adjustment" : "Ajustement Manuel de Solde"}</h3>
              <p className="text-sm text-slate-500 mb-6">
                {isEn 
                  ? "Directly credit or debit an agency wallet (for compensation, offline recovery, penalties)."
                  : "Créditez ou débitez directement le portefeuille d'une agence (remise, encaissement physique, pénalité)."}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{isEn ? "Select Partner Agency" : "Sélectionner l'Agence"}</label>
                  <Select value={manualAgencyId} onValueChange={setManualAgencyId}>
                    <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                      <SelectValue placeholder={isEn ? "Choose an agency..." : "Choisir une agence..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {agencies.map(a => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.agencyName || a.name || a.email} (Solde : {(a.balance || 0).toLocaleString()} DZD)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{isEn ? "Operation Type" : "Type d'opération"}</label>
                    <Select value={manualType} onValueChange={(val: any) => setManualType(val)}>
                      <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit">{isEn ? "Credit (+) Add" : "Crédit (+) Ajouter"}</SelectItem>
                        <SelectItem value="debit">{isEn ? "Debit (-) Deduct" : "Débit (-) Déduire"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{isEn ? "Amount (DZD)" : "Montant (DZD)"}</label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={manualAmount}
                      onChange={e => setManualAmount(e.target.value)}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{isEn ? "Administrative Reason" : "Motif administratif (Obligatoire)"}</label>
                  <Input 
                    placeholder={isEn ? "e.g., Cash top-up at office / Voucher refund" : "Ex: Virement reçu en agence / Compensation commerciale"} 
                    value={manualNote}
                    onChange={e => setManualNote(e.target.value)}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleManualAdjustment} 
                    disabled={isSubmitting || !manualAgencyId || !manualAmount || !manualNote}
                    className="w-full bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold h-11"
                  >
                    {isSubmitting ? (isEn ? "Processing..." : "Enregistrement...") : (isEn ? "Apply Adjustment" : "Appliquer l'ajustement")}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GLOBAL TRANSACTIONS HISTORY */}
          {activeTab === 'history' && (
            allTransactions.length === 0 ? (
              <div className="p-16 text-center text-slate-500">
                <History className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p className="font-medium text-lg text-slate-800">{isEn ? "No transaction history" : "Aucun historique"}</p>
                <p className="text-sm">{isEn ? "Transactions will appear here." : "Les transactions apparaîtront ici."}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead>{isEn ? "Date" : "Date"}</TableHead>
                      <TableHead>{isEn ? "Agency" : "Agence"}</TableHead>
                      <TableHead>{isEn ? "Operation" : "Opération"}</TableHead>
                      <TableHead>{isEn ? "Details" : "Détails"}</TableHead>
                      <TableHead className="text-right">{isEn ? "Amount" : "Montant"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="text-sm font-medium text-slate-600 whitespace-nowrap">
                          {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </TableCell>
                        <TableCell className="font-bold text-slate-900">{tx.agencyName || (isEn ? 'Unknown' : 'Inconnue')}</TableCell>
                        <TableCell>
                           {tx.type === 'credit' ? (
                             <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">{isEn ? "Credit (+)" : "Crédit (+)"}</Badge>
                           ) : (
                             <Badge className="bg-red-100 text-red-700 border-red-200">{isEn ? "Debit (-)" : "Débit (-)"}</Badge>
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
                <h3 className="text-2xl font-black">{isEn ? "Validate Top-up" : "Valider la Recharge"}</h3>
                <p className="text-emerald-100 font-medium">{selectedReq.agencyName}</p>
              </div>
                            
              <div className="p-6 space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
                  {isImageBase64(selectedReq.note) ? (
                    <div className="mb-3 text-center">
                      <span className="text-slate-500 block mb-2 font-bold">{isEn ? "Provided Proof:" : "Justificatif fourni :"}</span>
                      <img src={selectedReq.note} className="max-h-32 object-contain mx-auto rounded-lg border border-slate-200 cursor-pointer hover:opacity-80 transition" onClick={() => window.open(selectedReq.note)} alt="Reçu" />
                    </div>
                  ) : (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-500 font-bold">{isEn ? "Agency note:" : "Note de l'agence:"}</span>
                      <span className="text-slate-900">{selectedReq.note || '-'}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-bold">{isEn ? "Requested amount:" : "Demande initiale:"}</span>
                    <span className="font-mono font-black text-slate-900 text-lg">{selectedReq.amount.toLocaleString()} DZD</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700">{isEn ? "Confirm received amount (DZD)" : "Confirmer le montant reçu (DZD)"}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">DZD</span>
                    <Input 
                      type="number" 
                      className="pl-14 h-14 text-xl font-mono font-black bg-white border-slate-300 focus:border-emerald-500" 
                      value={creditAmount} 
                      onChange={e => setCreditAmount(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-slate-500 font-medium text-center">{isEn ? "You can adjust if the transferred amount differs from proof." : "Vous pouvez corriger le montant s'il diffère du justificatif."}</p>
                </div>

                <div className="pt-2 flex gap-3">
                  <Button variant="outline" onClick={() => setSelectedReq(null)} className="flex-1 h-12 border-slate-200 text-slate-600 font-bold">
                    {isEn ? "Cancel" : "Annuler"}
                  </Button>
                  <Button onClick={handleApprove} disabled={isSubmitting} className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg">
                    {isSubmitting ? '...' : (isEn ? 'Confirm' : 'Valider')}
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
