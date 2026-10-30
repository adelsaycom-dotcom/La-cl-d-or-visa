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
import { motion } from "framer-motion";
import { useLanguage } from "../../src/i18n/LanguageContext";

export function LocationSection() {
  const [copied, setCopied] = useState(false);
  const { language } = useLanguage();
  const isEn = language === "en";

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
        
        {/* Section Header with reveal animation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7B1B38]/10 text-[#7B1B38] text-xs font-bold uppercase tracking-wider mb-3.5 border border-[#7B1B38]/20">
            <MapPin className="w-3.5 h-3.5 text-[#7B1B38]" />
            <span>{isEn ? "Headquarters & Partner Reception" : "Siège & Accueil Partenaires"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isEn ? "Our Location & " : "Notre Localisation & "}
            <span className="text-[#7B1B38]">{isEn ? "Official Headquarters" : "Siège Officiel"}</span>
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            {isEn
              ? "Physical passport drop-off, collection of validated visas, and private front-desk reception for partner travel agencies in Algiers."
              : "Dépôt physique des passeports, retrait des visas validés et accueil privilégié de nos agences de voyages partenaires à Alger."}
          </p>
        </motion.div>

        {/* 2-Columns Card Grid with Staggered Entrance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Interactive Mini-Map */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-xl shadow-slate-200/50 flex flex-col justify-between overflow-hidden group"
          >
            
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
                  <span>{isEn ? "Open in Maps" : "Agrandir"}</span>
                </a>
              </div>
            </div>

            {/* Sub-bar below map */}
            <div className="pt-3 px-2 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Navigation2 className="w-3.5 h-3.5 text-[#7B1B38]" />
                {isEn ? "GPS Coordinates:" : "Coordonnées GPS :"} 36.7465° N, 3.1902° E
              </span>
              <span className="hidden sm:inline font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {isEn ? "Easy Access (Tramway & Highway)" : "Accès rapide Tramway & Rocade"}
              </span>
            </div>
          </motion.div>

          {/* Right Column: Physical Address & Agency Reception Details */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-between gap-6"
          >
            
            {/* Main Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xl shadow-slate-200/50 space-y-6">
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {isEn ? "Agency Reception Desk" : "Bureau Central B2B"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isEn ? "Exclusive drop-off desk for accredited agencies" : "Guichet dédié au dépôt physique de vos passeports"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#7B1B38]/10 text-[#7B1B38] flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>

              {/* Address with copy button */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>{isEn ? "Official Address" : "Adresse Officielle"}</span>
                  <button
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7B1B38] hover:underline cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">{isEn ? "Copied!" : "Copié !"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isEn ? "Copy" : "Copier"}</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm font-semibold text-slate-900 leading-snug">
                  {addressText}
                </p>
              </div>

              {/* Working Hours */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-900">
                  <Clock className="w-4 h-4 text-[#7B1B38]" />
                  <span>{isEn ? "Opening & Reception Hours" : "Horaires de Réception des Agences"}</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600 pl-6 border-l-2 border-[#7B1B38]/30">
                  <div className="flex justify-between">
                    <span className="font-medium">{isEn ? "Saturday – Wednesday" : "Samedi – Mercredi"}</span>
                    <span className="font-bold text-slate-900">08:30 – 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">{isEn ? "Thursday" : "Jeudi"}</span>
                    <span className="font-bold text-slate-900">08:30 – 15:30</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>{isEn ? "Friday" : "Vendredi"}</span>
                    <span>{isEn ? "Closed (Weekly Break)" : "Fermé (Repos hebdomadaire)"}</span>
                  </div>
                </div>
              </div>

              {/* Quick perks for agency visitors */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3 text-[11px] text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-[#7B1B38]" />
                  <span>{isEn ? "Easy Parking" : "Stationnement facile"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isEn ? "Instant Delivery Receipt" : "Récépissé immédiat"}</span>
                </div>
              </div>

            </div>

            {/* Direct Google Maps Action CTA Card */}
            <a
              href={locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 rounded-3xl bg-[#7B1B38] hover:bg-[#63142c] text-white shadow-xl shadow-[#7B1B38]/25 transition-all flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-white/80">
                  {isEn ? "Need Directions?" : "Besoin d'un itinéraire ?"}
                </p>
                <p className="text-base font-bold text-white flex items-center gap-1.5">
                  <span>{isEn ? "Open in Google Maps" : "Ouvrir dans Google Maps"}</span>
                  <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                <Navigation2 className="w-5 h-5" />
              </div>
            </a>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
