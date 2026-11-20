import { lazy, Suspense, useEffect } from "react";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { LandingNav } from "./landing/LandingNav";
import { HeroSection } from "./landing/HeroSection";

const ProcessSection = lazy(() => import("./landing/ProcessSection").then(m => ({ default: m.ProcessSection })));
const FeaturesSection = lazy(() => import("./landing/FeaturesSection").then(m => ({ default: m.FeaturesSection })));
const LocationSection = lazy(() => import("./landing/LocationSection").then(m => ({ default: m.LocationSection })));
const FaqSection = lazy(() => import("./landing/FaqSection").then(m => ({ default: m.FaqSection })));
const AppPromoSection = lazy(() => import("./landing/AppPromoSection").then(m => ({ default: m.AppPromoSection })));
const LandingFooter = lazy(() => import("./landing/LandingFooter").then(m => ({ default: m.LandingFooter })));
const AirplaneCursor = lazy(() => import("./landing/AirplaneCursor").then(m => ({ default: m.AirplaneCursor })));

export function LandingPage() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!target) return;
      const hash = target.getAttribute("href");
      if (!hash || hash === "#") return;
      const dest = document.querySelector(hash);
      if (dest) {
        e.preventDefault();
        lenis.scrollTo(dest as HTMLElement, { offset: -72, duration: 1.1 });
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#661915]/20 selection:text-[#661915] relative">
        {/* Barre de navigation B2B moderne (Mode clair) */}
        <LandingNav />

        {/* Sections principales */}
        <main>
          {/* 1. Section Principale au-dessus de la ligne de flottaison (rendu immédiat LCP) */}
          <HeroSection />

          <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
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
          </Suspense>
        </main>

        <Suspense fallback={null}>
          {/* Pied de page complet avec contacts officiels et informations légales */}
          <LandingFooter />
          {/* Effet personnalisé de curseur avion avec traînée */}
          <AirplaneCursor />
        </Suspense>
      </div>
    </MotionConfig>
  );
}
