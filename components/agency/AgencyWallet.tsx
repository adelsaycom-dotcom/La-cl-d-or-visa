import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { useAppStore } from "../../src/store/useAppStore";
import { auth } from "../../src/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Wallet, UploadCloud, CheckCircle2, XCircle, Clock,
  History, CreditCard, ArrowUpRight, ArrowDownRight, Image as ImageIcon, Loader2
} from "lucide-react";
import { useLanguage } from "../../src/i18n/LanguageContext";
import { useToast } from "@/components/ui/toast";
import { TablePagination } from "../common/TablePagination";
import { DocumentPreviewModal, type PreviewDocData } from "../common/DocumentPreviewModal";
import { ProtectedImage } from "../common/ProtectedImage";
import { compressImageIfPossible, uploadFileToServer } from "../../src/utils/fileUpload";
import {
  isReceiptAsset,
  getSafeTimestamp,
  sortTransactionsDesc,
  extractErrorMessage
} from "../../src/utils/financeHelpers";
import { getAgencyDisplayName } from "../../src/utils/agencyName";

const PAGE_SIZE = 10;
const MAX_RECEIPT_SIZE_BYTES = 5 * 1024 * 1024;

export function AgencyWallet() {
  const { language, t } = useLanguage();
  const isEn = language === "en";
  const toast = useToast();

  // Sélecteurs Zustand atomiques
  const agencyBalance = useAppStore((s) => s.agencyBalance);
  const transactions = useAppStore((s) => s.transactions);
  const rechargeRequests = useAppStore((s) => s.rechargeRequests);
  const mysqlSecondaryLoading = useAppStore((s) => s.mysqlSecondaryLoading);
  const mysqlSecondaryLoaded = useAppStore((s) => s.mysqlSecondaryLoaded);
  const addRechargeRequest = useAppStore((s) => s.addRechargeRequest);
  const agencies = useAppStore((s) => s.agencies);

  const agencyId = auth.currentUser?.uid || "mock-id";

  const currentAgency = useMemo(
    () => agencies.find((a) => a.id === agencyId),
    [agencies, agencyId]
  );

  const displayedBalance = currentAgency?.balance ?? agencyBalance;

  const [activeTab, setActiveTab] = useState<"recharges" | "transactions">("recharges");

  // Pagination
  const [rechargesPage, setRechargesPage] = useState<number>(1);
  const [transactionsPage, setTransactionsPage] = useState<number>(1);

  // Aperçu reçu intégré (remplace window.open)
  const [previewDoc, setPreviewDoc] = useState<PreviewDocData | null>(null);

  // Recharge Form State
  const [rechargeOpen, setRechargeOpen] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("ccp");
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Derived Data
  const myRecharges = useMemo(() => {
    return (rechargeRequests || [])
      .filter((r) => r.agencyId === agencyId)
      .sort((a, b) => getSafeTimestamp(b.date, b.createdAt) - getSafeTimestamp(a.date, a.createdAt));
  }, [rechargeRequests, agencyId]);

  const myTransactions = useMemo(() => {
    return sortTransactionsDesc((transactions || []).filter((tx) => tx.agencyId === agencyId));
  }, [transactions, agencyId]);

  const rechargesTotalPages = Math.max(1, Math.ceil(myRecharges.length / PAGE_SIZE));
  const txTotalPages = Math.max(1, Math.ceil(myTransactions.length / PAGE_SIZE));

  useEffect(() => {
    if (rechargesPage > rechargesTotalPages) setRechargesPage(rechargesTotalPages);
  }, [rechargesPage, rechargesTotalPages]);

  useEffect(() => {
    if (transactionsPage > txTotalPages) setTransactionsPage(txTotalPages);
  }, [transactionsPage, txTotalPages]);

  const paginatedRecharges = useMemo(() => {
    const start = (rechargesPage - 1) * PAGE_SIZE;
    return myRecharges.slice(start, start + PAGE_SIZE);
  }, [myRecharges, rechargesPage]);

  const paginatedTransactions = useMemo(() => {
    const start = (transactionsPage - 1) * PAGE_SIZE;
    return myTransactions.slice(start, start + PAGE_SIZE);
  }, [myTransactions, transactionsPage]);

  const readReceiptFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.warning(
          isEn ? "Invalid format" : "Format invalide",
          isEn ? "Please drop a valid image file." : "Veuillez déposer une image valide."
        );
        return;
      }
      if (file.size > MAX_RECEIPT_SIZE_BYTES) {
        toast.warning(
          isEn ? "File too large" : "Fichier trop volumineux",
          isEn ? "Maximum receipt image size is 5MB." : "L'image est trop volumineuse (Max 5MB)."
        );
        return;
      }
      setReceiptFile(file);
      const compressed = await compressImageIfPossible(file, 1200, 1200, 0.78);
      if (!isMountedRef.current) return;
      if (compressed) {
        setReceiptImage(compressed);
      }
    },
    [isEn, toast]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        readReceiptFile(file);
      }
    },
    [readReceiptFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) {
        readReceiptFile(file);
      }
    },
    [readReceiptFile]
  );

  const handleSubmitRecharge = useCallback(async () => {
    const parsedAmount = Number(amount);
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) return;

    setIsSubmitting(true);
    try {
      let noteValue = receiptImage || `Méthode: ${paymentMethod}`;
      if (receiptFile) {
        try {
          const uploadRes = await uploadFileToServer(receiptFile, "Justificatif Recharge");
          if (uploadRes.url && uploadRes.url.startsWith("/api/files/")) {
            noteValue = uploadRes.url;
          } else if (uploadRes.dataUrl) {
            noteValue = uploadRes.dataUrl;
          }
        } catch {
          // Conserver la version compressée locale en secours
        }
      }

      const payload = {
        agencyId: currentAgency?.id || auth.currentUser?.uid || "mock-id",
        agencyName: getAgencyDisplayName(currentAgency, auth.currentUser?.email, "Agence Partenaire"),
        amount: parsedAmount,
        note: noteValue,
        status: "Pending",
        date: new Date().toISOString(),
      };
      await addRechargeRequest(payload);
      if (!isMountedRef.current) return;
      toast.success(
        isEn ? "Request submitted" : "Demande envoyée",
        isEn
          ? "Your wallet top-up request is awaiting validation."
          : "Votre demande de recharge a été transmise pour validation."
      );
      setRechargeOpen(false);
      setAmount("");
      setReceiptImage(null);
      setReceiptFile(null);
      setPaymentMethod("ccp");
    } catch (err: unknown) {
      if (!isMountedRef.current) return;
      toast.error(
        isEn ? "Submission error" : "Erreur lors de l'envoi",
        extractErrorMessage(err, isEn ? "Failed to send top-up request." : "Erreur lors de l'envoi de la demande.")
      );
    } finally {
      if (isMountedRef.current) setIsSubmitting(false);
    }
  }, [amount, currentAgency, receiptFile, receiptImage, paymentMethod, addRechargeRequest, isEn, toast]);

  const handleOpenReceiptPreview = useCallback(
    (src: string) => {
      setPreviewDoc({
        src,
        title: isEn ? "Payment Receipt" : "Justificatif de paiement",
      });
    },
    [isEn]
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm"><CheckCircle2 className="w-3 h-3 mr-1" /> {isEn ? "Approved" : "Validée"}</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 border-red-200 shadow-sm"><XCircle className="w-3 h-3 mr-1" /> {isEn ? "Rejected" : "Rejetée"}</Badge>;
      default:
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200 shadow-sm"><Clock className="w-3 h-3 mr-1" /> {isEn ? "Pending" : "En attente"}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* WALLET CARD */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        {/* Decorational shapes */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#7B1B38] opacity-20 blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-slate-300 font-medium mb-2">
              <Wallet className="w-5 h-5" />
              <span>{t("wallet.availableBalance")}</span>
            </div>
            <div className="text-5xl font-black font-mono tracking-tight text-white flex items-baseline gap-2">
              {(displayedBalance || 0).toLocaleString()}
              <span className="text-2xl font-bold text-slate-400">DZD</span>
            </div>
          </div>

          <Dialog open={rechargeOpen} onOpenChange={setRechargeOpen}>
            <Button onClick={() => setRechargeOpen(true)} className="bg-[#7B1B38] text-white hover:bg-[#63142c] h-14 px-8 font-black text-lg shadow-lg shadow-[#7B1B38]/25 rounded-xl transition-transform active:scale-95">
              <ArrowUpRight className="w-5 h-5 mr-2" />
              {t("wallet.rechargeAccount")}
            </Button>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white rounded-2xl">
              <div className="bg-slate-900 p-6 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl"></div>
                <h3 className="text-2xl font-black relative z-10">{t("wallet.rechargeModalTitle")}</h3>
                <p className="text-slate-300 mt-1 relative z-10">{t("wallet.rechargeModalSubtitle")}</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t("wallet.rechargeMethod")}</label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="h-12 bg-slate-50 border-slate-200 font-bold">
                      <SelectValue placeholder={isEn ? "Select a method" : "Choisir une méthode"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ccp">{isEn ? "Postal CCP / BaridiMob Transfer" : "Virement CCP / BaridiMob"}</SelectItem>
                      <SelectItem value="bank">{isEn ? "Bank Wire Transfer" : "Virement Bancaire"}</SelectItem>
                      <SelectItem value="cash">{isEn ? "Cash Deposit (Office)" : "Dépôt en Espèces (Bureau)"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    {isEn ? "Transferred Amount (DZD)" : "Montant transféré (DZD)"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Wallet className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                      type="number"
                      placeholder="Ex: 50000"
                      className="pl-12 h-14 text-xl font-black font-mono border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-blue-500"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex justify-between">
                    <span>{isEn ? "Proof of Payment / Bank Slip" : "Justificatif de paiement"}</span>
                    <span className="text-slate-400 text-xs font-normal">
                      {isEn ? "Required for BaridiMob/CCP" : "Requis pour BaridiMob/CCP"}
                    </span>
                  </label>

                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${receiptImage ? "border-emerald-500 bg-emerald-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400"}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />

                    {receiptImage ? (
                      <div className="space-y-3">
                        <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden border border-emerald-200 shadow-sm relative group">
                          <img src={receiptImage} alt="Reçu" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ImageIcon className="text-white w-6 h-6" />
                          </div>
                        </div>
                        <p className="text-emerald-700 font-bold text-sm">
                          {isEn ? "Receipt uploaded successfully" : "Image chargée avec succès"}
                        </p>
                        <p className="text-emerald-600/70 text-xs font-medium">
                          {isEn ? "Click to change" : "Cliquez pour modifier"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-200">
                          <UploadCloud className="w-6 h-6 text-slate-500" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-700">
                            {isEn ? "Click or drag your receipt screenshot" : "Cliquez ou glissez une capture"}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {isEn ? "PNG, JPG up to 2MB" : "PNG, JPG jusqu'à 2MB"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Button
                    onClick={handleSubmitRecharge}
                    disabled={isSubmitting || !amount}
                    className="w-full h-14 bg-[#7B1B38] hover:bg-[#63142c] text-white font-black text-lg rounded-xl shadow-lg shadow-[#7B1B38]/25 transition-all active:scale-[0.98]"
                  >
                    {isSubmitting ? (isEn ? "Submitting..." : "Envoi en cours...") : (isEn ? "Submit Top-up Request" : "Envoyer la demande")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("recharges")}
          className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors relative whitespace-nowrap ${
            activeTab === "recharges" ? "text-[#7B1B38]" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Wallet className="w-4 h-4" /> {isEn ? "Top-ups Tracker" : "Suivi des Recharges"}
          {activeTab === "recharges" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7B1B38]" />}
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors relative whitespace-nowrap ${
            activeTab === "transactions" ? "text-[#7B1B38]" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <History className="w-4 h-4" /> {isEn ? "Expenses & Transactions History" : "Historique des Dépenses"}
          {activeTab === "transactions" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7B1B38]" />}
        </button>
      </div>

      {/* TABS CONTENT */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* RECHARGES TAB */}
        {activeTab === "recharges" && (
          myRecharges.length === 0 ? (
            mysqlSecondaryLoading && !mysqlSecondaryLoaded && rechargeRequests.length === 0 ? (
              <div className="p-16 text-center text-slate-500">
                <Loader2 className="w-8 h-8 mx-auto mb-3 text-[#7B1B38] animate-spin" />
                <p className="text-sm font-bold text-slate-700">{isEn ? "Loading top-up history..." : "Chargement des recharges en cours..."}</p>
              </div>
            ) : (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <CreditCard className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">
                  {isEn ? "No top-up requests" : "Aucune recharge"}
                </h3>
                <p className="text-slate-500 text-sm">
                  {isEn ? "Your wallet balance top-up requests will appear here." : "Vos demandes de rechargement de solde apparaîtront ici."}
                </p>
              </div>
            )
          ) : (
            <div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>{isEn ? "Date & Time" : "Date & Heure"}</TableHead>
                      <TableHead>{isEn ? "Details / Proof" : "Détails / Justificatif"}</TableHead>
                      <TableHead className="text-right">{isEn ? "Amount" : "Montant"}</TableHead>
                      <TableHead className="text-right">{isEn ? "Status" : "Statut"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRecharges.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>
                          <div className="font-bold text-slate-900">{new Date(req.date || req.createdAt).toLocaleDateString()}</div>
                          <div className="text-xs text-slate-500">{new Date(req.date || req.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                        </TableCell>
                        <TableCell>
                          {isReceiptAsset(req.note) ? (
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                className="w-10 h-10 rounded border border-slate-200 overflow-hidden cursor-pointer hover:opacity-80 transition shrink-0"
                                onClick={() => handleOpenReceiptPreview(req.note)}
                                title={isEn ? "View receipt" : "Agrandir le justificatif"}
                              >
                                <ProtectedImage src={req.note} alt="Reçu" className="w-full h-full object-cover" />
                              </button>
                              <span className="text-sm font-medium text-slate-600">
                                {isEn ? "Attached receipt" : "Reçu joint"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-600 max-w-[200px] truncate block" title={req.note}>
                              {req.note || (isEn ? "Standard request" : "Demande classique")}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-slate-900">
                          {req.amount.toLocaleString()} DZD
                        </TableCell>
                        <TableCell className="text-right">
                          {getStatusBadge(req.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <TablePagination
                currentPage={rechargesPage}
                totalPages={rechargesTotalPages}
                totalCount={myRecharges.length}
                pageSize={PAGE_SIZE}
                onPageChange={setRechargesPage}
                itemLabel={isEn ? "requests" : "demandes"}
              />
            </div>
          )
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === "transactions" && (
          myTransactions.length === 0 ? (
            mysqlSecondaryLoading && !mysqlSecondaryLoaded && transactions.length === 0 ? (
              <div className="p-16 text-center text-slate-500">
                <Loader2 className="w-8 h-8 mx-auto mb-3 text-[#7B1B38] animate-spin" />
                <p className="text-sm font-bold text-slate-700">{isEn ? "Loading transactions..." : "Chargement des transactions en cours..."}</p>
              </div>
            ) : (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <History className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">
                  {isEn ? "No transactions" : "Aucune transaction"}
                </h3>
                <p className="text-slate-500 text-sm">
                  {isEn ? "Your payments and debit history will appear here." : "Votre historique de paiements et prélèvements apparaîtra ici."}
                </p>
              </div>
            )
          ) : (
            <div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>{isEn ? "Date" : "Date"}</TableHead>
                      <TableHead>{isEn ? "Operation" : "Opération"}</TableHead>
                      <TableHead>{isEn ? "Detail" : "Détail"}</TableHead>
                      <TableHead className="text-right">{isEn ? "Amount" : "Montant"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">{new Date(tx.date).toLocaleDateString()}</div>
                          <div className="text-xs text-slate-500">{new Date(tx.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                        </TableCell>
                        <TableCell>
                          {tx.type === "credit" ? (
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-bold"><ArrowUpRight className="w-3 h-3 mr-1" /> {isEn ? "Credit" : "Crédit"}</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700 border-red-200 font-bold"><ArrowDownRight className="w-3 h-3 mr-1" /> {isEn ? "Debit" : "Débit"}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600 max-w-sm truncate" title={tx.description || tx.note || tx.ref}>
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
                currentPage={transactionsPage}
                totalPages={txTotalPages}
                totalCount={myTransactions.length}
                pageSize={PAGE_SIZE}
                onPageChange={setTransactionsPage}
                itemLabel={isEn ? "transactions" : "transactions"}
              />
            </div>
          )
        )}
      </div>

      {/* APERÇU JUSTIFICATIF INTÉGRÉ */}
      <DocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
    </div>
  );
}
