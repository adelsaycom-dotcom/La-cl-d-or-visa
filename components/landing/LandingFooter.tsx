import { Phone, Mail, Facebook, Instagram, Youtube, MessageCircle, ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../../src/i18n/LanguageContext";

const easeFluid = [0.22, 1, 0.36, 1] as const;

export function LandingFooter() {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <footer id="contact" className="bg-slate-100 pt-14 sm:pt-16">
      {/* Conteneur bordeaux exact (#661915 identique au logo et à l'icône) aux coins supérieurs arrondis */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.75, ease: easeFluid }}
        className="bg-[#661915] text-white rounded-t-[2rem] md:rounded-t-[2.75rem] relative shadow-2xl will-change-transform"
      >
        {/* Icône carrée arrondie centrée chevauchant le bord supérieur */}
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.05, ease: easeFluid }}
            className="-mt-10 sm:-mt-11 will-change-transform"
          >
            <Link
              to="/"
              aria-label="La Clé d'Or Travel B2B"
              className="block group focus:outline-none"
            >
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-[1.4rem] bg-white shadow-xl shadow-black/25 overflow-hidden flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 will-change-transform">
                <img
                  src="/assets/aistudio/fichier_source_lacledor-32_550f0870.png"
                  alt="La Clé d'Or B2B"
                  width={88}
                  height={88}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain scale-[1.06]"
                />
              </div>
            </Link>
          </motion.div>

          {/* Logo version sombre (blanc) affiché en entier sans aucun rognage */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.12, ease: easeFluid }}
            className="mt-3 flex justify-center w-full px-4 will-change-transform"
          >
            <img
              src="/assets/aistudio/lacledor-15_4320ba91.svg"
              alt="Powered By La Clé d'Or Travel"
              width={709}
              height={499}
              loading="lazy"
              decoding="async"
              className="h-36 sm:h-44 w-auto max-w-full object-contain -my-10 sm:-my-12 pointer-events-none select-none"
            />
          </motion.div>
        </div>

        {/* Contenu principal avec toutes les informations officielles d'origine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, delay: 0.16, ease: easeFluid }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10 relative z-10 will-change-transform"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/15">
            {/* Col 1 : Bio & Accréditation */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#F3D58D]">
                {isEn ? "About La Clé d'Or B2B" : "À propos"}
              </h4>
              <p className="text-sm text-white/85 leading-relaxed">
                {isEn
                  ? "Algeria's premier B2B platform for automated visa processing, travel logistics, and study abroad services for partner agencies."
                  : "La plateforme B2B de référence en Algérie pour le traitement automatisé des visas, voyages et séjours linguistiques des agences partenaires."}
              </p>
              <a
                href="#localisation"
                className="inline-flex items-center gap-2 text-xs text-white/80 hover:text-white transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#F3D58D] shrink-0" />
                <span>Bordj El Kiffan, Alger, Algérie</span>
              </a>
              <div className="pt-1">
                <span className="inline-block px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-bold">
                  {isEn
                    ? "Strictly Reserved for Tourism Professionals"
                    : "Accès Réservé aux Professionnels du Tourisme"}
                </span>
              </div>
            </div>

            {/* Col 2 : Ligne Agences B2B */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#F3D58D]">
                {isEn ? "Agency B2B Phone Lines" : "Ligne Agences B2B"}
              </h4>
              <div className="space-y-2.5 text-sm">
                <a
                  href="tel:0562101719"
                  className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 group-hover:bg-white group-hover:text-[#661915] flex items-center justify-center text-[#F3D58D] shrink-0 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="font-bold tabular-nums tracking-wide">0562 10 17 19</span>
                </a>
                <a
                  href="tel:0560127255"
                  className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 group-hover:bg-white group-hover:text-[#661915] flex items-center justify-center text-[#F3D58D] shrink-0 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="font-bold tabular-nums tracking-wide">0560 12 72 55</span>
                </a>
                <a
                  href="tel:0557629519"
                  className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 group-hover:bg-white group-hover:text-[#661915] flex items-center justify-center text-[#F3D58D] shrink-0 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="font-bold tabular-nums tracking-wide">0557 62 95 19</span>
                </a>
              </div>
            </div>

            {/* Col 3 : Courriels Professionnels */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#F3D58D]">
                {isEn ? "Professional Inquiries" : "Courriels Professionnels"}
              </h4>
              <div className="space-y-2 text-xs">
                <a
                  href="mailto:manager@lacledortravel.com"
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-white/8 hover:bg-white/15 border border-white/12 transition-all group"
                  title={isEn ? "General Management" : "Direction Générale"}
                >
                  <div className="w-7 h-7 rounded-lg bg-white/12 text-[#F3D58D] flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-white/70 font-semibold uppercase leading-none">
                      {isEn ? "Management" : "Direction"}
                    </span>
                    <span className="font-bold text-white truncate mt-0.5">
                      manager@lacledortravel.com
                    </span>
                  </div>
                </a>

                <a
                  href="mailto:contact@lacledortravel.com"
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-white/8 hover:bg-white/15 border border-white/12 transition-all group"
                  title={isEn ? "Agency Contact" : "Contact & Agences"}
                >
                  <div className="w-7 h-7 rounded-lg bg-white/12 text-[#F3D58D] flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-white/70 font-semibold uppercase leading-none">
                      {isEn ? "Partnerships" : "Contact & Agences"}
                    </span>
                    <span className="font-bold text-white truncate mt-0.5">
                      contact@lacledortravel.com
                    </span>
                  </div>
                </a>

                <a
                  href="mailto:finance@lacledortravel.com"
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-white/8 hover:bg-white/15 border border-white/12 transition-all group"
                  title={isEn ? "Invoicing & Finance" : "Facturation & Finance"}
                >
                  <div className="w-7 h-7 rounded-lg bg-white/12 text-[#F3D58D] flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-white/70 font-semibold uppercase leading-none">
                      {isEn ? "Billing & Finance" : "Facturation & Finance"}
                    </span>
                    <span className="font-bold text-white truncate mt-0.5">
                      finance@lacledortravel.com
                    </span>
                  </div>
                </a>

                <a
                  href="mailto:support@lacledortravel.com"
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-white/8 hover:bg-white/15 border border-white/12 transition-all group"
                  title={isEn ? "Platform Support" : "Support Plateforme"}
                >
                  <div className="w-7 h-7 rounded-lg bg-white/12 text-[#F3D58D] flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-white/70 font-semibold uppercase leading-none">
                      {isEn ? "Tech Support" : "Support Plateforme"}
                    </span>
                    <span className="font-bold text-white truncate mt-0.5">
                      support@lacledortravel.com
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Col 4 : Canaux Officiels & Inscription */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#F3D58D]">
                {isEn ? "Official Channels" : "Canaux Officiels"}
              </h4>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://whatsapp.com/channel/0029VbBSSDgKGGGQ2mCZwF0z"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 hover:bg-white hover:text-[#661915] text-white flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                  title="Canal WhatsApp"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@la.cle.dor.travel?_r=1&_t=ZN-9AaEuk5XTL4"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 hover:bg-white hover:text-[#661915] text-white flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                  title="TikTok Officiel"
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.81 4.47 6.27 6.27 0 0 0 1.86-4.47V8.91a8.18 8.18 0 0 0 4.79 1.52V7c-.29 0-.58-.1-.87-.31z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/share/18iGHDJaCt/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 hover:bg-white hover:text-[#661915] text-white flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                  title="Facebook"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/la.cle.dor.travel?igsh=MWM5ZWdxN2plYTZoZQ=="
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 hover:bg-white hover:text-[#661915] text-white flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com/@la.cle.dor.travel.service?si=fUybLNNYxjrAxtV1"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 hover:bg-white hover:text-[#661915] text-white flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                  title="YouTube"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>

              <div className="pt-2 space-y-2.5">
                <Link
                  to="/register"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-[#F9F9F9] text-[#661915] font-extrabold text-xs transition-all shadow-lg hover:-translate-y-0.5"
                >
                  <span>{isEn ? "Join Agency Network" : "Rejoindre le Réseau d'Agences"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Barre inférieure */}
          <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/75">
            <div>
              &copy; {new Date().getFullYear()} La Clé d&apos;Or B2B.{" "}
              {isEn ? "All rights reserved." : "Tous droits réservés."}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
              <span className="hover:text-white transition-colors">
                {isEn ? "SSL 256-Bit Encrypted Platform" : "Plateforme Sécurisée SSL 256-bit"}
              </span>
              <span aria-hidden="true">•</span>
              <span className="hover:text-white transition-colors">
                {isEn
                  ? "IATA & Consular Standards Compliant"
                  : "Conforme aux Réglementations IATA & Consulaires"}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
