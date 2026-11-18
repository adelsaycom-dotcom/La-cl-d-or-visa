import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useAppStore, type RechargeRequest } from "../../src/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFirestoreDb } from "../../src/firebase";
import {
  Check, X, FileText, Wallet, History, PlusSquare, Building, AlertCircle
} from "lucide-react";
import { useLanguage } from "../../src/i18n/LanguageContext";
import { useToast } from "@/components/ui/toast";
import { TablePagination } from "../common/TablePagination";
import { DocumentPreviewModal, type PreviewDocData } from "../common/DocumentPreviewModal";
import { ProtectedImage } from "../common/ProtectedImage";
import {
  computeRechargeSummary,
  sortTransactionsDesc,
  isReceiptAsset,
  extractErrorMessage
} from "../../src/utils/financeHelpers";
import { getBackendMode, apiFetch } from "../../src/services/apiClient";
import { buildAgenciesLookup, getAgencyDisplayName, resolveRecordAgencyName } from "../../src/utils/agencyName";

const PAGE_SIZE = 10;

export function FinancesManagement() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const toast = useToast();

  // Sélecteurs Zustand atomiques
  const rechargeRequests = useAppStore((s) => s.rechargeRequests);
  const transactions = useAppStore((s) => s.transactions);
  const agencies = useAppStore((s) => s.agencies);
  const agenciesLookup = useMemo(() => buildAgenciesLookup(agencies || []), [agencies]);

  const [activeTab, setActiveTab] = useState<"pending" | "history" | "manual">("pending");
  const [selectedReq, setSelectedReq] = useState<RechargeRequest | null>(null);
  const [creditAmount, setCreditAmount] = useState<string>("");

  // Modal de rejet (remplace window.prompt)
  const [rejectTarget, setRejectTarget] = useState<RechargeRequest | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [isRejecting, setIsRejecting] = useState<boolean>(false);

  // Aperçu justificatif intégré (remplace window.open)
  const [previewDoc, setPreviewDoc] = useState<PreviewDocData | null>(null);

  // Pagination
  const [pendingPage, setPendingPage] = useState<number>(1);
  const [historyPage, setHistoryPage] = useState<number>(1);

  // Manual Adjustment State
  const [manualAgencyId, setManualAgencyId] = useState<string>("");
  const [manualType, setManualType] = useState<"credit" | "debit">("credit");
  const [manualAmount, setManualAmount] = useState<string>("");
  const [manualNote, setManualNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Calcul O(N) consolidé
  const {
    pendingRecharges,
    totalEncaissements,
    totalPendingAmount,
    encoursGlobal,
  } = useMemo(
    () => computeRechargeSummary(rechargeRequests, agencies),
    [rechargeRequests, agencies]
  );

  const allTransactions = useMemo(
    () => sortTransactionsDesc(transactions),
    [transactions]
  );

  const pendingTotalPages = Math.max(1, Math.ceil(pendingRecharges.length / PAGE_SIZE));
  const historyTotalPages = Math.max(1, Math.ceil(allTransactions.length / PAGE_SIZE));

  useEffect(() => {
    if (pendingPage > pendingTotalPages) setPendingPage(pendingTotalPages);
  }, [pendingPage, pendingTotalPages]);

  useEffect(() => {
    if (historyPage > historyTotalPages) setHistoryPage(historyTotalPages);
  }, [historyPage, historyTotalPages]);

  const paginatedPending = useMemo(() => {
    const start = (pendingPage - 1) * PAGE_SIZE;
    return pendingRecharges.slice(start, start + PAGE_SIZE);
  }, [pendingRecharges, pendingPage]);

  const paginatedTransactions = useMemo(() => {
    const start = (historyPage - 1) * PAGE_SIZE;
    return allTransactions.slice(start, start + PAGE_SIZE);
  }, [allTransactions, historyPage]);

  const handleOpenReceipt = useCallback(
    (src: string, agencyName?: string) => {
      setPreviewDoc({
        src,
        title: `${isEn ? "Payment Receipt" : "Justificatif de recharge"} — ${agencyName || "Agence"}`,
      });
    },
    [isEn]
  );

  const handleApprove = useCallback(async () => {
    if (!selectedReq || !creditAmount) return;
    const finalAmount = parseFloat(creditAmount);
    if (Number.isNaN(finalAmount) || finalAmount <= 0) return;

    setIsSubmitting(true);
    try {
      const mode = await getBackendMode();
      if (mode === "mysql") {
        await apiFetch(`/api/db/recharge-requests/${encodeURIComponent(selectedReq.id)}/approve`, {
          method: "POST",
          body: JSON.stringify({ amount: finalAmount }),
        });
        await useAppStore.getState().refreshAllFromMysql(true);
      } else {
        const [{ doc, collection, runTransaction }, db] = await Promise.all([
          import("firebase/firestore"),
          getFirestoreDb(),
        ]);
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
            status: "Approved",
            amount: finalAmount,
            updatedAt: new Date().toISOString(),
          });

          const txRef = doc(collection(db, "transactions"));
          transaction.set(txRef, {
            id: txRef.id,
            agencyId: selectedReq.agencyId,
            agencyName: selectedReq.agencyName,
            type: "credit",
            amount: finalAmount,
            description: isEn
              ? `Top-up validation ${selectedReq.note && !isReceiptAsset(selectedReq.note) ? "- " + selectedReq.note : ""}`
              : `Validation de recharge ${selectedReq.note && !isReceiptAsset(selectedReq.note) ? "- " + selectedReq.note : ""}`,
            date: new Date().toISOString(),
          });

          const notifRef = doc(collection(db, "notifications"));
          transaction.set(notifRef, {
            id: notifRef.id,
            agencyId: selectedReq.agencyId,
            title: isEn ? "Top-up Approved" : "Recharge Approuvée",
            message: isEn
              ? `Your wallet has been credited with ${finalAmount.toLocaleString()} DZD.`
              : `Votre compte a été crédité de ${finalAmount.toLocaleString()} DZD.`,
            type: "success",
            read: false,
            createdAt: new Date().toISOString(),
            link: "/agency/wallet",
          });
        });
      }

      if (!isMountedRef.current) return;
      toast.success(
        isEn ? "Top-up approved" : "Recharge validée",
        isEn
          ? `${finalAmount.toLocaleString()} DZD credited to ${selectedReq.agencyName}.`
          : `${finalAmount.toLocaleString()} DZD crédités sur le compte de ${selectedReq.agencyName}.`
      );
      setSelectedReq(null);
    } catch (err: unknown) {
      if (!isMountedRef.current) return;
      toast.error(
        isEn ? "Validation error" : "Erreur lors de la validation",
        extractErrorMessage(err, isEn ? "Unable to approve request." : "Impossible de valider la recharge.")
      );
    } finally {
      if (isMountedRef.current) setIsSubmitting(false);
    }
  }, [selectedReq, creditAmount, isEn, toast]);

  const handleConfirmReject = useCallback(async () => {
    if (!rejectTarget) return;
    const reason = rejectReason.trim();
    if (!reason) return;

    setIsRejecting(true);
    try {
      const mode = await getBackendMode();
      if (mode === "mysql") {
        await apiFetch(`/api/db/recharge-requests/${encodeURIComponent(rejectTarget.id)}/reject`, {
          method: "POST",
          body: JSON.stringify({ reason }),
        });
        await useAppStore.getState().refreshAllFromMysql(true);
      } else {
        const [{ doc, collection, runTransaction }, db] = await Promise.all([
          import("firebase/firestore"),
          getFirestoreDb(),
        ]);
        await runTransaction(db, async (transaction) => {
          const reqRef = doc(db, "rechargeRequests", rejectTarget.id);
          transaction.update(reqRef, {
            status: "Rejected",
            note: isEn ? `Rejected: ${reason}` : `Rejeté: ${reason}`,
            updatedAt: new Date().toISOString(),
          });

          const notifRef = doc(collection(db, "notifications"));
          transaction.set(notifRef, {
            id: notifRef.id,
            agencyId: rejectTarget.agencyId,
            title: isEn ? "Top-up Rejected" : "Recharge Rejetée",
            message: isEn
              ? `Request for ${rejectTarget.amount} DZD rejected. Reason: ${reason}`
              : `Demande de ${rejectTarget.amount} DZD refusée. Motif : ${reason}`,
            type: "error",
            read: false,
            createdAt: new Date().toISOString(),
            link: "/agency/wallet",
          });
        });
      }

      if (!isMountedRef.current) return;
      toast.info(
        isEn ? "Request rejected" : "Demande rejetée",
        isEn ? "The agency has been notified." : "L'agence partenaire a été notifiée."
      );
      setRejectTarget(null);
      setRejectReason("");
    } catch (err: unknown) {
      if (!isMountedRef.current) return;
      toast.error(
        isEn ? "Error during rejection" : "Erreur lors du rejet",
        extractErrorMessage(err, isEn ? "Unable to reject request." : "Impossible de rejeter la demande.")
      );
    } finally {
      if (isMountedRef.current) setIsRejecting(false);
    }
  }, [rejectTarget, rejectReason, isEn, toast]);

  const handleManualAdjustment = useCallback(async () => {
    if (!manualAgencyId || !manualAmount || !manualNote.trim()) return;
    const amountNum = parseFloat(manualAmount);
    if (Number.isNaN(amountNum) || amountNum <= 0) return;

    const agency = agencies.find((a) => a.id === manualAgencyId);
    if (!agency) return;

    setIsSubmitting(true);
    try {
      const mode = await getBackendMode();
      if (mode === "mysql") {
        await apiFetch("/api/db/wallet/adjust", {
          method: "POST",
          body: JSON.stringify({
            agencyId: agency.id,
            type: manualType,
            amount: amountNum,
            reason: manualNote.trim(),
          }),
        });
        await useAppStore.getState().refreshAllFromMysql(true);
      } else {
        const [{ doc, collection, runTransaction }, db] = await Promise.all([
          import("firebase/firestore"),
          getFirestoreDb(),
        ]);
        await runTransaction(db, async (transaction) => {
          const agencyRef = doc(db, "users", agency.id);
          const agencyDoc = await transaction.get(agencyRef);
          if (!agencyDoc.exists()) {
            throw new Error(isEn ? "Agency not found" : "Agence introuvable");
          }

          const currentBalance = agencyDoc.data().balance || 0;
          const newBalance = manualType === "credit" ? currentBalance + amountNum : currentBalance - amountNum;

          transaction.update(agencyRef, { balance: newBalance });

          const txRef = doc(collection(db, "transactions"));
          transaction.set(txRef, {
            id: txRef.id,
            agencyId: agency.id,
            agencyName: agency.agencyName || agency.name || (isEn ? "Agency" : "Agence"),
            type: manualType,
            amount: amountNum,
            description: isEn ? `Manual Adjustment: ${manualNote.trim()}` : `Ajustement Manuel : ${manualNote.trim()}`,
            date: new Date().toISOString(),
          });

          const notifRef = doc(collection(db, "notifications"));
          transaction.set(notifRef, {
            id: notifRef.id,
            agencyId: agency.id,
            title: manualType === "credit"
              ? (isEn ? "Account Credited" : "Compte Crédité")
              : (isEn ? "Account Debited" : "Compte Débité"),
            message: isEn
              ? `An adjustment of ${amountNum.toLocaleString()} DZD was applied: ${manualNote.trim()}`
              : `Un ajustement de ${amountNum.toLocaleString()} DZD a été effectué : ${manualNote.trim()}`,
            type: "info",
            read: false,
            createdAt: new Date().toISOString(),
            link: "/agency/wallet",
          });
        });
      }

      if (!isMountedRef.current) return;
      setManualAmount("");
      setManualNote("");
      toast.success(
        isEn ? "Adjustment applied" : "Ajustement effectué",
        isEn ? "The agency wallet balance has been updated." : "Le solde de l'agence a été mis à jour avec succès."
      );
      setActiveTab("history");
    } catch (err: unknown) {
      if (!isMountedRef.current) return;
      toast.error(
        isEn ? "Adjustment error" : "Erreur lors de l'ajustement",
        extractErrorMessage(err, isEn ? "Operation failed." : "L'opération a échoué.")
      );
    } finally {
      if (isMountedRef.current) setIsSubmitting(false);
    }
  }, [manualAgencyId, manualAmount, manualNote, manualType, agencies, isEn, toast]);

  const handleManualTypeChange = useCallback((val: string) => {
    if (val === "credit" || val === "debit") {
      setManualType(val);
    }
  }, []);

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
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors relative whitespace-nowrap ${
              activeTab === "pending" ? "text-[#7B1B38] bg-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            }`}
          >
            <Wallet className="w-4 h-4" /> {isEn ? "Top-up Requests" : "Demandes de Recharge"}
            {pendingRecharges.length > 0 && (
              <span className="bg-[#7B1B38] text-white text-[10px] px-2 py-0.5 rounded-full ml-1">
                {pendingRecharges.length}
              </span>
            )}
            {activeTab === "pending" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7B1B38]" />}
          </button>

          <button
            onClick={() => setActiveTab("manual")}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors relative whitespace-nowrap ${
              activeTab === "manual" ? "text-[#7B1B38] bg-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            }`}
          >
            <PlusSquare className="w-4 h-4" /> {isEn ? "Manual Adjustment" : "Ajustement Manuel"}
            {activeTab === "manual" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7B1B38]" />}
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors relative whitespace-nowrap ${
              activeTab === "history" ? "text-[#7B1B38] bg-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            }`}
          >
            <History className="w-4 h-4" /> {isEn ? "General Ledger (History)" : "Grand Livre (Historique)"}
            {activeTab === "history" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7B1B38]" />}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-0">
          {/* TAB 1: PENDING RECHARGES */}
          {activeTab === "pending" && (
            pendingRecharges.length === 0 ? (
              <div className="p-16 text-center text-slate-500">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-1">{isEn ? "Everything is up to date!" : "Tout est à jour !"}</h3>
                <p>{isEn ? "No pending top-up requests to review." : "Aucune demande de recharge en attente de validation."}</p>
              </div>
            ) : (
              <div>
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
                      {paginatedPending.map((req) => (
                        <TableRow key={req.id}>
                          <TableCell className="text-sm font-medium text-slate-600 whitespace-nowrap">
                            {new Date(req.date || req.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-bold text-slate-900">
                            {resolveRecordAgencyName(req, agenciesLookup, "Agence Partenaire")}
                          </TableCell>
                          <TableCell className="font-mono font-bold text-emerald-600 whitespace-nowrap">
                            {req.amount.toLocaleString()} DZD
                          </TableCell>
                          <TableCell className="max-w-xs">
                            {isReceiptAsset(req.note) ? (
                              <button
                                type="button"
                                className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline cursor-pointer bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100"
                                onClick={() => handleOpenReceipt(req.note, resolveRecordAgencyName(req, agenciesLookup, "Agence Partenaire"))}
                              >
                                <FileText className="w-3.5 h-3.5" /> {isEn ? "View Receipt" : "Voir Justificatif"}
                              </button>
                            ) : (
                              <span className="text-sm text-slate-600 truncate block">{req.note || "-"}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-2 whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => {
                                setRejectTarget(req);
                                setRejectReason("");
                              }}
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
                <TablePagination
                  currentPage={pendingPage}
                  totalPages={pendingTotalPages}
                  totalCount={pendingRecharges.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setPendingPage}
                  itemLabel={isEn ? "requests" : "demandes"}
                />
              </div>
            )
          )}

          {/* TAB 2: MANUAL ADJUSTMENT */}
          {activeTab === "manual" && (
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
                      {agencies.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {getAgencyDisplayName(a)} (Solde : {(a.balance || 0).toLocaleString()} DZD)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{isEn ? "Operation Type" : "Type d'opération"}</label>
                    <Select value={manualType} onValueChange={handleManualTypeChange}>
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
                      onChange={(e) => setManualAmount(e.target.value)}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{isEn ? "Administrative Reason" : "Motif administratif (Obligatoire)"}</label>
                  <Input
                    placeholder={isEn ? "e.g., Cash top-up at office / Voucher refund" : "Ex: Virement reçu en agence / Compensation commerciale"}
                    value={manualNote}
                    onChange={(e) => setManualNote(e.target.value)}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleManualAdjustment}
                    disabled={isSubmitting || !manualAgencyId || !manualAmount || !manualNote.trim()}
                    className="w-full bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold h-11"
                  >
                    {isSubmitting ? (isEn ? "Processing..." : "Enregistrement...") : (isEn ? "Apply Adjustment" : "Appliquer l'ajustement")}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GLOBAL TRANSACTIONS HISTORY */}
          {activeTab === "history" && (
            allTransactions.length === 0 ? (
              <div className="p-16 text-center text-slate-500">
                <History className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p className="font-medium text-lg text-slate-800">{isEn ? "No transaction history" : "Aucun historique"}</p>
                <p className="text-sm">{isEn ? "Transactions will appear here." : "Les transactions apparaîtront ici."}</p>
              </div>
            ) : (
              <div>
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
                      {paginatedTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="text-sm font-medium text-slate-600 whitespace-nowrap">
                            {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </TableCell>
                          <TableCell className="font-bold text-slate-900">
                            {resolveRecordAgencyName(tx, agenciesLookup, isEn ? "Unknown" : "Agence Partenaire")}
                          </TableCell>
                          <TableCell>
                            {tx.type === "credit" ? (
                              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">{isEn ? "Credit (+)" : "Crédit (+)"}</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700 border-red-200">{isEn ? "Debit (-)" : "Débit (-)"}</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-slate-600 max-w-md truncate" title={tx.description || tx.note || tx.ref}>
                            {tx.description || tx.note || tx.ref}
                          </TableCell>
                          <TableCell className={`text-right font-mono font-bold whitespace-nowrap ${tx.type === "credit" ? "text-emerald-600" : "text-slate-900"}`}>
                            {tx.type === "credit" ? "+" : "-"}{tx.amount?.toLocaleString()} DZD
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <TablePagination
                  currentPage={historyPage}
                  totalPages={historyTotalPages}
                  totalCount={allTransactions.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setHistoryPage}
                  itemLabel={isEn ? "transactions" : "transactions"}
                />
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
                <p className="text-emerald-100 font-medium">
                  {resolveRecordAgencyName(selectedReq, agenciesLookup, "Agence Partenaire")}
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
                  {isReceiptAsset(selectedReq.note) ? (
                    <div className="mb-3 text-center">
                      <span className="text-slate-500 block mb-2 font-bold">{isEn ? "Provided Proof:" : "Justificatif fourni :"}</span>
                      <ProtectedImage
                        src={selectedReq.note}
                        className="max-h-32 object-contain mx-auto rounded-lg border border-slate-200 cursor-pointer hover:opacity-80 transition"
                        onClick={() => handleOpenReceipt(selectedReq.note, resolveRecordAgencyName(selectedReq, agenciesLookup, "Agence Partenaire"))}
                        alt="Reçu"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-500 font-bold">{isEn ? "Agency note:" : "Note de l'agence:"}</span>
                      <span className="text-slate-900">{selectedReq.note || "-"}</span>
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
                      onChange={(e) => setCreditAmount(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-slate-500 font-medium text-center">{isEn ? "You can adjust if the transferred amount differs from proof." : "Vous pouvez corriger le montant s'il diffère du justificatif."}</p>
                </div>

                <div className="pt-2 flex gap-3">
                  <Button variant="outline" onClick={() => setSelectedReq(null)} className="flex-1 h-12 border-slate-200 text-slate-600 font-bold">
                    {isEn ? "Cancel" : "Annuler"}
                  </Button>
                  <Button onClick={handleApprove} disabled={isSubmitting} className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg">
                    {isSubmitting ? "..." : (isEn ? "Confirm" : "Valider")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL: REJECT RECHARGE (remplace window.prompt) */}
      <Dialog open={!!rejectTarget} onOpenChange={(o) => !o && !isRejecting && setRejectTarget(null)}>
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden">
          {rejectTarget && (
            <div>
              <div className="bg-red-600 p-5 text-white">
                <h3 className="text-xl font-black">{isEn ? "Reject Top-up Request" : "Rejeter la demande de recharge"}</h3>
                <p className="text-red-100 text-sm mt-1">
                  {resolveRecordAgencyName(rejectTarget, agenciesLookup, "Agence Partenaire")} — {rejectTarget.amount.toLocaleString()} DZD
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    {isEn ? "Reason for rejection (Required)" : "Motif du rejet (Obligatoire)"}
                  </label>
                  <Input
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder={isEn ? "e.g., Unreadable receipt or funds not received" : "Ex: Justificatif illisible ou virement non reçu"}
                    className="bg-slate-50 border-slate-200"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setRejectTarget(null)}
                    disabled={isRejecting}
                    className="flex-1 h-11 border-slate-200 text-slate-600 font-bold"
                  >
                    {isEn ? "Cancel" : "Annuler"}
                  </Button>
                  <Button
                    onClick={handleConfirmReject}
                    disabled={isRejecting || !rejectReason.trim()}
                    className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-bold"
                  >
                    {isRejecting ? "..." : (isEn ? "Confirm Rejection" : "Confirmer le rejet")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* APERÇU JUSTIFICATIF INTÉGRÉ */}
      <DocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
    </div>
  );
}
