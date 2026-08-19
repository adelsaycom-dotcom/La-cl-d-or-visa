import re

content = """import { Users, FileText, CheckCircle2, Clock, Map, TrendingUp, Wallet, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppStore } from "../../src/store/useAppStore";

export function AdminDashboard() {
  const { applications, agencies, transactions, rechargeRequests } = useAppStore();
  
  const today = new Date().toISOString().split("T")[0];
  const appsToday = applications.filter(a => a.submissionDate?.startsWith(today)).length;
  const pendingApps = applications.filter(a => a.status === "Pending" || a.status === "Processing").length;
  const activeAgencies = agencies.filter(a => a.status === "ACTIVE").length;
  
  const pendingRecharges = (rechargeRequests || []).filter(r => r.status === "Pending").length;
  
  const totalVolume = transactions.reduce((acc, tx) => acc + (tx.amount || 0), 0);
  const formattedVolume = totalVolume > 1000000 ? (totalVolume/1000000).toFixed(1) + "M" : totalVolume.toLocaleString();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-900 p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-black tracking-tight mb-2">Tableau de bord central</h1>
          <p className="text-slate-400 font-medium text-sm">Vue d'ensemble des métriques clés de la plateforme.</p>
        </div>
        <div className="relative z-10 flex gap-4 w-full md:w-auto">
          <Link to="/admin/applications" className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-900/50 hover:shadow-lg hover:-translate-y-0.5 text-sm">
             Traiter les dossiers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col group hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Demandes du jour</span>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900">{appsToday}</div>
          <p className="text-xs text-emerald-600 font-bold flex items-center mt-4 pt-4 border-t border-slate-100">
            <TrendingUp className="w-3.5 h-3.5 mr-1.5"/> Activité stable
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col group hover:border-amber-300 transition-colors relative overflow-hidden">
          {pendingApps > 0 && <div className="absolute top-0 right-0 w-3 h-3 bg-amber-500 rounded-full m-6 animate-pulse"></div>}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Dossiers en attente</span>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900">{pendingApps}</div>
          <p className="text-xs text-amber-600 font-bold flex items-center mt-4 pt-4 border-t border-slate-100">
            Dossiers à traiter urgemment
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col group hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Agences Actives</span>
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900">{activeAgencies}</div>
          <p className="text-xs text-slate-500 font-bold flex items-center mt-4 pt-4 border-t border-slate-100">
            Sur la plateforme
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col group hover:border-emerald-300 transition-colors relative">
          {pendingRecharges > 0 && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full m-6 animate-pulse"></div>}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Volume Financier</span>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900">{formattedVolume}</div>
          <p className="text-xs text-slate-500 font-bold flex items-center mt-4 pt-4 border-t border-slate-100">
            DZD en flux total
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Activity Mini-List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900 text-lg">Activité Récente</h3>
            <Link to="/admin/applications" className="text-sm font-bold text-blue-600 hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-5">
            {applications.slice(0, 5).map(app => (
              <div key={app.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${app.status === 'Approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : app.status === 'Processing' ? 'bg-blue-50 border-blue-100 text-blue-600' : app.status === 'Rejected' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                      <FileText className="w-5 h-5" />
                    </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{app.agencyName.split('@')[0]}</div>
                    <div className="text-xs font-medium text-slate-500 mt-0.5">Demande {app.serviceType} - {app.travelerName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${app.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : app.status === 'Processing' ? 'bg-blue-100 text-blue-700' : app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {app.status}
                  </div>
                </div>
              </div>
            ))}
            {applications.length === 0 && (
               <div className="text-center text-slate-500 font-medium py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                 Aucun dossier soumis récemment.
               </div>
            )}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 lg:p-8">
           <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900 text-lg">Actions Requises</h3>
          </div>
          <div className="space-y-4">
             
             {/* Recharges Pending */}
             <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-amber-600">
                     <Wallet className="w-6 h-6" />
                   </div>
                   <div>
                     <div className="font-bold text-amber-900">Recharges de solde</div>
                     <div className="text-sm font-medium text-amber-700/80">{pendingRecharges} demande(s) en attente de validation</div>
                   </div>
                </div>
                <Link to="/admin/finances" className="bg-amber-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-amber-700 transition-colors shadow-md shadow-amber-900/10">
                  Gérer
                </Link>
             </div>

             {/* Apps Pending */}
             <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-blue-600">
                     <Clock className="w-6 h-6" />
                   </div>
                   <div>
                     <div className="font-bold text-blue-900">Dossiers en attente</div>
                     <div className="text-sm font-medium text-blue-700/80">{pendingApps} nouveau(x) dossier(s) à traiter</div>
                   </div>
                </div>
                <Link to="/admin/applications" className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-900/10">
                  Traiter
                </Link>
             </div>

          </div>
        </div>

      </div>
    </div>
  );
}
"""

with open('components/admin/AdminDashboard.tsx', 'w') as f:
    f.write(content)
