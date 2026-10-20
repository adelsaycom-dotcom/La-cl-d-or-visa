import { 
  WalletCards, CheckCircle2, Clock, Plane, Building2, Car, ShieldCheck, 
  GraduationCap, Mail, CalendarDays, FileText, ArrowUpRight, TrendingUp, Globe, Map, FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MapPin, Info, DollarSign, Star } from "lucide-react";
import { useAppStore } from "../../src/store/useAppStore";
import { auth } from "../../src/firebase";
import { AGENCY_SERVICES } from "../../src/constants/servicesConfig";
import { useLanguage } from "../../src/i18n/LanguageContext";

export function AgencyDashboard() {
  const { t } = useLanguage();
  const { agencyBalance, applications, organizedTrips, currentAgency, b2cMode, b2cMarginPercent } = useAppStore();
  const agencyDisplayName = currentAgency?.agencyName || currentAgency?.companyName || currentAgency?.name || auth.currentUser?.displayName || "Mon Agence";
  const navigate = useNavigate();
  const [newTripPopupOpen, setNewTripPopupOpen] = useState(false);
  const [popupTrip, setPopupTrip] = useState<any>(null);

  const featuredTrips = organizedTrips.filter(t => t.featured && t.status === 'active');
  const activeTrips = organizedTrips.filter(t => t.status === 'active');

  useEffect(() => {
    // Show popup for the most recently added active trip if not seen
    if (activeTrips.length > 0) {
      // Sort by creation date if available, or just take the last one
      const sortedTrips = [...activeTrips].sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0; // Fallback
      });
      
      const latestTrip = sortedTrips[0];
      const seenTripId = sessionStorage.getItem('seenNewTripId');
      
      if (latestTrip && seenTripId !== latestTrip.id) {
        setPopupTrip(latestTrip);
        setNewTripPopupOpen(true);
      }
    }
  }, [activeTrips]);

  const handleDismissPopup = () => {
    if (popupTrip) {
      sessionStorage.setItem('seenNewTripId', popupTrip.id);
    }
    setNewTripPopupOpen(false);
  };
  
  const handleAccessPopup = () => {
    handleDismissPopup();
    navigate('/agency/trips');
  };
  
  const pendingApps = applications.filter(a => a.status === "Pending" || a.status === "Processing").length;
  const approvedApps = applications.filter(a => a.status === "Approved").length;
  const rejectedApps = applications.filter(a => a.status === "Rejected").length;

  const services = AGENCY_SERVICES;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* Header / Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7B1B38]/5 rounded-full blur-3xl opacity-70 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7B1B38]/10 border border-[#7B1B38]/20 text-[#7B1B38] text-xs font-bold mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B1B38] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7B1B38]"></span>
            </span>
            <span>Portail Agence B2B • La Clé d'Or</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            {t("agencyDashboard.welcome")}, {agencyDisplayName} 👋
          </h1>
          <p className="text-slate-500 font-medium">{t("agencyDashboard.subtitle")}</p>
        </div>
        <div className="relative z-10 flex gap-4 w-full md:w-auto">
          <Link to="/agency/wallet" className="flex-1 md:flex-none bg-[#7B1B38] text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#63142c] transition-all shadow-md shadow-[#7B1B38]/25 hover:shadow-lg hover:-translate-y-0.5">
            <WalletCards className="w-5 h-5" /> {t("header.rechargeWallet")}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content (Left) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Featured Trips Carousel */}
          {featuredTrips.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-[#7B1B38] rounded-full"></div>
                  Voyages à la une
                </h2>
                <Link to="/agency/trips" className="text-sm text-[#7B1B38] font-bold hover:underline">Voir tout</Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                {featuredTrips.map(trip => (
                  <div key={trip.id} className="min-w-[280px] sm:min-w-[320px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden snap-start group relative hover:border-[#7B1B38]/30 transition-colors">
                    <div className="h-32 relative overflow-hidden">
                      <img src={trip.photoUrl} alt={trip.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <Star className="w-3 h-3 fill-current" /> À la une
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-bold text-lg leading-tight truncate">{trip.title}</h3>
                        <p className="text-blue-100 text-xs flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3 h-3" /> {trip.destination}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-400">Prix B2B</span>
                          <span className="font-black text-slate-900 text-lg leading-none">{trip.price.toLocaleString()} DZD</span>
                        </div>
                        <Link to="/agency/trips" className="bg-[#7B1B38]/10 text-[#7B1B38] hover:bg-[#7B1B38]/15 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                          Voir détails
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Quick Actions / Services */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#7B1B38] rounded-full"></div>
                Démarrer une demande
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {services.map((srv, idx) => (
                <Link 
                  key={idx} 
                  to={srv.path}
                  className="group flex flex-col items-center justify-center gap-3 p-5 bg-white rounded-2xl border border-slate-200 hover:border-[#7B1B38]/30 hover:shadow-lg hover:shadow-[#7B1B38]/5 transition-all duration-300 hover:-translate-y-1 text-center"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${srv.color} group-hover:scale-110 transition-transform duration-300`}>
                    <srv.icon className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-slate-700 text-sm">{srv.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* KPI Stats */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#7B1B38] rounded-full"></div>
                Performances & Statistiques
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
                  <Clock className="w-16 h-16 text-amber-500" />
                </div>
                <div className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">En cours</div>
                <div className="text-4xl font-black text-slate-900">{pendingApps}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                </div>
                <div className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Approuvées</div>
                <div className="text-4xl font-black text-slate-900">{approvedApps}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
                  <ShieldCheck className="w-16 h-16 text-red-500" />
                </div>
                <div className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Rejetées</div>
                <div className="text-4xl font-black text-slate-900">{rejectedApps}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets (Right) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Wallet Widget */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#7B1B38]/25 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              <div className="flex items-center justify-between mb-2 relative z-10">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Solde Disponible</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7B1B38]/30 text-rose-200 border border-[#7B1B38]/40">B2B Actif</span>
              </div>
              <div className="text-3xl font-black text-white relative z-10 flex items-end gap-2">
                {agencyBalance.toLocaleString()} <span className="text-lg text-slate-400 mb-1">DZD</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Réservations Vols</span>
                <span className="font-bold text-slate-900">0 DZD</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Services & Visas</span>
                <span className="font-bold text-slate-900">{agencyBalance.toLocaleString()} DZD</span>
              </div>
              <Link to="/agency/wallet" className="mt-6 w-full flex items-center justify-center gap-2 bg-[#7B1B38]/10 text-[#7B1B38] hover:bg-[#7B1B38]/15 px-4 py-2.5 rounded-xl font-bold transition-colors">
                Gérer le portefeuille <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Recent Applications Mini-List */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">Dossiers Récents</h3>
              <Link to="/agency/applications" className="text-sm text-[#7B1B38] font-bold hover:underline">Voir tout</Link>
            </div>
            
            <div className="space-y-4">
              {applications.slice(0, 3).map(app => (
                <div key={app.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${app.status === 'Approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : app.status === 'Processing' ? 'bg-blue-50 border-blue-100 text-blue-600' : app.status === 'Rejected' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm group-hover:text-[#7B1B38] transition-colors">{app.travelerName}</div>
                      <div className="text-xs text-slate-500 font-medium">{app.serviceType} • {app.country}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">{app.price} DA</div>
                  </div>
                </div>
              ))}
              {applications.length === 0 && (
                <div className="text-center text-slate-500 text-sm py-4">Aucun dossier récent.</div>
              )}
            </div>
          </div>

        </div>
      </div>
      
      {/* New Trip Popup */}
      <Dialog open={newTripPopupOpen} onOpenChange={(open) => { if(!open) handleDismissPopup(); }}>
        <DialogContent className="sm:max-w-md bg-white p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
          {popupTrip && (
            <div className="flex flex-col">
              <div className="h-48 relative">
                <img src={popupTrip.photoUrl} alt={popupTrip.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-6">
                  <div className="inline-flex items-center gap-1.5 bg-[#7B1B38]/20 text-rose-100 border border-[#7B1B38]/40 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold w-fit mb-3">
                    <Star className="w-3.5 h-3.5 fill-current" /> Nouvelle offre disponible
                  </div>
                  <h2 className="text-white font-black text-2xl leading-tight mb-1">{popupTrip.title}</h2>
                  <p className="text-slate-300 text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> {popupTrip.destination}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {popupTrip.description}
                </p>
                
                <div className="flex items-center justify-between mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <div>
                     <span className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Tarif B2B</span>
                     <span className="font-black text-xl text-slate-900">{popupTrip.price.toLocaleString()} DZD</span>
                   </div>
                   <div className="text-right">
                     <span className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Places dispo</span>
                     <span className="font-bold text-slate-700">{popupTrip.availableSeats}</span>
                   </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-slate-200" onClick={handleDismissPopup}>
                    Retirer
                  </Button>
                  <Button className="flex-1 h-12 rounded-xl font-bold bg-[#7B1B38] hover:bg-[#63142c] text-white shadow-md shadow-[#7B1B38]/20" onClick={handleAccessPopup}>
                    Y accéder
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
