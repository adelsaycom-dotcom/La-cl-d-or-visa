import React, { useState, useEffect } from "react";
import { 
  WalletCards, CheckCircle2, Clock, Plane, Building2, Car, ShieldCheck, 
  GraduationCap, Mail, CalendarDays, FileText, ArrowUpRight, Globe, FolderOpen, 
  MapPin, Star, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAppStore } from "../../src/store/useAppStore";
import { auth } from "../../src/firebase";
import { useLanguage } from "../../src/i18n/LanguageContext";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";

export function AgencyDashboard() {
  const { language, t } = useLanguage();
  const isEn = language === "en";

  const { agencyBalance, applications, organizedTrips, currentAgency } = useAppStore();
  const agencyDisplayName = currentAgency?.agencyName || currentAgency?.companyName || currentAgency?.name || auth.currentUser?.displayName || (isEn ? "My Agency" : "Mon Agence");
  const navigate = useNavigate();

  const [newTripPopupOpen, setNewTripPopupOpen] = useState(false);
  const [popupTrip, setPopupTrip] = useState<any>(null);

  const featuredTrips = organizedTrips.filter(t => t.featured && t.status === 'active');
  const activeTrips = organizedTrips.filter(t => t.status === 'active');

  useEffect(() => {
    // Affiche un popup pour le voyage actif le plus récemment ajouté si non encore vu
    if (activeTrips.length > 0) {
      const sortedTrips = [...activeTrips].sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
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

  // 10 services officiels correspondant au mockup exact
  const quickServices = [
    {
      id: "visa",
      name: isEn ? "B2B Visa" : "Visa B2B",
      icon: FileText,
      iconBg: "bg-sky-500/15 text-sky-700 border border-sky-400/30",
      path: "/agency/apply?service=Visa"
    },
    {
      id: "invitation",
      name: isEn ? "Invitation Letter" : "Lettre d'Invitation",
      icon: Mail,
      iconBg: "bg-teal-500/15 text-teal-700 border border-teal-400/30",
      path: "/agency/apply?service=Invitation"
    },
    {
      id: "trips",
      name: isEn ? "Organized Trips" : "Voyages Organisés",
      icon: Plane,
      iconBg: "bg-pink-500/15 text-pink-700 border border-pink-400/30",
      path: "/agency/trips"
    },
    {
      id: "residence",
      name: isEn ? "Residence Dossier" : "Dossier Résidence",
      icon: Building2,
      iconBg: "bg-indigo-500/15 text-indigo-700 border border-indigo-400/30",
      path: "/agency/apply?service=Dossier Résidence"
    },
    {
      id: "rendezvous",
      name: isEn ? "Appointment Booking" : "Prise de RDV",
      icon: CalendarDays,
      iconBg: "bg-orange-500/15 text-orange-700 border border-orange-400/30",
      path: "/agency/apply?service=Rendez-vous"
    },
    {
      id: "dossier",
      name: isEn ? "Dossier Processing" : "Traitement Dossier",
      icon: FolderOpen,
      iconBg: "bg-emerald-500/15 text-emerald-700 border border-emerald-400/30",
      path: "/agency/apply?service=Dossier"
    },
    {
      id: "permis",
      name: isEn ? "Intl. Driving Permit" : "Permis International",
      icon: Car,
      iconBg: "bg-amber-500/15 text-amber-700 border border-amber-400/30",
      path: "/agency/apply?service=Permis"
    },
    {
      id: "study",
      name: isEn ? "Student Visa" : "Visa Études",
      icon: GraduationCap,
      iconBg: "bg-purple-500/15 text-purple-700 border border-purple-400/30",
      path: "/agency/study"
    },
    {
      id: "assurance",
      name: isEn ? "Travel Insurance" : "Assurance Voyage",
      icon: ShieldCheck,
      iconBg: "bg-teal-500/15 text-teal-700 border border-teal-400/30",
      path: "/agency/apply?service=Assurance"
    },
    {
      id: "passport-index",
      name: isEn ? "Passport Index" : "Index Passeport",
      icon: Globe,
      iconBg: "bg-rose-500/15 text-rose-700 border border-rose-400/30",
      path: "/agency/passport-index"
    }
  ];

  return (
    <div className="relative space-y-6 animate-in fade-in duration-500 pb-10">

      {/* 1. CARTE DE BIENVENUE HERO */}
      <div className="rounded-3xl border border-white/30 bg-white/15 backdrop-blur-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7B1B38]/15 border border-[#7B1B38]/25 text-[#7B1B38] text-[11px] font-bold backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#7B1B38]"></span>
            <span>{isEn ? "B2B Partner Portal • La Clé d'Or" : "Portail Agence B2B • La Clé d'Or"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isEn ? "Welcome to your B2B portal" : "Bienvenue sur votre portail B2B"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            {isEn 
              ? "Manage visa applications, track progress in real time, and scale your travel business." 
              : "Gérez vos demandes de visa, suivez l'avancement en temps réel et développez votre activité touristique."}
          </p>
        </div>

        <Link
          to="/agency/wallet"
          className="shrink-0 bg-[#7B1B38] hover:bg-[#63142c] text-white px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <WalletCards className="w-4 h-4" />
          <span>{isEn ? "Top up wallet" : "Recharger le portefeuille"}</span>
        </Link>
      </div>

      {/* 2. GRILLE PRINCIPALE (GAUCHE SERVICES & STATS / DROITE SOLDE & RÉCENT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Colonne Gauche (8 col) */}
        <div className="lg:col-span-8 space-y-6">

          {/* A. Démarrer une Demande (Start an Application) */}
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-1.5 h-5 bg-[#7B1B38] rounded-full shadow-2xs"></div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                {isEn ? "Start an Application" : "Démarrer une Demande"}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
              {quickServices.map((srv) => (
                <Link
                  key={srv.id}
                  to={srv.path}
                  className="bg-white/15 backdrop-blur-2xl border border-white/25 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-xs hover:bg-white/30 hover:border-white/50 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer h-32 group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 shadow-2xs backdrop-blur-md ${srv.iconBg}`}>
                    <srv.icon className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-900 text-xs sm:text-[13px] leading-tight line-clamp-2">
                    {srv.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* B. Performance & Statistiques (Performance & Statistics) */}
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-1.5 h-5 bg-[#7B1B38] rounded-full shadow-2xs"></div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                {isEn ? "Performance & Statistics" : "Performances & Statistiques"}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-white/15 backdrop-blur-2xl rounded-2xl p-5 border border-white/25 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    {isEn ? "IN PROGRESS" : "EN COURS"}
                  </span>
                  <span className="text-3xl font-black font-mono text-slate-900">
                    <AnimatedCounter value={pendingApps} duration={1.5} />
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs backdrop-blur-md">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-2xl rounded-2xl p-5 border border-white/25 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    {isEn ? "APPROVED" : "APPROUVÉS"}
                  </span>
                  <span className="text-3xl font-black font-mono text-slate-900">
                    <AnimatedCounter value={approvedApps} duration={1.5} />
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs backdrop-blur-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-2xl rounded-2xl p-5 border border-white/25 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    {isEn ? "REJECTED" : "REJETÉS"}
                  </span>
                  <span className="text-3xl font-black font-mono text-slate-900">
                    <AnimatedCounter value={rejectedApps} duration={1.5} />
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-700 flex items-center justify-center shrink-0 shadow-2xs backdrop-blur-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* C. Voyages Organisés en vedette (si disponibles) */}
          {featuredTrips.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-5 bg-[#7B1B38] rounded-full shadow-2xs"></div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    {isEn ? "Featured Group Tours" : "Voyages Organisés à la Une"}
                  </h2>
                </div>
                <Link to="/agency/trips" className="text-xs text-[#7B1B38] font-bold hover:underline">
                  {isEn ? "View all trips" : "Voir tout"}
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {featuredTrips.slice(0, 2).map(trip => (
                  <div key={trip.id} className="bg-white/15 backdrop-blur-2xl rounded-2xl border border-white/25 shadow-xs overflow-hidden flex flex-col group hover:shadow-md transition-all">
                    <div className="h-32 relative overflow-hidden">
                      <img src={trip.photoUrl} alt={trip.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                          <Star className="w-3 h-3 fill-current" /> {isEn ? "Featured" : "À la une"}
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-3 right-3 text-white">
                        <h4 className="font-bold text-sm leading-tight truncate">{trip.title}</h4>
                        <span className="text-[11px] text-slate-200 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-400" /> {trip.destination}
                        </span>
                      </div>
                    </div>
                    <div className="p-3.5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-600 block">Tarif Agence B2B</span>
                        <span className="text-base font-black font-mono text-slate-900">{trip.price.toLocaleString()} DZD</span>
                      </div>
                      <Link to="/agency/trips" className="px-3 py-1.5 rounded-xl bg-[#7B1B38]/15 text-[#7B1B38] font-bold text-xs hover:bg-[#7B1B38]/25 transition-colors">
                        {isEn ? "View Details" : "Détails"}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Colonne Droite (4 col) */}
        <div className="lg:col-span-4 space-y-6">

          {/* A. Widget Solde Disponible (Available Balance) */}
          <div className="rounded-3xl overflow-hidden border border-white/25 shadow-xs bg-white/15 backdrop-blur-2xl">
            <div className="bg-gradient-to-br from-slate-950/80 via-slate-900/75 to-[#13111C]/80 p-6 text-white relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#7B1B38]/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                  {isEn ? "AVAILABLE BALANCE" : "SOLDE DISPONIBLE"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#7B1B38] text-white shadow-2xs">
                  B2B Active
                </span>
              </div>

              <div className="text-3xl font-black font-mono text-white tracking-tight flex items-center gap-2 relative z-10">
                <WalletCards className="w-6 h-6 text-slate-300 shrink-0" />
                <AnimatedCounter value={agencyBalance} suffix=" DZD" duration={1.8} />
              </div>
            </div>

            <div className="p-5 space-y-3.5 bg-white/10 backdrop-blur-xl border-t border-white/15">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-white/15">
                <span className="text-slate-700 font-semibold">{isEn ? "Flight Bookings" : "Réservations Vols"}</span>
                <span className="font-bold text-slate-900 font-mono">0 DZD</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-3 border-b border-white/15">
                <span className="text-slate-700 font-semibold">{isEn ? "Services & Visas" : "Services & Visas"}</span>
                <span className="font-bold text-slate-900 font-mono">0 DZD</span>
              </div>
              <Link
                to="/agency/wallet"
                className="w-full mt-2 py-3 rounded-2xl bg-white/25 hover:bg-white/40 text-[#7B1B38] border border-white/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer backdrop-blur-md"
              >
                <span>{isEn ? "Manage Wallet" : "Gérer le Portefeuille"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* B. Widget Demandes Récentes (Recent Applications) */}
          <div className="rounded-3xl border border-white/25 bg-white/15 backdrop-blur-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                {isEn ? "Recent Applications" : "Demandes Récentes"}
              </h3>
              <Link to="/agency/applications" className="text-xs font-bold text-[#7B1B38] hover:underline">
                {isEn ? "View all" : "Voir tout"}
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-600 font-medium">
                {isEn ? "No applications created yet." : "Aucune demande créée pour le moment."}
              </div>
            ) : (
              <div className="space-y-2.5">
                {applications.slice(0, 4).map(app => (
                  <div 
                    key={app.id} 
                    onClick={() => navigate('/agency/applications')}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/25 border border-white/30 hover:bg-white/45 hover:shadow-2xs transition-all text-xs cursor-pointer backdrop-blur-md"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-bold text-slate-900 block truncate">{app.travelerName}</span>
                      <span className="text-[10px] text-slate-600 font-medium">{app.country} • {app.serviceType || app.visaType}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full block whitespace-nowrap mb-0.5 ${
                        app.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-800 border border-emerald-400/40' :
                        app.status === 'Processing' ? 'bg-blue-500/20 text-blue-800 border border-blue-400/40' :
                        app.status === 'Rejected' ? 'bg-rose-500/20 text-rose-800 border border-rose-400/40' : 
                        'bg-amber-500/20 text-amber-800 border border-amber-400/40'
                      }`}>
                        {app.status === 'Approved' ? 'Validé' : app.status === 'Processing' ? 'En cours' : app.status === 'Rejected' ? 'Rejeté' : 'En attente'}
                      </span>
                      <span className="text-[10px] text-slate-700 font-mono font-bold">
                        {app.price ? `${app.price.toLocaleString()} DZD` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Popup Nouveau Voyage Organisé (Dialog) */}
      <Dialog open={newTripPopupOpen} onOpenChange={(open) => { if(!open) handleDismissPopup(); }}>
        <DialogContent className="sm:max-w-md bg-white p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">
          {popupTrip && (
            <div className="flex flex-col">
              <div className="h-48 relative">
                <img src={popupTrip.photoUrl} alt={popupTrip.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-6">
                  <div className="inline-flex items-center gap-1.5 bg-[#7B1B38]/30 text-rose-100 border border-[#7B1B38]/40 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold w-fit mb-2">
                    <Star className="w-3.5 h-3.5 fill-current" /> {isEn ? "New offer available!" : "Nouvelle offre disponible"}
                  </div>
                  <h2 className="text-white font-black text-xl leading-tight mb-1">{popupTrip.title}</h2>
                  <p className="text-slate-300 text-xs flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> {popupTrip.destination}
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                  {popupTrip.description}
                </p>
                
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                   <div>
                     <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                       {t("agencyDashboard.b2bPrice")}
                     </span>
                     <span className="font-black text-lg text-slate-900 font-mono">{popupTrip.price.toLocaleString()} DZD</span>
                   </div>
                   <div className="text-right">
                     <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                       {isEn ? "Seats available" : "Places disponibles"}
                     </span>
                     <span className="font-bold text-slate-700 text-sm">{popupTrip.availableSeats}</span>
                   </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1 h-11 rounded-xl font-bold text-xs border-slate-200 cursor-pointer" onClick={handleDismissPopup}>
                    {isEn ? "Dismiss" : "Fermer"}
                  </Button>
                  <Button className="flex-1 h-11 rounded-xl font-bold text-xs bg-[#7B1B38] hover:bg-[#63142c] text-white shadow-md cursor-pointer" onClick={handleAccessPopup}>
                    {isEn ? "Explore" : "Y accéder"}
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
