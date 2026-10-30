import { 
  LayoutDashboard, 
  ShieldCheck, 
  Wallet, 
  History, 
  Headphones, 
  TrendingUp,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../../src/i18n/LanguageContext";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";

export function FeaturesSection() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const features = [
    {
      icon: LayoutDashboard,
      title: isEn ? "All-in-One Dashboard" : "Tableau de Bord Tout-en-Un",
      description: isEn 
        ? "Overview all pending applications, remaining processing time, consular status, and required actions at a glance."
        : "Visualisez d'un coup d'œil tous les dossiers en cours, les délais restants, les statuts et les actions requises par vos conseillers.",
      badge: isEn ? "Centralized View" : "Vue Centralisée"
    },
    {
      icon: ShieldCheck,
      title: isEn ? "Rigorous Document Pre-Check" : "Contrôle Documentaire Rigoureux",
      description: isEn
        ? "Automated destination-specific checklist. Prevent formatting mistakes and outdated records that trigger consular rejections."
        : "Checklist consulaire automatisée par pays. Finies les erreurs de format ou les pièces périmées qui causent des refus consulaires.",
      badge: isEn ? "Zero Avoidable Refusal" : "Zéro Refus Évitable"
    },
    {
      icon: Wallet,
      title: isEn ? "B2B Wallet & Local Invoicing" : "Portefeuille Virtuel & Facturation",
      description: isEn
        ? "Top up your agency balance in Algerian Dinars (DZD) via bank wire or CCP deposit and debit applications without payment blocks."
        : "Rechargez votre solde agence en Dinars Algériens (DZD) par virement ou versement et réglez vos dossiers sans blocage de carte.",
      badge: isEn ? "Healthy Financial Flow" : "Gestion Financière Saine"
    },
    {
      icon: History,
      title: isEn ? "Complete Audit Trail & History" : "Historique & Traçabilité Complète",
      description: isEn
        ? "Permanent digital repository of traveler passport scans, receipts, and approved visas for repeat business."
        : "Archives numériques permanentes des passeports, quittances et visas émis pour chacun de vos clients et voyageurs réguliers.",
      badge: isEn ? "Secure Archive" : "Archives Sécurisées"
    },
    {
      icon: Headphones,
      title: isEn ? "24/7 Priority B2B Desk" : "Support B2B Prioritaire 24/7",
      description: isEn
        ? "A seasoned team of consular officers reachable directly via phone hotline and pro WhatsApp to expedite urgent files."
        : "Une équipe d'experts consulaires joignable directement par téléphone et WhatsApp dédié pour débloquer vos dossiers urgents.",
      badge: isEn ? "Direct Helpline" : "Assistance Directe"
    },
    {
      icon: TrendingUp,
      title: isEn ? "Wholesale Rates & Net Margins" : "Tarifs Préférentiels & Marges Nettes",
      description: isEn
        ? "Unlock volume tier discounts exclusively negotiated for partner travel agencies to scale front-desk profitability."
        : "Bénéficiez de remises de volume exclusives pour les agences partenaires et développez la rentabilité de votre comptoir.",
      badge: isEn ? "Profitable Margins" : "Marges Rentables"
    }
  ];

  return (
    <section id="avantages" className="py-24 md:py-32 bg-slate-50 text-slate-900 relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with reveal animation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7B1B38]/10 border border-[#7B1B38]/25 text-[#7B1B38] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#7B1B38]" />
            {isEn ? "Dedicated Pro Travel Toolkit" : "Outils Dédiés aux Professionnels"}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            {isEn ? "Everything Your Travel Agency Needs to Excel" : "Tout Ce Dont Votre Agence a Besoin Pour Exceller"}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {isEn
              ? "A comprehensive software suite transforming your travel agency into a high-performance, fast, and profitable visa center."
              : "Une suite logicielle complète pour transformer votre agence de voyages en un pôle visa performant, rapide et rentable."}
          </p>
        </motion.div>

        {/* Feature Grid with Staggered Entrance & Interactive Hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 30px -10px rgba(123,27,56,0.12)" }}
                className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-[#7B1B38]/40 transition-all duration-300 group cursor-default"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#7B1B38]/10 text-[#7B1B38] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#7B1B38] group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feat.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Social Proof / Stats Box with Spring Scale Entrance */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl bg-white border border-slate-200 shadow-xl p-8 sm:p-12 relative overflow-hidden"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <div className="text-4xl sm:text-5xl font-black text-[#7B1B38]">
                <AnimatedCounter value={12400} suffix="+" duration={2.4} />
              </div>
              <div className="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wider mt-2">
                {isEn ? "Visas Handled" : "Visas Traités"}
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <div className="text-4xl sm:text-5xl font-black text-slate-900">
                <AnimatedCounter value={180} suffix="+" duration={2} />
              </div>
              <div className="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wider mt-2">
                {isEn ? "Partner Agencies" : "Agences Partenaires"}
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <div className="text-4xl sm:text-5xl font-black text-emerald-600">
                <AnimatedCounter value={99.4} decimals={1} suffix="%" duration={2.2} />
              </div>
              <div className="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wider mt-2">
                {isEn ? "Approval Rate" : "Taux d'Accord"}
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <div className="text-4xl sm:text-5xl font-black text-[#7B1B38]">
                <AnimatedCounter value={15} suffix=" min" duration={1.8} />
              </div>
              <div className="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wider mt-2">
                {isEn ? "Average Response" : "Prise en Charge Moy."}
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
