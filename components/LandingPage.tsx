import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Globe2, ShieldCheck, Zap, Users, ArrowRight, BarChart } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <Globe2 className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold tracking-tight">VisaHub B2B</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-gray-900 transition-colors">Fonctionnalités</a>
          <a href="#destinations" className="hover:text-gray-900 transition-colors">Destinations</a>
          <a href="#pricing" className="hover:text-gray-900 transition-colors">Tarifs</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">Se connecter</Link>
          <Link to="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">Devenir partenaire</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 py-32 text-center max-w-4xl mx-auto space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900">
          La plateforme de Visas pour les <span className="text-blue-600">Agences de Voyage</span>.
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Gérez vos dossiers de visas pour les EAU, l'Arabie Saoudite, Oman, la Turquie et plus encore. Suivez tout dans un tableau de bord B2B centralisé.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/register">
             <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-8 py-6 text-lg h-auto shadow-xl">
               Accès Agence <ArrowRight className="w-5 h-5 ml-2" />
             </Button>
          </Link>
          <Link to="/login">
             <Button variant="outline" className="rounded-full px-8 py-6 text-lg h-auto text-gray-500">
               Se Connecter
             </Button>
          </Link>
        </div>
        
        {/* Trusted By (Placeholder) */}
        <div className="pt-20">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">Plus de 120 agences nous font confiance en Algérie</p>
          <div className="flex justify-center gap-12 opacity-50 grayscale flex-wrap">
             {/* Fake logos */}
             <div className="text-xl font-bold font-serif italic text-gray-400">Wanderlust.Tours</div>
             <div className="text-xl font-bold font-sans text-gray-400">Global Exp</div>
             <div className="text-xl font-bold font-mono tracking-tighter text-gray-400">OASIS TRAVELS</div>
             <div className="text-xl font-bold font-sans tracking-widest text-gray-400">HORIZON</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-32 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Tout ce dont une agence a besoin</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Nous avons conçu tous les outils nécessaires pour traiter des milliers de demandes efficacement.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Traitement rapide</h3>
              <p className="text-gray-500 leading-relaxed">Les connexions directes par API avec les ambassades assurent un traitement en un temps record.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Portefeuille prépayé</h3>
              <p className="text-gray-500 leading-relaxed">Rechargez le solde de votre agence et profitez de déductions instantanées pour chaque demande.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Statistiques en direct</h3>
              <p className="text-gray-500 leading-relaxed">Suivez l'état de vos demandes, vos dépenses globales et autres données clés sur le tableau de bord.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a192f] text-gray-400 py-12 px-8 text-center text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <Globe2 className="w-6 h-6" />
            <span className="font-bold tracking-tight text-lg">VisaHub B2B</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Conditions Générales</a>
            <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
          <div>
            &copy; {new Date().getFullYear()} VisaHub Inc. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
