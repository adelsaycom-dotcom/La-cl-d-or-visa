import { Outlet, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, WalletCards, Bell, HelpCircle, FileText, Globe, Menu, LogOut, Settings, MapPin, ChevronDown, Plane, Building2, Car, ShieldCheck, GraduationCap, Mail, CalendarDays } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useAppStore } from "../../src/store/useAppStore";

export function AgencyLayout() {
    const { agencyBalance, applications, rechargeRequests, supportTickets } = useAppStore();
  
  // Dynamic notifications for Agency
  const recentApps = applications.filter(a => a.status === 'Approved' || a.status === 'Rejected').slice(0, 2);
  const recentRecharges = (rechargeRequests || []).filter(r => r.status === 'Approved').slice(0, 1);
  const recentTickets = (supportTickets || []).filter(t => t.status === 'RESOLVED').slice(0, 1);
  const notificationsCount = recentApps.length + recentRecharges.length + recentTickets.length;

  const balanceColor = agencyBalance > 10000 ? "text-emerald-400" : agencyBalance > 0 ? "text-amber-300" : "text-red-400";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const NavLinks = () => (
    <>
      <Link to="/agency" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-colors text-sm font-medium whitespace-nowrap">
        <LayoutDashboard className="h-4 w-4" /> Tableau de Bord
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-colors text-sm font-medium focus:outline-none whitespace-nowrap">
          <Globe className="h-4 w-4" /> Services <ChevronDown className="h-3 w-3 opacity-50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white text-text-dark border-gray-100 shadow-xl rounded-xl p-2" align="start">
          <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-blue-50 focus:bg-blue-50 p-0">
            <Link to="/agency/apply?service=evisa" className="flex items-center gap-2 w-full px-2 py-1.5" onClick={() => setMobileMenuOpen(false)}>
              <Plane className="h-4 w-4 text-blue-500" /> Evisa
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 focus:bg-gray-50 p-0">
            <Link to="/agency/apply?service=residence" className="flex items-center gap-2 w-full px-2 py-1.5" onClick={() => setMobileMenuOpen(false)}>
              <Building2 className="h-4 w-4 text-gray-500" /> Résidence
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 focus:bg-gray-50 p-0">
            <Link to="/agency/apply?service=permis" className="flex items-center gap-2 w-full px-2 py-1.5" onClick={() => setMobileMenuOpen(false)}>
              <Car className="h-4 w-4 text-gray-500" /> Permis international
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 focus:bg-gray-50 p-0">
            <Link to="/agency/apply?service=assurance" className="flex items-center gap-2 w-full px-2 py-1.5" onClick={() => setMobileMenuOpen(false)}>
              <ShieldCheck className="h-4 w-4 text-gray-500" /> Assurance voyage
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 focus:bg-gray-50 p-0">
            <Link to="/agency/apply?service=etude" className="flex items-center gap-2 w-full px-2 py-1.5" onClick={() => setMobileMenuOpen(false)}>
              <GraduationCap className="h-4 w-4 text-gray-500" /> Visa étude
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 focus:bg-gray-50 p-0">
            <Link to="/agency/apply?service=invitation" className="flex items-center gap-2 w-full px-2 py-1.5" onClick={() => setMobileMenuOpen(false)}>
              <Mail className="h-4 w-4 text-gray-500" /> Invitation
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 focus:bg-gray-50 p-0">
            <Link to="/agency/apply?service=rendezvous" className="flex items-center gap-2 w-full px-2 py-1.5" onClick={() => setMobileMenuOpen(false)}>
              <CalendarDays className="h-4 w-4 text-gray-500" /> Rendez-vous
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 focus:bg-gray-50 p-0">
            <Link to="/agency/apply?service=dossier" className="flex items-center gap-2 w-full px-2 py-1.5" onClick={() => setMobileMenuOpen(false)}>
              <FileText className="h-4 w-4 text-gray-500" /> Traitement dossier
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link to="/agency/applications" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-colors text-sm font-medium whitespace-nowrap">
        <FileText className="h-4 w-4" /> Demandes
      </Link>
      <Link to="/agency/trips" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-colors text-sm font-medium whitespace-nowrap">
        <MapPin className="h-4 w-4" /> Voyages
      </Link>
      <Link to="/agency/wallet" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-colors text-sm font-medium whitespace-nowrap">
        <WalletCards className="h-4 w-4" /> Finances
      </Link>
      <Link to="/agency/support" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-colors text-sm font-medium whitespace-nowrap">
        <HelpCircle className="h-4 w-4" /> Support
      </Link>
      <Link to="/agency/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-colors text-sm font-medium whitespace-nowrap">
        <Settings className="h-4 w-4" /> Paramètres
      </Link>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-text-dark">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full bg-[var(--color-text-dark)] text-gray-300 shadow-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              {/* Logo / Branch Name */}
              <div className="shrink-0 flex items-center">
                <Link to="/agency" className="text-xl font-bold font-sans text-white flex items-center gap-2">
                  <div className="bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-900 p-1.5 rounded-lg">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="tracking-tight">La Clé d'Or <span className="text-amber-400">Visa</span></span>
                </Link>
              </div>
              
              {/* Desktop Menu */}
              <nav className="hidden xl:flex space-x-1 items-center">
                <NavLinks />
              </nav>
            </div>

            <div className="flex items-center gap-4">
               {/* Wallet Balance (Desktop) */}
               <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[var(--color-accent-bronze)] rounded-full border border-white/5 whitespace-nowrap">
                <span className="text-xs text-gray-400">Solde:</span>
                <span className={"text-sm font-bold " + balanceColor}>{agencyBalance.toLocaleString()} DZD</span>
              </div>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10">
                  <Bell className="w-5 h-5" />
                  {notificationsCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--color-text-dark)] pointer-events-none"></span>}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {notificationsCount === 0 && (
                      <div className="p-4 text-sm text-gray-500 text-center">Aucune nouvelle notification</div>
                    )}

                    {recentApps.map(app => (
                      <DropdownMenuItem key={app.id} className="flex flex-col items-start p-3 cursor-pointer" onClick={() => navigate("/agency/applications")}>
                        <span className={`text-sm font-medium ${app.status === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>Visa {app.status === 'Approved' ? 'Approuvé' : 'Rejeté'}</span>
                        <span className="text-xs text-gray-500 mt-1">La demande {app.id} pour {app.travelerName} a été {app.status === 'Approved' ? 'approuvée' : 'rejetée'}.</span>
                      </DropdownMenuItem>
                    ))}

                    {recentRecharges.map(req => (
                      <DropdownMenuItem key={req.id} className="flex flex-col items-start p-3 cursor-pointer" onClick={() => navigate("/agency/wallet")}>
                        <span className="text-sm font-medium text-green-600">Recharge Validée</span>
                        <span className="text-xs text-gray-500 mt-1">Votre recharge de {req.amount.toLocaleString()} DA a été approuvée.</span>
                      </DropdownMenuItem>
                    ))}

                    {recentTickets.map(ticket => (
                      <DropdownMenuItem key={ticket.id} className="flex flex-col items-start p-3 cursor-pointer" onClick={() => navigate("/agency/support")}>
                        <span className="text-sm font-medium text-blue-600">Ticket Résolu</span>
                        <span className="text-xs text-gray-500 mt-1">Le ticket "{ticket.subject}" a été marqué comme résolu.</span>
                      </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-center font-medium text-blue-600 justify-center">
                      Tout marquer comme lu
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Trigger */}
              <div className="xl:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10">
                    <Menu className="w-6 h-6" />
                    <span className="sr-only">Open Menu</span>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-72 p-0 flex flex-col bg-[var(--color-text-dark)] text-gray-300 border-l-0">
                    <div className="p-6 mt-6 shrink-0 flex flex-col justify-center">
                      <h1 className="text-xl font-bold font-sans text-white">Global Travel Exp.</h1>
                      <div className="mt-1 text-xs text-[#8892b0] flex gap-2">
                        Statut: <span className="text-[var(--color-light-gold)] font-medium">Actif</span>
                      </div>
                    </div>
                    <nav className="flex-1 px-4 mt-6 space-y-2 overflow-y-auto">
                      <NavLinks />
                    </nav>
                    <div className="px-4 pb-4 mb-4">
                      <div className="p-4 mb-4 bg-[var(--color-accent-bronze)] rounded-xl border border-white/5 shrink-0">
                        <div className="text-sm font-medium text-gray-400">Solde Actuel</div>
                        <div className={"text-2xl font-bold mt-1 shrink-0 " + balanceColor}>{agencyBalance.toLocaleString()} DZD</div>
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

              {/* Logout (Desktop) */}
              <Link to="/login" className="hidden xl:flex items-center p-2 text-gray-400 hover:text-red-400 transition-colors rounded-full hover:bg-red-500/10" title="Se déconnecter">
                <LogOut className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full bg-bg-white">
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
      
      {/* Footer */}
      <footer className="w-full bg-[var(--color-text-dark)] border-t border-white/10 mt-auto text-gray-400 py-8 px-4 sm:px-6 lg:px-8 text-sm">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© 2026 La Clé d'Or Visa. Tous droits réservés.</div>
          <div className="flex gap-6 flex-wrap justify-center">
             <span>Support: (+213) 770 74 92 63</span>
             <a href="#" className="hover:text-white transition-colors">Conditions</a>
             <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
