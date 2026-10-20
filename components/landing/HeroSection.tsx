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

      {/* Warm soft glow with brand color #7B1B38 */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-[#7B1B38]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Badge in #7B1B38 */}
        <div className="flex justify-center mb-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#7B1B38]/25 text-[#7B1B38] text-xs sm:text-sm font-bold shadow-sm"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-4xl mx-auto space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-slate-900 drop-shadow-sm">
            {t("landing.hero.title")}{" "}
            <span className="text-[#7B1B38]">
              {t("landing.hero.titleHighlight")}
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            {t("landing.hero.subtitle")}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto pt-4 pb-4">
            <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md hover:border-[#7B1B38]/50 transition-all">
              <div className="text-2xl sm:text-3xl font-black text-[#7B1B38]">35+</div>
              <div className="text-xs text-slate-700 font-bold mt-0.5">{t("landing.hero.metricDestinations")}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md hover:border-slate-300 transition-all">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">1 250+</div>
              <div className="text-xs text-slate-700 font-bold mt-0.5">{t("landing.hero.metricVolume")}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md hover:border-emerald-300 transition-all">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">99.2%</div>
              <div className="text-xs text-slate-700 font-bold mt-0.5">{t("landing.hero.metricCompliance")}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md hover:border-[#7B1B38]/40 transition-all">
              <div className="text-2xl sm:text-3xl font-black text-[#7B1B38]">24/7</div>
              <div className="text-xs text-slate-700 font-bold mt-0.5">{t("landing.hero.metricSupport")}</div>
            </div>
          </div>

          {/* CTA Buttons in #7B1B38 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-base transition-all duration-200 shadow-lg shadow-[#7B1B38]/30 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Building2 className="w-5 h-5 text-white" />
              <span>{t("landing.hero.ctaRegister")}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/95 hover:bg-slate-50 text-slate-800 hover:text-[#7B1B38] border-2 border-slate-200 hover:border-[#7B1B38]/40 font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{t("landing.hero.ctaLogin")}</span>
            </Link>
          </div>

          {/* Quality highlight pill */}
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

        </motion.div>
      </div>

      {/* Trust Bar in Light Mode with #7B1B38 Accents */}
      <div className="mt-16 sm:mt-20 border-y border-slate-200/90 bg-white/95 backdrop-blur-md py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7B1B38]/10 border border-[#7B1B38]/20 flex items-center justify-center text-[#7B1B38] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900">{t("landing.hero.pillarAntiReject")}</div>
                <div className="text-xs text-slate-500">{t("landing.hero.pillarAntiRejectSub")}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900">{t("landing.hero.pillarExpress")}</div>
                <div className="text-xs text-slate-500">{t("landing.hero.pillarExpressSub")}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7B1B38]/10 border border-[#7B1B38]/20 flex items-center justify-center text-[#7B1B38] shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900">{t("landing.hero.pillarB2BPrice")}</div>
                <div className="text-xs text-slate-500">{t("landing.hero.pillarB2BPriceSub")}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900">{t("landing.hero.pillarDedicatedSupport")}</div>
                <div className="text-xs text-slate-500">{t("landing.hero.pillarDedicatedSupportSub")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
