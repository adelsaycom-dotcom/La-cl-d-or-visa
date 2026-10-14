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

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      num: "01",
      icon: UploadCloud,
      title: "Transmettez les documents",
      shortDesc: "Depuis votre portail agence, par e-mail ou WhatsApp dédié.",
      longDesc: "Déposez le scan du passeport, photo d'identité et pièces justificatives du client. Notre plateforme vérifie instantanément les formats requis et vous indique les éléments manquants.",
      badge: "Intake Rapide & Sécurisé",
      detailItems: [
        "Glisser-déposer de scans & PDF",
        "Formulaire simplifié par destination",
        "Assistance WhatsApp dédiée pour vos urgences"
      ]
    },
    {
      num: "02",
      icon: FileCheck2,
      title: "Nos experts vérifient & déposent",
      shortDesc: "Contrôle anti-rejet, génération des formulaires et dépôt officiel.",
      longDesc: "Notre équipe consulaire analyse scrupuleusement chaque dossier, élimine les anomalies, génère les dossiers officiels et gère les prises de rendez-vous (TLS, VFS, BLS) ou dépôts E-visas.",
      badge: "Contrôle Consulaire Garanti",
      detailItems: [
        "Audit de conformité consulaire 99.2%",
        "Gestion des créneaux & rendez-vous",
        "Dépôt direct auprès des autorités consulaires"
      ]
    },
    {
      num: "03",
      icon: Radio,
      title: "Suivez en direct & Délivrez",
      shortDesc: "Mises à jour instantanées sur votre dashboard et alertes automatiques.",
      longDesc: "Recevez les notifications d'étape en étape jusqu'à la délivrance du visa. Téléchargez le visa électronique ou récupérez le passeport pour remise immédiate au voyageur.",
      badge: "Visibilité 100% Temps Réel",
      detailItems: [
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
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7B1B38]/10 border border-[#7B1B38]/25 text-[#7B1B38] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#7B1B38]" />
            Méthodologie Éprouvée B2B
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Comment Fonctionne Le Traitement B2B
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Transmettez les pièces une seule fois, La Clé d'Or s'occupe de la conformité, 
            du dépôt consulaire et des notifications d'avancement jusqu'à la délivrance.
          </p>
        </div>

        {/* Step Cards Grid in Light Mode */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx + 1;

            return (
              <div
                key={step.num}
                onClick={() => setActiveStep(idx + 1)}
                className={`relative rounded-3xl p-8 transition-all duration-300 cursor-pointer border ${
                  isSelected 
                    ? "bg-white border-[#7B1B38] shadow-xl shadow-[#7B1B38]/10 -translate-y-2 ring-1 ring-[#7B1B38]" 
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Step indicator top */}
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-xs font-black tracking-widest px-3 py-1 rounded-full uppercase ${
                    isSelected ? "bg-[#7B1B38] text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    Étape {step.num}
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
              </div>
            );
          })}
        </div>

        {/* Live Workflow Demonstration (Light mode interactive pipeline) */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-6 sm:p-10 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Pipeline B2B en temps réel</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Aperçu d'un Dossier Voyageur dans votre Console
              </h4>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
              <span>Référence Dossier :</span>
              <span className="font-mono text-[#7B1B38] font-bold">#CDO-2026-8841</span>
              <span>•</span>
              <span className="text-slate-900 font-semibold">Visa France Court Séjour</span>
            </div>
          </div>

          {/* Interactive Steps Visual Tracker */}
          <div className="py-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {/* Stage 1 */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-emerald-700">1. Réception</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-sm font-bold text-slate-900">Dossier Transmis</div>
                <div className="text-xs text-slate-600 mt-1">Scans & formulaire client validés</div>
                <div className="mt-3 text-[10px] text-slate-500 font-mono">10:15 - Portail Agence</div>
              </div>

              {/* Stage 2 */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-emerald-700">2. Contrôle B2B</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-sm font-bold text-slate-900">Audit Anti-Rejet</div>
                <div className="text-xs text-slate-600 mt-1">Conformité consulaire certifiée</div>
                <div className="mt-3 text-[10px] text-slate-500 font-mono">11:30 - Cellule Consulaire</div>
              </div>

              {/* Stage 3 */}
              <div className="p-4 rounded-2xl bg-[#7B1B38]/5 border border-[#7B1B38]/30 relative shadow-md shadow-[#7B1B38]/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#7B1B38]">3. Traitement</span>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B1B38] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#7B1B38]"></span>
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">Dépôt Consulaire</div>
                <div className="text-xs text-slate-600 mt-1">Rendez-vous VFS / Dépôt ambassade</div>
                <div className="mt-3 text-[10px] text-[#7B1B38] font-mono font-bold">En cours d'instruction</div>
              </div>

              {/* Stage 4 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 relative opacity-70">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500">4. Finalisation</span>
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-sm font-bold text-slate-700">Délivrance Visa</div>
                <div className="text-xs text-slate-500 mt-1">Passeport prêt pour remise</div>
                <div className="mt-3 text-[10px] text-slate-400 font-mono">Étape suivante</div>
              </div>
            </div>
          </div>

          {/* Quick Callout Footer */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
              💡 Vos agents de comptoir gagnent jusqu'à <strong className="text-slate-900">4 heures par dossier</strong> en éliminant la gestion des erreurs consulaires.
            </p>
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-xl bg-[#7B1B38] hover:bg-[#63142c] text-white text-xs font-bold transition-all flex items-center gap-2 shrink-0 shadow-md shadow-[#7B1B38]/20 cursor-pointer"
            >
              <span>Tester la Plateforme</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
