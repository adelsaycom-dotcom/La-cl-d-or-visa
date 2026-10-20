import { Logo } from "@/components/Logo";
import { Phone, Mail, Facebook, Instagram, Youtube, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../src/i18n/LanguageContext";

export function LandingFooter() {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <footer id="contact" className="bg-slate-100 text-slate-700 border-t-4 border-[#7B1B38] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-200">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="inline-block bg-white p-2.5 rounded-xl shadow-sm border border-slate-200">
              <Logo />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isEn
                ? "Algeria's premier B2B platform for automated visa processing, travel logistics, and study abroad services for partner agencies."
                : "La plateforme B2B de référence en Algérie pour le traitement automatisé des visas, voyages et séjours linguistiques des agences partenaires."}
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-md bg-[#7B1B38]/10 border border-[#7B1B38]/25 text-[#7B1B38] text-xs font-bold">
                {isEn ? "Strictly Reserved for Tourism Professionals" : "Accès Réservé aux Professionnels du Tourisme"}
              </span>
            </div>
          </div>

          {/* Col 2: Support Téléphonique */}
          <div className="space-y-4">
            <h4 className="text-slate-900 font-bold text-base uppercase tracking-wider">
              {isEn ? "Agency B2B Phone Lines" : "Ligne Agences B2B"}
            </h4>
            <div className="space-y-2.5 text-sm">
              <a href="tel:0562101719" className="flex items-center gap-3 text-slate-700 hover:text-[#7B1B38] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#7B1B38] shrink-0 shadow-sm">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900">0562 10 17 19</span>
              </a>
              <a href="tel:0560127255" className="flex items-center gap-3 text-slate-700 hover:text-[#7B1B38] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#7B1B38] shrink-0 shadow-sm">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900">0560 12 72 55</span>
              </a>
              <a href="tel:0557629519" className="flex items-center gap-3 text-slate-700 hover:text-[#7B1B38] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#7B1B38] shrink-0 shadow-sm">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900">0557 62 95 19</span>
              </a>
            </div>
          </div>

          {/* Col 3: Courriels Professionnels */}
          <div className="space-y-4">
            <h4 className="text-slate-900 font-bold text-base uppercase tracking-wider">
              {isEn ? "Professional Inquiries" : "Courriels Professionnels"}
            </h4>
            <div className="space-y-2 text-xs">
              <a 
                href="mailto:manager@lacledortravel.com" 
                className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#7B1B38] hover:border-[#7B1B38]/40 transition-all shadow-xs group"
                title={isEn ? "General Management" : "Direction Générale"}
              >
                <div className="w-6 h-6 rounded-lg bg-[#7B1B38]/10 text-[#7B1B38] flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase leading-none">
                    {isEn ? "Management" : "Direction"}
                  </span>
                  <span className="font-bold text-slate-900 group-hover:text-[#7B1B38] truncate mt-0.5">manager@lacledortravel.com</span>
                </div>
              </a>

              <a 
                href="mailto:contact@lacledortravel.com" 
                className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#7B1B38] hover:border-[#7B1B38]/40 transition-all shadow-xs group"
                title={isEn ? "Agency Contact" : "Contact & Agences"}
              >
                <div className="w-6 h-6 rounded-lg bg-[#7B1B38]/10 text-[#7B1B38] flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase leading-none">
                    {isEn ? "Partnerships" : "Contact & Agences"}
                  </span>
                  <span className="font-bold text-slate-900 group-hover:text-[#7B1B38] truncate mt-0.5">contact@lacledortravel.com</span>
                </div>
              </a>

              <a 
                href="mailto:finance@lacledortravel.com" 
                className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#7B1B38] hover:border-[#7B1B38]/40 transition-all shadow-xs group"
                title={isEn ? "Invoicing & Finance" : "Facturation & Finance"}
              >
                <div className="w-6 h-6 rounded-lg bg-[#7B1B38]/10 text-[#7B1B38] flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase leading-none">
                    {isEn ? "Billing & Finance" : "Facturation & Finance"}
                  </span>
                  <span className="font-bold text-slate-900 group-hover:text-[#7B1B38] truncate mt-0.5">finance@lacledortravel.com</span>
                </div>
              </a>

              <a 
                href="mailto:support@lacledortravel.com" 
                className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#7B1B38] hover:border-[#7B1B38]/40 transition-all shadow-xs group"
                title={isEn ? "Platform Support" : "Support Plateforme"}
              >
                <div className="w-6 h-6 rounded-lg bg-[#7B1B38]/10 text-[#7B1B38] flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase leading-none">
                    {isEn ? "Tech Support" : "Support Plateforme"}
                  </span>
                  <span className="font-bold text-slate-900 group-hover:text-[#7B1B38] truncate mt-0.5">support@lacledortravel.com</span>
                </div>
              </a>
            </div>
          </div>

          {/* Col 4: Canaux Officiels & Inscription */}
          <div className="space-y-4">
            <h4 className="text-slate-900 font-bold text-base uppercase tracking-wider">
              {isEn ? "Official Channels" : "Canaux Officiels"}
            </h4>
            <div className="flex flex-wrap gap-2">
              <a 
                href="https://whatsapp.com/channel/0029VbBSSDgKGGGQ2mCZwF0z" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 flex items-center justify-center transition-colors shadow-sm"
                title="Canal WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@la.cle.dor.travel?_r=1&_t=ZN-9AaEuk5XTL4" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-slate-900 hover:bg-slate-900 text-slate-700 hover:text-white flex items-center justify-center transition-all shadow-sm"
                title="TikTok Officiel"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.81 4.47 6.27 6.27 0 0 0 1.86-4.47V8.91a8.18 8.18 0 0 0 4.79 1.52V7c-.29 0-.58-.1-.87-.31z" />
                </svg>
              </a>
              <a 
                href="https://www.facebook.com/share/18iGHDJaCt/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-colors shadow-sm"
                title="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/la.cle.dor.travel?igsh=MWM5ZWdxN2plYTZoZQ==" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-pink-500 hover:bg-pink-50 text-slate-600 hover:text-pink-600 flex items-center justify-center transition-colors shadow-sm"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com/@la.cle.dor.travel.service?si=fUybLNNYxjrAxtV1" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-red-500 hover:bg-red-50 text-slate-600 hover:text-red-600 flex items-center justify-center transition-colors shadow-sm"
                title="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            <div className="pt-2">
              <Link
                to="/register"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-xs transition-colors shadow-md shadow-[#7B1B38]/20"
              >
                <span>{isEn ? "Join Agency Network" : "Rejoindre le Réseau d'Agences"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} La Clé d'Or B2B. {isEn ? "All rights reserved." : "Tous droits réservés."}
          </div>
          <div className="flex gap-6">
            <span className="hover:text-slate-800 transition-colors">
              {isEn ? "SSL 256-Bit Encrypted Platform" : "Plateforme Sécurisée SSL 256-bit"}
            </span>
            <span>•</span>
            <span className="hover:text-slate-800 transition-colors">
              {isEn ? "IATA & Consular Standards Compliant" : "Conforme aux Réglementations IATA & Consulaires"}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
