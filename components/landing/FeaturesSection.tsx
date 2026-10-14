import { 
  LayoutDashboard, 
  ShieldCheck, 
  Wallet, 
  History, 
  Headphones, 
  TrendingUp,
  Sparkles
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: LayoutDashboard,
      title: "Tableau de Bord Tout-en-Un",
      description: "Visualisez d'un coup d'œil tous les dossiers en cours, les délais restants, les statuts et les actions requises par vos conseillers.",
      badge: "Vue Centralisée"
    },
    {
      icon: ShieldCheck,
      title: "Contrôle Documentaire Rigoureux",
      description: "Checklist consulaire automatisée par pays. Finies les erreurs de format ou les pièces périmées qui causent des refus consulaires.",
      badge: "Zéro Refus Évitable"
    },
    {
      icon: Wallet,
      title: "Portefeuille Virtuel & Facturation",
      description: "Rechargez votre solde agence en Dinars Algériens (DZD) par virement ou versement et réglez vos dossiers sans blocage de carte.",
      badge: "Gestion Financière Saine"
    },
    {
      icon: History,
      title: "Historique & Traçabilité Complète",
      description: "Archives numériques permanentes des passeports, quittances et visas émis pour chacun de vos clients et voyageurs réguliers.",
      badge: "Archives Sécurisées"
    },
    {
      icon: Headphones,
      title: "Support B2B Prioritaire 24/7",
      description: "Une équipe d'experts consulaires joignable directement par téléphone et WhatsApp dédié pour débloquer vos dossiers urgents.",
      badge: "Assistance Directe"
    },
    {
      icon: TrendingUp,
      title: "Tarifs Préférentiels & Marges Nettes",
      description: "Bénéficiez de remises de volume exclusives pour les agences partenaires et développez la rentabilité de votre comptoir.",
      badge: "Marges Rentables"
    }
  ];

  return (
    <section id="avantages" className="py-24 md:py-32 bg-slate-50 text-slate-900 relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7B1B38]/10 border border-[#7B1B38]/25 text-[#7B1B38] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#7B1B38]" />
            Outils Dédiés aux Professionnels
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Tout Ce Dont Votre Agence a Besoin Pour Exceller
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Une suite logicielle complète pour transformer votre agence de voyages en un pôle visa performant, rapide et rentable.
          </p>
        </div>

        {/* Feature Grid in Light Mode */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-[#7B1B38]/40 hover:shadow-xl transition-all duration-300 group"
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
              </div>
            );
          })}
        </div>

        {/* Social Proof / Stats Box (Light Mode with #7B1B38) */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-black text-[#7B1B38]">12 400+</div>
              <div className="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wider mt-2">Visas Traités</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black text-slate-900">180+</div>
              <div className="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wider mt-2">Agences Partenaires</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black text-emerald-600">2.1 Jours</div>
              <div className="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wider mt-2">Délai Moyen E-Visa</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black text-[#7B1B38]">98.7%</div>
              <div className="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wider mt-2">Dossiers Conformes</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
