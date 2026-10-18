import { useState, useMemo } from "react";
import { useAppStore, PrestationService } from "../../src/store/useAppStore";
import { 
  Plus, Edit, Trash2, Globe2, FileText, CheckCircle2, 
  Search, AlertCircle, MapPin, List, Settings, Save, X, CreditCard, Clock,
  Copy, LayoutGrid, Table, Check, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AGENCY_SERVICES, AgencyServiceConfig } from "../../src/constants/servicesConfig";

// Référentiel des onglets du Catalogue Admin, calqué à 100% sur le Dashboard Agence
const CATALOG_TABS = [
  {
    id: "ALL",
    name: "Toutes les offres",
    badge: "Vue globale",
    description: "Toutes les prestations B2B actives et en catalogue",
    icon: Globe2,
    color: "bg-slate-100 text-slate-800 border-slate-200",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-800"
  },
  ...AGENCY_SERVICES.map(srv => ({
    id: srv.id,
    name: srv.name,
    badge: srv.badge,
    description: srv.description,
    icon: srv.icon,
    color: srv.color,
    badgeBg: srv.bgColor,
    badgeText: srv.textColor,
    matchKeys: srv.matchKeys
  }))
];

// Options de documents types recommandés pour la checklist
const DEFAULT_DOCUMENT_OPTIONS = [
  "Scan du Passeport (Page bio)",
  "Photo d'identité aux normes",
  "Billet d'avion A/R ou Réservation",
  "Réservation d'hôtel confirmée",
  "Fiche familiale / État civil",
  "Attestation de travail / Registre commerce",
  "3 Derniers relevés bancaires",
  "Attestation d'accueil ou Invitation",
  "Formulaire officiel signé",
  "Justificatif d'hébergement",
  "Copie de l'ancien visa",
  "Permis de conduire national"
];

// Liste de pays courants pour les filtres et sélections rapides
const POPULAR_DESTINATIONS = [
  "Tous les pays", "Turquie", "France", "Espagne", "Arabie Saoudite", 
  "Chine", "Émirats Arabes Unis", "Royaume-Uni", "Canada", "États-Unis", 
  "Égypte", "Russie", "Italie", "Monde"
];

export function ServiceCatalog() {
  const { services, addService, updateService, deleteService } = useAppStore();
  
  // Navigation & Filtres
  const [activeFamilyId, setActiveFamilyId] = useState<string>("ALL");
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>("Tous les pays");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Éditeur Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingNewCountry, setIsAddingNewCountry] = useState(false);
  const [customDocInput, setCustomDocInput] = useState("");

  // État du formulaire
  const [formData, setFormData] = useState<Partial<PrestationService>>({
    title: "", 
    type: "Visa B2B", 
    destination: "", 
    price: 0, 
    processingTime: "24h à 48h", 
    conditions: [""], 
    requiredDocuments: ["Scan du Passeport (Page bio)", "Photo d'identité aux normes"], 
    active: true 
  });

  // Liste de toutes les destinations existantes dans la base
  const allDestinations = useMemo(() => {
    const list = Array.from(new Set(services.map(s => s.destination).filter(Boolean)));
    POPULAR_DESTINATIONS.filter(p => p !== "Tous les pays").forEach(p => {
      if (!list.includes(p)) list.push(p);
    });
    return list.sort();
  }, [services]);

  // Fonction de correspondance rigoureuse avec les 10 services du Dashboard
  const matchesService = (s: PrestationService, tabId: string): boolean => {
    if (tabId === "ALL") return true;
    const target = AGENCY_SERVICES.find(srv => srv.id === tabId);
    if (!target) return true;
    
    const sType = (s.type || "").toLowerCase().trim();
    const sTitle = (s.title || "").toLowerCase().trim();
    const targetName = target.name.toLowerCase().trim();

    if (sType === targetName || sType === target.id) return true;
    return target.matchKeys.some(k => sType.includes(k.toLowerCase()) || sTitle.includes(k.toLowerCase()));
  };

  // Compteurs par famille pour les badges d'onglets
  const familyCounts = useMemo(() => {
    const counts: Record<string, { total: number; active: number }> = {};
    CATALOG_TABS.forEach(f => {
      if (f.id === "ALL") {
        counts["ALL"] = {
          total: services.length,
          active: services.filter(s => s.active).length
        };
      } else {
        const matches = services.filter(s => matchesService(s, f.id));
        counts[f.id] = {
          total: matches.length,
          active: matches.filter(s => s.active).length
        };
      }
    });
    return counts;
  }, [services]);

  // Prestations filtrées
  const filteredServices = useMemo(() => {
    return services.filter(s => {
      // 1. Filtre Famille (identique au dashboard)
      const matchFamily = matchesService(s, activeFamilyId);
      
      // 2. Filtre Pays
      const matchCountry = selectedCountryFilter === "Tous les pays" || s.destination === selectedCountryFilter;
      
      // 3. Filtre Statut
      const matchStatus = 
        statusFilter === "ALL" ? true :
        statusFilter === "ACTIVE" ? s.active :
        !s.active;

      // 4. Recherche textuelle
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        s.title.toLowerCase().includes(q) || 
        (s.destination && s.destination.toLowerCase().includes(q)) ||
        (s.type && s.type.toLowerCase().includes(q)) ||
        (s.processingTime && s.processingTime.toLowerCase().includes(q));

      return matchFamily && matchCountry && matchStatus && matchSearch;
    });
  }, [services, activeFamilyId, selectedCountryFilter, statusFilter, searchQuery]);

  // Statistiques globales
  const stats = useMemo(() => {
    const total = services.length;
    const active = services.filter(s => s.active).length;
    const countriesCount = new Set(services.map(s => s.destination).filter(Boolean)).size;
    const avgPrice = total > 0 ? Math.round(services.reduce((acc, s) => acc + (s.price || 0), 0) / total) : 0;
    return { total, active, countriesCount, avgPrice };
  }, [services]);

  // Actions Édition & Création
  const handleAddNew = () => {
    const activeConfig = AGENCY_SERVICES.find(s => s.id === activeFamilyId);
    const defaultType = activeConfig ? activeConfig.name : "Visa B2B";

    setFormData({ 
      title: "", 
      type: defaultType, 
      destination: selectedCountryFilter !== "Tous les pays" ? selectedCountryFilter : "Turquie", 
      price: 15000, 
      processingTime: "24h à 48h", 
      conditions: ["Passeport valide au moins 6 mois à la date d'entrée."], 
      requiredDocuments: ["Scan du Passeport (Page bio)", "Photo d'identité aux normes"], 
      active: true 
    });
    setEditingId(null);
    setIsAddingNewCountry(false);
    setIsEditorOpen(true);
  };

  const handleEdit = (s: PrestationService) => {
    setFormData({
      ...s,
      conditions: s.conditions && s.conditions.length > 0 ? s.conditions : [""],
      requiredDocuments: s.requiredDocuments || []
    });
    setEditingId(s.id);
    setIsAddingNewCountry(false);
    setIsEditorOpen(true);
  };

  const handleDuplicate = async (s: PrestationService) => {
    const duplicated: PrestationService = {
      ...s,
      id: Date.now().toString(),
      title: `${s.title} (Copie)`,
      active: true
    };
    await addService(duplicated);
  };

  const handleSave = async () => {
    if (!formData.title?.trim() || !formData.destination?.trim() || !formData.type) {
      alert("Veuillez renseigner le nom de l'offre, la destination et la famille de prestation.");
      return;
    }
        
    const cleanConditions = (formData.conditions || [])
      .map(c => c.trim())
      .filter(c => c !== "");
    
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateService(editingId, { 
          ...formData, 
          conditions: cleanConditions 
        });
      } else {
        await addService({ 
          ...formData as PrestationService, 
          id: Date.now().toString(),
          conditions: cleanConditions
        });
      }
      setIsEditorOpen(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Confirmez-vous la suppression définitive de cette prestation du catalogue ?")) {
      await deleteService(id);
    }
  };

  const toggleDocument = (docName: string) => {
    const current = formData.requiredDocuments || [];
    if (current.includes(docName)) {
      setFormData({ ...formData, requiredDocuments: current.filter(d => d !== docName) });
    } else {
      setFormData({ ...formData, requiredDocuments: [...current, docName] });
    }
  };

  const handleAddCustomDocument = () => {
    if (!customDocInput.trim()) return;
    const docName = customDocInput.trim();
    if (!formData.requiredDocuments?.includes(docName)) {
      setFormData({
        ...formData,
        requiredDocuments: [...(formData.requiredDocuments || []), docName]
      });
    }
    setCustomDocInput("");
  };

  // Trouver les métadonnées exactes de la famille selon le Dashboard
  const getCategoryMeta = (type: string, title?: string) => {
    const typeLower = (type || "").toLowerCase().trim();
    const titleLower = (title || "").toLowerCase().trim();

    const found = AGENCY_SERVICES.find(srv => 
      srv.id === typeLower ||
      srv.name.toLowerCase() === typeLower ||
      srv.matchKeys.some(k => typeLower.includes(k.toLowerCase()) || titleLower.includes(k.toLowerCase()))
    );

    if (found) {
      return {
        name: found.name,
        icon: found.icon,
        badgeBg: found.bgColor,
        badgeText: found.textColor,
        badge: found.badge
      };
    }

    return {
      name: type || "Visa B2B",
      icon: FileText,
      badgeBg: "bg-blue-50",
      badgeText: "text-blue-700",
      badge: "Standard"
    };
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      
      {/* ============================================================ */}
      {/* En-tête Principal & Statistiques Globales                    */}
      {/* ============================================================ */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Catalogue B2B & Prestations</h2>
            <span className="px-2.5 py-1 text-xs font-bold bg-[#7B1B38]/10 text-[#7B1B38] rounded-full">
              Référentiel Dashboard Agence
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Gérez vos 10 familles de services identiques au tableau de bord agence, vos barèmes tarifaires en DZD et vos documents requis.
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Bascule Grille / Tableau */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("grid")}
              title="Affichage en Grille de cartes"
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              title="Affichage en Tableau administratif"
              className={`p-2 rounded-lg transition-all ${viewMode === "table" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
            >
              <Table className="w-4 h-4" />
            </button>
          </div>

          <Button 
            onClick={handleAddNew} 
            className="bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold h-11 px-5 rounded-xl shadow-sm shadow-[#7B1B38]/20 flex items-center gap-2 text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Prestation</span>
          </Button>
        </div>
      </div>

      {/* Cartes d'indicateurs clés */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Offres Actives</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 font-mono">{stats.active}</span>
            <span className="text-xs text-slate-400">/ {stats.total} totales</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Destinations Couvertes</span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">{stats.countriesCount} <span className="text-xs text-slate-500 font-medium">pays</span></div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tarif B2B Moyen</span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">{stats.avgPrice.toLocaleString()} <span className="text-xs text-slate-500">DZD</span></div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Services Référents</span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">10 <span className="text-xs text-emerald-600 font-bold">100% Conformes</span></div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Barre d'Onglets Horizontaux : Les 10 Services du Dashboard    */}
      {/* ============================================================ */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATALOG_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeFamilyId === tab.id;
            const count = familyCounts[tab.id]?.total || 0;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveFamilyId(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isActive 
                    ? "bg-[#7B1B38] text-white shadow-sm shadow-[#7B1B38]/20" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span>{tab.name}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  isActive 
                    ? "bg-white/20 text-white" 
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* Filtres Avancés : Pays & Recherche                           */}
      {/* ============================================================ */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Recherche */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Rechercher par titre de formule, pays, délai ou condition..." 
              className="pl-10 h-10 bg-slate-50 border-slate-200 text-xs rounded-xl focus:bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtre Statut */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-full md:w-44 h-10 bg-slate-50 border-slate-200 text-xs rounded-xl font-medium">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">Tous les statuts</SelectItem>
                <SelectItem value="ACTIVE" className="text-xs font-bold text-emerald-700">Actives uniquement</SelectItem>
                <SelectItem value="INACTIVE" className="text-xs font-bold text-slate-500">Inactives (Masquées)</SelectItem>
              </SelectContent>
            </Select>

            {/* Sélecteur Pays Complet */}
            <Select value={selectedCountryFilter} onValueChange={setSelectedCountryFilter}>
              <SelectTrigger className="w-full md:w-56 h-10 bg-slate-50 border-slate-200 text-xs rounded-xl font-medium">
                <SelectValue placeholder="Filtrer par pays..." />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                <SelectItem value="Tous les pays" className="text-xs font-bold">Tous les pays</SelectItem>
                {allDestinations.map(c => (
                  <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pilules de raccourcis Pays Fréquents */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#7B1B38]" /> Destinations :
          </span>
          {POPULAR_DESTINATIONS.map(country => {
            const isSelected = selectedCountryFilter === country;
            return (
              <button
                key={country}
                onClick={() => setSelectedCountryFilter(country)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all shrink-0 ${
                  isSelected 
                    ? "bg-slate-900 text-white shadow-xs" 
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {country}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* Contenu : Affichage en Grille ou en Tableau                  */}
      {/* ============================================================ */}
      {filteredServices.length === 0 ? (
        <div className="py-20 text-center text-slate-500 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
          <Globe2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">Aucune prestation trouvée</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Aucune formule ne correspond à ce filtre. Vous pouvez créer une nouvelle prestation pour cette famille de service.
          </p>
          <Button 
            onClick={handleAddNew}
            className="mt-4 bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-xs rounded-xl"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Ajouter une prestation
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        /* VUE GRILLE DE CARTES */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map(srv => {
            const meta = getCategoryMeta(srv.type, srv.title);
            const Icon = meta.icon;

            return (
              <div 
                key={srv.id} 
                className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  srv.active 
                    ? "border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300" 
                    : "border-slate-200 opacity-60 bg-slate-50/50"
                }`}
              >
                <div>
                  {/* Carte Header */}
                  <div className="p-5 border-b border-slate-100">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${meta.badgeBg} ${meta.badgeText}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{meta.name}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${srv.active ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-200'}`}>
                          {srv.active ? "Actif" : "Masqué"}
                        </span>
                        <Switch 
                          checked={srv.active}
                          onCheckedChange={async (val) => await updateService(srv.id, { active: val })}
                        />
                      </div>
                    </div>

                    <h3 className="font-black text-base text-slate-900 leading-snug line-clamp-2">
                      {srv.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-slate-500 mt-2 text-xs font-bold">
                      <MapPin className="w-3.5 h-3.5 text-[#7B1B38]" /> 
                      <span className="text-slate-800">{srv.destination}</span>
                    </div>
                  </div>

                  {/* Carte Body */}
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-end bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Tarif B2B Débité
                        </span>
                        <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                          {srv.price?.toLocaleString()} <span className="text-xs font-bold text-slate-500">DZD</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Délai Moyen
                        </span>
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md mt-0.5">
                          <Clock className="w-3 h-3 text-[#7B1B38]" /> {srv.processingTime || "24h à 48h"}
                        </div>
                      </div>
                    </div>

                    {/* Conditions */}
                    <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/70 text-xs">
                      <div className="flex gap-2 items-start">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <p className="text-[11px] font-medium text-amber-900 line-clamp-2 leading-relaxed">
                          {srv.conditions && srv.conditions[0] ? srv.conditions[0] : "Passeport valide requis, selon exigences consulaires."}
                        </p>
                      </div>
                    </div>

                    {/* Pièces requises */}
                    {srv.requiredDocuments && srv.requiredDocuments.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-bold text-slate-700">{srv.requiredDocuments.length} pièces requises</span>
                        <span className="text-slate-400 truncate">({srv.requiredDocuments.slice(0, 2).join(", ")}...)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Carte Footer */}
                <div className="p-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between rounded-b-2xl">
                  <button 
                    onClick={() => handleDuplicate(srv)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-200/60 transition-colors"
                    title="Dupliquer cette prestation"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Dupliquer</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-slate-700 hover:text-blue-700 hover:bg-blue-50 text-xs font-bold h-8"
                      onClick={() => handleEdit(srv)}
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" /> Configurer
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                      onClick={() => handleDelete(srv.id)}
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VUE TABLEAU ADMINISTRATIF */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Prestation</th>
                  <th className="py-3 px-4">Famille (Réf Dashboard)</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4 text-right">Tarif B2B (DZD)</th>
                  <th className="py-3 px-4">Délai</th>
                  <th className="py-3 px-4 text-center">Docs Requis</th>
                  <th className="py-3 px-4 text-center">Visibilité</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredServices.map(srv => {
                  const meta = getCategoryMeta(srv.type, srv.title);
                  return (
                    <tr key={srv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{srv.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: #{srv.id.substring(0, 8)}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${meta.badgeBg} ${meta.badgeText}`}>
                          {meta.name}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {srv.destination}
                      </td>

                      <td className="py-3.5 px-4 text-right font-black font-mono text-slate-900">
                        {srv.price?.toLocaleString()} DZD
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {srv.processingTime || "24h-48h"}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 font-bold text-[11px] text-slate-700">
                          {srv.requiredDocuments?.length || 0}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <Switch 
                          checked={srv.active}
                          onCheckedChange={async (val) => await updateService(srv.id, { active: val })}
                        />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => handleDuplicate(srv)}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900"
                            title="Dupliquer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleEdit(srv)}
                            className="p-1.5 hover:bg-blue-50 rounded text-slate-500 hover:text-blue-700"
                            title="Éditer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(srv.id)}
                            className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* Modal Éditeur de Prestation Complet                          */}
      {/* ============================================================ */}
      <Dialog open={isEditorOpen} onOpenChange={(o) => !o && setIsEditorOpen(false)}>
        <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden bg-slate-50 rounded-3xl border-0 shadow-2xl max-h-[92vh] flex flex-col">
          
          {/* Header Modal */}
          <div className="bg-[#7B1B38] text-white p-6 shrink-0 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Configuration de l'Offre B2B</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black">
                {editingId ? "Modifier la Prestation" : "Créer une Nouvelle Prestation"}
              </h3>
              <p className="text-white/80 text-xs mt-1">
                Sélectionnez l'un des 10 services officiels du dashboard, le tarif B2B en DZD et les pièces à fournir.
              </p>
            </div>
            <button 
              onClick={() => setIsEditorOpen(false)} 
              className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Formulaire défilant */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
            
            {/* Bloc 1: Informations Générales & Famille */}
            <section className="space-y-4">
              <h4 className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                <Settings className="w-4 h-4 text-[#7B1B38]" /> 1. Service Référent & Destination
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Famille identique au Dashboard */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-800">Famille de Prestation (Référentiel Dashboard)</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(v: any) => setFormData({...formData, type: v})}
                  >
                    <SelectTrigger className="h-11 bg-slate-50 border-slate-200 text-xs rounded-xl font-bold">
                      <SelectValue placeholder="Choisir une famille..." />
                    </SelectTrigger>
                    <SelectContent>
                      {AGENCY_SERVICES.map(f => (
                        <SelectItem key={f.id} value={f.name} className="text-xs py-2 font-bold">
                          <div className="flex items-center gap-2">
                            <f.icon className="w-3.5 h-3.5 text-[#7B1B38]" />
                            <span>{f.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">({f.badge})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pays */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold text-slate-800">Pays (Destination)</Label>
                    <button 
                      type="button"
                      onClick={() => setIsAddingNewCountry(!isAddingNewCountry)}
                      className="text-[11px] text-blue-600 hover:underline font-bold"
                    >
                      {isAddingNewCountry ? "Choisir dans la liste" : "+ Autre pays"}
                    </button>
                  </div>
                  {isAddingNewCountry ? (
                    <Input 
                      placeholder="Saisissez le nom du pays..." 
                      value={formData.destination} 
                      onChange={e => setFormData({...formData, destination: e.target.value})}
                      className="h-11 bg-slate-50 border-slate-200 font-bold text-xs rounded-xl"
                      autoFocus
                    />
                  ) : (
                    <Select 
                      value={formData.destination} 
                      onValueChange={(v) => setFormData({...formData, destination: v})}
                    >
                      <SelectTrigger className="h-11 bg-slate-50 border-slate-200 font-bold text-xs rounded-xl">
                        <SelectValue placeholder="Choisir un pays..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {allDestinations.map(c => (
                          <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Nom / Intitulé de l'offre */}
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs font-bold text-slate-800">Intitulé Commercial de l'Offre</Label>
                  <Input 
                    placeholder="Ex: Visa Affaires 90 Jours B2B (Délivrance rapide)" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="h-11 bg-slate-50 border-slate-200 font-bold text-sm text-slate-900 rounded-xl"
                  />
                </div>
              </div>
            </section>

            {/* Bloc 2: Tarification & Délais */}
            <section className="space-y-4">
              <h4 className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                <CreditCard className="w-4 h-4 text-emerald-600" /> 2. Barème Tarifaire & Délais Consulaires
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-800">Tarif B2B Débité du Solde</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={formData.price} 
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      className="h-12 bg-slate-50 border-slate-200 pl-4 pr-16 text-xl font-black font-mono rounded-xl focus:bg-white"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <span className="font-bold text-slate-400 text-xs">DZD</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">Montant net décompté du portefeuille de l'agence partenaire.</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold text-slate-800">Délai Estimé de Traitement</Label>
                    <div className="flex gap-1 text-[10px]">
                      <button type="button" onClick={() => setFormData({...formData, processingTime: "24h à 48h"})} className="text-blue-600 hover:underline">24h</button>
                      <span>•</span>
                      <button type="button" onClick={() => setFormData({...formData, processingTime: "3 à 5 jours"})} className="text-blue-600 hover:underline">3-5j</button>
                      <span>•</span>
                      <button type="button" onClick={() => setFormData({...formData, processingTime: "7 à 10 jours"})} className="text-blue-600 hover:underline">7-10j</button>
                    </div>
                  </div>
                  <Input 
                    placeholder="Ex: 24h à 48h ouvrées" 
                    value={formData.processingTime} 
                    onChange={e => setFormData({...formData, processingTime: e.target.value})}
                    className="h-12 bg-slate-50 border-slate-200 text-xs font-bold rounded-xl"
                  />
                </div>

                {/* Conditions consulaires */}
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs font-bold text-slate-800">Consignes & Conditions Particulières</Label>
                  <Textarea 
                    placeholder="Ex: Passeport valide au moins 6 mois. Réponse et délivrance sous réserve d'acceptation par les services consulaires." 
                    value={formData.conditions?.[0] || ""}
                    onChange={e => setFormData({...formData, conditions: [e.target.value]})}
                    className="bg-slate-50 border-slate-200 min-h-[70px] text-xs rounded-xl"
                  />
                </div>
              </div>
            </section>

            {/* Bloc 3: Prérequis Documentaires */}
            <section className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                  <List className="w-4 h-4 text-purple-600" /> 3. Pièces & Documents Exigés
                </h4>
                <span className="text-[11px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full">
                  {(formData.requiredDocuments || []).length} Document(s) requis
                </span>
              </div>
              
              <p className="text-xs text-slate-500">
                Cochez les justificatifs que l'agence doit téléverser obligatoirement pour soumettre cette formule :
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                {DEFAULT_DOCUMENT_OPTIONS.map(docOpt => {
                  const isChecked = (formData.requiredDocuments || []).includes(docOpt);
                  return (
                    <div 
                      key={docOpt} 
                      onClick={() => toggleDocument(docOpt)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all border text-xs ${
                        isChecked 
                          ? 'bg-purple-50/90 border-purple-300 text-purple-900 font-bold' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/60'
                      }`}
                    >
                      <div className={`w-4 h-4 shrink-0 rounded flex items-center justify-center ${isChecked ? 'bg-purple-700 text-white' : 'bg-slate-100 border border-slate-300'}`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="truncate">{docOpt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Ajout document personnalisé */}
              <div className="flex gap-2 pt-1">
                <Input 
                  placeholder="Ajouter une autre pièce spécifique (ex: Autorisation parentale, Casier judiciaire...)"
                  value={customDocInput}
                  onChange={e => setCustomDocInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomDocument();
                    }
                  }}
                  className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddCustomDocument}
                  disabled={!customDocInput.trim()}
                  className="h-10 text-xs font-bold rounded-xl border-slate-300 shrink-0"
                >
                  Ajouter
                </Button>
              </div>
            </section>
          </div>

          {/* Footer Modal */}
          <div className="bg-slate-50 p-5 border-t border-slate-200 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2.5">
              <Switch 
                checked={formData.active} 
                onCheckedChange={v => setFormData({...formData, active: v})} 
              />
              <Label className="text-xs font-bold text-slate-700 cursor-pointer">
                Activer cette formule immédiatement sur le portail B2B
              </Label>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditorOpen(false)} 
                className="font-bold border-slate-200 text-xs h-10 px-5 rounded-xl"
              >
                Annuler
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSubmitting} 
                className="font-bold text-xs h-10 px-7 bg-[#7B1B38] hover:bg-[#63142c] text-white rounded-xl shadow-sm shadow-[#7B1B38]/20"
              >
                <Save className="w-4 h-4 mr-1.5" /> 
                {isSubmitting ? "Enregistrement..." : "Enregistrer la Prestation"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
