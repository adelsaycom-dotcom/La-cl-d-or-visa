import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Clock, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  X, 
  ChevronRight,
  Globe2
} from "lucide-react";
import { Link } from "react-router-dom";

export interface CountryVisaInfo {
  id: string;
  name: string;
  flag: string;
  category: "automated" | "consular";
  categoryLabel: string;
  processingTime: string;
  validity: string;
  b2bPrice: string;
  imgUrl: string;
  visaTypes: {
    title: string;
    duration: string;
    entry: string;
    priceDzd: string;
  }[];
  requiredDocs: string[];
  notes?: string;
}

const COUNTRIES_CATALOG: CountryVisaInfo[] = [
  // E-Visas & Traitements Rapides
  {
    id: "turquie",
    name: "Turquie",
    flag: "🇹🇷",
    category: "automated",
    categoryLabel: "E-Visa Automatisé",
    processingTime: "24h - 48h",
    validity: "180 jours (Séjour 30 jours)",
    b2bPrice: "12 500 DZD",
    imgUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80",
    visaTypes: [
      { title: "E-Visa Tourisme (Single/Multiple)", duration: "30 jours", entry: "Simple entrée", priceDzd: "12 500 DZD" },
      { title: "Dossier Visa Consulaire Sticker", duration: "90 jours", entry: "Entrées multiples", priceDzd: "18 000 DZD" }
    ],
    requiredDocs: [
      "Scan passeport en cours de validité (min. 6 mois)",
      "Photo d'identité récente fond blanc",
      "Billet d'avion A/R ou réservation",
      "Attestation ou visa Schengen/USA valide (pour e-visa direct selon conditions)"
    ],
    notes: "Délivrance électronique officielle sous format PDF directement téléchargeable."
  },
  {
    id: "dubai",
    name: "Émirats Arabes Unis (Dubaï)",
    flag: "🇦🇪",
    category: "automated",
    categoryLabel: "E-Visa Express",
    processingTime: "24h - 72h",
    validity: "60 jours après émission",
    b2bPrice: "18 500 DZD",
    imgUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
    visaTypes: [
      { title: "Visa Touristique 30 Jours", duration: "30 jours", entry: "Simple entrée", priceDzd: "18 500 DZD" },
      { title: "Visa Touristique 60 Jours", duration: "60 jours", entry: "Simple entrée", priceDzd: "32 000 DZD" },
      { title: "Visa Multi-Entrées 30 Jours", duration: "30 jours", entry: "Multi-entrées", priceDzd: "42 000 DZD" }
    ],
    requiredDocs: [
      "Copie passeport couleur haute définition",
      "Photo d'identité fond blanc nette (format JPEG)",
      "Titre de séjour ou réservation hôtelière"
    ],
    notes: "Traitement express prioritaire possible sous 12 heures."
  },
  {
    id: "malaisie",
    name: "Malaisie",
    flag: "🇲🇾",
    category: "automated",
    categoryLabel: "E-Visa Direct",
    processingTime: "48h - 72h",
    validity: "3 mois (Séjour 30 jours)",
    b2bPrice: "14 000 DZD",
    imgUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80",
    visaTypes: [
      { title: "e-Visa Tourisme", duration: "30 jours", entry: "Simple entrée", priceDzd: "14 000 DZD" },
      { title: "MDAC (Malaysia Digital Arrival Card)", duration: "Par voyage", entry: "Obligatoire", priceDzd: "2 500 DZD" }
    ],
    requiredDocs: [
      "Page biométrique du passeport (valide > 6 mois)",
      "Photo d'identité aux normes ICAO (35x50mm)",
      "Preuve d'hébergement ou réservation d'hôtel",
      "Plan de vol confirmé aller-retour"
    ]
  },
  {
    id: "thailande",
    name: "Thaïlande",
    flag: "🇹🇭",
    category: "automated",
    categoryLabel: "E-Visa & Assistance",
    processingTime: "3 à 5 jours ouvrés",
    validity: "60 jours de séjour",
    b2bPrice: "16 500 DZD",
    imgUrl: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80",
    visaTypes: [
      { title: "Tourist Visa (TR)", duration: "60 jours", entry: "Simple entrée", priceDzd: "16 500 DZD" },
      { title: "Thailand Digital Pass Assistance", duration: "Par voyage", entry: "Simple entrée", priceDzd: "4 000 DZD" }
    ],
    requiredDocs: [
      "Passeport valide au moins 6 mois",
      "Photo couleur récente",
      "Relevé de compte bancaire des 3 derniers mois",
      "Réservation billet d'avion et hébergement"
    ]
  },
  {
    id: "omra",
    name: "Arabie Saoudite (Omra & Tourisme)",
    flag: "🇸🇦",
    category: "automated",
    categoryLabel: "E-Visa Rapide",
    processingTime: "24h - 48h",
    validity: "1 an (Multi-entrées, 90j/séjour)",
    b2bPrice: "28 000 DZD",
    imgUrl: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=600&q=80",
    visaTypes: [
      { title: "E-Visa Touristique / Omra", duration: "90 jours cumulés", entry: "Multi-entrées (1 an)", priceDzd: "28 000 DZD" },
      { title: "Visa Transit 96h", duration: "96 heures", entry: "Simple entrée", priceDzd: "8 500 DZD" }
    ],
    requiredDocs: [
      "Scan passeport valide",
      "Photo d'identité avec fond blanc",
      "Assurance médicale obligatoire (incluse dans les frais officiels)"
    ]
  },

  // Dossiers Consulaires, Prise de Rendez-vous & Dépôt
  {
    id: "france",
    name: "France (Schengen)",
    flag: "🇫🇷",
    category: "consular",
    categoryLabel: "RDV Consulaire & Dossier",
    processingTime: "10 à 20 jours",
    validity: "Selon décision consulaire",
    b2bPrice: "22 000 DZD",
    imgUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
    visaTypes: [
      { title: "Court Séjour Tourisme (Type C)", duration: "1 à 90 jours", entry: "Selon visa", priceDzd: "22 000 DZD" },
      { title: "Court Séjour Affaires", duration: "1 à 90 jours", entry: "Simple/Multiple", priceDzd: "24 000 DZD" },
      { title: "Dossier Études Campus France", duration: "Long séjour", entry: "Multiple", priceDzd: "26 000 DZD" }
    ],
    requiredDocs: [
      "Passeport original + copies de tous les visas antérieurs",
      "Formulaire France-Visas officiel complété et signé",
      "Attestation de travail / Registre de commerce & C20",
      "Relevés bancaires des 6 derniers mois cachetés",
      "Réservation d'hôtel confirmée ou attestation d'accueil",
      "Assurance voyage Schengen (30 000 € min.)"
    ],
    notes: "Assistance complète : Remplissage France-Visas, prise de RDV TLScontact, audit de solvabilité."
  },
  {
    id: "espagne",
    name: "Espagne (Schengen)",
    flag: "🇪🇸",
    category: "consular",
    categoryLabel: "RDV Consulaire BLS",
    processingTime: "10 à 15 jours",
    validity: "Selon décision consulaire",
    b2bPrice: "21 000 DZD",
    imgUrl: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=600&q=80",
    visaTypes: [
      { title: "Court Séjour Tourisme BLS", duration: "90 jours max", entry: "Selon décision", priceDzd: "21 000 DZD" },
      { title: "Affaires / Foire commerciale", duration: "90 jours max", entry: "Multiple", priceDzd: "23 000 DZD" }
    ],
    requiredDocs: [
      "Passeport en cours de validité (2 pages vierges)",
      "Formulaire BLS Espagne vérifié",
      "Justificatifs professionnels et de ressources financières",
      "Réservation vol aller-retour et hébergement"
    ]
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
    category: "consular",
    categoryLabel: "Portail IRCC & Biométrie",
    processingTime: "15 à 35 jours",
    validity: "Jusqu'à expiration du passeport",
    b2bPrice: "28 000 DZD",
    imgUrl: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=600&q=80",
    visaTypes: [
      { title: "Visa de Résident Temporaire (VRT)", duration: "Jusqu'à 10 ans", entry: "Multi-entrées", priceDzd: "28 000 DZD" },
      { title: "Permis d'Études Canada", duration: "Durée du cursus", entry: "Multi-entrées", priceDzd: "38 000 DZD" }
    ],
    requiredDocs: [
      "Passeport valide",
      "Lettre explicative de voyage détaillée",
      "Preuves de liens avec le pays d'origine (travail, patrimoine, famille)",
      "Capacité financière solide (relevés bancaires en devises et DZD)"
    ],
    notes: "Création et suivi complet sur le portail sécurisé IRCC Canada."
  },
  {
    id: "royaume-uni",
    name: "Royaume-Uni (UK)",
    flag: "🇬🇧",
    category: "consular",
    categoryLabel: "Portail TLScontact / UKVI",
    processingTime: "15 à 21 jours",
    validity: "6 mois, 2 ans, 5 ans ou 10 ans",
    b2bPrice: "26 000 DZD",
    imgUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80",
    visaTypes: [
      { title: "Standard Visitor Visa (6 Mois)", duration: "6 mois", entry: "Multi-entrées", priceDzd: "26 000 DZD" },
      { title: "Visitor Visa Longue Durée (2 Ans)", duration: "2 ans", entry: "Multi-entrées", priceDzd: "45 000 DZD" }
    ],
    requiredDocs: [
      "Passeport en cours de validité",
      "Traduction assermentée en anglais de tous les justificatifs",
      "Relevés de comptes et fiches de paie / registre de commerce",
      "Itinéraire de séjour"
    ]
  }
];

interface CountriesSectionProps {
  initialSearchQuery?: string;
  selectedCountryName?: string;
}

export function CountriesSection({ initialSearchQuery = "", selectedCountryName = "" }: CountriesSectionProps) {
  const [activeTab, setActiveTab] = useState<"all" | "automated" | "consular">("all");
  const [searchFilter, setSearchFilter] = useState(initialSearchQuery || selectedCountryName);
  const [selectedCountry, setSelectedCountry] = useState<CountryVisaInfo | null>(null);

  const filteredCountries = useMemo(() => {
    return COUNTRIES_CATALOG.filter((c) => {
      const matchesCategory = activeTab === "all" || c.category === activeTab;
      const matchesSearch = 
        !searchFilter ||
        c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        c.categoryLabel.toLowerCase().includes(searchFilter.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchFilter]);

  return (
    <section id="destinations" className="py-24 md:py-32 bg-white text-slate-900 relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Globe2 className="w-4 h-4 text-amber-600" />
              Catalogue B2B Ouvert
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Destinations & Tarifs Agences
            </h2>
            <p className="mt-3 text-slate-600 max-w-xl text-base">
              Accédez aux conditions consulaires à jour, vérifiez la liste des pièces 
              exigées et soumettez vos dossiers aux tarifs B2B négociés.
            </p>
          </div>

          {/* Search bar inside section */}
          <div className="w-full md:w-80">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filtrer une destination..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Filters in Light Mode */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "all"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            Toutes les Destinations ({COUNTRIES_CATALOG.length})
          </button>
          <button
            onClick={() => setActiveTab("automated")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "automated"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            E-Visas Automatisés (24h-72h)
          </button>
          <button
            onClick={() => setActiveTab("consular")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "consular"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Visas Consulaires & Rendez-vous
          </button>
        </div>

        {/* Countries Grid in Light Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCountries.map((country) => (
            <div
              key={country.id}
              onClick={() => setSelectedCountry(country)}
              className="group bg-white rounded-3xl border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
            >
              {/* Photo & Badge */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={country.imgUrl}
                  alt={country.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                
                {/* Flag + Country Name */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl drop-shadow">{country.flag}</span>
                    <span className="font-black text-lg text-white drop-shadow-md">{country.name}</span>
                  </div>
                </div>

                {/* Badge Top Left */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md ${
                    country.category === "automated" 
                      ? "bg-emerald-500 text-white" 
                      : "bg-blue-600 text-white"
                  }`}>
                    {country.category === "automated" ? "E-Visa Rapide" : "Dossier Consulaire"}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Délai de traitement :
                    </span>
                    <span className="text-slate-900 font-bold">{country.processingTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      Validité :
                    </span>
                    <span className="text-slate-900 font-bold truncate max-w-[150px]">{country.validity}</span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Tarif Agence B2B</div>
                    <div className="text-base font-black text-amber-600">{country.b2bPrice}</div>
                  </div>
                  <span className="text-xs text-slate-700 group-hover:text-amber-600 font-bold flex items-center gap-1 transition-colors">
                    Détails <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Country Details & Checklist (Light Mode) */}
        <AnimatePresence>
          {selectedCountry && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-900"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedCountry.flag}</span>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">{selectedCountry.name}</h3>
                      <div className="text-xs text-amber-600 font-bold">{selectedCountry.categoryLabel}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCountry(null)}
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Summary badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Délai Moyen</div>
                      <div className="text-sm font-black text-slate-900 mt-0.5">{selectedCountry.processingTime}</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Validité</div>
                      <div className="text-sm font-black text-slate-900 mt-0.5">{selectedCountry.validity}</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Tarif B2B</div>
                      <div className="text-sm font-black text-amber-600 mt-0.5">{selectedCountry.b2bPrice}</div>
                    </div>
                  </div>

                  {/* Visa options breakdown */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                      Types de Visas Pris en Charge
                    </h4>
                    <div className="space-y-2">
                      {selectedCountry.visaTypes.map((v, i) => (
                        <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-slate-900">{v.title}</div>
                            <div className="text-xs text-slate-500">{v.duration} • {v.entry}</div>
                          </div>
                          <div className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                            {v.priceDzd}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Required Documents Checklist */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                      Pièces Exigées pour le Dossier Client
                    </h4>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                      {selectedCountry.requiredDocs.map((doc, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Operational Note */}
                  {selectedCountry.notes && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{selectedCountry.notes}</span>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">
                    Connectez-vous pour déposer ce dossier instantanément.
                  </span>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setSelectedCountry(null)}
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors w-full sm:w-auto"
                    >
                      Fermer
                    </button>
                    <Link
                      to="/login"
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm"
                    >
                      <span>Traiter dans mon Espace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
