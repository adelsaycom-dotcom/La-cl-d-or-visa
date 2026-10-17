import { useState } from "react";
import { 
  MapPin, 
  ExternalLink, 
  Clock, 
  Building2, 
  Navigation2, 
  Check, 
  Copy,
  Car,
  Compass
} from "lucide-react";

export function LocationSection() {
  const [copied, setCopied] = useState(false);
  const locationUrl = "https://maps.app.goo.gl/yn9aApV68iC2jVC26";
  const addressText = "Rue Ali Khodja, Bordj El Kiffan, Alger, Algérie";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(addressText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="localisation" className="py-20 bg-slate-50/80 border-t border-slate-200/80 scroll-mt-20 relative overflow-hidden">
      {/* Background subtle dotted grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "radial-gradient(#7B1B38 0.75px, transparent 0.75px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7B1B38]/10 text-[#7B1B38] text-xs font-bold uppercase tracking-wider mb-3.5 border border-[#7B1B38]/20">
            <MapPin className="w-3.5 h-3.5 text-[#7B1B38]" />
            <span>Siège & Accueil Partenaires</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Notre Localisation & <span className="text-[#7B1B38]">Siège Officiel</span>
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Dépôt physique des passeports, retrait des visas validés et accueil privilégié de nos agences de voyages partenaires à Alger.
          </p>
        </div>

        {/* 2-Columns Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Interactive Mini-Map */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-xl shadow-slate-200/50 flex flex-col justify-between overflow-hidden group">
            
            <div className="relative w-full h-[340px] sm:h-[400px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              {/* Google Maps Embed iframe */}
              <iframe
                title="Localisation La Clé d'Or Visa"
                src="https://maps.google.com/maps?q=36.7465302,3.1901569&hl=fr&z=16&output=embed"
                className="w-full h-full border-0 filter saturate-105"
                loading="lazy"
                allowFullScreen
              />

              {/* Floating Badge on Map */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200 flex items-center gap-2.5 pointer-events-none">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B1B38] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#7B1B38]"></span>
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-none">La Clé d'Or Visa</p>
                  <p className="text-[10px] text-slate-500 font-medium leading-none mt-1">Bordj El Kiffan, Alger</p>
                </div>
              </div>

              {/* Floating Quick Action over map on mobile/desktop */}
              <div className="absolute bottom-3 right-3">
                <a
                  href={locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-800 text-xs font-bold shadow-md hover:shadow-lg border border-slate-200 transition-all hover:text-[#7B1B38]"
                >
                  <Compass className="w-3.5 h-3.5 text-[#7B1B38]" />
                  <span>Agrandir</span>
                </a>
              </div>
            </div>

            {/* Sub-bar below map */}
            <div className="pt-3 px-2 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Navigation2 className="w-3.5 h-3.5 text-[#7B1B38]" />
                Coordonnées GPS : 36.7465° N, 3.1902° E
              </span>
              <span className="hidden sm:inline font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                ● Agence ouverte aux professionnels
              </span>
            </div>

          </div>

          {/* Right Column: Address Details & Direct Action Button */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
            
            <div className="space-y-6">
              
              <div className="border-b border-slate-100 pb-5">
                <div className="flex items-center gap-2.5 text-xs font-bold text-[#7B1B38] uppercase tracking-wider mb-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>Agence Centrale & Dépôt B2B</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  La Clé d'Or Visa & Services
                </h3>
              </div>

              {/* Address with copy button */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Adresse Postale
                </span>
                <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-5 h-5 text-[#7B1B38] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-snug">
                        Rue Ali Khodja
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5 font-medium">
                        Bordj El Kiffan, Wilaya d'Alger, Algérie
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyAddress}
                    type="button"
                    title="Copier l'adresse"
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:border-[#7B1B38] text-slate-600 hover:text-[#7B1B38] transition-all shrink-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Horaires de Réception des Agences
                </span>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#7B1B38]" />
                      Du Samedi au Jeudi :
                    </span>
                    <span className="text-slate-900 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                      08h30 – 17h00
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 font-medium">
                    <span>Vendredi :</span>
                    <span className="text-rose-600 font-bold">Fermé (Permanence Urgences)</span>
                  </div>
                </div>
              </div>

              {/* Practical information */}
              <div className="p-3.5 rounded-xl bg-[#7B1B38]/5 border border-[#7B1B38]/15 flex items-start gap-3">
                <Car className="w-4 h-4 text-[#7B1B38] shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  <strong>Stationnement & Accès :</strong> Possibilité de stationnement à proximité immédiate pour les coursiers et agents déposant des lots de passeports.
                </p>
              </div>

            </div>

            {/* Direct Google Maps Action Button requested by user */}
            <div className="pt-6 border-t border-slate-100 mt-6 space-y-2">
              <a
                href={locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-sm transition-all shadow-lg shadow-[#7B1B38]/25 hover:shadow-xl hover:shadow-[#7B1B38]/30 group"
              >
                <Navigation2 className="w-4 h-4 text-white transition-transform group-hover:translate-x-0.5" />
                <span>Ouvrir dans Google Maps</span>
                <ExternalLink className="w-4 h-4 text-white/80 ml-0.5" />
              </a>

              <p className="text-center text-[11px] text-slate-400 font-medium">
                Ouvre directement l'itinéraire GPS sur votre application mobile ou navigateur
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
