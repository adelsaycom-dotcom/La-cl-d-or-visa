import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Earth, FileText, Users, DollarSign, HelpCircle, Bell, Menu, LogOut, Settings } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { VisaEditor } from "@/components/admin/VisaEditor";
import { AgencyManagement } from "@/components/admin/AgencyManagement";
import { FinancesManagement } from "@/components/admin/FinancesManagement";
import { ApplicationManagement } from "@/components/admin/ApplicationManagement";
import { SupportManagement } from "@/components/admin/SupportManagement";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AgencyLayout } from "@/components/agency/AgencyLayout";
import { VisaWizard } from "@/components/agency/VisaWizard";
import { AgencyDashboard } from "@/components/agency/Dashboard";
import { AgencyApplications } from "@/components/agency/AgencyApplications";
import { AgencyWallet } from "@/components/agency/AgencyWallet";
import { AgencySupport } from "@/components/agency/AgencySupport";
import { AgencySettings } from "@/components/agency/AgencySettings";
import { PassportIndex } from "@/components/agency/PassportIndex";
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
      <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 font-medium">
        <LayoutDashboard className="h-5 w-5" /> Dashboard
      </Link>
      <Link to="/admin/countries" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 font-medium">
        <Earth className="h-5 w-5" /> Countries & Visas
      </Link>
      <Link to="/admin/agencies" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 font-medium">
        <Users className="h-5 w-5" /> Agencies
      </Link>
      <Link to="/admin/applications" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 font-medium">
        <FileText className="h-5 w-5" /> Applications
      </Link>
      <Link to="/admin/finances" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 font-medium">
        <DollarSign className="h-5 w-5" /> Finances
      </Link>
      <Link to="/admin/support" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 font-medium">
        <HelpCircle className="h-5 w-5" /> Support
      </Link>
      <Link to="/admin/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 font-medium">
        <Settings className="h-5 w-5" /> Settings
      </Link>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold font-sans">Visa B2B Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-gray-200 shrink-0">
          <Link to="/login" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-50 font-medium text-red-600 hover:text-red-700 transition-colors">
            <LogOut className="h-5 w-5" /> Sign Out
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-white flex items-center justify-between md:justify-end px-4 md:px-8 shrink-0">
          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Open Menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 flex flex-col">
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

          <DropdownMenu>
            <DropdownMenuTrigger className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
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
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// Admin Countries Page (Placeholder for Visa Management)
function AdminCountries() {
  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Countries & Visa Types</h2>
        <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition">Add Country</button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl" role="img" aria-label="UAE">🇦🇪</span>
              <h3 className="font-bold text-lg">United Arab Emirates</h3>
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Active</span>
          </div>
          <p className="text-sm text-gray-500">2 Visa Types configured.</p>
          <button 
            className="text-sm font-medium text-blue-600 hover:text-blue-800 self-start"
            onClick={() => setEditorOpen(true)}
          >
            Manage Visas &rarr;
          </button>
        </div>
      </div>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-4xl p-0 border-none bg-transparent shadow-none">
          {/* Include accessibility title */}
          <div className="sr-only"><h3>Edit Visa Type</h3></div>
          <VisaEditor countryId="1" onSave={() => setEditorOpen(false)} onCancel={() => setEditorOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// App Router
export default function App() {
  return (
    <BrowserRouter>
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
          <Route path="finances" element={<FinancesManagement />} />
          <Route path="support" element={<SupportManagement />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Agency Space */}
        <Route path="/agency" element={<AgencyLayout />}>
          <Route index element={<AgencyDashboard />} />
          <Route path="apply" element={<VisaWizard />} />
          <Route path="applications" element={<AgencyApplications />} />
          <Route path="wallet" element={<AgencyWallet />} />
          <Route path="support" element={<AgencySupport />} />
          <Route path="settings" element={<AgencySettings />} />
          <Route path="passport-index" element={<PassportIndex />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
