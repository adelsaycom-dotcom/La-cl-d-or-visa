import { motion, AnimatePresence } from "framer-motion";
import { useFirebaseSync } from "./hooks/useFirebaseSync";
import { BrowserRouter as Router, Routes, Route, Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Globe2, LayoutDashboard, Earth, FileText, Users, DollarSign, HelpCircle, Bell, Menu, LogOut, Settings, MapPin, GraduationCap, X, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import React, { useState, useEffect, lazy, Suspense } from "react";
import { useAppStore } from "./store/useAppStore";
import { Logo } from '@/components/Logo';
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { ToastProvider } from "@/components/ui/toast";

// Eager imports for layout & auth components
import { VisaEditor } from "@/components/admin/VisaEditor";
import { LandingPage } from "@/components/LandingPage";
import { Login } from "@/components/auth/Login";
import { Register } from "@/components/auth/Register";

// Lazy loaded page components
const AgencyManagement = lazy(() => import("@/components/admin/AgencyManagement").then(m => ({ default: m.AgencyManagement })));
const FinancesManagement = lazy(() => import("@/components/admin/FinancesManagement").then(m => ({ default: m.FinancesManagement })));
const ApplicationManagement = lazy(() => import("@/components/admin/ApplicationManagement").then(m => ({ default: m.ApplicationManagement })));
const SupportManagement = lazy(() => import("@/components/admin/SupportManagement").then(m => ({ default: m.SupportManagement })));
const AdminDashboard = lazy(() => import("@/components/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminSettings = lazy(() => import("@/components/admin/AdminSettings").then(m => ({ default: m.AdminSettings })));
const ServiceCatalog = lazy(() => import("@/components/admin/ServiceCatalog").then(m => ({ default: m.ServiceCatalog })));
const OrganizedTripsManagement = lazy(() => import("@/components/admin/OrganizedTripsManagement"));
const StudyProgramsManagement = lazy(() => import("@/components/admin/StudyProgramsManagement"));

const AgencyLayout = lazy(() => import("@/components/agency/AgencyLayout").then(m => ({ default: m.AgencyLayout })));
const VisaWizard = lazy(() => import("@/components/agency/VisaWizard").then(m => ({ default: m.VisaWizard })));
const AgencyDashboard = lazy(() => import("@/components/agency/Dashboard").then(m => ({ default: m.AgencyDashboard })));
const AgencyApplications = lazy(() => import("@/components/agency/AgencyApplications").then(m => ({ default: m.AgencyApplications })));
const AgencyWallet = lazy(() => import("@/components/agency/AgencyWallet").then(m => ({ default: m.AgencyWallet })));
const AgencySupport = lazy(() => import("@/components/agency/AgencySupport").then(m => ({ default: m.AgencySupport })));
const AgencySettings = lazy(() => import("@/components/agency/AgencySettings").then(m => ({ default: m.AgencySettings })));
const PassportIndex = lazy(() => import("@/components/agency/PassportIndex").then(m => ({ default: m.PassportIndex })));
const OrganizedTrips = lazy(() => import("@/components/agency/OrganizedTrips"));
const StudyPrograms = lazy(() => import("@/components/agency/StudyPrograms"));

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.error("ErrorBoundary caught error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-4">
            <h2 className="text-xl font-black text-slate-900">Actualisation requise</h2>
            <p className="text-xs text-slate-500">
              Une nouvelle version de la plateforme a été chargée. Veuillez recharger la page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full h-11 bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const SuspenseFallback = () => (
  <div className="flex justify-center items-center h-full w-full p-8 text-gray-500">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-gold"></div>
  </div>
);

// Admin Layout
function AdminLayout() {
  const { language, t } = useLanguage();
  const isEn = language === "en";
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppStore();
  const unreadNotifications = (notifications || []).filter(n => !n.read && n.agencyId === 'admin').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const adminNotifsCount = unreadNotifications.length;
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: t("nav.dashboard"), path: "/admin", icon: LayoutDashboard },
    { name: t("nav.serviceCatalog"), path: "/admin/countries", icon: Globe2 },
    { name: t("nav.myApplications"), path: "/admin/applications", icon: FileText, highlight: true },
    { name: t("nav.organizedTrips"), path: "/admin/trips", icon: MapPin },
    { name: t("nav.studyVisa"), path: "/admin/study", icon: GraduationCap },
    { name: t("nav.agencies"), path: "/admin/agencies", icon: Users },
    { name: t("nav.finances"), path: "/admin/finances", icon: DollarSign },
    { name: t("nav.support"), path: "/admin/support", icon: HelpCircle },
    { name: t("nav.settings"), path: "/admin/settings", icon: Settings },
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
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white text-slate-900 border-r border-slate-200/80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shrink-0 flex flex-col shadow-xl lg:shadow-xs ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
          <Link to="/admin" className="flex items-center gap-3">
             <Logo imageClassName="h-8 w-auto" />
             <div className="flex flex-col">
               <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none">{t("nav.administration")}</span>
               <span className="text-[10px] text-[#7B1B38] font-bold uppercase tracking-wider mt-1">{isEn ? "Admin Console" : "Console Centrale"}</span>
             </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-800 p-1 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-[#7B1B38] text-white shadow-sm shadow-[#7B1B38]/25 font-bold' 
                    : item.highlight
                      ? 'bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100/70 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : item.highlight ? 'text-amber-600' : 'text-slate-500 group-hover:text-slate-800'} transition-colors`} />
                  <span className="text-sm">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-100 shrink-0">
          <Link to="/login" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-colors group font-semibold text-sm">
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-600 transition-colors" />
            <span>{t("nav.logout")}</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-900">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-800 hidden sm:block">
              {navItems.find(i => location.pathname === i.path || (i.path !== '/admin' && location.pathname.startsWith(i.path)))?.name || t("nav.administration")}
            </h1>
          </div>

          <div className="flex items-center gap-3">
             {/* Sélecteur de langue bilingue FR/EN */}
             <LanguageSwitcher variant="outline" />

             {/* Notifications */}
             <DropdownMenu>
              <DropdownMenuTrigger className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors outline-none">
                <Bell className="w-5 h-5" />
                {adminNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B1B38] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#7B1B38] border-2 border-white"></span>
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-xl border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-800">{isEn ? "Admin Alerts" : "Alertes Admin"}</span>
                  {adminNotifsCount > 0 && (
                    <span className="bg-[#7B1B38]/10 text-[#7B1B38] px-2 py-0.5 rounded-full text-xs font-bold">{adminNotifsCount}</span>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {adminNotifsCount === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                       <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                       <p className="text-sm">{isEn ? "No new admin alerts" : "Aucune nouvelle alerte"}</p>
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
                {adminNotifsCount > 0 && (
                  <div className="p-2 border-t border-slate-100 bg-white">
                    <button className="w-full py-2 text-xs font-bold text-[#7B1B38] hover:bg-[#7B1B38]/10 rounded-lg transition-colors" onClick={() => markAllNotificationsAsRead('admin')}>
                      {isEn ? "Mark all as read" : "Tout marquer comme lu"}
                    </button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="w-9 h-9 rounded-full bg-[#7B1B38] flex items-center justify-center text-white shadow-md shadow-[#7B1B38]/20">
              <span className="font-bold text-sm">AD</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="mx-auto max-w-[1600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  useFirebaseSync();
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ToastProvider>
          <Router>
            <Suspense fallback={<SuspenseFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Admin Space */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="countries" element={<ServiceCatalog />} />
                <Route path="agencies" element={<AgencyManagement />} />
                <Route path="applications" element={<ApplicationManagement />} />
                <Route path="trips" element={<OrganizedTripsManagement />} />
                <Route path="study" element={<StudyProgramsManagement />} />
                <Route path="finances" element={<FinancesManagement />} />
                <Route path="support" element={<SupportManagement />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Agency Space */}
              <Route path="/agency" element={<AgencyLayout />}>
                <Route index element={<AgencyDashboard />} />
                <Route path="apply" element={<VisaWizard />} />
                <Route path="applications" element={<AgencyApplications />} />
                <Route path="trips" element={<OrganizedTrips />} />
                <Route path="study" element={<StudyPrograms />} />
                <Route path="wallet" element={<AgencyWallet />} />
                <Route path="support" element={<AgencySupport />} />
                <Route path="settings" element={<AgencySettings />} />
                <Route path="passport-index" element={<PassportIndex />} />
              </Route>
            </Routes>
          </Suspense>
          </Router>
        </ToastProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
