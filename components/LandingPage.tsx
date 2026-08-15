import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { KeyRound, ShieldCheck, Zap, Users, ArrowRight, BarChart, Phone, Mail, MapPin, Facebook, Instagram, Youtube, MessageCircle, Link2, Eye, LogIn, CheckCircle, Globe2, Plane } from "lucide-react";
import { Logo } from '@/components/Logo';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-text-dark">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-6 py-4 md:px-12 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-50 transition-all">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
        <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-600">
          <a href="#about" className="hover:text-primary-gold transition-colors">Notre Agence</a>
          <a href="#services" className="hover:text-primary-gold transition-colors">Services</a>
          <a href="#contact" className="hover:text-primary-gold transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/login" className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-primary-gold transition-colors">
            <LogIn className="w-4 h-4" /> Espace pro
          </Link>
          <Link to="/login" className="sm:hidden p-2 text-gray-700">
            <LogIn className="w-5 h-5" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 py-20 md:py-32 overflow-hidden flex flex-col items-center">
        <div className="absolute inset-0 bg-[url('/fond-monde.png')] bg-cover bg-center opacity-20 mix-blend-multiply transition-all duration-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-bg-white/90"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-gold/10 text-primary-gold font-bold text-sm border border-primary-gold/20 shadow-sm">
               <span className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-gold opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-gold"></span>
               </span>
               La plateforme B2B #1 en Algérie
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-text-dark leading-[1.1]">
              Accélérez le succès de votre <span className="text-primary-gold">Agence de Voyage</span>.
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-500 max-w-xl leading-relaxed font-medium">
              La Clé d'Or vous offre un portail exclusif pour traiter vos demandes de visas, séjours, études et assurances avec une efficacité redoutable.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
              <Link to="/register">
                 <Button className="bg-primary-gold hover:bg-primary-gold text-white rounded-2xl px-8 py-6 text-lg h-auto shadow-xl shadow-primary-gold/20 transition-all hover:-translate-y-1 font-bold">
                   Créer un compte <ArrowRight className="w-5 h-5 ml-2" />
                 </Button>
              </Link>
              <Link to="/agency">
                 <Button variant="outline" className="rounded-2xl px-8 py-6 text-lg h-auto text-gray-700 border-2 border-gray-200 hover:bg-bg-white hover:border-gray-300 font-bold transition-all hover:-translate-y-1 gap-2 bg-white">
                   <Eye className="w-5 h-5" /> Démo
                 </Button>
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-300 px-4 md:px-0">
             {/* Phone Mockup Frame */}
             <div className="relative w-[300px] md:w-[350px] aspect-[9/19] bg-white rounded-[3rem] border-[12px] border-gray-900 shadow-2xl flex flex-col ring-4 ring-gray-200/50">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl z-30"></div>
                
                {/* Content inside phone - HTML Mockup of the Platform */}
                <div className="absolute inset-0 z-10 rounded-[2rem] bg-bg-white flex flex-col pt-7 overflow-hidden border border-gray-100">
                   {/* Fake Mobile Header */}
                   <div className="px-4 pb-4 pt-4 bg-white border-b border-gray-100 flex justify-between items-center z-20">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider mb-0.5">Agence Partenaire</span>
                        <span className="text-sm font-black text-text-dark leading-none">La Clé d'Or B2B</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary-gold/10 text-primary-gold flex items-center justify-center shrink-0">
                        <KeyRound className="w-4 h-4" />
                      </div>
                   </div>
                   
                   {/* Fake Mobile Body */}
                   <div className="p-4 flex-1 overflow-hidden flex flex-col space-y-5 relative z-10">
                      {/* Balance Card */}
                      <div className="bg-[var(--color-text-dark)] rounded-2xl p-4 text-white shadow-xl relative overflow-hidden transform hover:scale-105 transition-transform duration-300">
                         <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-gold rounded-full blur-2xl opacity-40"></div>
                         <div className="relative z-10">
                           <div className="text-blue-200 text-xs font-semibold mb-1 tracking-wide">Solde disponible</div>
                           <div className="text-3xl font-black mb-3 text-white">45,000<span className="text-lg text-blue-200 ml-1">DA</span></div>
                           <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 rounded-[0.5rem] text-[10px] font-bold text-white border border-white/10 shadow-sm">
                             <Zap className="w-3 h-3 text-primary-gold" /> Recharge Express
                           </div>
                         </div>
                      </div>
                      
                      {/* Quick Actions Grid */}
                      <div className="grid grid-cols-4 gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                         {[ 
                            { icon: Plane, label: 'E-Visa', color: 'text-primary-gold', bg: 'bg-primary-gold/10' },
                            { icon: ShieldCheck, label: 'Assurance', color: 'text-primary-gold', bg: 'bg-primary-gold/10' },
                            { icon: Users, label: 'Dossier', color: 'text-primary-gold', bg: 'bg-primary-gold/10' },
                            { icon: BarChart, label: 'Suivi', color: 'text-primary-gold', bg: 'bg-primary-gold/10' },
                         ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5 cursor-pointer">
                               <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl ${item.bg} ${item.color} flex items-center justify-center transform hover:-translate-y-1 transition-transform border border-white`}>
                                 <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                               </div>
                               <span className="text-[9px] md:text-[10px] font-bold text-gray-700">{item.label}</span>
                            </div>
                         ))}
                      </div>

                      {/* Recent Activities */}
                      <div className="flex-1 overflow-hidden flex flex-col">
                         <div className="flex justify-between items-center text-xs font-bold px-1 mb-2">
                           <span className="text-text-dark text-xs font-black uppercase tracking-wider">Dossiers récents</span>
                           <span className="text-primary-gold text-[10px]">Voir tout</span>
                         </div>
                         <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar pb-6">
                            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transform active:scale-95 transition-all">
                               <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-primary-gold/10 border border-green-100 flex items-center justify-center text-primary-gold shrink-0">
                                    <CheckCircle className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-black text-text-dark truncate tracking-tight">Visa Dubaï B2B</div>
                                    <div className="text-[10px] font-semibold text-gray-500 mt-0.5">Dossier Approuvé</div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <div className="text-[10px] font-bold text-gray-400">Il y a 2h</div>
                                  </div>
                               </div>
                            </div>
                            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transform active:scale-95 transition-all">
                               <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-primary-gold/10 border border-primary-gold/20 flex items-center justify-center text-primary-gold shrink-0">
                                    <Globe2 className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-black text-text-dark truncate tracking-tight">Visa Turquie</div>
                                    <div className="text-[10px] font-semibold text-gray-500 mt-0.5">En cours de traitement</div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <div className="text-[10px] font-bold text-gray-400">Aujourd'hui</div>
                                  </div>
                               </div>
                            </div>
                            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transform active:scale-95 transition-all opacity-50">
                               <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-primary-gold/10 border border-blue-100 flex items-center justify-center text-primary-gold shrink-0">
                                    <ShieldCheck className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-black text-text-dark truncate tracking-tight">Assurance Voyage</div>
                                    <div className="text-[10px] font-semibold text-gray-500 mt-0.5">Dossier finalisé</div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <div className="text-[10px] font-bold text-gray-400">Hier</div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Decorative blob behind phone */}
             <div className="absolute inset-0 bg-gradient-to-tr from-primary-gold/60 to-primary-gold/30 blur-[80px] opacity-20 -z-10 rounded-full transform scale-75 translate-x-10 translate-y-10"></div>
          </div>
        </div>
      </section>

      {/* Services Grid (SaaS Style) */}
      <section id="services" className="py-32 bg-bg-white border-y border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <div className="text-primary-gold font-bold tracking-wide uppercase mb-3">Nos Solutions</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Un écosystème de services complet</h2>
            <p className="text-xl text-gray-500 font-medium">Nous mettons à votre disposition une suite d'outils performants pour satisfaire vos clients les plus exigeants.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-primary-gold/10 text-primary-gold rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary-gold group-hover:text-white transition-all">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Traitement B2B Express</h3>
              <p className="text-gray-500 leading-relaxed text-lg">Soumettez vos dossiers de visa en quelques clics. Nos experts s'occupent du reste avec une priorité absolue et un suivi minutieux.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-primary-gold/10 text-primary-gold rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary-gold group-hover:text-white transition-all">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Portefeuille Prépayé</h3>
              <p className="text-gray-500 leading-relaxed text-lg">Gérez vos finances avec transparence. Un solde sécurisé pour payer instantanément vos services sans frais cachés.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-primary-gold/10 text-primary-gold rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary-gold group-hover:text-white transition-all">
                <BarChart className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Suivi en Temps Réel</h3>
              <p className="text-gray-500 leading-relaxed text-lg">Ne laissez plus vos clients dans le flou. Un tableau de bord interactif pour suivre l'état d'avancement de chaque demande.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-primary-gold/10 text-primary-gold rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary-gold group-hover:text-white transition-all">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Assistance Dédiée</h3>
              <p className="text-gray-500 leading-relaxed text-lg">Une équipe de spécialistes est à votre écoute pour vous guider et résoudre les situations les plus complexes.</p>
            </div>
            
            <div className="md:col-span-2 lg:col-span-2 bg-[var(--color-text-dark)] text-white p-10 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col justify-center group overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20 group-hover:scale-110 transition-transform duration-1000"></div>
               <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-text-dark)] via-[var(--color-text-dark)]/90 to-[var(--color-text-dark)]/40"></div>
               <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-primary-gold rounded-full blur-[120px] opacity-40"></div>
               
               <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-4 text-primary-gold font-bold uppercase tracking-wider">
                   <Globe2 className="w-5 h-5" /> Couverture Globale
                 </div>
                 <h3 className="text-3xl md:text-4xl font-black mb-4">Plus de 8 services intégrés</h3>
                 <p className="text-blue-100 text-lg md:text-xl font-medium max-w-lg mb-8 leading-relaxed">Evisa, Résidence, Permis International, Assurance Voyage, Études à l'étranger, Rendez-vous, Traitement de Dossier.</p>
                 <Link to="/register">
                    <Button className="bg-primary-gold hover:bg-primary-gold text-white rounded-xl px-8 py-6 text-lg h-auto font-bold transition-transform hover:-translate-y-1 border-none">
                      Rejoindre le réseau Agences <Plane className="w-5 h-5 ml-2" />
                    </Button>
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white border-b border-gray-100 relative z-20">
         <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-20 max-w-3xl mx-auto">
               <div className="text-primary-gold font-bold tracking-wide uppercase mb-3">Fonctionnement</div>
               <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-text-dark">Votre demande en 4 étapes</h2>
               <p className="text-xl text-gray-500 font-medium">Un processus 100% digitalisé conçu pour les agences de voyage.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative">
               <div className="hidden md:block absolute top-[45px] left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary-gold/10 via-primary-gold/40 to-primary-gold/10"></div>
               
               {[
                 { step: "01", title: "Soumission", desc: "Saisissez les informations et téléchargez les documents requis." },
                 { step: "02", title: "Vérification", desc: "Nos experts vérifient minutieusement le dossier pour éviter tout refus." },
                 { step: "03", title: "Traitement", desc: "Nous soumettons la demande aux autorités compétentes en priorité." },
                 { step: "04", title: "Validation", desc: "Recevez le document final directement sur votre tableau de bord B2B." }
               ].map((item, i) => (
                  <div key={i} className="relative flex flex-col items-center text-center group z-10">
                     <div className="w-24 h-24 rounded-full bg-bg-white border-4 border-white shadow-xl flex items-center justify-center text-2xl font-black text-primary-gold mb-6 relative z-10 group-hover:-translate-y-2 group-hover:bg-primary-gold group-hover:text-white transition-all duration-300">
                        {item.step}
                     </div>
                     <h3 className="text-xl font-bold mb-3 text-text-dark">{item.title}</h3>
                     <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Social Proof & About */}
      <section id="about" className="py-32 bg-white">
         <div className="max-w-4xl mx-auto px-6 md:px-12 text-center space-y-8 relative z-10">
               <div className="text-primary-gold font-bold tracking-wide uppercase">Pourquoi nous choisir ?</div>
               <h2 className="text-4xl md:text-5xl font-black tracking-tight text-text-dark leading-tight">Notre expertise à votre service</h2>
               <p className="text-xl text-gray-600 leading-relaxed font-medium">La Clé d'Or est votre partenaire privilégié pour faciliter toutes les démarches administratives de voyages pour vos clients. Nous comprenons les enjeux des agences de voyage et nous avons bâti cet outil pour vous rendre plus compétitifs.</p>
               
               <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                  <div>
                     <div className="text-4xl md:text-5xl font-black text-text-dark mb-2">+50</div>
                     <div className="text-primary-gold font-bold text-lg">Destinations couvertes</div>
                  </div>
                  <div>
                     <div className="text-4xl md:text-5xl font-black text-text-dark mb-2">24h</div>
                     <div className="text-primary-gold font-bold text-lg">Temps de traitement moyen</div>
                  </div>
               </div>

               <div className="pt-12 text-left max-w-2xl mx-auto space-y-8">
                 <h3 className="text-3xl font-black text-center mb-10">Rejoignez le réseau B2B</h3>
                 <ul className="space-y-6">
                   <li className="flex gap-4 items-start bg-bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
                     <div className="w-12 h-12 rounded-xl bg-primary-gold/10 text-primary-gold flex items-center justify-center shrink-0 font-black text-xl">1</div>
                     <div>
                       <div className="font-bold text-xl mb-1 text-text-dark">Inscrivez votre agence</div>
                       <div className="text-gray-500 font-medium leading-relaxed">Remplissez le formulaire de partenariat en 2 minutes avec vos informations légales.</div>
                     </div>
                   </li>
                   <li className="flex gap-4 items-start bg-bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
                     <div className="w-12 h-12 rounded-xl bg-primary-gold/10 text-primary-gold flex items-center justify-center shrink-0 font-black text-xl">2</div>
                     <div>
                       <div className="font-bold text-xl mb-1 text-text-dark">Accédez à la plateforme</div>
                       <div className="text-gray-500 font-medium leading-relaxed">Connectez-vous, rechargez votre portefeuille et découvrez votre espace dédié.</div>
                     </div>
                   </li>
                   <li className="flex gap-4 items-start bg-bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
                     <div className="w-12 h-12 rounded-xl bg-primary-gold/10 text-primary-gold flex items-center justify-center shrink-0 font-black text-xl">3</div>
                     <div>
                       <div className="font-bold text-xl mb-1 text-text-dark">Gérez vos dossiers</div>
                       <div className="text-gray-500 font-medium leading-relaxed">Gagnez du temps, augmentez vos marges et la satisfaction de vos clients.</div>
                     </div>
                   </li>
                 </ul>
               </div>
         </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 bg-white border-y border-gray-100 z-20 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Nos Partenaires de Confiance</h3>
           <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-70 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/94/AXA_Logo.svg" alt="AXA Assurance" className="h-12 md:h-16 object-contain" />
              
              <div className="flex items-center gap-2 font-black text-3xl md:text-4xl text-[#1e58a7] tracking-tight relative">
                <Logo />
              </div>
           </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="bg-[var(--color-text-dark)] text-gray-300 py-20 px-6 md:px-12 border-t-8 border-primary-gold">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div className="space-y-6 lg:col-span-1">
            <div className="mb-6 inline-block bg-white p-3 rounded-xl">
              <Logo />
            </div>
            <p className="text-blue-200/70 font-medium text-lg leading-relaxed">
              Simplifiez vos démarches de visas et offrez le meilleur service à vos clients grâce à notre plateforme B2B innovante.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold text-xl mb-6">Contactez-nous</h4>
            <div className="space-y-4">
               <a href="tel:0562101719" className="flex items-center gap-3 hover:text-primary-gold transition-colors font-medium text-lg">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"><Phone className="w-4 h-4 text-primary-gold" /></div> 
                 0562 10 17 19
               </a>
               <a href="tel:0560127255" className="flex items-center gap-3 hover:text-primary-gold transition-colors font-medium text-lg">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"><Phone className="w-4 h-4 text-primary-gold" /></div> 
                 0560 12 72 55
               </a>
               <a href="tel:0557629519" className="flex items-center gap-3 hover:text-primary-gold transition-colors font-medium text-lg">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"><Phone className="w-4 h-4 text-primary-gold" /></div> 
                 0557 62 95 19
               </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold text-xl mb-6">Informations</h4>
            <div className="space-y-4">
               <a href="mailto:la.cle.dor.visa.b2b@gmail.com" className="flex items-start gap-3 hover:text-primary-gold transition-colors font-medium text-lg group">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary-gold/20 transition-colors"><Mail className="w-4 h-4 text-primary-gold" /></div> 
                 <span className="pt-2 break-all">la.cle.dor.visa.b2b@gmail.com</span>
               </a>
               <div className="flex items-start gap-3 font-medium text-lg">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0"><MapPin className="w-4 h-4 text-primary-gold" /></div> 
                 <span className="pt-2 leading-relaxed">Rue Ali Khodja, Bordj El Kiffan - Alger</span>
               </div>
            </div>
          </div>

          <div className="space-y-6">
             <h4 className="text-white font-bold text-xl mb-6">Réseaux Sociaux</h4>
             <div className="flex flex-col gap-4">
               <a href="https://www.facebook.com/share/18iGHDJaCt/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary-gold transition-colors font-medium text-lg group">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-gold/20 transition-colors"><Facebook className="w-4 h-4 text-gray-400 group-hover:text-primary-gold" /></div> 
                 Facebook
               </a>
               <a href="https://www.instagram.com/la.cle.dor.travel?igsh=MWM5ZWdxN2plYTZoZQ==" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary-gold transition-colors font-medium text-lg group">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-gold/20 transition-colors"><Instagram className="w-4 h-4 text-gray-400 group-hover:text-primary-gold" /></div> 
                 Instagram
               </a>
               <a href="https://www.tiktok.com/@la.cle.dor.travel?_r=1&_t=ZS-96KYhI0sPrA" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-white transition-colors font-medium text-lg group">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors"><Link2 className="w-4 h-4 text-gray-400 group-hover:text-white" /></div> 
                 TikTok
               </a>
               <a href="https://youtube.com/@la.cle.dor.travel.service?si=fUybLNNYxjrAxtV1" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-red-500 transition-colors font-medium text-lg group">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-500/20 transition-colors"><Youtube className="w-4 h-4 text-gray-400 group-hover:text-red-500" /></div> 
                 YouTube
               </a>
               <a href="https://whatsapp.com/channel/0029VbBSSDgKGGGQ2mCZwF0z" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary-gold transition-colors font-medium text-lg group">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-gold/20 transition-colors"><MessageCircle className="w-4 h-4 text-gray-400 group-hover:text-primary-gold" /></div> 
                 WhatsApp
               </a>
             </div>
          </div>
          
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-gray-800/80 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-gray-500">
           <div>&copy; {new Date().getFullYear()} La Clé d'Or B2B. Tous droits réservés.</div>
           <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a>
           </div>
        </div>
      </footer>
    </div>
  );
}