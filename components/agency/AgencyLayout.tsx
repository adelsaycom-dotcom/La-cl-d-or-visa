import { Outlet, Link } from "react-router-dom";
import { LayoutDashboard, WalletCards, Bell, HelpCircle, FileText, Globe, Menu, LogOut, Settings, Map } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function AgencyLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavLinks = () => (
    <>
      <Link to="/agency" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-colors">
        <LayoutDashboard className="h-5 w-5" /> Tableau de Bord
      </Link>
      <Link to="/agency/apply" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-colors">
        <Globe className="h-5 w-5" /> Nouvelle Demande
      </Link>
      <Link to="/agency/applications" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-colors">
        <FileText className="h-5 w-5" /> Mes Demandes
      </Link>
      <Link to="/agency/passport-index" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-colors">
        <Map className="h-5 w-5" /> Passport Index
      </Link>
      <Link to="/agency/wallet" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-colors">
        <WalletCards className="h-5 w-5" /> Portefeuille & Facturation
      </Link>
      <Link to="/agency/support" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-colors">
        <HelpCircle className="h-5 w-5" /> Tickets Support
      </Link>
      <Link to="/agency/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-colors">
        <Settings className="h-5 w-5" /> Paramètres
      </Link>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#0a192f] text-gray-300 flex-col shrink-0">
        <div className="p-6 h-16 shrink-0 flex flex-col justify-center">
          <h1 className="text-xl font-bold font-sans text-white">Global Travel Exp.</h1>
          <div className="mt-1 text-xs text-[#8892b0] flex gap-2">
            Statut: <span className="text-[#64ffda] font-medium">Actif</span>
          </div>
        </div>
        <nav className="flex-1 px-4 mt-6 space-y-2 overflow-y-auto">
          <NavLinks />
        </nav>
        <div className="px-4 pb-4">
          <div className="p-4 mb-4 bg-[#112240] rounded-xl border border-white/5 shrink-0">
            <div className="text-sm font-medium text-gray-400">Solde Actuel</div>
            <div className="text-2xl font-bold text-[#64ffda] mt-1 shrink-0">4,500 DA</div>
          </div>
          <div className="pt-4 border-t border-white/10 shrink-0">
            <Link to="/login" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors">
              <LogOut className="h-5 w-5" /> Se déconnecter
            </Link>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        {/* Header Notification icon etc */}
        <header className="h-16 shrink-0 bg-white border-b px-4 md:px-8 flex items-center justify-between md:justify-end">
          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Open Menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 flex flex-col bg-[#0a192f] text-gray-300 border-r-0">
                <div className="p-6 mt-6 shrink-0 flex flex-col justify-center">
                  <h1 className="text-xl font-bold font-sans text-white">Global Travel Exp.</h1>
                  <div className="mt-1 text-xs text-[#8892b0] flex gap-2">
                    Statut: <span className="text-[#64ffda] font-medium">Actif</span>
                  </div>
                </div>
                <nav className="flex-1 px-4 mt-6 space-y-2 overflow-y-auto">
                  <NavLinks />
                </nav>
                <div className="px-4 pb-4 mb-4">
                  <div className="p-4 mb-4 bg-[#112240] rounded-xl border border-white/5 shrink-0">
                    <div className="text-sm font-medium text-gray-400">Solde Actuel</div>
                    <div className="text-2xl font-bold text-[#64ffda] mt-1 shrink-0">4,500 DA</div>
                  </div>
                  <div className="pt-4 border-t border-white/10 shrink-0">
                    <Link to="/login" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors">
                      <LogOut className="h-5 w-5" /> Se déconnecter
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white pointer-events-none"></span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                  <span className="text-sm font-medium text-green-600">Visa Approuvé</span>
                  <span className="text-xs text-gray-500 mt-1">La demande APP-003 pour Ali Benmoussa est approuvée !</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                  <span className="text-sm font-medium">Recharge Validée</span>
                  <span className="text-xs text-gray-500 mt-1">L'admin a ajouté 5,000 DA à votre portefeuille.</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center font-medium text-blue-600 justify-center">
                  Tout marquer comme lu
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
