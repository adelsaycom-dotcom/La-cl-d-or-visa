import { Logo } from "@/components/Logo";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function LandingFooter() {
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
              La plateforme B2B de référence en Algérie pour le traitement automatisé des visas, voyages et séjours linguistiques des agences partenaires.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-md bg-[#7B1B38]/10 border border-[#7B1B38]/25 text-[#7B1B38] text-xs font-bold">
                Accès Réservé aux Professionnels du Tourisme
              </span>
            </div>
          </div>

          {/* Col 2: Support Téléphonique */}
          <div className="space-y-4">
            <h4 className="text-slate-900 font-bold text-base uppercase tracking-wider">Ligne Agences B2B</h4>
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

          {/* Col 3: Coordonnées & Siège */}
          <div className="space-y-4">
            <h4 className="text-slate-900 font-bold text-base uppercase tracking-wider">Siège & Courriel</h4>
            <div className="space-y-3 text-sm">
              <a href="mailto:la.cle.dor.visa.b2b@gmail.com" className="flex items-start gap-3 text-slate-700 hover:text-[#7B1B38] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#7B1B38] shrink-0 mt-0.5 shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="break-all font-semibold">la.cle.dor.visa.b2b@gmail.com</span>
              </a>
              <div className="flex items-start gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#7B1B38] shrink-0 mt-0.5 shadow-sm">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="leading-relaxed">Rue Ali Khodja, Bordj El Kiffan, Alger, Algérie</span>
              </div>
            </div>
          </div>

          {/* Col 4: Canaux & Inscription */}
          <div className="space-y-4">
            <h4 className="text-slate-900 font-bold text-base uppercase tracking-wider">Canaux Officiels</h4>
            <div className="flex flex-wrap gap-2">
              <a 
                href="https://whatsapp.com/channel/0029VbBSSDgKGGGQ2mCZwF0z" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 flex items-center justify-center transition-colors shadow-sm"
                title="WhatsApp Channel"
              >
                <MessageCircle className="w-5 h-5" />
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
                <span>Rejoindre le Réseau d'Agences</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} La Clé d'Or B2B. Tous droits réservés.
          </div>
          <div className="flex gap-6">
            <span className="hover:text-slate-800 transition-colors">Plateforme Sécurisée SSL 256-bit</span>
            <span>•</span>
            <span className="hover:text-slate-800 transition-colors">Conforme aux Réglementations IATA & Consulaires</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
