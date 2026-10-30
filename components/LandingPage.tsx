import { LandingNav } from "./landing/LandingNav";
import { HeroSection } from "./landing/HeroSection";
import { ProcessSection } from "./landing/ProcessSection";
import { FeaturesSection } from "./landing/FeaturesSection";
import { LocationSection } from "./landing/LocationSection";
import { FaqSection } from "./landing/FaqSection";
import { AppPromoSection } from "./landing/AppPromoSection";
import { LandingFooter } from "./landing/LandingFooter";
import { AirplaneCursor } from "./landing/AirplaneCursor";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#7B1B38]/20 selection:text-[#7B1B38] relative">
      {/* Effet personnalisé de curseur avion avec traînée */}
      <AirplaneCursor />

      {/* Barre de navigation B2B moderne (Mode clair) */}
      <LandingNav />

      {/* Sections principales */}
      <main>
        {/* 1. Section Principale avec image de fond bien visible, proposition de valeur B2B et métriques */}
        <HeroSection />

        {/* 2. Processus B2B en 3 étapes & suivi d'avancement */}
        <ProcessSection />

        {/* 3. Fonctionnalités de la plateforme & Avantages B2B */}
        <FeaturesSection />

        {/* 4. Localisation du siège & Carte interactive Google Maps */}
        <LocationSection />

        {/* 5. Questions Fréquentes & Support Agences */}
        <FaqSection />

        {/* 6. Section Affiche Application Mobile (Desktop/Mobile x FR/EN) */}
        <AppPromoSection />
      </main>

      {/* Pied de page complet avec contacts officiels et informations légales */}
      <LandingFooter />
    </div>
  );
}
