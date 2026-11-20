import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, WalletCards, Bell, HelpCircle, FileText, 
  Settings, LogOut, Plane, Building2, ShieldCheck, MapPin, Menu, X, ChevronRight, User, Globe2,
  Eye, EyeOff, SlidersHorizontal, Percent, AlertTriangle, GraduationCap
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from '@/components/Logo';
import { signOut } from "firebase/auth";
import { auth } from "../../src/firebase";
import { useAppStore } from "../../src/store/useAppStore";
import { useLanguage } from "../../src/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { prefetchRouteChunk, prefetchAgencyPortalChunks } from "../../src/utils/routePrefetch";

const OutletLoader = () => (
  <div className="flex justify-center items-center w-full p-10 min-h-[320px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#661915]" />
  </div>
);

export function AgencyLayout() {
  const agencyBalance = useAppStore(state => state.agencyBalance);
  const notifications = useAppStore(state => state.notifications);
  const markNotificationAsRead = useAppStore(state => state.markNotificationAsRead);
  const markAllNotificationsAsRead = useAppStore(state => state.markAllNotificationsAsRead);
  const currentAgency = useAppStore(state => state.currentAgency);
  const b2cMode = useAppStore(state => state.b2cMode);
  const setB2cMode = useAppStore(state => state.setB2cMode);
  const b2cMarginPercent = useAppStore(state => state.b2cMarginPercent);
  const setB2cMarginPercent = useAppStore(state => state.setB2cMarginPercent);

  const agencyDisplayName = useMemo(() => {
    return currentAgency?.agencyName || currentAgency?.companyName || currentAgency?.name || auth.currentUser?.displayName || "Mon Agence";
  }, [currentAgency]);

  const agencyCode = useMemo(() => {
    return currentAgency?.id ? `ID: AGE-${currentAgency.id.slice(0, 6).toUpperCase()}` : "ID: AGE-2948";
  }, [currentAgency?.id]);

  const [showMarginInput, setShowMarginInput] = useState(false);
  const [marginTemp, setMarginTemp] = useState(b2cMarginPercent || 15);

  const unreadNotifications = useMemo(() => {
    if (!notifications) return [];
    return notifications
      .filter(n => !n.read)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications]);

  const notificationsCount = unreadNotifications.length;
  
  const balanceColor = useMemo(() => {
    return agencyBalance > 10000 ? "text-emerald-600" : agencyBalance > 0 ? "text-amber-600" : "text-red-600";
  }, [agencyBalance]);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Préchargement silencieux des chunks de l'espace agence en arrière-plan
  useEffect(() => {
    prefetchAgencyPortalChunks();
  }, []);

  const { language, t } = useLanguage();
  const isEn = language === "en";

  const navItems = useMemo(() => [
    { name: t("nav.dashboard"), path: "/agency", icon: LayoutDashboard },
    { name: t("nav.passportIndex"), path: "/agency/passport-index", icon: Globe2 },
    { name: t("nav.newApplication"), path: "/agency/apply", icon: FileText, highlight: true },
    { name: t("nav.myApplications"), path: "/agency/applications", icon: Plane },
    { name: t("nav.organizedTrips"), path: "/agency/trips", icon: MapPin },
    { name: t("nav.studyVisa"), path: "/agency/study", icon: GraduationCap },
    { name: t("nav.wallet"), path: "/agency/wallet", icon: WalletCards },
    { name: t("nav.support"), path: "/agency/support", icon: HelpCircle },
    { name: t("nav.settings"), path: "/agency/settings", icon: Settings },
  ], [t]);

  const handleNotificationClick = useCallback((notifId: string, link?: string) => {
    markNotificationAsRead(notifId);
    if (link) navigate(link);
  }, [markNotificationAsRead, navigate]);

  const handleMarkAllRead = useCallback(() => {
    markAllNotificationsAsRead(auth.currentUser?.uid || "");
  }, [markAllNotificationsAsRead]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignorer
    }
    useAppStore.getState().clearData();
    navigate("/login", { replace: true });
  }, [navigate]);

  const isSuspended = currentAgency?.status === "SUSPENDED";
  const isSupportRoute = location.pathname.startsWith("/agency/support");

  return (
    <div className="relative flex h-screen overflow-hidden font-sans">
      {/* Fond d'écran atténué et doux */}
      <div className="fixed inset-0 pointer-events-none -z-20 bg-gradient-to-br from-slate-100 via-sky-50/40 to-slate-100" />
      <div 
        className="fixed inset-0 pointer-events-none -z-10 bg-cover bg-no-repeat opacity-50 transition-opacity duration-300"
        style={{ 
          backgroundImage: `url('/assets/dashboard-wing-bg.webp')`,
          backgroundPosition: 'right 15% center',
          backgroundSize: 'cover'
        }}
      />
      {/* Voile très léger et cristallin */}
      <div className="fixed inset-0 bg-white/5 pointer-events-none -z-10" />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Translucide Légère */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl text-slate-900 border-r border-slate-200/70 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shrink-0 flex flex-col shadow-lg lg:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-200/60 shrink-0 bg-white/40 overflow-hidden">
          <Link to="/agency" className="flex items-center gap-2.5 min-w-0">
             <Logo imageClassName="h-16 w-auto" />
             <div className="flex flex-col min-w-0">
               <span className="font-extrabold text-sm tracking-tight text-slate-900 leading-none truncate">{t("nav.b2bPlatform")}</span>
               <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mt-1 truncate">{isEn ? "Agency Portal" : "Espace Agence"}</span>
             </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-800 p-1 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Agency Info */}
        <div className="px-5 py-4 border-b border-slate-200/60 shrink-0 bg-white/30">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center border border-slate-200/70 shadow-2xs shrink-0">
               <Building2 className="w-5 h-5 text-[#661915]" />
             </div>
             <div className="min-w-0">
               <div className="font-bold text-sm text-slate-900 leading-tight truncate" title={agencyDisplayName}>
                 {agencyDisplayName}
               </div>
               <div className="text-xs text-slate-600 font-mono mt-0.5 font-semibold">{agencyCode}</div>
             </div>
           </div>
           
           <div className="bg-white/90 rounded-xl p-3 border border-slate-200/80">
             <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
               {t("header.agencyBalance")}
             </div>
             <div className="text-xl font-extrabold text-slate-950 font-mono tabular-nums tracking-tight flex items-center gap-2">
               <WalletCards className="w-4 h-4 text-[#661915] shrink-0" />
               <span>{agencyBalance.toLocaleString("fr-FR").replace(/\u202F/g, " ")}</span>
               <span className="text-xs font-semibold text-slate-500">DZD</span>
             </div>
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/agency' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                to={item.path}
                onMouseEnter={() => prefetchRouteChunk(item.path)}
                onFocus={() => prefetchRouteChunk(item.path)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 group ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-md font-bold' 
                    : item.highlight 
                      ? 'text-orange-600 hover:bg-white/70 font-bold'
                      : 'text-slate-800 hover:bg-white/70 hover:text-slate-950 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : item.highlight ? 'text-orange-500' : 'text-slate-600 group-hover:text-slate-900'} transition-colors`} />
                  <span className="text-sm">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/15 shrink-0">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-rose-500/10 hover:text-rose-700 transition-colors group font-semibold text-sm cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-slate-500 group-hover:text-rose-600 transition-colors" />
            <span>{t("nav.logout")}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent overflow-hidden">
        
        {/* Top Header Translucide */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 hover:text-slate-900 p-1">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg lg:text-2xl font-bold text-slate-900 hidden sm:block">
              {navItems.find(i => location.pathname === i.path || (i.path !== '/agency' && location.pathname.startsWith(i.path)))?.name || t("nav.dashboard")}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
             {/* B2B / B2C Counter Mode Switcher */}
             <div className="flex items-center bg-white/75 p-1 rounded-2xl border border-slate-200/80 shadow-inner">
               <button
                 type="button"
                 onClick={() => setB2cMode(false)}
                 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                   !b2cMode 
                     ? 'bg-white text-slate-900 shadow-2xs border border-slate-200' 
                     : 'text-slate-600 hover:text-slate-900'
                 }`}
                 title={isEn ? "Display net wholesale B2B prices debited from your wallet" : "Afficher les prix d'achat B2B nets débités de votre solde"}
               >
                 <span className="hidden sm:inline">{isEn ? "Rate" : "Tarif"}</span> B2B
               </button>
               <button
                 type="button"
                 onClick={() => setB2cMode(true)}
                 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                   b2cMode 
                     ? 'bg-emerald-600/90 text-white shadow-sm' 
                     : 'text-slate-600 hover:text-emerald-700'
                 }`}
                 title={isEn ? "Enable client desk mode with markup to present screen to traveler" : "Activer la vue comptoir client avec marge pour présenter l'écran au voyageur"}
               >
                 <Eye className="w-3.5 h-3.5" />
                 <span>{isEn ? "Desk B2C" : "Comptoir B2C"}</span>
                 <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${b2cMode ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200/80 text-slate-700'}`}>
                   +{b2cMarginPercent}%
                 </span>
               </button>
               
               {/* Quick Margin Config Trigger */}
               <button
                 type="button"
                 onClick={() => setShowMarginInput(!showMarginInput)}
                 className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white/60 rounded-xl transition-colors"
                 title={isEn ? "Configure B2C markup percentage" : "Régler le taux de marge B2C"}
               >
                 <SlidersHorizontal className="w-3.5 h-3.5" />
               </button>
             </div>

             {/* Popover / Mini-Dialog to adjust margin % */}
             {showMarginInput && (
               <div className="absolute top-18 right-24 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl z-50 w-72 animate-in fade-in zoom-in-95">
                 <div className="flex items-center justify-between mb-2">
                   <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                     <Percent className="w-3.5 h-3.5 text-[#661915]" /> {isEn ? "B2C Markup Rate" : "Taux de Marge B2C"}
                   </span>
                   <button onClick={() => setShowMarginInput(false)} className="text-slate-400 hover:text-slate-700">
                     <X className="w-4 h-4" />
                   </button>
                 </div>
                 <p className="text-[11px] text-slate-500 mb-3">
                   {isEn ? "Set the automatic markup percentage applied on retail prices in desk view." : "Fixez le pourcentage appliqué automatiquement sur les tarifs publics en vue comptoir."}
                 </p>
                 <div className="flex gap-2 items-center mb-3">
                   {[10, 15, 20, 25, 30].map(pct => (
                     <button
                       key={pct}
                       onClick={() => {
                         setMarginTemp(pct);
                         setB2cMarginPercent(pct);
                         if (currentAgency?.id) {
                           useAppStore.getState().updateAgency(currentAgency.id, { b2cMarginPercent: pct });
                         }
                       }}
                       className={`flex-1 py-1 rounded-lg text-xs font-bold border ${
                         b2cMarginPercent === pct 
                           ? 'bg-[#661915] text-white border-[#661915]' 
                           : 'bg-white/50 text-slate-700 border-white/60 hover:bg-white/80'
                       }`}
                     >
                       {pct}%
                     </button>
                   ))}
                 </div>
                 <div className="flex gap-2">
                   <div className="relative flex-1">
                     <input
                       type="number"
                       min={0}
                       max={100}
                       value={marginTemp}
                       onChange={(e) => setMarginTemp(Number(e.target.value))}
                       className="w-full text-xs font-bold pl-3 pr-7 py-1.5 rounded-xl border border-slate-200 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#661915]"
                     />
                     <span className="absolute right-2.5 top-1.5 text-xs text-slate-400 font-bold">%</span>
                   </div>
                   <button
                     onClick={() => {
                       const val = Math.max(0, Math.min(100, Number(marginTemp) || 0));
                       setB2cMarginPercent(val);
                       if (currentAgency?.id) {
                         useAppStore.getState().updateAgency(currentAgency.id, { b2cMarginPercent: val });
                       }
                       setShowMarginInput(false);
                     }}
                     className="px-3 py-1.5 bg-[#661915] hover:bg-[#4d120f] text-white text-xs font-bold rounded-xl transition-colors"
                   >
                     {isEn ? "Apply" : "Appliquer"}
                   </button>
                 </div>
               </div>
             )}

             {/* Quick Apply Button (Desktop) */}
             <Link
               to="/agency/apply"
               onMouseEnter={() => prefetchRouteChunk("/agency/apply")}
               onFocus={() => prefetchRouteChunk("/agency/apply")}
               className="hidden md:flex items-center gap-2 bg-[#661915]/90 hover:bg-[#661915] text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm shadow-[#661915]/20 hover:shadow"
             >
               <FileText className="w-4 h-4" /> {t("nav.newApplication")}
             </Link>

             {/* Sélecteur de langue bilingue FR/EN */}
             <LanguageSwitcher variant="outline" />

             {/* Notifications */}
             <DropdownMenu>
              <DropdownMenuTrigger className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-white/20 rounded-full transition-colors outline-none">
                <Bell className="w-5 h-5" />
                {notificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#661915] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#661915] ring-2 ring-white"></span>
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-2xl border border-slate-200 bg-white overflow-hidden">
                <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-800">{isEn ? "Notifications" : "Notifications"}</span>
                  {notificationsCount > 0 && (
                    <span className="bg-[#661915]/10 text-[#661915] px-2 py-0.5 rounded-full text-xs font-bold">{notificationsCount}</span>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notificationsCount === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                       <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                       <p className="text-sm">{isEn ? "No new notifications" : "Aucune nouvelle notification"}</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {unreadNotifications.map(notif => (
                        <div key={notif.id} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => handleNotificationClick(notif.id, notif.link)}>
                           <p className="text-sm font-bold text-slate-800 mb-1 leading-tight">{notif.title}</p>
                           <p className="text-xs text-slate-500 line-clamp-2">{notif.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {notificationsCount > 0 && (
                  <div className="p-2 border-t border-slate-100 bg-slate-50">
                    <button className="w-full py-2 text-xs font-bold text-[#661915] hover:bg-[#661915]/10 rounded-lg transition-colors" onClick={handleMarkAllRead}>
                      {isEn ? "Mark all as read" : "Tout marquer comme lu"}
                    </button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile */}
            <div className="w-9 h-9 rounded-full bg-white/80 border border-slate-200/80 flex items-center justify-center text-[#661915] shadow-2xs">
              <User className="w-5 h-5" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="mx-auto max-w-[1600px]">
            {isSuspended && (
              <div className="mb-6 p-5 bg-red-50 border-2 border-red-300 rounded-2xl flex items-start gap-3 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs text-red-900 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm">{isEn ? "Agency Account Temporarily Suspended" : "Compte Agence Temporairement Suspendu"}</span>
                    {currentAgency.bannedUntil && (
                      <span className="bg-red-200 text-red-900 px-2 py-0.5 rounded-full font-bold text-[10px]">
                        {isEn ? `Until ${new Date(currentAgency.bannedUntil).toLocaleDateString()}` : `Jusqu'au ${new Date(currentAgency.bannedUntil).toLocaleDateString()}`}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 leading-relaxed">
                    {isEn ? "Your access to applications and B2B wallet is restricted by administration." : "Votre accès aux dépôts de demandes et au solde B2B est restreint par l'administration."}
                    {currentAgency.banReason && (
                      <span className="block mt-1 font-semibold italic text-red-800">
                        {isEn ? `Reason: ${currentAgency.banReason}` : `Motif : ${currentAgency.banReason}`}
                      </span>
                    )}
                  </p>
                  {!isSupportRoute && (
                    <Link to="/agency/support" className="inline-block mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors">
                      {isEn ? "Contact emergency support to restore your account →" : "Contacter le support d'urgence pour régulariser votre compte →"}
                    </Link>
                  )}
                </div>
              </div>
            )}
            {(!isSuspended || isSupportRoute) && (
              <ErrorBoundary scoped key={location.pathname}>
                <Suspense fallback={<OutletLoader />}>
                  <Outlet />
                </Suspense>
              </ErrorBoundary>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
