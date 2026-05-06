import { Users, FileText, CheckCircle2, Clock, Map, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Vue d'ensemble Admin</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link to="/admin/applications" className="w-full sm:w-auto">
            <Button className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto">Examiner les demandes</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Demandes du jour</span>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold mt-2">14</div>
          <p className="text-xs text-green-600 flex items-center mt-auto pt-4 border-t border-gray-50"><TrendingUp className="w-3 h-3 mr-1"/> +12% par rapport à hier</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-orange-600">En attente d'examen</span>
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-orange-700 mt-2">32</div>
          <p className="text-xs text-orange-500 mt-auto pt-4 border-t border-orange-50">Demandes nécessitant une attention</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Agences Actives</span>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold mt-2">128</div>
          <p className="text-xs text-gray-400 mt-auto pt-4 border-t border-gray-50 flex items-center gap-1">
             <span className="w-2 h-2 rounded-full bg-red-400"></span> 3 en attente d'approbation
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Revenus du système</span>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono tracking-tight mt-2">1.2M <span className="text-lg">DA</span></div>
          <p className="text-xs text-green-600 flex items-center mt-auto pt-4 border-t border-gray-50"><TrendingUp className="w-3 h-3 mr-1"/> Mois en cours</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col min-h-[300px]">
          <h3 className="font-bold text-lg mb-6 tracking-tight">Destinations Principales</h3>
          
          <div className="space-y-6 mt-4">
             <div>
               <div className="flex justify-between text-sm mb-2">
                 <span className="font-medium">Émirats Arabes Unis</span>
                 <span className="text-gray-500 font-mono">65%</span>
               </div>
               <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-600 w-[65%]" />
               </div>
             </div>
             <div>
               <div className="flex justify-between text-sm mb-2">
                 <span className="font-medium">Arabie Saoudite</span>
                 <span className="text-gray-500 font-mono">20%</span>
               </div>
               <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                 <div className="h-full bg-green-600 w-[20%]" />
               </div>
             </div>
             <div>
               <div className="flex justify-between text-sm mb-2">
                 <span className="font-medium">Turquie</span>
                 <span className="text-gray-500 font-mono">15%</span>
               </div>
               <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                 <div className="h-full bg-red-600 w-[15%]" />
               </div>
             </div>
          </div>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-lg tracking-tight">Flux d'actions prioritaires</h3>
             <Link to="/admin/support" className="text-sm text-blue-600 hover:underline">Voir Tout</Link>
          </div>
          
          <div className="space-y-4">
             <div className="flex gap-4 items-start p-3 bg-red-50 rounded-xl border border-red-100">
               <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-1">
                 <div className="w-2 h-2 rounded-full bg-red-500"></div>
               </div>
               <div>
                  <p className="text-sm font-bold text-red-900">Ticket de support urgent</p>
                  <p className="text-xs text-red-700 mt-1">L'agence "Wanderlust Tours" signale un problème de paiement.</p>
                  <Button variant="link" className="p-0 h-auto text-xs text-red-600 mt-2 font-bold">Examiner le ticket &rarr;</Button>
               </div>
             </div>
             
             <div className="flex gap-4 items-start p-3 border rounded-xl border-gray-100 hover:bg-gray-50 transition-colors">
               <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-1">
                 <div className="w-2 h-2 rounded-full bg-orange-500"></div>
               </div>
               <div>
                  <p className="text-sm font-bold text-gray-900">Demande de recharge en attente</p>
                  <p className="text-xs text-gray-600 mt-1">Global Travel a demandé 50,000 DA</p>
                  <Button variant="link" className="p-0 h-auto text-xs text-blue-600 mt-2 font-bold">Traiter la finance &rarr;</Button>
               </div>
             </div>
             
             <div className="flex gap-4 items-start p-3 border rounded-xl border-gray-100 hover:bg-gray-50 transition-colors">
               <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
                 <div className="w-2 h-2 rounded-full bg-blue-500"></div>
               </div>
               <div>
                  <p className="text-sm font-bold text-gray-900">Nouvelle Inscription d'Agence</p>
                  <p className="text-xs text-gray-600 mt-1">"Desert Rose Travels" est en attente d'approbation.</p>
                  <Button variant="link" className="p-0 h-auto text-xs text-blue-600 mt-2 font-bold">Examiner l'agence &rarr;</Button>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
