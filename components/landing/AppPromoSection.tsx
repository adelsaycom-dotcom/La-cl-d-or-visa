import React from "react";
import { motion } from "framer-motion";
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
    <section className="py-12 md:py-20 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-t border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Conteneur de l'affiche responsive avec effet d'apparition fluide et élévation au survol */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -6, transition: { duration: 0.3 } }}
          className="relative overflow-hidden rounded-3xl shadow-2xl border border-slate-200/80 bg-white transition-shadow duration-500 hover:shadow-[0_30px_60px_-15px_rgba(123,27,56,0.22)]"
        >
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
              className="w-full h-auto object-cover block mx-auto transition-transform duration-700 hover:scale-[1.015]"
            />
          </picture>
        </motion.div>

      </div>
    </section>
  );
}
