import React from "react";
import { useLanguage } from "../../src/i18n/LanguageContext";

export function AppPromoSection() {
  const { language } = useLanguage();
  const isEn = language === "en";

  // Sélection dynamique selon la langue active
  const desktopSrc = isEn
    ? "/assets/banners/desk-en.png"
    : "/assets/banners/desk-fr.png";

  const mobileSrc = isEn
    ? "/assets/banners/mob-en.png"
    : "/assets/banners/mob-fr.png";

  const altText = isEn
    ? "La Clé d'Or App - Another meaning of Tourism"
    : "Application La Clé d'Or - Une autre signification du Tourisme";

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Conteneur de l'affiche responsive avec ombre et bordure soignée */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-slate-200/80 bg-white transition-all hover:shadow-[0_25px_50px_-12px_rgba(123,27,56,0.15)]">
          <picture className="w-full h-auto block">
            {/* Version Bureau / Tablette large (>= 768px) */}
            <source
              media="(min-width: 768px)"
              srcSet={desktopSrc}
            />
            {/* Version Mobile (< 768px) par défaut */}
            <img
              src={mobileSrc}
              alt={altText}
              loading="lazy"
              className="w-full h-auto object-cover block mx-auto transition-transform duration-500 hover:scale-[1.01]"
            />
          </picture>
        </div>

      </div>
    </section>
  );
}
