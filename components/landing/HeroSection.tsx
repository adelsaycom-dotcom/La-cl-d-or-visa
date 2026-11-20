import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Building2,
  FileCheck,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "../../src/i18n/LanguageContext";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden text-slate-900 border-b border-slate-200">
      {/* Background Image WebP responsive prioritaire (LCP immédiat) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <picture className="w-full h-full block">
          <source
            media="(max-width: 767px)"
            srcSet="/hero-bg-mobile.webp"
            type="image/webp"
          />
          <source srcSet="/hero-bg.webp" type="image/webp" />
          <img
            src="/hero-bg.jpg"
            alt="Voyage aérien & Aviation B2B"
            width={1600}
            height={1062}
            {...({ fetchpriority: "high" } as Record<string, string>)}
            decoding="sync"
            className="w-full h-full object-cover object-center scale-100 opacity-90"
          />
        </picture>
        <div className="absolute inset-0 bg-white/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/35 to-white" />
      </div>

      {/* Warm soft glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-[#661915]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#661915]/25 text-[#661915] text-xs sm:text-sm font-bold shadow-sm transition-transform hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-md cursor-default">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#661915] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#661915]"></span>
            </span>
            <span>{t("landing.hero.badgeOfficial")}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-700 hidden sm:inline">{t("landing.hero.badgeAgencies")}</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-slate-900 drop-shadow-sm">
            {t("landing.hero.title")}{" "}
            <span className="text-[#661915] relative inline-block">
              {t("landing.hero.titleHighlight")}
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            {t("landing.hero.subtitle")}
          </p>

          {/* Quick Metrics Bar avec AnimatedCounter */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto pt-4 pb-4">
            {[
              { num: 35, suffix: "+", decimals: 0, label: t("landing.hero.metricDestinations"), color: "text-[#661915]", borderHover: "hover:border-[#661915]/50" },
              { num: 1250, suffix: "+", decimals: 0, label: t("landing.hero.metricVolume"), color: "text-slate-900", borderHover: "hover:border-slate-400" },
              { num: 99.2, suffix: "%", decimals: 1, label: t("landing.hero.metricCompliance"), color: "text-emerald-600", borderHover: "hover:border-emerald-400" },
              { num: 24, suffix: "/7", decimals: 0, label: t("landing.hero.metricSupport"), color: "text-[#661915]", borderHover: "hover:border-[#661915]/50" },
            ].map((m, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md ${m.borderHover} transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-lg will-change-transform cursor-default`}
              >
                <div className={`text-2xl sm:text-3xl font-black tabular-nums ${m.color}`}>
                  <AnimatedCounter value={m.num} suffix={m.suffix} decimals={m.decimals} duration={1.4} />
                </div>
                <div className="text-xs text-slate-700 font-bold mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <div className="w-full sm:w-auto transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.98] will-change-transform">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#661915] hover:bg-[#4d120f] text-white font-bold text-base transition-colors transition-shadow duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-lg shadow-[#661915]/30 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Building2 className="w-5 h-5 text-white" />
                <span>{t("landing.hero.ctaRegister")}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="w-full sm:w-auto transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.98] will-change-transform">
              <Link
                to="/login"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/95 hover:bg-slate-50 text-slate-800 hover:text-[#661915] border-2 border-slate-200 hover:border-[#661915]/40 font-bold text-base transition-colors transition-shadow duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{t("landing.hero.ctaLogin")}</span>
              </Link>
            </div>
          </div>

          {/* Quality highlight */}
          <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-600 font-semibold bg-white/70 backdrop-blur-sm py-2 px-4 rounded-full max-w-fit mx-auto border border-white/80">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t("landing.hero.trustImmediate")}
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t("landing.hero.trustBilling")}
            </span>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="mt-16 sm:mt-20 border-y border-slate-200/90 bg-white/95 backdrop-blur-md py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-700">
            {[
              {
                icon: ShieldCheck,
                title: t("landing.hero.pillarAntiReject"),
                sub: t("landing.hero.pillarAntiRejectSub"),
                bg: "bg-[#661915]/10 text-[#661915] border-[#661915]/20",
              },
              {
                icon: Clock,
                title: t("landing.hero.pillarExpress"),
                sub: t("landing.hero.pillarExpressSub"),
                bg: "bg-emerald-50 text-emerald-600 border-emerald-200",
              },
              {
                icon: FileCheck,
                title: t("landing.hero.pillarB2BPrice"),
                sub: t("landing.hero.pillarB2BPriceSub"),
                bg: "bg-[#661915]/10 text-[#661915] border-[#661915]/20",
              },
              {
                icon: Headphones,
                title: t("landing.hero.pillarDedicatedSupport"),
                sub: t("landing.hero.pillarDedicatedSupportSub"),
                bg: "bg-purple-50 text-purple-600 border-purple-200",
              },
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 cursor-default transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className={`w-10 h-10 rounded-xl ${pillar.bg} border flex items-center justify-center shrink-0 shadow-2xs`}>
                  <pillar.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">{pillar.title}</div>
                  <div className="text-xs text-slate-500">{pillar.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
