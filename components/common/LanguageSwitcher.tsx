import React from "react";
import { useLanguage } from "../../src/i18n/LanguageContext";

/**
 * Drapeaux vectoriels SVG haute fidélité (100% compatibles Windows, Android, iOS, macOS, Linux).
 * Aucune dépendance sur les polices emojis système (qui échouent sur Windows et Android).
 */
export function FlagFR({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 512 512" 
      className={`inline-block shrink-0 rounded-full overflow-hidden shadow-xs ring-1 ring-black/10 ${className}`}
      aria-hidden="true"
    >
      <path fill="#002654" d="M0 0h170.7v512H0z" />
      <path fill="#ffffff" d="M170.7 0h170.6v512H170.7z" />
      <path fill="#ce1126" d="M341.3 0H512v512H341.3z" />
    </svg>
  );
}

export function FlagGB({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 512 512" 
      className={`inline-block shrink-0 rounded-full overflow-hidden shadow-xs ring-1 ring-black/10 ${className}`}
      aria-hidden="true"
    >
      <path fill="#012169" d="M0 0h512v512H0z" />
      <path fill="#FFF" d="M60 0l196 193L452 0h60v53L316 256l196 203v53h-60L256 319 60 512H0v-53l196-203L0 53V0h60z" />
      <path fill="#C8102E" d="M339 307l173 170v35l-208-205h35zm-124-99L42 38V3l208 205h-35zm124 0L512 38V3L304 208h35zM0 477l173-170h35L0 512v-35z" />
      <path fill="#FFF" d="M200 0h112v512H200zM0 200h512v112H0z" />
      <path fill="#C8102E" d="M221 0h70v512h-70zM0 221h512v70H0z" />
    </svg>
  );
}

interface LanguageSwitcherProps {
  variant?: "outline" | "ghost" | "glass" | "pill";
  className?: string;
  showLabels?: boolean;
}

/**
 * Commutateur de langue B2B ultra-moderne et ergonomique :
 * - Commutation en 1 seul clic
 * - Drapeaux ronds SVG haute précision (zéro emoji système, compatible 100% Windows/Android)
 * - Indicateur actif avec badge contrasté et accent de marque Clé d'Or (#7B1B38)
 * - Structure HTML purement valide (zéro imbrication de button, pas de dropdown instable)
 */
export function LanguageSwitcher({ 
  variant = "outline", 
  className = "",
  showLabels = true
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const isGlass = variant === "glass";

  return (
    <div 
      className={`inline-flex items-center p-1 rounded-2xl transition-all duration-200 select-none ${
        isGlass 
          ? "bg-white/10 border border-white/20 backdrop-blur-md shadow-xs" 
          : "bg-slate-100/95 border border-slate-200/90 shadow-inner"
      } ${className}`}
      role="radiogroup"
      aria-label="Choix de langue / Language toggle"
    >
      {/* Bouton Français */}
      <button
        type="button"
        role="radio"
        aria-checked={language === "fr"}
        onClick={() => setLanguage("fr")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
          language === "fr"
            ? isGlass
              ? "bg-white text-slate-900 shadow-md scale-[1.02]"
              : "bg-white text-[#7B1B38] shadow-sm border border-slate-200/80 scale-[1.02]"
            : isGlass
              ? "text-white/70 hover:text-white hover:bg-white/5"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
        }`}
        title="Passer en Français"
      >
        <FlagFR className="w-4 h-4 shadow-2xs" />
        {showLabels && <span className="tracking-wide">FR</span>}
      </button>

      {/* Séparateur élégant */}
      <span className={`h-3 w-px mx-0.5 ${isGlass ? "bg-white/20" : "bg-slate-300/80"}`} />

      {/* Bouton Anglais */}
      <button
        type="button"
        role="radio"
        aria-checked={language === "en"}
        onClick={() => setLanguage("en")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
          language === "en"
            ? isGlass
              ? "bg-white text-slate-900 shadow-md scale-[1.02]"
              : "bg-white text-[#7B1B38] shadow-sm border border-slate-200/80 scale-[1.02]"
            : isGlass
              ? "text-white/70 hover:text-white hover:bg-white/5"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
        }`}
        title="Switch to English"
      >
        <FlagGB className="w-4 h-4 shadow-2xs" />
        {showLabels && <span className="tracking-wide">EN</span>}
      </button>
    </div>
  );
}
