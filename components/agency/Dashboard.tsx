import { WalletCards, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";

export function AgencyDashboard() {
  const [selectedPassport, setSelectedPassport] = useState("Algérien");

  const passportData: Record<string, any> = {
    "Algérien": { rank: 82, free: 21, arrival: 32, req: 143, color: "bg-green-600" },
    "Français": { rank: 3, free: 124, arrival: 43, req: 21, color: "bg-blue-800" },
    "Britannique": { rank: 4, free: 190, arrival: 42, req: 36, color: "bg-red-800" },
    "Émirati": { rank: 1, free: 133, arrival: 46, req: 19, color: "bg-slate-900" }
  };

  const data = passportData[selectedPassport] || passportData["Algérien"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Bienvenue, Global Travel <span className="text-lg">👋</span></h2>
        <Link to="/agency/apply">
          <Button className="bg-[#0a192f] hover:bg-[#112240] text-white w-full sm:w-auto">Nouvelle Demande</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0a192f] text-white p-6 rounded-2xl shadow-sm flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <WalletCards className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-200">Solde du Portefeuille</span>
            </div>
            <div className="text-3xl font-bold font-mono tracking-tight">4,500 <span className="text-xl">DA</span></div>
            <Link to="/agency/wallet">
              <Button variant="outline" size="sm" className="mt-4 w-full text-xs bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white">Demander une Recharge</Button>
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">En attente</span>
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <div className="text-3xl font-bold">12</div>
          <p className="text-xs text-gray-400 mt-auto pt-2 border-t mt-4">Demandes en cours de révision</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Approuvées</span>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold">89</div>
          <p className="text-xs text-gray-400 mt-auto pt-2 border-t mt-4">Visas délivrés</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex flex-col gap-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-red-600">Action Requise</span>
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-red-700">2</div>
          <p className="text-xs text-red-500 mt-auto pt-2 border-t border-red-100 mt-4">Documents manquants</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg">Outil Passport Index</h3>
              <div className="text-sm text-gray-500">Vérifiez les exigences de visa.</div>
            </div>
            <Select value={selectedPassport} onValueChange={setSelectedPassport}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Passeport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Algérien">Algérien</SelectItem>
                <SelectItem value="Français">Français</SelectItem>
                <SelectItem value="Britannique">Britannique</SelectItem>
                <SelectItem value="Émirati">Émirati</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Link to="/agency/passport-index" className="block w-full">
            <div className={`rounded-xl p-6 text-white overflow-hidden relative shadow-lg hover:ring-4 hover:ring-offset-2 transition-all cursor-pointer ${data.color}`}>
              <div className="absolute right-[-20%] top-[-20%] opacity-10">
                 <svg viewBox="0 0 200 200" className="w-64 h-64"><path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.4,-46.3C91,-33.5,97.3,-18,97,-2.8C96.7,12.4,89.8,27.3,80.1,39.9C70.4,52.5,57.9,62.8,44.1,70.6C30.3,78.4,15.1,83.7,0.3,83.2C-14.6,82.7,-29.2,76.3,-42.6,67.8C-56,59.3,-68.2,48.7,-76.9,35.5C-85.6,22.3,-90.8,6.5,-89.1,-8.5C-87.4,-23.5,-78.8,-37.7,-68,-48.9C-57.2,-60.1,-44.2,-68.3,-30.8,-75C-17.4,-81.7,-3.7,-86.9,10.6,-88.4C24.9,-89.9,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" /></svg>
              </div>
              <div className="relative z-10">
                <div className="text-white/80 text-sm font-medium uppercase tracking-wider mb-1 flex items-center justify-between">
                  Rang Mondial
                  <span className="bg-white/20 px-2 py-1 flex items-center gap-1 rounded text-xs">Ouvrir l'outil &rarr;</span>
                </div>
                <div className="text-5xl font-black mb-8">#{data.rank}</div>
                
                <div className="grid grid-cols-3 gap-2 text-center items-end">
                   <div>
                     <div className="text-3xl font-bold">{data.free}</div>
                     <div className="text-[10px] text-white/80 uppercase tracking-widest mt-1">Sans Visa</div>
                   </div>
                   <div>
                     <div className="text-3xl font-bold">{data.arrival}</div>
                     <div className="text-[10px] text-white/80 uppercase tracking-widest mt-1">A l'arrivée</div>
                   </div>
                   <div>
                     <div className="text-3xl font-bold opacity-50">{data.req}</div>
                     <div className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Requis</div>
                   </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Demandes Récentes</h3>
            <Link to="/agency/applications" className="text-sm text-blue-600 hover:underline">Voir Tout</Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                    JD
                  </div>
                  <div>
                    <div className="font-semibold text-sm">John Doe {i}</div>
                    <div className="text-xs text-gray-500">e-Visa Touristique • Émirats Arabes Unis</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full inline-block mb-1">EN ATTENTE</div>
                  <div className="text-[10px] text-gray-400 block font-medium">5 Mai 2026</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
