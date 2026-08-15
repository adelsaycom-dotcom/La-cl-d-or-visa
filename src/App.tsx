import { motion, AnimatePresence } from "framer-motion";
import { useFirebaseSync } from "./hooks/useFirebaseSync";
import { BrowserRouter as Router, Routes, Route, Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Earth, FileText, Users, DollarSign, HelpCircle, Bell, Menu, LogOut, Settings, MapPin } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, lazy, Suspense } from "react";
import { Logo } from '@/components/Logo';

// Eager imports for layout components
import { VisaEditor } from "@/components/admin/VisaEditor";
import { LandingPage } from "@/components/LandingPage";

// Lazy loaded page components
const AgencyManagement = lazy(() => import("@/components/admin/AgencyManagement").then(m => ({ default: m.AgencyManagement })));
const FinancesManagement = lazy(() => import("@/components/admin/FinancesManagement").then(m => ({ default: m.FinancesManagement })));
const ApplicationManagement = lazy(() => import("@/components/admin/ApplicationManagement").then(m => ({ default: m.ApplicationManagement })));
const SupportManagement = lazy(() => import("@/components/admin/SupportManagement").then(m => ({ default: m.SupportManagement })));
const AdminDashboard = lazy(() => import("@/components/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminSettings = lazy(() => import("@/components/admin/AdminSettings").then(m => ({ default: m.AdminSettings })));
const OrganizedTripsManagement = lazy(() => import("@/components/admin/OrganizedTripsManagement"));

const AgencyLayout = lazy(() => import("@/components/agency/AgencyLayout").then(m => ({ default: m.AgencyLayout })));
const VisaWizard = lazy(() => import("@/components/agency/VisaWizard").then(m => ({ default: m.VisaWizard })));
const AgencyDashboard = lazy(() => import("@/components/agency/Dashboard").then(m => ({ default: m.AgencyDashboard })));
const AgencyApplications = lazy(() => import("@/components/agency/AgencyApplications").then(m => ({ default: m.AgencyApplications })));
const AgencyWallet = lazy(() => import("@/components/agency/AgencyWallet").then(m => ({ default: m.AgencyWallet })));
const AgencySupport = lazy(() => import("@/components/agency/AgencySupport").then(m => ({ default: m.AgencySupport })));
const AgencySettings = lazy(() => import("@/components/agency/AgencySettings").then(m => ({ default: m.AgencySettings })));
const PassportIndex = lazy(() => import("@/components/agency/PassportIndex").then(m => ({ default: m.PassportIndex })));
const OrganizedTrips = lazy(() => import("@/components/agency/OrganizedTrips"));

const Login = lazy(() => import("@/components/auth/Login").then(m => ({ default: m.Login })));
const Register = lazy(() => import("@/components/auth/Register").then(m => ({ default: m.Register })));

const SuspenseFallback = () => (
  <div className="flex justify-center items-center h-full w-full p-8 text-gray-500">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-gold"></div>
  </div>
);

// Admin Layout
function AdminLayout() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppStore();
  const unreadNotifications = (notifications || []).filter(n => !n.read && n.agencyId === 'admin').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const adminNotifsCount = unreadNotifications.length;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const NavLinks = () => (
    <>
      <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 font-medium text-sm">
        <LayoutDashboard className="h-4 w-4" /> Dashboard
      </Link>
      <Link to="/admin/countries" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 font-medium text-sm">
        <Earth className="h-4 w-4" /> Pays & Visas
      </Link>
      <Link to="/admin/agencies" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 font-medium text-sm">
        <Users className="h-4 w-4" /> Agences
      </Link>
      <Link to="/admin/applications" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 font-medium text-sm">
        <FileText className="h-4 w-4" /> Demandes
      </Link>
      <Link to="/admin/trips" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 font-medium text-sm">
        <MapPin className="h-4 w-4" /> Voyages Organisés
      </Link>
      <Link to="/admin/finances" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 font-medium text-sm">
        <DollarSign className="h-4 w-4" /> Finances
      </Link>
      <Link to="/admin/support" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 font-medium text-sm">
        <HelpCircle className="h-4 w-4" /> Support
      </Link>
      <Link to="/admin/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 font-medium text-sm">
        <Settings className="h-4 w-4" /> Paramètres
      </Link>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div className="shrink-0 flex items-center">
                <Link to="/admin" className="text-xl font-bold font-sans text-text-dark flex items-center gap-2">
                  <span className="bg-primary-gold text-white px-2 py-1 rounded text-sm uppercase tracking-wider">Admin</span>
                  <Logo imageClassName="h-8 sm:h-10" />
                </Link>
              </div>
              
              {/* Desktop Menu */}
              <nav className="hidden xl:flex space-x-1 ml-4 items-center">
                <NavLinks />
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 outline-none">
                  <Bell className="w-5 h-5" />
                  {adminNotifsCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                    </span>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 border-gray-200 overflow-hidden shadow-xl rounded-xl">
                  <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                    <span className="font-bold text-gray-900">Notifications Admin</span>
                    {adminNotifsCount > 0 && (
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">{adminNotifsCount} nouvelle(s)</span>
                    )}
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    {adminNotifsCount === 0 ? (
                      <div className="p-8 text-center flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                          <Bell className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">Aucune nouvelle notification</p>
                        <p className="text-xs text-gray-500 mt-1">Vous êtes à jour !</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        <AnimatePresence>
                          {unreadNotifications.map(notif => (
                            <motion.div 
                              key={notif.id}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="group p-4 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 items-start"
                              onClick={() => {
                                markNotificationAsRead(notif.id);
                                if(notif.link) navigate(notif.link);
                              }}
                            >
                              <div className={`shrink-0 w-2 h-2 mt-2 rounded-full ${notif.type === 'success' ? 'bg-green-500' : notif.type === 'error' ? 'bg-red-500' : notif.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-bold text-gray-900 leading-tight">{notif.title}</p>
                                <p className="text-xs text-gray-600 line-clamp-2">{notif.message}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{new Date(notif.createdAt).toLocaleString()}</p>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                  {adminNotifsCount > 0 && (
                    <div className="p-2 border-t bg-gray-50">
                      <button 
                        className="w-full py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        onClick={() => markAllNotificationsAsRead("admin")}
                      >
                        Tout marquer comme lu
                      </button>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Trigger */}
              <div className="xl:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger className="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100">
                    <Menu className="w-6 h-6" />
                    <span className="sr-only">Open Menu</span>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-72 p-0 flex flex-col bg-white">
                    <div className="p-4 border-b border-gray-200 mt-8">
                      <h1 className="text-xl font-bold font-sans">Visa B2B Admin</h1>
                    </div>
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                      <NavLinks />
                    </nav>
                    <div className="p-4 border-t border-gray-200 shrink-0 mb-4">
                      <Link to="/login" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-50 font-medium text-red-600 hover:text-red-700 transition-colors">
                        <LogOut className="h-5 w-5" /> Sign Out
                      </Link>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              
              {/* Logout (Desktop) */}
              <Link to="/login" className="hidden xl:flex items-center p-2 text-gray-500 hover:text-red-600 transition-colors rounded-full hover:bg-red-50" title="Se déconnecter">
                <LogOut className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full bg-gray-50 px-4 md:px-8 py-8 md:py-10 mx-auto max-w-[1600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={useLocation().pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// Admin Countries Page (Placeholder for Visa Management)
import { useAppStore } from "./store/useAppStore";

function AdminCountries() {
  const { countries, addCountry } = useAppStore();
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [isAddCountryOpen, setIsAddCountryOpen] = useState(false);
  const [newCountryName, setNewCountryName] = useState("");
  const [newCountryFlag, setNewCountryFlag] = useState("🏳️");

  const handleAddCountry = () => {
    const name = prompt("Enter Country Name:");
    if (!name) return;
    const flag = prompt("Enter Country Flag (Emoji):", "🏳️");
    addCountry({
      id: Date.now().toString(),
      name,
      flag: flag || "🏳️",
      active: true,
      visaTypes: []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Pays & Types de Visas</h2>
        <button onClick={() => setIsAddCountryOpen(true)} className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition">Ajouter un pays</button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {countries.map(country => (
        <div key={country.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl" role="img" aria-label={country.name}>{country.flag}</span>
              <h3 className="font-bold text-lg">{country.name}</h3>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${country.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{country.active ? 'Active' : 'Inactive'}</span>
          </div>
          <p className="text-sm text-gray-500">{country.visaTypes.length} Visa Types configured.</p>
          <button 
            className="text-sm font-medium text-blue-600 hover:text-blue-800 self-start"
            onClick={() => {
              setSelectedCountryId(country.id);
              setEditorOpen(true);
            }}
          >
            Manage Visas &rarr;
          </button>
        </div>
        ))}
      </div>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-4xl sm:max-w-4xl p-0 border-none bg-transparent shadow-none">
          <div className="sr-only"><h3>Edit Visa Type</h3></div>
          {selectedCountryId && <VisaEditor countryId={selectedCountryId} onSave={() => setEditorOpen(false)} onCancel={() => setEditorOpen(false)} />}
        </DialogContent>
      </Dialog>
      <Dialog open={isAddCountryOpen} onOpenChange={setIsAddCountryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col gap-4 py-4">
            <h3 className="text-lg font-bold">Ajouter un pays</h3>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Nom du pays</label>
              <input className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={newCountryName} onChange={(e) => setNewCountryName(e.target.value)} placeholder="Ex: France" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Drapeau (Emoji)</label>
              <input className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={newCountryFlag} onChange={(e) => setNewCountryFlag(e.target.value)} placeholder="Ex: 🇫🇷" />
            </div>
            <button onClick={() => {
              if (newCountryName) {
                addCountry({
                  id: Date.now().toString(),
                  name: newCountryName,
                  flag: newCountryFlag || "🏳️",
                  active: true,
                  visaTypes: []
                });
                setIsAddCountryOpen(false);
                setNewCountryName("");
                setNewCountryFlag("🏳️");
              }
            }} className="w-full bg-black hover:bg-gray-800 text-white h-10 rounded-md font-medium">Ajouter</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// App Router
export default function App() {
  useFirebaseSync();
  return (
    <Router>
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Space */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="countries" element={<AdminCountries />} />
            <Route path="agencies" element={<AgencyManagement />} />
            <Route path="applications" element={<ApplicationManagement />} />
            <Route path="trips" element={<OrganizedTripsManagement />} />
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
            <Route path="wallet" element={<AgencyWallet />} />
            <Route path="support" element={<AgencySupport />} />
            <Route path="settings" element={<AgencySettings />} />
            <Route path="passport-index" element={<PassportIndex />} />
          </Route>
        </Routes>
      </Suspense>
      </Router>
  );
}
