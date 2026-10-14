import { useState } from "react";
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker, 
  Line, 
  ZoomableGroup 
} from "react-simple-maps";
import { 
  Globe2, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Plane
} from "lucide-react";
import { Link } from "react-router-dom";

// Standard geographic TopoJSON dataset from Natural Earth
const GEO_URL = "/countries-110m.json";

export interface Destination {
  id: string;
  name: string;
  flag: string;
  city: string;
  // Longitude, Latitude for geoMercator / geoEqualEarth projection
  coordinates: [number, number];
  category: "evisa" | "schengen" | "consular";
  categoryLabel: string;
  processingTime: string;
  b2bPrice: string;
  validity: string;
  highlight: string;
  requirements: string[];
}

const DESTINATIONS: Destination[] = [
  {
    id: "france",
    name: "France",
    flag: "🇫🇷",
    city: "Paris",
    coordinates: [2.3522, 48.8566],
    category: "schengen",
    categoryLabel: "Espace Schengen (TLScontact)",
    processingTime: "10 à 20 jours",
    b2bPrice: "22 000 DZD",
    validity: "Selon décision consulaire",
    highlight: "Audit anti-rejet + Formulaire France-Visas officiel",
    requirements: ["Passeport original", "Relevés bancaires 6 mois", "Attestation de travail / RC", "Assurance voyage 30 000€"]
  },
  {
    id: "espagne",
    name: "Espagne",
    flag: "🇪🇸",
    city: "Madrid",
    coordinates: [-3.7038, 40.4168],
    category: "schengen",
    categoryLabel: "Espace Schengen (BLS)",
    processingTime: "10 à 15 jours",
    b2bPrice: "21 000 DZD",
    validity: "Selon décision consulaire",
    highlight: "Prise de rendez-vous BLS & contrôle dossier",
    requirements: ["Formulaire BLS vérifié", "Justificatifs financiers", "Réservation hôtel & vol"]
  },
  {
    id: "italie",
    name: "Italie",
    flag: "🇮🇹",
    city: "Rome",
    coordinates: [12.4964, 41.9028],
    category: "schengen",
    categoryLabel: "Espace Schengen (VFS)",
    processingTime: "10 à 15 jours",
    b2bPrice: "21 000 DZD",
    validity: "Selon décision consulaire",
    highlight: "Dossier tourisme & affaires VFS",
    requirements: ["Passeport", "Relevés bancaires", "Assurance Schengen 30 000€"]
  },
  {
    id: "turquie",
    name: "Turquie",
    flag: "🇹🇷",
    city: "Istanbul",
    coordinates: [28.9784, 41.0082],
    category: "evisa",
    categoryLabel: "E-Visa Automatisé",
    processingTime: "24h - 48h",
    b2bPrice: "12 500 DZD",
    validity: "180 jours (30j séjour)",
    highlight: "Délivrance électronique officielle directe",
    requirements: ["Passeport valide > 6 mois", "Photo fond blanc", "Billet A/R"]
  },
  {
    id: "dubai",
    name: "Émirats (Dubaï)",
    flag: "🇦🇪",
    city: "Dubaï",
    coordinates: [55.2708, 25.2048],
    category: "evisa",
    categoryLabel: "E-Visa Express",
    processingTime: "24h - 72h",
    b2bPrice: "18 500 DZD",
    validity: "60 jours après émission",
    highlight: "Traitement prioritaire 12h-24h possible",
    requirements: ["Scan passeport HD couleur", "Photo d'identité nette", "Réservation hôtel"]
  },
  {
    id: "arabie",
    name: "Arabie Saoudite",
    flag: "🇸🇦",
    city: "Riyad / Jeddah",
    coordinates: [46.7137, 24.7136],
    category: "evisa",
    categoryLabel: "E-Visa Tourisme & Omra",
    processingTime: "24h - 48h",
    b2bPrice: "28 000 DZD",
    validity: "1 an (Multi-entrées, 90j)",
    highlight: "Assurance médicale consulaire incluse",
    requirements: ["Scan passeport valide", "Photo fond blanc", "Traitement instantané"]
  },
  {
    id: "malaisie",
    name: "Malaisie",
    flag: "🇲🇾",
    city: "Kuala Lumpur",
    coordinates: [101.6869, 3.1390],
    category: "evisa",
    categoryLabel: "E-Visa Direct",
    processingTime: "48h - 72h",
    b2bPrice: "14 000 DZD",
    validity: "3 mois (30j séjour)",
    highlight: "Génération automatique MDAC incluse",
    requirements: ["Scan passeport valide", "Photo aux normes ICAO", "Réservation vol & hôtel"]
  },
  {
    id: "thailande",
    name: "Thaïlande",
    flag: "🇹🇭",
    city: "Bangkok",
    coordinates: [100.5018, 13.7563],
    category: "evisa",
    categoryLabel: "E-Visa Touristique",
    processingTime: "3 à 5 jours",
    b2bPrice: "16 500 DZD",
    validity: "60 jours de séjour",
    highlight: "Assistance déclaration numérique",
    requirements: ["Passeport > 6 mois", "Relevé bancaire 3 mois", "Billet d'avion A/R"]
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
    city: "Montréal",
    coordinates: [-73.5673, 45.5017],
    category: "consular",
    categoryLabel: "Portail Fédéral IRCC",
    processingTime: "15 à 30 jours",
    b2bPrice: "28 000 DZD",
    validity: "Jusqu'à 10 ans",
    highlight: "Constitution de dossier biométrique",
    requirements: ["Passeport valide", "Attestation de liens socio-économiques", "Solvabilité financière"]
  },
  {
    id: "royaume-uni",
    name: "Royaume-Uni",
    flag: "🇬🇧",
    city: "Londres",
    coordinates: [-0.1276, 51.5072],
    category: "consular",
    categoryLabel: "Visa UKVI TLScontact",
    processingTime: "15 à 21 jours",
    b2bPrice: "26 000 DZD",
    validity: "6 mois à 2 ans",
    highlight: "Traduction assermentée & téléversement",
    requirements: ["Passeport", "Justificatifs traduits en anglais", "Preuves d'attaches professionnelles"]
  }
];

// Algiers Headquarters Coordinates [Longitude, Latitude]
const ALGIERS_COORDS: [number, number] = [3.0588, 36.7538];

export function InteractiveMapSection() {
  const [selectedDestId, setSelectedDestId] = useState<string>("france");
  const [filterCategory, setFilterCategory] = useState<"all" | "evisa" | "schengen" | "consular">("all");
  const [zoomPosition, setZoomPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [20, 32],
    zoom: 1.4,
  });

  const selectedDest = DESTINATIONS.find((d) => d.id === selectedDestId) || DESTINATIONS[0];

  const filteredDests = DESTINATIONS.filter((d) => {
    if (filterCategory === "all") return true;
    return d.category === filterCategory;
  });

  const handleZoomIn = () => {
    if (zoomPosition.zoom >= 4) return;
    setZoomPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.3 }));
  };

  const handleZoomOut = () => {
    if (zoomPosition.zoom <= 1) return;
    setZoomPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.3 }));
  };

  const handleResetZoom = () => {
    setZoomPosition({ coordinates: [20, 32], zoom: 1.4 });
  };

  const handleSelectDestination = (dest: Destination) => {
    setSelectedDestId(dest.id);
  };

  return (
    <section id="carte-mondiale" className="py-20 md:py-28 bg-slate-50 text-slate-900 relative border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Globe2 className="w-4 h-4 text-amber-600" />
            Cartographie Réelle B2B
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Explorez Nos Liaisons & Visas sur la Carte
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Véritable carte géographique interactive des liaisons aériennes depuis Alger. 
            Cliquez sur un pays pour consulter les conditions consulaires, délais et tarifs B2B.
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filterCategory === "all"
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Toutes les liaisons ({DESTINATIONS.length})
          </button>
          <button
            onClick={() => setFilterCategory("evisa")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              filterCategory === "evisa"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            E-Visas Express 24h-72h
          </button>
          <button
            onClick={() => setFilterCategory("schengen")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              filterCategory === "schengen"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Espace Schengen (Europe)
          </button>
          <button
            onClick={() => setFilterCategory("consular")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              filterCategory === "consular"
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Canada & Royaume-Uni
          </button>
        </div>

        {/* Map + Details Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Map Box */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-3 sm:p-5 shadow-xl relative overflow-hidden">
            
            {/* Map Top Bar */}
            <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span className="font-bold text-slate-900">Hub Central : Alger, Algérie</span>
              </div>

              {/* Map Zoom Controls */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 shadow-xs"
                  title="Zoomer"
                  aria-label="Zoomer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 shadow-xs"
                  title="Dézoomer"
                  aria-label="Dézoomer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 shadow-xs"
                  title="Réinitialiser la vue"
                  aria-label="Réinitialiser la vue"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Geographical Map Canvas with Real World TopoJSON */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[16/9] bg-gradient-to-b from-sky-50/60 to-slate-50 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing border border-slate-100">
              <ComposableMap
                projection="geoEqualEarth"
                projectionConfig={{
                  scale: 160,
                }}
                className="w-full h-full"
              >
                <ZoomableGroup
                  zoom={zoomPosition.zoom}
                  center={zoomPosition.coordinates}
                  onMoveEnd={(position) => setZoomPosition(position)}
                >
                  {/* Real World Geographies from Natural Earth */}
                  <Geographies geography={GEO_URL}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const isAlgeria = geo.properties.name === "Algeria";
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={isAlgeria ? "#fef3c7" : "#f1f5f9"}
                            stroke={isAlgeria ? "#d97706" : "#cbd5e1"}
                            strokeWidth={isAlgeria ? 1.2 : 0.6}
                            style={{
                              default: { outline: "none" },
                              hover: { fill: "#e2e8f0", outline: "none" },
                              pressed: { outline: "none" },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>

                  {/* Flight Lines connecting Algiers to Destinations */}
                  {filteredDests.map((dest) => {
                    const isSelected = dest.id === selectedDestId;
                    return (
                      <Line
                        key={`line-${dest.id}`}
                        from={ALGIERS_COORDS}
                        to={dest.coordinates}
                        stroke={isSelected ? "#d97706" : "#94a3b8"}
                        strokeWidth={isSelected ? 2.5 : 1.2}
                        strokeDasharray={isSelected ? "5 3" : "3 3"}
                        strokeLinecap="round"
                      />
                    );
                  })}

                  {/* Algiers HQ Marker */}
                  <Marker coordinates={ALGIERS_COORDS}>
                    <g className="cursor-pointer">
                      <circle r={6} fill="#d97706" />
                      <circle r={12} stroke="#d97706" strokeWidth={1.5} fill="none" opacity={0.6} className="animate-ping" />
                      <text
                        textAnchor="middle"
                        y={-12}
                        style={{
                          fontFamily: "system-ui",
                          fill: "#0f172a",
                          fontSize: "8px",
                          fontWeight: "800",
                        }}
                      >
                        🇩🇿 Alger (HQ)
                      </text>
                    </g>
                  </Marker>

                  {/* Destination Markers */}
                  {filteredDests.map((dest) => {
                    const isSelected = dest.id === selectedDestId;
                    const isEvisa = dest.category === "evisa";

                    return (
                      <Marker
                        key={`marker-${dest.id}`}
                        coordinates={dest.coordinates}
                        onClick={() => handleSelectDestination(dest)}
                      >
                        <g className="cursor-pointer group">
                          {/* Outer node glow */}
                          <circle
                            r={isSelected ? 8 : 5}
                            fill={isSelected ? "#d97706" : isEvisa ? "#10b981" : "#2563eb"}
                            stroke="#ffffff"
                            strokeWidth={1.8}
                          />

                          {/* Flag and City Label */}
                          <text
                            textAnchor="middle"
                            y={-10}
                            style={{
                              fontFamily: "system-ui",
                              fill: isSelected ? "#b45309" : "#334155",
                              fontSize: isSelected ? "9px" : "7.5px",
                              fontWeight: isSelected ? "900" : "700",
                              userSelect: "none",
                            }}
                          >
                            {dest.flag} {dest.city}
                          </text>
                        </g>
                      </Marker>
                    );
                  })}
                </ZoomableGroup>
              </ComposableMap>
            </div>

            {/* Quick Country Buttons Strip */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Sélection rapide :</span>
              {filteredDests.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => handleSelectDestination(dest)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    dest.id === selectedDestId
                      ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                      : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{dest.flag}</span>
                  <span>{dest.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Destination Details Panel */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xl space-y-6">
            
            {/* Header info */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-4xl drop-shadow-sm">{selectedDest.flag}</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">{selectedDest.name}</h3>
                <span className={`inline-block mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  selectedDest.category === "evisa"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-blue-100 text-blue-800"
                }`}>
                  {selectedDest.categoryLabel}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Tarif Agence B2B</span>
                <span className="text-xl font-black text-amber-600">{selectedDest.b2bPrice}</span>
              </div>
            </div>

            {/* Processing and Validity metrics */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Délai moyen
                </div>
                <div className="text-sm font-black text-slate-900 mt-1">{selectedDest.processingTime}</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Validité
                </div>
                <div className="text-sm font-black text-slate-900 mt-1 truncate">{selectedDest.validity}</div>
              </div>
            </div>

            {/* Key feature highlight */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{selectedDest.highlight}</span>
            </div>

            {/* Checklist */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
                <span>Documents requis pour le client</span>
                <span className="text-slate-400 font-normal">Checklist</span>
              </h4>
              <ul className="space-y-2">
                {selectedDest.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct Action in Console */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <Link
                to="/login"
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <span>Traiter ce Visa dans l'Espace Pro</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#destinations"
                className="w-full py-2 text-center text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors block"
              >
                Voir la checklist détaillée dans le catalogue ↓
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
