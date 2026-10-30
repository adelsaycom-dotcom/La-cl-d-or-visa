import { useState } from "react";
import { ChevronDown, HelpCircle, PhoneCall, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../src/i18n/LanguageContext";

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { language } = useLanguage();
  const isEn = language === "en";

  const faqs = isEn ? [
    {
      q: "How does registration work for travel agencies?",
      a: "Registration is fast and 100% free. Fill out the application form with your agency details and Trade Register (RC) / License number. Our team validates your profile within 24 business hours to grant certified B2B access."
    },
    {
      q: "How are payments handled and how do we top up our wallet?",
      a: "All financial transactions are conducted in Algerian Dinars (DZD). Top up your agency wallet via bank wire, postal CCP deposit, or counter payment. Once your receipt is verified, your balance is credited and applications are debited automatically."
    },
    {
      q: "Which destinations and visa categories do you support?",
      a: "We support 35+ global destinations: direct E-Visas (Turkey, Dubai / UAE, Malaysia, Thailand, Saudi Arabia / Umrah, etc.) as well as full consular applications with appointment booking for Schengen nations (France, Spain, Italy...), Canada, UK, and USA."
    },
    {
      q: "What happens if a client application contains an error or missing document?",
      a: "Our consular compliance desk runs a systematic pre-check prior to any official lodgement. If a file is incomplete or non-compliant, your agency receives an immediate alert with clear guidance to fix it before submission."
    },
    {
      q: "Do you offer priority support for urgent traveler files?",
      a: "Yes. As a verified partner agency, you receive a direct phone hotline and priority WhatsApp channel to track urgent or VIP files."
    }
  ] : [
    {
      q: "Comment fonctionne l'inscription pour les agences de voyages ?",
      a: "L'inscription est simple et 100% gratuite. Vous remplissez le formulaire avec les coordonnées de votre agence et votre numéro de Registre de Commerce (RC). Notre équipe valide votre profil sous 24h ouvrées et active vos accès B2B."
    },
    {
      q: "Comment s'effectuent les paiements et le rechargement du portefeuille ?",
      a: "Toutes les transactions s'effectuent en Dinars Algériens (DZD). Vous rechargez votre portefeuille agence par versement bancaire, CCP ou virement. Une fois le reçu validé, votre solde est immédiatement crédité et vos dossiers sont débités automatiquement."
    },
    {
      q: "Quelles destinations et types de visas gérez-vous ?",
      a: "Nous couvrons plus de 35 destinations mondiales : les E-Visas directs (Turquie, Dubaï / Émirats, Malaisie, Thaïlande, Arabie Saoudite / Omra, etc.) ainsi que les dossiers consulaires complets avec rendez-vous pour l'espace Schengen (France, Espagne, Italie...), le Canada, le Royaume-Uni et les États-Unis."
    },
    {
      q: "Que se passe-t-il si un dossier client comporte une erreur ou une pièce manquante ?",
      a: "Notre cellule de contrôle consulaire effectue un audit systématique avant toute soumission. En cas d'anomalie ou de document non conforme, votre agence reçoit une alerte instantanée avec la consigne exacte pour corriger la pièce avant le dépôt."
    },
    {
      q: "Proposez-vous un support en cas d'urgence sur un dossier ?",
      a: "Oui. En tant qu'agence partenaire, vous bénéficiez d'une ligne d'assistance téléphonique dédiée et d'un canal WhatsApp prioritaire pour le suivi de vos dossiers sensibles ou urgents."
    }
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading with reveal animation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7B1B38]/10 border border-[#7B1B38]/25 text-[#7B1B38] text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#7B1B38]" />
            {isEn ? "Clear Answers" : "Réponses Claires"}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {isEn ? "Agency Frequently Asked Questions" : "Questions Fréquentes des Agences"}
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            {isEn ? "Everything you need to know about partnering with La Clé d'Or B2B." : "Tout ce que vous devez savoir pour collaborer avec La Clé d'Or B2B."}
          </p>
        </motion.div>

        {/* Accordion in Light Mode with staggered entrance */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className={`rounded-2xl border transition-all duration-200 shadow-sm ${
                  isOpen ? "bg-white border-[#7B1B38]/40 ring-1 ring-[#7B1B38]/20" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-[#7B1B38] transition-colors cursor-pointer"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#7B1B38]" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-4 bg-white">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Still have questions block */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 p-6 rounded-2xl bg-[#7B1B38]/5 border border-[#7B1B38]/20 text-center flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-left">
            <div className="font-bold text-slate-900 text-base">
              {isEn ? "Have a specific question for your agency?" : "Une question spécifique pour votre agence ?"}
            </div>
            <div className="text-xs sm:text-sm text-slate-600">
              {isEn ? "Our B2B team is available Saturday to Thursday." : "Nos conseillers B2B sont à votre écoute du samedi au jeudi."}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:0562101719"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 hover:text-[#7B1B38] text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5 shadow-sm hover:scale-105"
            >
              <PhoneCall className="w-4 h-4 text-[#7B1B38]" />
              <span>0562 10 17 19</span>
            </a>
            <a
              href="https://whatsapp.com/channel/0029VbBSSDgKGGGQ2mCZwF0z"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Pro</span>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
