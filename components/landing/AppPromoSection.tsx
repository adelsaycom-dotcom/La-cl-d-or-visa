import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../src/i18n/LanguageContext";

export function AppPromoSection() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const desktopWebp = isEn
    ? "/assets/banners/desk-en.webp"
    : "/assets/banners/desk-fr.webp";
  const desktopSrc = isEn
    ? "/assets/banners/desk-en.png"
    : "/assets/banners/desk-fr.png";

  const mobileWebp = isEn
    ? "/assets/banners/mob-en.webp"
    : "/assets/banners/mob-fr.webp";
  const mobileSrc = isEn
    ? "/assets/banners/mob-en.png"
    : "/assets/banners/mob-fr.png";

  const altText = isEn
    ? "La Clé d'Or App - Another meaning of Tourism"
    : "Application La Clé d'Or - Une autre signification du Tourisme";

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-t border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
          className="relative overflow-hidden rounded-3xl shadow-2xl border border-slate-200/80 bg-white transition-shadow duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_30px_60px_-15px_rgba(102,25,21,0.24)] will-change-transform"
        >
          <picture className="w-full h-auto block">
            <source media="(min-width: 768px)" srcSet={desktopWebp} type="image/webp" />
            <source media="(min-width: 768px)" srcSet={desktopSrc} />
            <source srcSet={mobileWebp} type="image/webp" />
            <img
              src={mobileSrc}
              alt={altText}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover block mx-auto transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.015] will-change-transform"
            />
          </picture>
        </motion.div>
      </div>
    </section>
  );
}
