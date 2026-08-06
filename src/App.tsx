import { BrowserRouter as Router, Routes, Route, Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Earth, FileText, Users, DollarSign, HelpCircle, Bell, Menu, LogOut, Settings, MapPin } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { VisaEditor } from "@/components/admin/VisaEditor";
import { AgencyManagement } from "@/components/admin/AgencyManagement";
import { FinancesManagement } from "@/components/admin/FinancesManagement";
import { ApplicationManagement } from "@/components/admin/ApplicationManagement";
import { SupportManagement } from "@/components/admin/SupportManagement";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminSettings } from "@/components/admin/AdminSettings";
import OrganizedTripsManagement from "@/components/admin/OrganizedTripsManagement";
import { AgencyLayout } from "@/components/agency/AgencyLayout";
import { VisaWizard } from "@/components/agency/VisaWizard";
import { AgencyDashboard } from "@/components/agency/Dashboard";
import { AgencyApplications } from "@/components/agency/AgencyApplications";
import { AgencyWallet } from "@/components/agency/AgencyWallet";
import { AgencySupport } from "@/components/agency/AgencySupport";
import { AgencySettings } from "@/components/agency/AgencySettings";
import { PassportIndex } from "@/components/agency/PassportIndex";
import OrganizedTrips from "@/components/agency/OrganizedTrips";
import { LandingPage } from "@/components/LandingPage";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Login } from "@/components/auth/Login";
import { Register } from "@/components/auth/Register";
import { useState } from "react";

// Admin Layout
function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                  <img src="/logo.png" alt="La Clé d'Or Visa" className="h-8 object-contain" />
                </Link>
              </div>
              
              {/* Desktop Menu */}
              <nav className="hidden xl:flex space-x-1 ml-4 items-center">
                <NavLinks />
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white pointer-events-none"></span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                      <span className="text-sm font-medium">New Recharge Request</span>
                      <span className="text-xs text-gray-500 mt-1">Global Travel requested 50,000 DA</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                      <span className="text-sm font-medium">Urgent Ticket Options</span>
                      <span className="text-xs text-gray-500 mt-1">Wanderlust Tours opened a new ticket</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-center font-medium text-blue-600 justify-center">
                      Mark all as read
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
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
        <Outlet />
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
        <h2 className="text-2xl font-semibold tracking-tight">Countries & Visa Types</h2>
        <button onClick={handleAddCountry} className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition">Add Country</button>
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
        <DialogContent className="max-w-4xl p-0 border-none bg-transparent shadow-none">
          <div className="sr-only"><h3>Edit Visa Type</h3></div>
          {selectedCountryId && <VisaEditor countryId={selectedCountryId} onSave={() => setEditorOpen(false)} onCancel={() => setEditorOpen(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// App Router
export default function App() {
  return (
    <Router>
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
      </Router>
  );
}
