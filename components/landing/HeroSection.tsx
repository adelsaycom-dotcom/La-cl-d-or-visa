import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Building2,
  FileCheck,
  Headphones,
  CheckCircle2
} from "lucide-react";
import { useLanguage } from "../../src/i18n/LanguageContext";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden text-slate-900 border-b border-slate-200">
      
      {/* Background Image with Significantly Higher Visibility / Opacity */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/hero-bg.jpg"
          alt="Voyage aérien & Aviation B2B"
          className="w-full h-full object-cover object-center scale-100 opacity-90 transition-opacity duration-500"
        />
        {/* Balanced light overlay: clearly reveals the airplane and sky while maintaining text contrast */}
        <div className="absolute inset-0 bg-white/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/35 to-white" />
      </div>

      {/* Warm soft glow with animated breathing effect */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1], 
          opacity: [0.10, 0.22, 0.10] 
        }} 
        transition={{ 
          duration: 7, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-[#7B1B38] rounded-full blur-3xl pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Badge in #7B1B38 with bouncing reveal */}
        <div className="flex justify-center mb-6">
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.03, y: -2 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#7B1B38]/25 text-[#7B1B38] text-xs sm:text-sm font-bold shadow-sm transition-shadow hover:shadow-md cursor-default"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B1B38] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#7B1B38]"></span>
            </span>
            <span>{t("landing.hero.badgeOfficial")}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-700 hidden sm:inline">{t("landing.hero.badgeAgencies")}</span>
          </motion.div>
        </div>

        {/* Main Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto space-y-6"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-slate-900 drop-shadow-sm"
          >
            {t("landing.hero.title")}{" "}
            <span className="text-[#7B1B38] relative inline-block">
              {t("landing.hero.titleHighlight")}
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-sm"
          >
            {t("landing.hero.subtitle")}
          </motion.p>

          {/* Quick Metrics Bar with Staggered Pop-in & Auto-Counting */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto pt-4 pb-4">
            {[
              { num: 35, suffix: "+", decimals: 0, label: t("landing.hero.metricDestinations"), color: "text-[#7B1B38]", borderHover: "hover:border-[#7B1B38]/50" },
              { num: 1250, suffix: "+", decimals: 0, label: t("landing.hero.metricVolume"), color: "text-slate-900", borderHover: "hover:border-slate-400" },
              { num: 99.2, suffix: "%", decimals: 1, label: t("landing.hero.metricCompliance"), color: "text-emerald-600", borderHover: "hover:border-emerald-400" },
              { num: 24, suffix: "/7", decimals: 0, label: t("landing.hero.metricSupport"), color: "text-[#7B1B38]", borderHover: "hover:border-[#7B1B38]/50" }
            ].map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.35 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, scale: 1.03, boxShadow: "0 12px 25px -8px rgba(123,27,56,0.15)" }}
                className={`p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md ${m.borderHover} transition-colors cursor-default`}
              >
                <div className={`text-2xl sm:text-3xl font-black ${m.color}`}>
                  <AnimatedCounter value={m.num} suffix={m.suffix} decimals={m.decimals} duration={2.2} />
                </div>
                <div className="text-xs text-slate-700 font-bold mt-0.5">{m.label}</div>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons in #7B1B38 with Micro-Interactions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-base transition-all duration-200 shadow-lg shadow-[#7B1B38]/30 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Building2 className="w-5 h-5 text-white" />
                <span>{t("landing.hero.ctaRegister")}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                to="/login"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/95 hover:bg-slate-50 text-slate-800 hover:text-[#7B1B38] border-2 border-slate-200 hover:border-[#7B1B38]/40 font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{t("landing.hero.ctaLogin")}</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Quality highlight pill with subtle fade */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-600 font-semibold bg-white/70 backdrop-blur-sm py-2 px-4 rounded-full max-w-fit mx-auto border border-white/80"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t("landing.hero.trustImmediate")}
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t("landing.hero.trustBilling")}
            </span>
          </motion.div>

        </motion.div>
      </div>

      {/* Trust Bar with Scroll Trigger & Staggered items */}
      <motion.div 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mt-16 sm:mt-20 border-y border-slate-200/90 bg-white/95 backdrop-blur-md py-6 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-700">
            {[
              {
                icon: ShieldCheck,
                title: t("landing.hero.pillarAntiReject"),
                sub: t("landing.hero.pillarAntiRejectSub"),
                bg: "bg-[#7B1B38]/10 text-[#7B1B38] border-[#7B1B38]/20"
              },
              {
                icon: Clock,
                title: t("landing.hero.pillarExpress"),
                sub: t("landing.hero.pillarExpressSub"),
                bg: "bg-emerald-50 text-emerald-600 border-emerald-200"
              },
              {
                icon: FileCheck,
                title: t("landing.hero.pillarB2BPrice"),
                sub: t("landing.hero.pillarB2BPriceSub"),
                bg: "bg-[#7B1B38]/10 text-[#7B1B38] border-[#7B1B38]/20"
              },
              {
                icon: Headphones,
                title: t("landing.hero.pillarDedicatedSupport"),
                sub: t("landing.hero.pillarDedicatedSupportSub"),
                bg: "bg-purple-50 text-purple-600 border-purple-200"
              }
            ].map((pillar, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="flex items-center gap-3 cursor-default"
              >
                <div className={`w-10 h-10 rounded-xl ${pillar.bg} border flex items-center justify-center shrink-0 shadow-2xs`}>
                  <pillar.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">{pillar.title}</div>
                  <div className="text-xs text-slate-500">{pillar.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
