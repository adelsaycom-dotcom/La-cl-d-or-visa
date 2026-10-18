import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, WalletCards, Bell, HelpCircle, FileText, 
  Settings, LogOut, Plane, Building2, ShieldCheck, MapPin, Menu, X, ChevronRight, User, Globe2,
  Eye, EyeOff, SlidersHorizontal, Percent, AlertTriangle
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from '@/components/Logo';
import { auth } from "../../src/firebase";
import { useAppStore } from "../../src/store/useAppStore";

export function AgencyLayout() {
  const { 
    agencyBalance, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    currentAgency,
    b2cMode,
    setB2cMode,
    b2cMarginPercent,
    setB2cMarginPercent
  } = useAppStore();

  const agencyDisplayName = currentAgency?.agencyName || currentAgency?.companyName || currentAgency?.name || auth.currentUser?.displayName || "Mon Agence";
  const agencyCode = currentAgency?.id ? `ID: AGE-${currentAgency.id.slice(0, 6).toUpperCase()}` : "ID: AGE-2948";
  const [showMarginInput, setShowMarginInput] = useState(false);
  const [marginTemp, setMarginTemp] = useState(b2cMarginPercent || 15);

  const unreadNotifications = (notifications || []).filter(n => !n.read).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const notificationsCount = unreadNotifications.length;
  
  const balanceColor = agencyBalance > 10000 ? "text-emerald-600" : agencyBalance > 0 ? "text-amber-600" : "text-red-600";
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: "Tableau de Bord", path: "/agency", icon: LayoutDashboard },
    { name: "Index Passeport", path: "/agency/passport-index", icon: Globe2 },
    { name: "Nouvelle Demande", path: "/agency/apply", icon: FileText, highlight: true },
    { name: "Mes Dossiers", path: "/agency/applications", icon: Plane },
    { name: "Voyages Organisés", path: "/agency/trips", icon: MapPin },
    { name: "Visa Études", path: "/agency/study", icon: FileText },
    { name: "Mon Portefeuille", path: "/agency/wallet", icon: WalletCards },
    { name: "Assistance", path: "/agency/support", icon: HelpCircle },
    { name: "Paramètres", path: "/agency/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shrink-0 flex flex-col shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <Link to="/agency" className="flex items-center gap-3">
             <Logo imageClassName="h-8 w-auto" />
             <span className="font-bold text-lg tracking-tight text-white">Espace Agence</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Agency Info */}
        <div className="px-6 py-5 border-b border-slate-800 shrink-0">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
               <Building2 className="w-5 h-5 text-slate-300" />
             </div>
             <div className="min-w-0">
               <div className="font-semibold text-sm text-white leading-tight truncate" title={agencyDisplayName}>
                 {agencyDisplayName}
               </div>
               <div className="text-xs text-slate-400 font-mono mt-0.5">{agencyCode}</div>
             </div>
           </div>
           
           <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
             <div className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">Solde Actuel</div>
             <div className="text-2xl font-bold text-white">
               {agencyBalance.toLocaleString()} <span className="text-sm font-medium text-slate-400">DZD</span>
             </div>
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/agency' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-[#7B1B38] text-white shadow-md shadow-[#7B1B38]/25' 
                    : item.highlight 
                      ? 'bg-[#7B1B38]/15 text-[#f59e0b] hover:bg-slate-800 hover:text-white'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : item.highlight ? 'text-[#f59e0b]' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`} />
                  <span className="font-semibold text-sm">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <Link to="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors group">
            <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-400" />
            <span className="font-semibold text-sm">Déconnexion</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-900 p-1">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg lg:text-2xl font-bold text-slate-800 hidden sm:block">
              {navItems.find(i => location.pathname === i.path || (i.path !== '/agency' && location.pathname.startsWith(i.path)))?.name || "Tableau de Bord"}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
             {/* B2B / B2C Counter Mode Switcher */}
             <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80 shadow-inner">
               <button
                 type="button"
                 onClick={() => setB2cMode(false)}
                 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                   !b2cMode 
                     ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                     : 'text-slate-500 hover:text-slate-900'
                 }`}
                 title="Afficher les prix d'achat B2B nets débités de votre solde"
               >
                 <span className="w-2 h-2 rounded-full bg-[#7B1B38]"></span>
                 <span className="hidden sm:inline">Tarif</span> B2B
               </button>
               <button
                 type="button"
                 onClick={() => setB2cMode(true)}
                 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                   b2cMode 
                     ? 'bg-emerald-600 text-white shadow-sm' 
                     : 'text-slate-500 hover:text-emerald-700'
                 }`}
                 title="Activer la vue comptoir client avec marge pour présenter l'écran au voyageur"
               >
                 <Eye className="w-3.5 h-3.5" />
                 <span>Comptoir B2C</span>
                 <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${b2cMode ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'}`}>
                   +{b2cMarginPercent}%
                 </span>
               </button>
               
               {/* Quick Margin Config Trigger */}
               <button
                 type="button"
                 onClick={() => setShowMarginInput(!showMarginInput)}
                 className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
                 title="Régler le taux de marge B2C"
               >
                 <SlidersHorizontal className="w-3.5 h-3.5" />
               </button>
             </div>

             {/* Popover / Mini-Dialog to adjust margin % */}
             {showMarginInput && (
               <div className="absolute top-18 right-24 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl z-50 w-72 animate-in fade-in zoom-in-95">
                 <div className="flex items-center justify-between mb-2">
                   <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                     <Percent className="w-3.5 h-3.5 text-[#7B1B38]" /> Taux de Marge B2C
                   </span>
                   <button onClick={() => setShowMarginInput(false)} className="text-slate-400 hover:text-slate-700">
                     <X className="w-4 h-4" />
                   </button>
                 </div>
                 <p className="text-[11px] text-slate-500 mb-3">
                   Fixez le pourcentage appliqué automatiquement sur les tarifs publics en vue comptoir.
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
                           ? 'bg-[#7B1B38] text-white border-[#7B1B38]' 
                           : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
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
                       className="w-full text-xs font-bold pl-3 pr-7 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B1B38]"
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
                     className="px-3 py-1.5 bg-[#7B1B38] hover:bg-[#63142c] text-white text-xs font-bold rounded-xl transition-colors"
                   >
                     Appliquer
                   </button>
                 </div>
               </div>
             )}

             {/* Quick Apply Button (Desktop) */}
             <Link to="/agency/apply" className="hidden md:flex items-center gap-2 bg-[#7B1B38] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#63142c] transition-colors shadow-sm shadow-[#7B1B38]/20 hover:shadow">
               <FileText className="w-4 h-4" /> Nouvelle Demande
             </Link>

             {/* Notifications */}
             <DropdownMenu>
              <DropdownMenuTrigger className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors outline-none">
                <Bell className="w-5 h-5" />
                {notificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B1B38] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#7B1B38] border-2 border-white"></span>
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-xl border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-800">Notifications</span>
                  {notificationsCount > 0 && (
                    <span className="bg-[#7B1B38]/10 text-[#7B1B38] px-2 py-0.5 rounded-full text-xs font-bold">{notificationsCount}</span>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notificationsCount === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                       <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                       <p className="text-sm">Aucune nouvelle notification</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {unreadNotifications.map(notif => (
                        <div key={notif.id} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => { markNotificationAsRead(notif.id); if(notif.link) navigate(notif.link); }}>
                           <p className="text-sm font-bold text-slate-800 mb-1 leading-tight">{notif.title}</p>
                           <p className="text-xs text-slate-500 line-clamp-2">{notif.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {notificationsCount > 0 && (
                  <div className="p-2 border-t border-slate-100 bg-white">
                    <button className="w-full py-2 text-xs font-bold text-[#7B1B38] hover:bg-[#7B1B38]/10 rounded-lg transition-colors" onClick={() => markAllNotificationsAsRead(auth.currentUser?.uid || "")}>
                      Tout marquer comme lu
                    </button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile */}
            <div className="w-9 h-9 rounded-full bg-[#7B1B38]/10 flex items-center justify-center border border-[#7B1B38]/20 text-[#7B1B38]">
              <User className="w-5 h-5" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {currentAgency?.status === "SUSPENDED" && (
                  <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-start gap-3 shadow-sm">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-red-900 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm">Compte Agence Temporairement Suspendu</span>
                        {currentAgency.bannedUntil && (
                          <span className="bg-red-200 text-red-900 px-2 py-0.5 rounded-full font-bold text-[10px]">
                            Jusqu'au {new Date(currentAgency.bannedUntil).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 leading-relaxed">
                        Votre accès aux dépôts de demandes et au solde B2B est restreint par l'administration.
                        {currentAgency.banReason && (
                          <span className="block mt-1 font-semibold italic text-red-800">
                            Motif : {currentAgency.banReason}
                          </span>
                        )}
                      </p>
                      <Link to="/agency/support" className="inline-block mt-2 font-bold underline text-red-700 hover:text-red-900">
                        Contacter le support d'urgence pour régulariser votre compte →
                      </Link>
                    </div>
                  </div>
                )}
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
