import { useState } from "react";
import { 
  UploadCloud, 
  FileCheck2, 
  Radio, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../../src/i18n/LanguageContext";

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const { language, t } = useLanguage();
  const isEn = language === "en";

  const steps = [
    {
      num: "01",
      icon: UploadCloud,
      title: isEn ? "Upload Applicant Documents" : "Transmettez les documents",
      shortDesc: isEn ? "From your pro portal, dedicated email, or agency WhatsApp." : "Depuis votre portail agence, par e-mail ou WhatsApp dédié.",
      longDesc: isEn 
        ? "Upload traveler's passport scan, ID photos, and supporting records. Our system instantly verifies required formats and flags missing items."
        : "Déposez le scan du passeport, photo d'identité et pièces justificatives du client. Notre plateforme vérifie instantanément les formats requis et vous indique les éléments manquants.",
      badge: isEn ? "Fast & Secure Intake" : "Intake Rapide & Sécurisé",
      detailItems: isEn ? [
        "Drag & drop PDF and high-res scans",
        "Streamlined forms per destination",
        "Dedicated WhatsApp hotline for urgent files"
      ] : [
        "Glisser-déposer de scans & PDF",
        "Formulaire simplifié par destination",
        "Assistance WhatsApp dédiée pour vos urgences"
      ]
    },
    {
      num: "02",
      icon: FileCheck2,
      title: isEn ? "Our Experts Audit & Lodge" : "Nos experts vérifient & déposent",
      shortDesc: isEn ? "Anti-rejection compliance check, form generation, and official filing." : "Contrôle anti-rejet, génération des formulaires et dépôt officiel.",
      longDesc: isEn
        ? "Our consular operations team rigorously reviews each application, fixes anomalies, books official appointments (TLS, VFS, BLS), or submits E-Visas."
        : "Notre équipe consulaire analyse scrupuleusement chaque dossier, élimine les anomalies, génère les dossiers officiels et gère les prises de rendez-vous (TLS, VFS, BLS) ou dépôts E-visas.",
      badge: isEn ? "Guaranteed Consular Audit" : "Contrôle Consulaire Garanti",
      detailItems: isEn ? [
        "99.2% consular compliance audit",
        "Appointment slot booking & handling",
        "Direct submission to consular authorities"
      ] : [
        "Audit de conformité consulaire 99.2%",
        "Gestion des créneaux & rendez-vous",
        "Dépôt direct auprès des autorités consulaires"
      ]
    },
    {
      num: "03",
      icon: Radio,
      title: isEn ? "Track in Real Time & Deliver" : "Suivez en direct & Délivrez",
      shortDesc: isEn ? "Live status milestones on your dashboard and automated client alerts." : "Mises à jour instantanées sur votre dashboard et alertes automatiques.",
      longDesc: isEn
        ? "Receive step-by-step notifications until the visa is issued. Download the approved e-visa or collect the physical passport for instant handover."
        : "Recevez les notifications d'étape en étape jusqu'à la délivrance du visa. Téléchargez le visa électronique ou récupérez le passeport pour remise immédiate au voyageur.",
      badge: isEn ? "100% Real-Time Visibility" : "Visibilité 100% Temps Réel",
      detailItems: isEn ? [
        "Status alerts via SMS & live notification",
        "Permanently archived and downloadable files",
        "Automated invoices and agency receipts"
      ] : [
        "Alertes statut par SMS & notification",
        "Dossier archivé et téléchargeable à tout moment",
        "Facture et quittance agence générées automatiquement"
      ]
    }
  ];

  return (
    <section id="processus" className="py-24 md:py-32 bg-slate-50 text-slate-900 relative overflow-hidden border-b border-slate-200">
      
      {/* Background soft ambient accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#7B1B38]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with reveal animation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7B1B38]/10 border border-[#7B1B38]/25 text-[#7B1B38] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#7B1B38]" />
            {t("landing.process.badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            {t("landing.process.title")}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {t("landing.process.subtitle")}
          </p>
        </motion.div>

        {/* Step Cards Grid with Staggered Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx + 1;

            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => setActiveStep(idx + 1)}
                className={`relative rounded-3xl p-8 transition-all duration-300 cursor-pointer border ${
                  isSelected 
                    ? "bg-white border-[#7B1B38] shadow-xl shadow-[#7B1B38]/10 ring-1 ring-[#7B1B38]" 
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Step indicator top */}
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-xs font-black tracking-widest px-3 py-1 rounded-full uppercase ${
                    isSelected ? "bg-[#7B1B38] text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    {isEn ? "Step" : "Étape"} {step.num}
                  </span>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    isSelected ? "bg-[#7B1B38]/10 text-[#7B1B38]" : "bg-slate-100 text-slate-500"
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">{step.shortDesc}</p>

                {/* Checklist items */}
                <ul className="space-y-2.5 pt-4 border-t border-slate-100">
                  {step.detailItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? "text-[#7B1B38]" : "text-slate-400"}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Live Workflow Demonstration (Light mode interactive pipeline) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl bg-white border border-slate-200 shadow-xl p-6 sm:p-10 relative overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  {isEn ? "Live Real-Time B2B Pipeline" : "Pipeline B2B en temps réel"}
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {isEn ? "Live Traveler Application Dashboard Preview" : "Aperçu d'un Dossier Voyageur dans votre Console"}
              </h4>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
              <span>{isEn ? "Application Ref:" : "Référence Dossier :"}</span>
              <span className="font-mono text-[#7B1B38] font-bold">#CDO-2026-8841</span>
              <span>•</span>
              <span className="text-slate-900 font-semibold">{isEn ? "Schengen Visa Short Stay" : "Visa France Court Séjour"}</span>
            </div>
          </div>

          {/* Interactive Steps Visual Tracker */}
          <div className="py-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {/* Stage 1 */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-emerald-700">{isEn ? "1. Intake" : "1. Réception"}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-sm font-bold text-slate-900">{isEn ? "Files Received" : "Dossier Transmis"}</div>
                <div className="text-xs text-slate-600 mt-1">{isEn ? "Passport scans & client forms validated" : "Scans & formulaire client validés"}</div>
                <div className="mt-3 text-[10px] text-slate-500 font-mono">10:15 - {isEn ? "Agency Portal" : "Portail Agence"}</div>
              </div>

              {/* Stage 2 */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-emerald-700">{isEn ? "2. B2B Audit" : "2. Contrôle B2B"}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-sm font-bold text-slate-900">{isEn ? "Anti-Rejection Review" : "Audit Anti-Rejet"}</div>
                <div className="text-xs text-slate-600 mt-1">{isEn ? "Consular compliance verified" : "Conformité consulaire certifiée"}</div>
                <div className="mt-3 text-[10px] text-slate-500 font-mono">11:30 - {isEn ? "Consular Desk" : "Cellule Consulaire"}</div>
              </div>

              {/* Stage 3 */}
              <div className="p-4 rounded-2xl bg-[#7B1B38]/5 border border-[#7B1B38]/30 relative shadow-md shadow-[#7B1B38]/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#7B1B38]">{isEn ? "3. Processing" : "3. Traitement"}</span>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B1B38] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#7B1B38]"></span>
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">{isEn ? "Consular Lodgement" : "Dépôt Consulaire"}</div>
                <div className="text-xs text-slate-600 mt-1">{isEn ? "Appointment booked / Embassy lodging" : "Rendez-vous VFS / Dépôt ambassade"}</div>
                <div className="mt-3 text-[10px] text-[#7B1B38] font-mono font-bold">{isEn ? "Under assessment" : "En cours d'instruction"}</div>
              </div>

              {/* Stage 4 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 relative opacity-70">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500">{isEn ? "4. Completion" : "4. Finalisation"}</span>
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-sm font-bold text-slate-700">{isEn ? "Visa Handover" : "Délivrance Visa"}</div>
                <div className="text-xs text-slate-500 mt-1">{isEn ? "Passport ready for client delivery" : "Passeport prêt pour remise"}</div>
                <div className="mt-3 text-[10px] text-slate-400 font-mono">{isEn ? "Next step" : "Étape suivante"}</div>
              </div>
            </div>
          </div>

          {/* Quick Callout Footer */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
              💡 {isEn ? "Your front-desk team saves up to " : "Vos agents de comptoir gagnent jusqu'à "}
              <strong className="text-slate-900">{isEn ? "4 hours per application" : "4 heures par dossier"}</strong>
              {isEn ? " by eliminating consular errors." : " en éliminant la gestion des erreurs consulaires."}
            </p>
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-xl bg-[#7B1B38] hover:bg-[#63142c] text-white text-xs font-bold transition-all flex items-center gap-2 shrink-0 shadow-md shadow-[#7B1B38]/20 cursor-pointer"
            >
              <span>{isEn ? "Test the Platform" : "Tester la Plateforme"}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
