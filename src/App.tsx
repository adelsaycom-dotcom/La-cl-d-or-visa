import { motion, AnimatePresence } from "framer-motion";
import { useFirebaseSync } from "./hooks/useFirebaseSync";
import { BrowserRouter as Router, Routes, Route, Outlet, Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Globe2, LayoutDashboard, FileText, Users, DollarSign, HelpCircle, Bell, Menu, LogOut, Settings, MapPin, GraduationCap, X, ChevronRight, AlertTriangle, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import React, { useState, useEffect, lazy, Suspense, useMemo, useCallback, ComponentType } from "react";
import { useAppStore } from "./store/useAppStore";
import { Logo } from '@/components/Logo';
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { ToastProvider } from "@/components/ui/toast";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ErrorBoundary, isChunkLoadError } from "@/components/common/ErrorBoundary";
import { prefetchRouteChunk, prefetchAdminPortalChunks } from "./utils/routePrefetch";

const CHUNK_RELOAD_KEY = "cldor_chunk_reload_ts";

/**
 * Enveloppe React.lazy avec rechargement automatique sécurisé (1 fois max)
 * lorsque les chunks Vite changent suite à un déploiement sur Hostinger.
 */
function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      const mod = await factory();
      try {
        sessionStorage.removeItem(CHUNK_RELOAD_KEY);
      } catch {
        // Ignorer
      }
      return mod;
    } catch (error) {
      if (isChunkLoadError(error)) {
        try {
          const lastReload = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || "0");
          if (Date.now() - lastReload > 15000) {
            sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
            window.location.reload();
            return new Promise<{ default: T }>(() => {});
          }
        } catch {
          // Ignorer si sessionStorage bloqué
        }
      }
      throw error;
    }
  });
}

import { LandingPage } from "@/components/LandingPage";

// Code Splitting & Lazy Loading avec reprise automatique sur Hostinger pour les autres routes
const Login = lazyWithRetry(() => import("@/components/auth/Login").then(m => ({ default: m.Login })));
const Register = lazyWithRetry(() => import("@/components/auth/Register").then(m => ({ default: m.Register })));

// Lazy loaded page components
const AgencyManagement = lazyWithRetry(() => import("@/components/admin/AgencyManagement").then(m => ({ default: m.AgencyManagement })));
const FinancesManagement = lazyWithRetry(() => import("@/components/admin/FinancesManagement").then(m => ({ default: m.FinancesManagement })));
const ApplicationManagement = lazyWithRetry(() => import("@/components/admin/ApplicationManagement").then(m => ({ default: m.ApplicationManagement })));
const SupportManagement = lazyWithRetry(() => import("@/components/admin/SupportManagement").then(m => ({ default: m.SupportManagement })));
const AdminDashboard = lazyWithRetry(() => import("@/components/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminSettings = lazyWithRetry(() => import("@/components/admin/AdminSettings").then(m => ({ default: m.AdminSettings })));
const ServiceCatalog = lazyWithRetry(() => import("@/components/admin/ServiceCatalog").then(m => ({ default: m.ServiceCatalog })));
const OrganizedTripsManagement = lazyWithRetry(() => import("@/components/admin/OrganizedTripsManagement"));
const StudyProgramsManagement = lazyWithRetry(() => import("@/components/admin/StudyProgramsManagement"));

const AgencyLayout = lazyWithRetry(() => import("@/components/agency/AgencyLayout").then(m => ({ default: m.AgencyLayout })));
const VisaWizard = lazyWithRetry(() => import("@/components/agency/VisaWizard").then(m => ({ default: m.VisaWizard })));
const AgencyDashboard = lazyWithRetry(() => import("@/components/agency/Dashboard").then(m => ({ default: m.AgencyDashboard })));
const AgencyApplications = lazyWithRetry(() => import("@/components/agency/AgencyApplications").then(m => ({ default: m.AgencyApplications })));
const AgencyWallet = lazyWithRetry(() => import("@/components/agency/AgencyWallet").then(m => ({ default: m.AgencyWallet })));
const AgencySupport = lazyWithRetry(() => import("@/components/agency/AgencySupport").then(m => ({ default: m.AgencySupport })));
const AgencySettings = lazyWithRetry(() => import("@/components/agency/AgencySettings").then(m => ({ default: m.AgencySettings })));
const PassportIndex = lazyWithRetry(() => import("@/components/agency/PassportIndex").then(m => ({ default: m.PassportIndex })));
const OrganizedTrips = lazyWithRetry(() => import("@/components/agency/OrganizedTrips"));
const StudyPrograms = lazyWithRetry(() => import("@/components/agency/StudyPrograms"));

const SuspenseFallback = () => (
  <div className="flex justify-center items-center h-full w-full p-8 text-gray-500 min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B1B38]"></div>
  </div>
);

// Admin Layout optimisé avec mémoïsation
function AdminLayout() {
  const { language, t } = useLanguage();
  const isEn = language === "en";
  const notifications = useAppStore(state => state.notifications);
  const markNotificationAsRead = useAppStore(state => state.markNotificationAsRead);
  const markAllNotificationsAsRead = useAppStore(state => state.markAllNotificationsAsRead);

  // Mémoïsation du filtrage et du tri des notifications pour éviter des instanciations de Date à chaque cycle
  const unreadNotifications = useMemo(() => {
    if (!notifications) return [];
    return notifications
      .filter(n => !n.read && n.agencyId === 'admin')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications]);

  const adminNotifsCount = unreadNotifications.length;
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Préchargement silencieux des chunks de la console admin en arrière-plan
  useEffect(() => {
    prefetchAdminPortalChunks();
  }, []);

  // Mémoïsation des éléments de navigation selon la langue
  const navItems = useMemo(() => [
    { name: t("nav.dashboard"), path: "/admin", icon: LayoutDashboard },
    { name: t("nav.serviceCatalog"), path: "/admin/countries", icon: Globe2 },
    { name: t("nav.myApplications"), path: "/admin/applications", icon: FileText, highlight: true },
    { name: t("nav.organizedTrips"), path: "/admin/trips", icon: MapPin },
    { name: t("nav.studyVisa"), path: "/admin/study", icon: GraduationCap },
    { name: t("nav.agencies"), path: "/admin/agencies", icon: Users },
    { name: t("nav.finances"), path: "/admin/finances", icon: DollarSign },
    { name: t("nav.support"), path: "/admin/support", icon: HelpCircle },
    { name: t("nav.settings"), path: "/admin/settings", icon: Settings },
  ], [t]);

  const handleNotificationClick = useCallback((notifId: string, link?: string) => {
    markNotificationAsRead(notifId);
    if (link) navigate(link);
  }, [markNotificationAsRead, navigate]);

  const handleMarkAllRead = useCallback(() => {
    markAllNotificationsAsRead('admin');
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
                onMouseEnter={() => prefetchRouteChunk(item.path)}
                onFocus={() => prefetchRouteChunk(item.path)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 group ${
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
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-colors group font-semibold text-sm cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-600 transition-colors" />
            <span>{t("nav.logout")}</span>
          </button>
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
                        <div key={notif.id} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => handleNotificationClick(notif.id, notif.link)}>
                           <p className="text-sm font-bold text-slate-800 mb-1 leading-tight">{notif.title}</p>
                           <p className="text-xs text-slate-500 line-clamp-2">{notif.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {adminNotifsCount > 0 && (
                  <div className="p-2 border-t border-slate-100 bg-white">
                    <button className="w-full py-2 text-xs font-bold text-[#7B1B38] hover:bg-[#7B1B38]/10 rounded-lg transition-colors" onClick={handleMarkAllRead}>
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
            <ErrorBoundary scoped key={location.pathname}>
              <Suspense fallback={<SuspenseFallback />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  useFirebaseSync();
  const quotaExceeded = useAppStore(state => state.quotaExceeded);
  const databaseMode = useAppStore(state => state.databaseMode);

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ToastProvider>
          {databaseMode !== 'mysql' && quotaExceeded && (
            <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-950 px-4 py-2 text-xs flex items-center justify-between gap-3 sticky top-0 z-[999] backdrop-blur-md">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                <span className="font-semibold truncate">
                  Quota journalier gratuit Firestore (Spark) atteint. Les données restent accessibles en cache local et le quota sera réinitialisé demain.
                </span>
              </div>
              <a
                href="https://console.firebase.google.com/project/project-ffd6a722-67cd-492b-a21/firestore/databases/ai-studio-visab2bplatform-997b6e64-cd61-4897-9e6a-a46f23376287/data?openUpgradeDialog=true"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline text-amber-900 hover:text-black shrink-0 text-xs"
              >
                Mettre à niveau dans Firebase Console
              </a>
            </div>
          )}
          <Router>
            <Suspense fallback={<SuspenseFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Admin Space - Protected */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
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
              </Route>

              {/* Agency Space - Protected */}
              <Route element={<ProtectedRoute requiredRole="agency" />}>
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
              </Route>
              {/* Route fallback 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          </Router>
        </ToastProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
