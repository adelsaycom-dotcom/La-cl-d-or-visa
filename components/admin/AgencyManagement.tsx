import { useState, useMemo } from "react";
import { useAppStore, Agency, Application, Transaction, RechargeRequest } from "../../src/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Building2, ShieldCheck, ShieldAlert, ShieldBan, Edit, Eye, MoreHorizontal, 
  Plus, Search, Filter, Phone, Mail, MapPin, FileText, CheckCircle2, 
  AlertCircle, Clock, WalletCards, ArrowUpRight, ArrowDownRight, RefreshCw, 
  X, Save, Ban, Calendar, UserCheck, AlertTriangle, ExternalLink, Sparkles
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "../../src/i18n/LanguageContext";

export function AgencyManagement() {
  const { language, t } = useLanguage();
  const isEn = language === "en";

  const { 
    agencies, updateAgencyStatus, updateAgency, applications, 
    transactions, rechargeRequests, addTransaction 
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<"juridique" | "dossiers" | "finances" | "sanctions">("juridique");

  // Modal Ajout Agence
  const [isAddAgencyOpen, setIsAddAgencyOpen] = useState(false);
  const [newAgencyName, setNewAgencyName] = useState("");
  const [newAgencyEmail, setNewAgencyEmail] = useState("");
  const [newAgencyPhone, setNewAgencyPhone] = useState("");
  const [newAgencyPwd, setNewAgencyPwd] = useState("");
  const [newAgencyRc, setNewAgencyRc] = useState("");
  const [newAgencyNif, setNewAgencyNif] = useState("");
  const [newAgencyManager, setNewAgencyManager] = useState("");
  const [newAgencyWilaya, setNewAgencyWilaya] = useState("");
  const [newAgencyAddress, setNewAgencyAddress] = useState("");
  const [isAddingLoading, setIsAddingLoading] = useState(false);

  // Édition des données du profil de l'agence sélectionnée
  const [editFormData, setEditFormData] = useState<Partial<Agency>>({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Ajustement de solde admin
  const [balanceAdjustType, setBalanceAdjustType] = useState<"credit" | "debit">("credit");
  const [balanceAdjustAmount, setBalanceAdjustAmount] = useState<number>(0);
  const [balanceAdjustReason, setBalanceAdjustReason] = useState("");
  const [isAdjustingBalance, setIsAdjustingBalance] = useState(false);

  // Sanction / Bannissement temporaire
  const [banDurationDays, setBanDurationDays] = useState<string>("15");
  const [banReason, setBanReason] = useState("");
  const [isBanning, setIsBanning] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Synchronisation du formulaire d'édition lorsque l'agence sélectionnée change
  const handleSelectAgency = (agency: Agency, tab: "juridique" | "dossiers" | "finances" | "sanctions" = "juridique") => {
    setSelectedAgency(agency);
    setActiveProfileTab(tab);
    setEditFormData({
      agencyName: agency.agencyName || agency.name || "",
      companyName: agency.companyName || "",
      managerName: agency.managerName || "",
      rc: agency.rc || agency.rcNumber || "",
      nif: agency.nif || agency.nifNumber || "",
      phone: agency.phone || "",
      email: agency.email || "",
      wilaya: agency.wilaya || "",
      address: agency.address || ""
    });
    setBalanceAdjustAmount(0);
    setBalanceAdjustReason("");
    setBanReason("");
    setActionNotice(null);
  };

  // Filtrage des agences
  const filteredAgencies = useMemo(() => {
    return agencies.filter(agency => {
      const q = searchTerm.toLowerCase().trim();
      const name = (agency.agencyName || agency.name || "").toLowerCase();
      const email = (agency.email || "").toLowerCase();
      const phone = (agency.phone || "").toLowerCase();
      const rc = (agency.rc || agency.rcNumber || "").toLowerCase();
      const manager = (agency.managerName || "").toLowerCase();
      const wilaya = (agency.wilaya || "").toLowerCase();

      const matchesSearch = !q || 
        name.includes(q) || 
        email.includes(q) || 
        phone.includes(q) || 
        rc.includes(q) || 
        manager.includes(q) ||
        wilaya.includes(q);

      const matchesStatus = 
        filterStatus === "ALL" ? true : 
        filterStatus === "ACTIVE" ? agency.status === "ACTIVE" :
        filterStatus === "PENDING" ? agency.status === "PENDING" :
        filterStatus === "SUSPENDED" ? agency.status === "SUSPENDED" :
        agency.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [agencies, searchTerm, filterStatus]);

  // Statistiques globales des agences
  const stats = useMemo(() => {
    const total = agencies.length;
    const active = agencies.filter(a => a.status === "ACTIVE").length;
    const pending = agencies.filter(a => a.status === "PENDING").length;
    const suspended = agencies.filter(a => a.status === "SUSPENDED").length;
    const totalBalance = agencies.reduce((acc, a) => acc + (a.balance || 0), 0);
    return { total, active, pending, suspended, totalBalance };
  }, [agencies]);

  // Données associées à l'agence sélectionnée
  const agencyApplications = useMemo(() => {
    if (!selectedAgency) return [];
    return applications.filter(app => app.agencyId === selectedAgency.id);
  }, [applications, selectedAgency]);

  const agencyTransactions = useMemo(() => {
    if (!selectedAgency) return [];
    return transactions.filter(t => t.agencyId === selectedAgency.id);
  }, [transactions, selectedAgency]);

  const agencyRecharges = useMemo(() => {
    if (!selectedAgency) return [];
    return rechargeRequests.filter(r => r.agencyId === selectedAgency.id);
  }, [rechargeRequests, selectedAgency]);

  // Métriques de l'agence sélectionnée
  const agencyMetrics = useMemo(() => {
    if (!selectedAgency) return { totalApps: 0, approvedApps: 0, approvalRate: 0, totalSpent: 0 };
    const totalApps = agencyApplications.length;
    const approvedApps = agencyApplications.filter(a => a.status === "Approved").length;
    const approvalRate = totalApps > 0 ? Math.round((approvedApps / totalApps) * 100) : 100;
    const totalSpent = agencyApplications.reduce((acc, a) => acc + (a.price || 0), 0);
    return { totalApps, approvedApps, approvalRate, totalSpent };
  }, [agencyApplications, selectedAgency]);

  // Sauvegarde des modifications du profil agence
  const handleSaveAgencyProfile = async () => {
    if (!selectedAgency) return;
    setIsSavingEdit(true);
    setActionNotice(null);
    try {
      await updateAgency(selectedAgency.id, editFormData);
      setSelectedAgency(prev => prev ? ({ ...prev, ...editFormData } as Agency) : null);
      setActionNotice({ type: "success", text: "Informations de l'agence mises à jour avec succès." });
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      console.error(err);
      setActionNotice({ type: "error", text: "Erreur lors de la mise à jour: " + (err.message || "Erreur serveur.") });
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Ajustement direct de solde par l'administrateur
  const handleAdjustBalance = async () => {
    if (!selectedAgency || balanceAdjustAmount <= 0 || !balanceAdjustReason.trim()) {
      setActionNotice({ type: "error", text: "Veuillez renseigner un montant supérieur à 0 et un motif administratif explicatif." });
      return;
    }

    const currentBal = selectedAgency.balance || 0;
    const diff = balanceAdjustType === "credit" ? balanceAdjustAmount : -balanceAdjustAmount;
    const newBal = Math.max(0, currentBal + diff);

    setIsAdjustingBalance(true);
    setActionNotice(null);
    try {
      await updateAgency(selectedAgency.id, { balance: newBal });
      await addTransaction({
        agencyId: selectedAgency.id,
        agencyName: selectedAgency.agencyName || selectedAgency.name || "Agence",
        type: balanceAdjustType === "credit" ? "Crédit Manuel Admin" : "Débit Manuel Admin",
        amount: balanceAdjustAmount,
        date: new Date().toISOString(),
        note: `Ajustement administratif : ${balanceAdjustReason.trim()}`,
        status: "Effectué"
      });

      setSelectedAgency(prev => prev ? ({ ...prev, balance: newBal } as Agency) : null);
      setBalanceAdjustAmount(0);
      setBalanceAdjustReason("");
      setActionNotice({ type: "success", text: `Solde de l'agence mis à jour avec succès. Nouveau solde : ${newBal.toLocaleString()} DZD` });
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      console.error(err);
      setActionNotice({ type: "error", text: "Erreur lors de l'ajustement du solde: " + (err.message || "Erreur serveur.") });
    } finally {
      setIsAdjustingBalance(false);
    }
  };

  // Application de suspension temporaire
  const handleApplySuspension = async () => {
    if (!selectedAgency || !banReason.trim()) {
      setActionNotice({ type: "error", text: "Veuillez préciser le motif administratif de la suspension." });
      return;
    }

    let bannedUntilDate: string = "";
    if (banDurationDays !== "indefinite") {
      const days = parseInt(banDurationDays, 10);
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);
      bannedUntilDate = targetDate.toISOString();
    }

    setIsBanning(true);
    setActionNotice(null);
    try {
      await updateAgency(selectedAgency.id, {
        status: "SUSPENDED",
        bannedUntil: bannedUntilDate,
        banReason: banReason.trim()
      });

      setSelectedAgency(prev => prev ? ({ 
        ...prev, 
        status: "SUSPENDED", 
        bannedUntil: bannedUntilDate, 
        banReason: banReason.trim() 
      } as Agency) : null);

      setActionNotice({ type: "success", text: "L'agence a été suspendue avec succès. Ses accès sont restreints." });
      setTimeout(() => setActionNotice(null), 5000);
    } catch (err: any) {
      console.error("Erreur suspension:", err);
      setActionNotice({ type: "error", text: "Erreur lors de la suspension: " + (err.message || "Erreur serveur.") });
    } finally {
      setIsBanning(false);
    }
  };

  // Réactivation / Levée de suspension (infaillible et instantané)
  const handleLiftSuspension = async (agencyToReactivate?: Agency | any) => {
    // Si passé via onClick direct, s'assurer que target est bien un objet Agency avec un id
    const target = (agencyToReactivate && typeof agencyToReactivate === 'object' && typeof agencyToReactivate.id === 'string' && agencyToReactivate.id)
      ? (agencyToReactivate as Agency)
      : selectedAgency;
    if (!target || !target.id) return;

    setIsBanning(true);
    setActionNotice(null);
    try {
      await updateAgency(target.id, {
        status: "ACTIVE",
        bannedUntil: "",
        banReason: ""
      });

      if (selectedAgency && selectedAgency.id === target.id) {
        setSelectedAgency(prev => prev ? ({ 
          ...prev, 
          status: "ACTIVE", 
          bannedUntil: undefined, 
          banReason: undefined 
        } as Agency) : null);
      }

      setActionNotice({
        type: "success",
        text: `La suspension de l'agence « ${target.agencyName || target.name || 'Agence'} » a été levée avec succès. Le compte est maintenant actif.`
      });
      setTimeout(() => setActionNotice(null), 5000);
    } catch (err: any) {
      console.error("Erreur réactivation:", err);
      setActionNotice({
        type: "error",
        text: "Erreur lors de la levée de suspension: " + (err.message || "Erreur serveur.")
      });
    } finally {
      setIsBanning(false);
    }
  };

  const getStatusBadge = (agency: Agency) => {
    switch (agency.status) {
      case "ACTIVE":
        return <Badge className="bg-emerald-100 text-emerald-800 border-none font-bold text-xs">{isEn ? "Active" : "Active"}</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-100 text-amber-800 border-none font-bold text-xs">{isEn ? "Awaiting Validation" : "En attente de validation"}</Badge>;
      case "SUSPENDED":
        return (
          <Badge className="bg-red-100 text-red-800 border-none font-bold text-xs flex items-center gap-1">
            <Ban className="w-3 h-3" /> {isEn ? "Suspended" : "Suspendue"}
          </Badge>
        );
      case "REJECTED":
        return <Badge className="bg-slate-200 text-slate-700 border-none font-bold text-xs">{isEn ? "Rejected" : "Rejetée"}</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-800 border-none">{agency.status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      
      {/* Bannière de notification d'action (Succès / Erreur) */}
      {actionNotice && (
        <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm border animate-in fade-in ${
          actionNotice.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
            : 'bg-red-50 border-red-300 text-red-950'
        }`}>
          <div className="flex items-center gap-2.5">
            {actionNotice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span className="text-xs font-bold">{actionNotice.text}</span>
          </div>
          <button 
            onClick={() => setActionNotice(null)}
            className="text-xs font-bold hover:underline opacity-80 cursor-pointer"
          >
            {isEn ? "Dismiss" : "Fermer"}
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* En-tête Principal                                            */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#7B1B38] uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>{isEn ? "B2B Network Management" : "Gestion Réseau B2B"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isEn ? "Partner Agencies & 360° Profiles" : "Agences Partenaires & Profils 360°"}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            {isEn 
              ? "Follow-up of dossiers, balance adjustments, corporate records (RC/NIF) and administrative sanctions."
              : "Suivi des dossiers, mouvements de solde, fiches juridiques (RC/NIF) et sanctions administratives."}
          </p>
        </div>

        <Button 
          onClick={() => setIsAddAgencyOpen(true)} 
          className="bg-[#7B1B38] text-white hover:bg-[#63142c] shadow-sm shadow-[#7B1B38]/20 font-bold rounded-xl text-xs h-11 px-5 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{isEn ? "Create Agency" : "Créer une agence"}</span>
        </Button>
      </div>

      {/* Cartes d'indicateurs clés */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {isEn ? "Total Agencies" : "Total Agences"}
          </span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">{stats.total}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
            {isEn ? "Active Agencies" : "Agences Actives"}
          </span>
          <div className="text-2xl font-black text-emerald-700 font-mono mt-1">{stats.active}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
            {isEn ? "Pending Approval" : "En Attente Validation"}
          </span>
          <div className="text-2xl font-black text-amber-700 font-mono mt-1">{stats.pending}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {isEn ? "Total B2B Balances" : "Total Soldes B2B"}
          </span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">
            {stats.totalBalance.toLocaleString()} <span className="text-xs font-bold text-slate-500">DZD</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Filtres & Recherche Rapide                                   */}
      {/* ============================================================ */}
      {/* ============================================================ */}
      {/* Filtres & Recherche Rapide                                   */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder={isEn 
              ? "Search by agency name, email, phone, trade register or manager..." 
              : "Rechercher par nom d'agence, email, téléphone, RC ou gérant..."} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 bg-slate-50 border-slate-200 text-xs rounded-xl focus:bg-white"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-56 h-10 bg-slate-50 border-slate-200 text-xs rounded-xl font-medium">
              <SelectValue placeholder={isEn ? "Filter by status" : "Filtrer par statut"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">{isEn ? "All agencies" : "Toutes les agences"}</SelectItem>
              <SelectItem value="ACTIVE" className="text-xs font-bold text-emerald-700">{isEn ? "Active only" : "Actives uniquement"}</SelectItem>
              <SelectItem value="PENDING" className="text-xs font-bold text-amber-700">{isEn ? "Awaiting approval" : "En attente d'approbation"}</SelectItem>
              <SelectItem value="SUSPENDED" className="text-xs font-bold text-red-600">{isEn ? "Suspended / Sanctioned" : "Suspendues / Sanctionnées"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Tableau des Agences                                          */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500">
              <TableRow>
                <TableHead className="py-3.5 px-4">{isEn ? "Agency & Corporate Name" : "Agence & Raison Sociale"}</TableHead>
                <TableHead className="py-3.5 px-4">{isEn ? "Legal & Manager" : "Juridique & Gérant"}</TableHead>
                <TableHead className="py-3.5 px-4">{isEn ? "Contact Info" : "Coordonnées"}</TableHead>
                <TableHead className="py-3.5 px-4 text-right">{isEn ? "Current Balance" : "Solde Actuel"}</TableHead>
                <TableHead className="py-3.5 px-4 text-center">{isEn ? "Files" : "Dossiers"}</TableHead>
                <TableHead className="py-3.5 px-4 text-center">{isEn ? "Status" : "Statut"}</TableHead>
                <TableHead className="py-3.5 px-4 text-right">{isEn ? "Actions" : "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 text-xs">
              {filteredAgencies.map((agency) => {
                const isSuspended = agency.status === "SUSPENDED";

                return (
                  <TableRow key={agency.id} className="hover:bg-slate-50/70 transition-colors">
                    <TableCell className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {agency.agencyName || agency.name || "Agence Sans Nom"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        ID: #{agency.id.substring(0, 10)}
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">
                        {agency.managerName || "Gérant non spécifié"}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        RC: <span className="font-mono font-medium">{agency.rc || agency.rcNumber || "N/A"}</span>
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{agency.email}</div>
                      <div className="text-slate-400 text-[11px]">{agency.phone || "Téléphone non renseigné"}</div>
                    </TableCell>

                    <TableCell className="py-3.5 px-4 text-right">
                      <span className="font-mono font-black text-slate-900 text-sm">
                        {(agency.balance || 0).toLocaleString()}
                      </span>{" "}
                      <span className="text-[10px] text-slate-400 font-bold">DZD</span>
                    </TableCell>

                    <TableCell className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                        {agency.applicationsCount || 0}
                      </span>
                    </TableCell>

                    <TableCell className="py-3.5 px-4 text-center">
                      {getStatusBadge(agency)}
                    </TableCell>

                    <TableCell className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isSuspended && (
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => handleLiftSuspension(agency)}
                            disabled={isBanning}
                            className="h-8 px-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 border-emerald-300 hover:bg-emerald-100 rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
                            title={isEn ? "Lift suspension immediately" : "Lever la suspension immédiatement"}
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{isBanning ? "..." : (isEn ? "Reactivate" : "Lever suspension")}</span>
                          </Button>
                        )}

                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleSelectAgency(agency, "juridique")}
                          className="h-8 px-2.5 text-xs font-bold text-slate-700 border-slate-200 hover:bg-slate-100 rounded-lg flex items-center gap-1 shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#7B1B38]" />
                          <span>Profil 360°</span>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs rounded-xl shadow-xl border-slate-200">
                            <DropdownMenuItem onClick={() => handleSelectAgency(agency, "juridique")}>
                              <Edit className="mr-2 h-3.5 w-3.5 text-slate-500" /> Modifier la fiche légale
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSelectAgency(agency, "dossiers")}>
                              <FileText className="mr-2 h-3.5 w-3.5 text-blue-600" /> Voir les dossiers soumis
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSelectAgency(agency, "finances")}>
                              <WalletCards className="mr-2 h-3.5 w-3.5 text-emerald-600" /> Ajuster le solde
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSelectAgency(agency, "sanctions")}>
                              <Ban className="mr-2 h-3.5 w-3.5 text-red-600" /> Suspendre / Sanction
                            </DropdownMenuItem>
                            
                            <div className="h-px bg-slate-100 my-1"></div>

                            {agency.status === "PENDING" && (
                              <DropdownMenuItem 
                                onClick={() => updateAgencyStatus(agency.id, "ACTIVE")} 
                                className="text-emerald-700 font-bold cursor-pointer"
                              >
                                <ShieldCheck className="mr-2 h-3.5 w-3.5" /> Approuver l'inscription
                              </DropdownMenuItem>
                            )}
                            {agency.status === "ACTIVE" && (
                              <DropdownMenuItem 
                                onClick={() => handleSelectAgency(agency, "sanctions")} 
                                className="text-amber-700 font-bold cursor-pointer"
                              >
                                <ShieldAlert className="mr-2 h-3.5 w-3.5" /> Suspendre temporairement
                              </DropdownMenuItem>
                            )}
                            {isSuspended && (
                              <DropdownMenuItem 
                                onClick={() => handleLiftSuspension(agency)} 
                                className="text-emerald-700 font-bold cursor-pointer"
                              >
                                <ShieldCheck className="mr-2 h-3.5 w-3.5 text-emerald-600" /> Lever la suspension immédiatement
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredAgencies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                    <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-slate-700">Aucune agence trouvée</p>
                    <p className="text-xs text-slate-400 mt-0.5">Essayez avec d'autres termes de recherche ou réinitialisez les filtres.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Modal Profil Détaillé 360° Agence                            */}
      {/* ============================================================ */}
      <Dialog open={!!selectedAgency} onOpenChange={(o) => !o && setSelectedAgency(null)}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-slate-50 rounded-3xl border-0 shadow-2xl max-h-[92vh] flex flex-col">
          {selectedAgency && (
            <>
              {/* Header de la Fiche Profil */}
              <div className="bg-[#7B1B38] text-white p-6 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-white/90">
                      ID: #{selectedAgency.id.substring(0, 10)}
                    </span>
                    {getStatusBadge(selectedAgency)}
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">
                    {selectedAgency.agencyName || selectedAgency.name || "Agence Partenaire"}
                  </h3>
                  <p className="text-xs text-white/80 mt-0.5">
                    Gérant : {selectedAgency.managerName || "Non spécifié"} • {selectedAgency.email} • {selectedAgency.phone || "N/A"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {(selectedAgency.status === "SUSPENDED" || selectedAgency.status === "BANNED" || Boolean(selectedAgency.bannedUntil)) && (
                    <Button
                      onClick={() => handleLiftSuspension(selectedAgency)}
                      disabled={isBanning}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 px-3.5 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer border border-emerald-400"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-100" />
                      <span>{isBanning ? "Réactivation..." : "Lever la suspension"}</span>
                    </Button>
                  )}
                  <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-right">
                    <span className="text-[10px] font-bold text-white/70 uppercase block">Solde Actuel</span>
                    <span className="text-lg font-black font-mono">
                      {(selectedAgency.balance || 0).toLocaleString()} DZD
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedAgency(null)}
                    className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation des 4 Onglets Profil */}
              <div className="bg-white border-b border-slate-200 px-6 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
                <button
                  onClick={() => setActiveProfileTab("juridique")}
                  className={`py-3.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeProfileTab === "juridique"
                      ? "border-[#7B1B38] text-[#7B1B38]"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>1. Fiche Juridique & Contact</span>
                </button>

                <button
                  onClick={() => setActiveProfileTab("dossiers")}
                  className={`py-3.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeProfileTab === "dossiers"
                      ? "border-[#7B1B38] text-[#7B1B38]"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>2. Dossiers Traités ({agencyApplications.length})</span>
                </button>

                <button
                  onClick={() => setActiveProfileTab("finances")}
                  className={`py-3.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeProfileTab === "finances"
                      ? "border-[#7B1B38] text-[#7B1B38]"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <WalletCards className="w-3.5 h-3.5" />
                  <span>3. Solde & Mouvements Financiers</span>
                </button>

                <button
                  onClick={() => setActiveProfileTab("sanctions")}
                  className={`py-3.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeProfileTab === "sanctions"
                      ? "border-red-600 text-red-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>4. Suspension & Sanctions</span>
                  {selectedAgency.status === "SUSPENDED" && (
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  )}
                </button>
              </div>

              {/* Corps de l'onglet actif */}
              <div className="p-6 overflow-y-auto flex-1 bg-white space-y-6">
                
                {/* ============================================================ */}
                {/* ONGLET 1 : FICHE JURIDIQUE & ÉDITION                         */}
                {/* ============================================================ */}
                {activeProfileTab === "juridique" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Données Administratives & Légales</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Modifiez ou validez les informations d'enregistrement officiel de l'agence.</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleSaveAgencyProfile}
                        disabled={isSavingEdit}
                        className="bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-xs rounded-xl h-9 px-4 flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSavingEdit ? "Enregistrement..." : "Sauvegarder"}</span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Nom Commercial de l'Agence</Label>
                        <Input 
                          value={editFormData.agencyName || ""} 
                          onChange={e => setEditFormData({...editFormData, agencyName: e.target.value})}
                          className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl font-bold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Raison Sociale</Label>
                        <Input 
                          value={editFormData.companyName || ""} 
                          onChange={e => setEditFormData({...editFormData, companyName: e.target.value})}
                          placeholder="SARL / EURL..."
                          className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Nom & Prénom du Gérant</Label>
                        <Input 
                          value={editFormData.managerName || ""} 
                          onChange={e => setEditFormData({...editFormData, managerName: e.target.value})}
                          className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl font-bold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Registre du Commerce (RC)</Label>
                        <Input 
                          value={editFormData.rc || ""} 
                          onChange={e => setEditFormData({...editFormData, rc: e.target.value})}
                          className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Numéro d'Identification Fiscale (NIF / NIS)</Label>
                        <Input 
                          value={editFormData.nif || ""} 
                          onChange={e => setEditFormData({...editFormData, nif: e.target.value})}
                          className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Wilaya</Label>
                        <Input 
                          value={editFormData.wilaya || ""} 
                          onChange={e => setEditFormData({...editFormData, wilaya: e.target.value})}
                          placeholder="Alger, Oran, Constantine..."
                          className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Téléphone Professionnel</Label>
                        <Input 
                          value={editFormData.phone || ""} 
                          onChange={e => setEditFormData({...editFormData, phone: e.target.value})}
                          className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Email de Contact</Label>
                        <Input 
                          value={editFormData.email || ""} 
                          onChange={e => setEditFormData({...editFormData, email: e.target.value})}
                          className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-xs font-bold text-slate-700">Adresse Physique Complète</Label>
                        <Textarea 
                          value={editFormData.address || ""} 
                          onChange={e => setEditFormData({...editFormData, address: e.target.value})}
                          placeholder="Numéro, rue, commune, code postal..."
                          rows={2}
                          className="text-xs bg-slate-50 border-slate-200 rounded-xl resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ============================================================ */}
                {/* ONGLET 2 : HISTORIQUE DES DOSSIERS TRAITÉS                   */}
                {/* ============================================================ */}
                {activeProfileTab === "dossiers" && (
                  <div className="space-y-5">
                    {/* Statistiques dossiers */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Demandes</span>
                        <span className="text-xl font-black text-slate-900">{agencyMetrics.totalApps}</span>
                      </div>
                      <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                        <span className="text-[10px] font-bold text-emerald-600 block uppercase">Approuvées</span>
                        <span className="text-xl font-black text-emerald-800">{agencyMetrics.approvedApps}</span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                        <span className="text-[10px] font-bold text-blue-600 block uppercase">Taux Succès</span>
                        <span className="text-xl font-black text-blue-800">{agencyMetrics.approvalRate}%</span>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                        <span className="text-[10px] font-bold text-purple-600 block uppercase">Volume d'Affaires</span>
                        <span className="text-xl font-black text-purple-900 font-mono">
                          {agencyMetrics.totalSpent.toLocaleString()} <span className="text-xs font-normal">DZD</span>
                        </span>
                      </div>
                    </div>

                    {/* Liste des dossiers */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <Table>
                        <TableHeader className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                          <TableRow>
                            <TableHead className="py-2.5 px-3">Réf Dossier</TableHead>
                            <TableHead className="py-2.5 px-3">Voyageur</TableHead>
                            <TableHead className="py-2.5 px-3">Prestation / Pays</TableHead>
                            <TableHead className="py-2.5 px-3 text-right">Tarif B2B</TableHead>
                            <TableHead className="py-2.5 px-3 text-center">Statut</TableHead>
                            <TableHead className="py-2.5 px-3 text-right">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="text-xs divide-y divide-slate-100">
                          {agencyApplications.map((app) => (
                            <TableRow key={app.id}>
                              <TableCell className="py-2.5 px-3 font-mono font-bold text-[#7B1B38]">
                                DOSS-{app.id.substring(0, 6).toUpperCase()}
                              </TableCell>
                              <TableCell className="py-2.5 px-3 font-bold text-slate-800">
                                {app.travelerName}
                              </TableCell>
                              <TableCell className="py-2.5 px-3 text-slate-600">
                                {app.country} ({app.serviceType})
                              </TableCell>
                              <TableCell className="py-2.5 px-3 text-right font-mono font-bold">
                                {(app.price || 0).toLocaleString()} DZD
                              </TableCell>
                              <TableCell className="py-2.5 px-3 text-center">
                                <Badge className="text-[10px] py-0.5 border-none font-bold" variant="secondary">
                                  {app.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-2.5 px-3 text-right text-slate-400 text-[11px]">
                                {app.submissionDate ? new Date(app.submissionDate).toLocaleDateString() : "N/A"}
                              </TableCell>
                            </TableRow>
                          ))}
                          {agencyApplications.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                                Aucun dossier soumis par cette agence à ce jour.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* ============================================================ */}
                {/* ONGLET 3 : GESTION DU SOLDE & MOUVEMENTS FINANCIERS          */}
                {/* ============================================================ */}
                {activeProfileTab === "finances" && (
                  <div className="space-y-6">
                    {/* Outil d'ajustement de solde par l'admin */}
                    <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div>
                          <span className="text-xs font-bold text-white/70 uppercase tracking-wider block">Portefeuille Partenaire</span>
                          <div className="text-3xl font-black font-mono mt-1">
                            {(selectedAgency.balance || 0).toLocaleString()} <span className="text-sm font-bold text-white/70">DZD</span>
                          </div>
                        </div>
                        <span className="text-xs bg-white/10 px-3 py-1 rounded-full font-bold text-white/90">
                          Ajustement Direct Administrateur
                        </span>
                      </div>

                      <div className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <Label className="text-xs font-bold text-white/90 block mb-1">Opération</Label>
                            <Select value={balanceAdjustType} onValueChange={(v: any) => setBalanceAdjustType(v)}>
                              <SelectTrigger className="h-10 bg-white text-slate-900 font-bold text-xs rounded-xl">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="credit" className="text-xs font-bold text-emerald-700">
                                  + Créditer le solde
                                </SelectItem>
                                <SelectItem value="debit" className="text-xs font-bold text-red-600">
                                  - Débiter le solde
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-xs font-bold text-white/90 block mb-1">Montant (DZD)</Label>
                            <Input 
                              type="number"
                              value={balanceAdjustAmount || ""}
                              onChange={e => setBalanceAdjustAmount(Number(e.target.value))}
                              placeholder="Ex: 50000"
                              className="h-10 bg-white text-slate-900 font-bold font-mono text-xs rounded-xl"
                            />
                          </div>

                          <div>
                            <Label className="text-xs font-bold text-white/90 block mb-1">Motif Administratif</Label>
                            <Input 
                              value={balanceAdjustReason}
                              onChange={e => setBalanceAdjustReason(e.target.value)}
                              placeholder="Ex: Virement reçu Badr Banque..."
                              className="h-10 bg-white text-slate-900 text-xs rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-1">
                          <Button 
                            onClick={handleAdjustBalance}
                            disabled={isAdjustingBalance || balanceAdjustAmount <= 0 || !balanceAdjustReason.trim()}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 px-6 rounded-xl"
                          >
                            <Save className="w-3.5 h-3.5 mr-1" />
                            <span>{isAdjustingBalance ? "Application..." : "Appliquer l'ajustement"}</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Historique des Recharges */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                        <span>Demandes de Recharges Récentes ({agencyRecharges.length})</span>
                      </h4>

                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <Table>
                          <TableHeader className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                            <TableRow>
                              <TableHead className="py-2.5 px-3">Date</TableHead>
                              <TableHead className="py-2.5 px-3 text-right">Montant (DZD)</TableHead>
                              <TableHead className="py-2.5 px-3">Note / Référence</TableHead>
                              <TableHead className="py-2.5 px-3 text-right">Statut</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="text-xs divide-y divide-slate-100">
                            {agencyRecharges.map(r => (
                              <TableRow key={r.id}>
                                <TableCell className="py-2 px-3 text-slate-500 font-medium">
                                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "N/A"}
                                </TableCell>
                                <TableCell className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                                  +{(r.amount || 0).toLocaleString()} DZD
                                </TableCell>
                                <TableCell className="py-2 px-3 text-slate-600 truncate max-w-[200px]">
                                  {r.note || "Virement bancaire standard"}
                                </TableCell>
                                <TableCell className="py-2 px-3 text-right">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    r.status === "Approved" ? "bg-emerald-100 text-emerald-800" :
                                    r.status === "Rejected" ? "bg-red-100 text-red-800" :
                                    "bg-amber-100 text-amber-800"
                                  }`}>
                                    {r.status === "Approved" ? "Validée" : r.status === "Rejected" ? "Rejetée" : "En attente"}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                            {agencyRecharges.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-6 text-slate-400">
                                  Aucune recharge enregistrée pour cette agence.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ============================================================ */}
                {/* ONGLET 4 : SUSPENSION & BANNISSEMENT TEMPORAIRE              */}
                {/* ============================================================ */}
                {activeProfileTab === "sanctions" && (
                  <div className="space-y-6">
                    {selectedAgency.status === "SUSPENDED" ? (
                      /* État Actuel : Agence Suspendue */
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                            <Ban className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-base font-black text-red-900">
                              Cette agence est actuellement suspendue
                            </h4>
                            <p className="text-xs text-red-700 mt-1">
                              Elle ne peut plus soumettre de dossiers ni utiliser ses services B2B.
                            </p>
                            {selectedAgency.bannedUntil && (
                              <p className="text-xs font-bold text-red-800 mt-2 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Suspension programmée jusqu'au : {new Date(selectedAgency.bannedUntil).toLocaleDateString()} ({new Date(selectedAgency.bannedUntil).toLocaleTimeString()})</span>
                              </p>
                            )}
                            {selectedAgency.banReason && (
                              <div className="mt-3 p-3 bg-white/80 rounded-xl border border-red-200 text-xs text-red-900">
                                <span className="font-bold block mb-0.5">Motif enregistré :</span>
                                {selectedAgency.banReason}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-red-200 flex justify-end">
                          <Button
                            onClick={() => handleLiftSuspension(selectedAgency)}
                            disabled={isBanning}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-6 rounded-xl cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4 mr-1.5" />
                            <span>{isBanning ? "Réactivation en cours..." : "Lever la suspension immédiatement"}</span>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* Formulaire de suspension temporaire */
                      <div className="space-y-5">
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                          <div className="text-xs text-amber-900">
                            <span className="font-bold block mb-0.5">Suspension ou Restriction Temporaire</span>
                            La suspension bloque immédiatement la capacité de l'agence à soumettre de nouvelles demandes ou à débiter son solde. Le motif sera affiché à l'agence lors de sa tentative d'accès.
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-800">Durée de la Suspension</Label>
                            <Select value={banDurationDays} onValueChange={setBanDurationDays}>
                              <SelectTrigger className="h-11 bg-slate-50 border-slate-200 text-xs font-bold rounded-xl">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="7" className="text-xs">7 Jours (Avertissement préliminaire)</SelectItem>
                                <SelectItem value="15" className="text-xs">15 Jours (Régularisation documentaire)</SelectItem>
                                <SelectItem value="30" className="text-xs font-bold text-orange-700">30 Jours (Sanction intermédiaire)</SelectItem>
                                <SelectItem value="60" className="text-xs font-bold text-red-700">60 Jours</SelectItem>
                                <SelectItem value="90" className="text-xs font-bold text-red-700">90 Jours</SelectItem>
                                <SelectItem value="indefinite" className="text-xs font-black text-red-900">
                                  Indéterminée (Bannissement permanent)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-800">
                              Motif Administratif Explicatif (Visible par l'agence) *
                            </Label>
                            <Textarea 
                              value={banReason}
                              onChange={e => setBanReason(e.target.value)}
                              placeholder="Ex: Documents consulaires non conformes répétés, impayé ou comportement contraire à la charte B2B..."
                              rows={3}
                              className="text-xs bg-slate-50 border-slate-200 rounded-xl resize-none"
                            />
                          </div>

                          <div className="flex justify-end pt-2">
                            <Button
                              onClick={handleApplySuspension}
                              disabled={isBanning || !banReason.trim()}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-11 px-7 rounded-xl shadow-sm shadow-red-500/20"
                            >
                              <Ban className="w-4 h-4 mr-1.5" />
                              <span>{isBanning ? "Application de la sanction..." : "Appliquer la suspension"}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ============================================================ */}
      {/* Modal Créer une Agence Manuellement                          */}
      {/* ============================================================ */}
      <Dialog open={isAddAgencyOpen} onOpenChange={setIsAddAgencyOpen}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-white rounded-3xl border-0 shadow-2xl">
          <div className="bg-[#7B1B38] text-white p-6">
            <h3 className="text-xl font-black">Ajouter une Nouvelle Agence B2B</h3>
            <p className="text-xs text-white/80 mt-1">Créez manuellement un compte partenaire opérationnel.</p>
          </div>

          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Nom Commercial de l'Agence *</Label>
                <Input 
                  value={newAgencyName} 
                  onChange={e => setNewAgencyName(e.target.value)} 
                  placeholder="Ex: Horizon Voyages" 
                  className="h-10 text-xs bg-slate-50 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Nom du Gérant / Représentant *</Label>
                <Input 
                  value={newAgencyManager} 
                  onChange={e => setNewAgencyManager(e.target.value)} 
                  placeholder="Ex: Karim Benali" 
                  className="h-10 text-xs bg-slate-50 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Registre du Commerce (RC)</Label>
                <Input 
                  value={newAgencyRc} 
                  onChange={e => setNewAgencyRc(e.target.value)} 
                  placeholder="Ex: 16/00-1234567B" 
                  className="h-10 text-xs bg-slate-50 rounded-xl font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Numéro NIF / NIS</Label>
                <Input 
                  value={newAgencyNif} 
                  onChange={e => setNewAgencyNif(e.target.value)} 
                  placeholder="Ex: 001916012345678" 
                  className="h-10 text-xs bg-slate-50 rounded-xl font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Wilaya</Label>
                <Input 
                  value={newAgencyWilaya} 
                  onChange={e => setNewAgencyWilaya(e.target.value)} 
                  placeholder="Ex: Alger, Oran..." 
                  className="h-10 text-xs bg-slate-50 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Téléphone *</Label>
                <Input 
                  value={newAgencyPhone} 
                  onChange={e => setNewAgencyPhone(e.target.value)} 
                  placeholder="+213 555 12 34 56" 
                  className="h-10 text-xs bg-slate-50 rounded-xl"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-bold text-slate-700">Email Officiel de Connexion *</Label>
                <Input 
                  type="email" 
                  value={newAgencyEmail} 
                  onChange={e => setNewAgencyEmail(e.target.value)} 
                  placeholder="contact@horizon-voyages.dz" 
                  className="h-10 text-xs bg-slate-50 rounded-xl"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-bold text-slate-700">Mot de Passe Temporaire *</Label>
                <Input 
                  type="password" 
                  value={newAgencyPwd} 
                  onChange={e => setNewAgencyPwd(e.target.value)} 
                  placeholder="Minimum 6 caractères" 
                  className="h-10 text-xs bg-slate-50 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button 
                variant="outline" 
                onClick={() => setIsAddAgencyOpen(false)}
                className="h-10 text-xs font-bold rounded-xl"
              >
                Annuler
              </Button>
              <Button 
                disabled={isAddingLoading || !newAgencyName || !newAgencyEmail || !newAgencyPwd}
                onClick={async () => {
                  setIsAddingLoading(true);
                  try {
                    const { getApp, initializeApp } = await import("firebase/app");
                    const { getAuth, createUserWithEmailAndPassword } = await import("firebase/auth");
                    const { doc, setDoc } = await import("firebase/firestore");
                    const { db } = await import("../../src/firebase");
                    
                    let secondaryApp;
                    try {
                      secondaryApp = getApp("SecondaryApp");
                    } catch(e) {
                      const firebaseConfig = getApp().options;
                      secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
                    }
                    const secondaryAuth = getAuth(secondaryApp);
                    const userCred = await createUserWithEmailAndPassword(secondaryAuth, newAgencyEmail, newAgencyPwd);
                    await setDoc(doc(db, "users", userCred.user.uid), {
                      email: newAgencyEmail,
                      role: "agency",
                      agencyName: newAgencyName,
                      managerName: newAgencyManager,
                      phone: newAgencyPhone,
                      rc: newAgencyRc,
                      nif: newAgencyNif,
                      wilaya: newAgencyWilaya,
                      address: newAgencyAddress,
                      applicationsCount: 0,
                      balance: 0,
                      status: "ACTIVE",
                      createdAt: new Date().toISOString()
                    });
                    await secondaryAuth.signOut();
                    setIsAddAgencyOpen(false);
                    alert("L'agence a été créée avec succès et activée.");
                  } catch(err: any) {
                    alert("Erreur lors de la création : " + err.message);
                  } finally {
                    setIsAddingLoading(false);
                  }
                }} 
                className="h-10 px-6 bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-xs rounded-xl"
              >
                {isAddingLoading ? "Création en cours..." : "Créer l'agence"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
