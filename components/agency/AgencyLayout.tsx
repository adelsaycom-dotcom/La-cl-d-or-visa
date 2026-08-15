import { Outlet, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, WalletCards, Bell, HelpCircle, FileText, Globe, Menu, LogOut, Settings, MapPin, ChevronDown, Plane, Building2, Car, ShieldCheck, GraduationCap, Mail, CalendarDays } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from '@/components/Logo';
import { auth } from "../../src/firebase";

import { useAppStore } from "../../src/store/useAppStore";

export function AgencyLayout() {
    const { agencyBalance, applications, rechargeRequests, supportTickets, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppStore();
  
  const unreadNotifications = (notifications || []).filter(n => !n.read).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const notificationsCount = unreadNotifications.length;

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
                  <Logo imageClassName="h-8 sm:h-10" />
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
                <DropdownMenuTrigger className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10 outline-none">
                  <Bell className="w-5 h-5" />
                  {notificationsCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-[var(--color-text-dark)]"></span>
                    </span>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 border-gray-200 overflow-hidden shadow-xl rounded-xl">
                  <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                    <span className="font-bold text-text-dark">Notifications</span>
                    {notificationsCount > 0 && (
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">{notificationsCount} nouvelle(s)</span>
                    )}
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    {notificationsCount === 0 ? (
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
                              <div className={`shrink-0 w-2 h-2 mt-2 rounded-full ${notif.type === 'success' ? 'bg-green-500' : notif.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`} />
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
                  {notificationsCount > 0 && (
                    <div className="p-2 border-t bg-gray-50">
                      <button 
                        className="w-full py-2 text-xs font-bold text-primary-gold hover:bg-yellow-50 rounded-md transition-colors"
                        onClick={() => markAllNotificationsAsRead(auth.currentUser?.uid || "")}
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
