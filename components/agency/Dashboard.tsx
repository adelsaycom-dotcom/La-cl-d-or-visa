import { WalletCards, CheckCircle2, Clock, AlertCircle, Plane, Building2, Car, ShieldCheck, GraduationCap, Mail, CalendarDays, FileText, Search, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useAppStore } from "../../src/store/useAppStore";

export function AgencyDashboard() {
  const { agencyBalance, applications } = useAppStore();
  const balanceColor = agencyBalance > 10000 ? "text-green-500" : agencyBalance > 0 ? "text-amber-500" : "text-red-500";
  const [selectedPassport, setSelectedPassport] = useState("Algérien");

  const passportData: Record<string, any> = {
    "Algérien": { rank: 82, free: 21, arrival: 32, req: 143, color: "bg-green-600" },
    "Français": { rank: 3, free: 124, arrival: 43, req: 21, color: "bg-blue-800" },
    "Britannique": { rank: 4, free: 190, arrival: 42, req: 36, color: "bg-red-800" },
    "Émirati": { rank: 1, free: 133, arrival: 46, req: 19, color: "bg-slate-900" }
  };

  const data = passportData[selectedPassport] || passportData["Algérien"];
  const pendingApps = applications.filter(a => a.status === "Pending").length;
  const approvedApps = applications.filter(a => a.status === "Approved").length;
  const rejectedApps = applications.filter(a => a.status === "Rejected").length;

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[500px] shadow-xl flex flex-col justify-center px-4 md:px-12 z-10 w-full mb-8">
        {/* Background Image - The airplane image */}
        <div className="absolute inset-0 bg-[url('/avion.jpg')] bg-cover bg-center"></div>
        {/* Dark gradient overlay for text readability instead of blue */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto pt-16 pb-20 text-white">
          <div className="max-w-3xl mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-4 sm:mb-6 leading-tight">Gérez vos services <br className="hidden md:block"/>en toute simplicité</h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 font-medium tracking-wide">La plateforme B2B qui propulse votre agence de voyage vers de nouveaux sommets. Simplement, sereinement, joyeusement.</p>
          </div>
          
          {/* Services Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
             <Link to="/agency/apply?service=evisa" className="flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-[var(--color-text-dark)] transition-all group shadow-lg">
                <Plane className="w-6 h-6 sm:w-8 sm:h-8 text-primary-gold group-hover:text-primary-gold group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm sm:text-lg">Evisa</span>
             </Link>
             <Link to="/agency/apply?service=residence" className="flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-[var(--color-text-dark)] transition-all group shadow-lg">
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary-gold group-hover:text-primary-gold group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm sm:text-lg">Résidence</span>
             </Link>
             <Link to="/agency/apply?service=permis" className="flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-[var(--color-text-dark)] transition-all group shadow-lg">
                <Car className="w-6 h-6 sm:w-8 sm:h-8 text-primary-gold group-hover:text-primary-gold group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm sm:text-lg text-center leading-tight">Permis intl.</span>
             </Link>
             <Link to="/agency/apply?service=assurance" className="flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-[var(--color-text-dark)] transition-all group shadow-lg">
                <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-primary-gold group-hover:text-primary-gold group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm sm:text-lg">Assurance</span>
             </Link>
             <Link to="/agency/apply?service=etude" className="flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-[var(--color-text-dark)] transition-all group shadow-lg">
                <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-primary-gold group-hover:text-primary-gold group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm sm:text-lg">Étude</span>
             </Link>
             <Link to="/agency/apply?service=invitation" className="flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-[var(--color-text-dark)] transition-all group shadow-lg">
                <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-primary-gold group-hover:text-primary-gold group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm sm:text-lg">Invitation</span>
             </Link>
             <Link to="/agency/apply?service=rendezvous" className="flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-[var(--color-text-dark)] transition-all group shadow-lg">
                <CalendarDays className="w-6 h-6 sm:w-8 sm:h-8 text-primary-gold group-hover:text-primary-gold group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm sm:text-lg text-center leading-tight">Rendez-vous</span>
             </Link>
             <Link to="/agency/apply?service=dossier" className="flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-[var(--color-text-dark)] transition-all group shadow-lg">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-primary-gold group-hover:text-primary-gold group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm sm:text-lg text-center leading-tight">Dossier</span>
             </Link>
          </div>
        </div>
      </div>

      <div className="space-y-12 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content Area (Statistiques & Finances) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Reservation Statistics */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                <h3 className="text-xl font-bold text-text-dark">Statistiques de traitement</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                  <div className="text-sm font-medium text-gray-500 mb-2">Total demandes en cours</div>
                  <div className="text-4xl font-black text-text-dark">{pendingApps}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                  <div className="text-sm font-medium text-gray-500 mb-2">Demandes approuvées</div>
                  <div className="text-4xl font-black text-text-dark">{approvedApps}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                  <div className="text-sm font-medium text-gray-500 mb-2">Demandes rejetées</div>
                  <div className="text-4xl font-black text-text-dark">{rejectedApps}</div>
                </div>
              </div>
            </div>

            {/* Financial Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                <h3 className="text-xl font-bold text-text-dark">Renseignements financiers</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                  <h4 className="text-sm font-bold text-gray-500 mb-6 uppercase tracking-wider">Solde</h4>
                  <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 justify-between mt-auto">
                    {/* Simulated Donut Chart using CSS */}
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-8 sm:border-[12px] border-[var(--color-light-gold)] shrink-0 flex items-center justify-center">
                       <div className="absolute inset-[-8px] sm:inset-[-12px] rounded-full border-8 sm:border-[12px] border-amber-400 border-t-transparent border-r-transparent -rotate-45"></div>
                    </div>
                    <div className="w-full space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-amber-400"></span> Crédit vols
                        </div>
                        <div className="font-bold text-text-dark">0 DA</div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                          <span className="w-3 h-3 rounded bg-[var(--color-light-gold)]"></span> Crédit visa
                        </div>
                        <div className={"font-bold " + balanceColor}>{agencyBalance.toLocaleString()} DZD</div>
                      </div>
                      <div className="pt-2 border-t flex justify-between items-center text-sm">
                        <div className="font-semibold text-gray-500">Solde Réel</div>
                        <div className={"font-black " + balanceColor}>{agencyBalance.toLocaleString()} DZD</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                   <h4 className="text-sm font-bold text-gray-500 mb-6 uppercase tracking-wider">Paiements</h4>
                    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 justify-between mt-auto">
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-8 sm:border-[12px] border-[var(--color-text-dark)] shrink-0">
                       <div className="absolute inset-[-8px] sm:inset-[-12px] rounded-full border-8 sm:border-[12px] border-[var(--color-primary-gold)] border-b-transparent border-l-transparent rotate-12"></div>
                     </div>
                      <div className="w-full space-y-3 sm:space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2 text-gray-600 font-medium">
                            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-[var(--color-primary-gold)]"></span> Total
                          </div>
                          <div className="font-bold text-text-dark">16,900 DA</div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2 text-gray-600 font-medium">
                            <span className="w-3 h-3 rounded bg-[var(--color-text-dark)]"></span> Réglé
                          </div>
                          <div className="font-bold text-text-dark">16,900 DA</div>
                        </div>
                        <div className="pt-2 border-t flex justify-between items-center text-sm">
                           <div className="font-semibold text-gray-500">Reste à payer</div>
                           <div className="font-black text-primary-gold">0 DA</div>
                        </div>
                      </div>
                    </div>
                     <Link to="/agency/wallet" className="mt-8">
                        <Button className="w-full bg-[var(--color-text-dark)] text-white hover:bg-[var(--color-accent-bronze)]">Recharger le compte</Button>
                     </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Passport Index Widget */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold justify-between items-center gap-2 flex">
                    <span className="w-1.5 h-4 bg-blue-600 rounded-full inline-block"></span>
                    Passport Index
                  </h3>
                </div>
                <Select value={selectedPassport} onValueChange={setSelectedPassport}>
                  <SelectTrigger className="w-[120px] h-8 text-xs font-semibold">
                    <SelectValue placeholder="Passeport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Algérien">Algérie</SelectItem>
                    <SelectItem value="Français">France</SelectItem>
                    <SelectItem value="Britannique">Royaume-Uni</SelectItem>
                    <SelectItem value="Émirati">E.A.U</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Link to="/agency/passport-index" className="block w-full">
                <div className={`rounded-xl p-6 text-white overflow-hidden relative shadow-lg hover:ring-4 hover:ring-offset-2 transition-all cursor-pointer ${data.color}`}>
                  <div className="absolute right-[-20%] top-[-20%] opacity-10">
                     <svg viewBox="0 0 200 200" className="w-48 h-48"><path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.4,-46.3C91,-33.5,97.3,-18,97,-2.8C96.7,12.4,89.8,27.3,80.1,39.9C70.4,52.5,57.9,62.8,44.1,70.6C30.3,78.4,15.1,83.7,0.3,83.2C-14.6,82.7,-29.2,76.3,-42.6,67.8C-56,59.3,-68.2,48.7,-76.9,35.5C-85.6,22.3,-90.8,6.5,-89.1,-8.5C-87.4,-23.5,-78.8,-37.7,-68,-48.9C-57.2,-60.1,-44.2,-68.3,-30.8,-75C-17.4,-81.7,-3.7,-86.9,10.6,-88.4C24.9,-89.9,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" /></svg>
                  </div>
                  <div className="relative z-10">
                    <div className="text-white/80 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
                      Rang Mondial
                    </div>
                    <div className="text-4xl font-black mb-6">#{data.rank}</div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center items-end bg-black/20 rounded-lg p-3 backdrop-blur-sm">
                       <div>
                         <div className="text-2xl font-bold">{data.free}</div>
                         <div className="text-[9px] text-white/80 font-semibold uppercase mt-1">Sans Visa</div>
                       </div>
                       <div>
                         <div className="text-2xl font-bold">{data.arrival}</div>
                         <div className="text-[9px] text-white/80 font-semibold uppercase mt-1">À l'arrivée</div>
                       </div>
                       <div>
                         <div className="text-2xl font-bold opacity-50">{data.req}</div>
                         <div className="text-[9px] text-white/50 font-semibold uppercase mt-1">Requis</div>
                       </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Support Client widget */}
            <div className="bg-white border rounded-2xl shadow-sm p-6">
               <h3 className="font-bold flex items-center gap-2 mb-4">
                 <span className="w-1.5 h-4 bg-amber-500 rounded-full inline-block"></span>
                 Service Client
               </h3>
               <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <div className="text-sm font-semibold text-amber-900 mb-3">Numéros d'urgence Visa</div>
                  <div className="space-y-3 font-medium text-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700">
                         <Search className="w-4 h-4" />
                      </div>
                      (+213) 770 74 92 63
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700">
                         <Search className="w-4 h-4" />
                      </div>
                      (+213) 770 35 55 88
                    </div>
                  </div>
                  <div className="mt-4 bg-amber-200/50 text-amber-800 text-xs font-semibold px-3 py-2 rounded-lg text-center">
                    Garanteed response within 1 hour
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
