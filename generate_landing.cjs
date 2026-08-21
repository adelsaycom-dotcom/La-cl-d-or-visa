const fs = require('fs');

const content = `import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { KeyRound, ShieldCheck, Zap, Users, ArrowRight, BarChart, Phone, Mail, MapPin, Facebook, Instagram, Youtube, MessageCircle, Link2, Eye, LogIn, CheckCircle, Globe2, Plane } from "lucide-react";
import { Logo } from '@/components/Logo';
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.15 }
};

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary-gold/30">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-6 py-4 md:px-12 border-b border-slate-200 sticky top-0 bg-white/90 backdrop-blur-md z-50 transition-all">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
        <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
          <a href="#about" className="hover:text-primary-gold transition-colors">Notre Agence</a>
          <a href="#services" className="hover:text-primary-gold transition-colors">Services</a>
          <a href="#contact" className="hover:text-primary-gold transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/login" className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-primary-gold transition-colors">
            <LogIn className="w-4 h-4" /> Espace pro
          </Link>
          <Link to="/login" className="sm:hidden p-2 text-slate-700">
            <LogIn className="w-5 h-5" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 py-20 md:py-32 overflow-hidden flex flex-col items-center">
        <div className="absolute inset-0 bg-[url('/fond-monde.png')] bg-cover bg-center opacity-[0.15] mix-blend-multiply transition-all duration-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-slate-50/80 to-slate-50/95"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div variants={staggerContainer} initial="initial" animate="whileInView" className="space-y-8 text-left">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-gold/10 text-primary-gold font-bold text-sm border border-primary-gold/20 shadow-sm">
               <span className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-gold opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-gold"></span>
               </span>
               La plateforme B2B #1 en Algérie
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-[1.1]">
              Accélérez le succès de votre <span className="text-primary-gold">Agence de Voyage</span>.
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-xl md:text-2xl text-slate-600 max-w-xl leading-relaxed font-medium">
              La Clé d'Or vous offre un portail exclusif pour traiter vos demandes de visas, séjours, études et assurances avec une efficacité redoutable.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
              <Link to="/register">
                 <Button className="bg-primary-gold hover:bg-primary-gold/90 text-white rounded-2xl px-8 py-6 text-lg h-auto shadow-xl shadow-primary-gold/20 transition-all hover:-translate-y-1 font-bold">
                   Créer un compte <ArrowRight className="w-5 h-5 ml-2" />
                 </Button>
              </Link>
              <Link to="/login">
                 <Button variant="outline" className="rounded-2xl px-8 py-6 text-lg h-auto text-slate-700 border-2 border-slate-200 hover:bg-white hover:border-slate-300 font-bold transition-all hover:-translate-y-1 gap-2 bg-white shadow-sm">
                   <Eye className="w-5 h-5" /> Se connecter
                 </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end px-4 md:px-0"
          >
             {/* Platform Mockup Behind Phone */}
             <div className="absolute right-10 top-10 w-[600px] h-[350px] bg-white rounded-xl shadow-2xl border border-slate-200 hidden xl:flex flex-col overflow-hidden opacity-90 transform translate-x-12 -translate-y-8">
               {/* Header mock */}
               <div className="h-12 bg-slate-900 flex items-center px-4 gap-4">
                 <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400"/><div className="w-3 h-3 rounded-full bg-amber-400"/><div className="w-3 h-3 rounded-full bg-green-400"/></div>
                 <div className="h-6 w-48 bg-white/10 rounded-md"></div>
               </div>
               {/* Body mock */}
               <div className="flex-1 bg-slate-50 flex">
                 <div className="w-48 bg-white border-r border-slate-200 p-4 space-y-3">
                    <div className="h-8 w-full bg-slate-100 rounded-md"></div>
                    <div className="h-8 w-full bg-indigo-50 border border-indigo-100 rounded-md"></div>
                    <div className="h-8 w-full bg-slate-100 rounded-md"></div>
                 </div>
                 <div className="flex-1 p-6 space-y-6">
                    <div className="flex justify-between items-center">
                       <div className="w-32 h-6 bg-slate-200 rounded"></div>
                       <div className="w-24 h-8 bg-indigo-600 rounded-lg"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                       <div className="h-24 bg-white border border-slate-200 rounded-xl shadow-sm"></div>
                       <div className="h-24 bg-white border border-slate-200 rounded-xl shadow-sm"></div>
                       <div className="h-24 bg-white border border-slate-200 rounded-xl shadow-sm"></div>
                    </div>
                 </div>
               </div>
             </div>

             {/* Phone Mockup Frame */}
             <div className="relative w-[300px] md:w-[350px] aspect-[9/19] bg-white rounded-[3rem] border-[12px] border-slate-900 shadow-2xl flex flex-col ring-4 ring-slate-200/50 z-10">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-900 rounded-b-3xl z-30"></div>
                
                {/* App Content inside mockup */}
                <div className="flex-1 rounded-[2.2rem] overflow-hidden bg-slate-50 relative flex flex-col">
                   {/* App Header */}
                   <div className="bg-slate-900 pt-12 pb-6 px-6 relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-gold rounded-full opacity-20 blur-2xl"></div>
                      <div className="flex justify-between items-center relative z-10">
                         <div>
                            <div className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">Bienvenue</div>
                            <div className="text-white font-black text-xl">Agence El Moustakbel</div>
                         </div>
                         <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                            <Users className="w-5 h-5 text-white" />
                         </div>
                      </div>
                   </div>
                   {/* App Body */}
                   <div className="p-4 flex-1 space-y-4">
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                         <div>
                            <div className="text-slate-500 text-xs font-bold mb-1">Solde Actuel</div>
                            <div className="text-slate-900 font-black text-2xl">145,000 DZD</div>
                         </div>
                         <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                            <Zap className="w-6 h-6" />
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                         <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                            <Globe2 className="w-6 h-6 text-indigo-600 mb-2" />
                            <div className="font-bold text-slate-900 text-sm">Visas</div>
                            <div className="text-xs text-indigo-600 font-medium mt-1">12 en cours</div>
                         </div>
                         <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                            <Plane className="w-6 h-6 text-amber-600 mb-2" />
                            <div className="font-bold text-slate-900 text-sm">Vols</div>
                            <div className="text-xs text-amber-600 font-medium mt-1">3 réservés</div>
                         </div>
                      </div>

                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
                         <div className="font-bold text-slate-900 text-sm flex justify-between">Dernières Demandes <span className="text-primary-gold">Voir tout</span></div>
                         
                         <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">M</div>
                               <div>
                                  <div className="text-sm font-bold text-slate-900">Visa France</div>
                                  <div className="text-xs text-slate-500">Mehdi Y.</div>
                               </div>
                            </div>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">Approuvé</span>
                         </div>
                         
                         <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">S</div>
                               <div>
                                  <div className="text-sm font-bold text-slate-900">Visa Espagne</div>
                                  <div className="text-xs text-slate-500">Sarah B.</div>
                               </div>
                            </div>
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">En cours</span>
                         </div>
                      </div>
                   </div>
                   
                   {/* App Bottom Nav */}
                   <div className="bg-white border-t border-slate-100 p-4 flex justify-around items-center">
                      <div className="w-10 h-10 flex flex-col items-center justify-center text-primary-gold">
                         <BarChart className="w-5 h-5 mb-1" />
                         <div className="text-[9px] font-bold">Home</div>
                      </div>
                      <div className="w-10 h-10 flex flex-col items-center justify-center text-slate-400">
                         <Users className="w-5 h-5 mb-1" />
                         <div className="text-[9px] font-bold">Clients</div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-primary-gold text-white flex items-center justify-center shadow-lg -mt-8 shadow-primary-gold/40 border-4 border-slate-50">
                         <div className="w-6 h-6">+</div>
                      </div>
                      <div className="w-10 h-10 flex flex-col items-center justify-center text-slate-400">
                         <ShieldCheck className="w-5 h-5 mb-1" />
                         <div className="text-[9px] font-bold">Docs</div>
                      </div>
                      <div className="w-10 h-10 flex flex-col items-center justify-center text-slate-400">
                         <KeyRound className="w-5 h-5 mb-1" />
                         <div className="text-[9px] font-bold">Profil</div>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white border-y border-slate-100 relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
           <motion.div variants={fadeUp} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="text-center max-w-3xl mx-auto mb-16">
             <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-6">Tout ce dont votre agence a besoin.</h2>
             <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
               Gagnez en rapidité et en efficacité. Nous mettons à votre disposition les outils pour développer votre activité de voyage sans les tracas administratifs.
             </p>
           </motion.div>

           <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[
               { icon: Globe2, title: "Visas Touristiques", desc: "Traitement complet des demandes de visas pour l'espace Schengen, UK, USA et autres destinations mondiales.", color: "text-blue-600", bg: "bg-blue-50" },
               { icon: Plane, title: "Séjours Linguistiques", desc: "Programmes complets pour l'apprentissage des langues à l'étranger (UK, USA, Canada).", color: "text-amber-600", bg: "bg-amber-50" },
               { icon: CheckCircle, title: "Assurances Voyage", desc: "Émission instantanée d'assurances voyage conformes aux exigences consulaires.", color: "text-green-600", bg: "bg-green-50" },
             ].map((service, idx) => (
               <motion.div variants={fadeUp} key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                 <div className={\`w-14 h-14 rounded-2xl \${service.bg} \${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform\`}>
                   <service.icon className="w-7 h-7" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                 <p className="text-slate-500 leading-relaxed font-medium">{service.desc}</p>
               </motion.div>
             ))}
           </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Agences Partenaires" },
              { value: "98%", label: "Taux de Satisfaction" },
              { value: "15k+", label: "Dossiers Traités" },
              { value: "24/7", label: "Support Dédié" },
            ].map((stat, idx) => (
              <motion.div variants={fadeUp} key={idx} className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-black text-primary-gold">{stat.value}</div>
                <div className="text-slate-600 font-bold text-sm uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="about" className="py-32 bg-white">
         <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="grid lg:grid-cols-2 gap-16 items-center">
               <motion.div variants={fadeUp} className="space-y-6">
                 <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                   Un partenariat pensé pour votre <span className="text-primary-gold">croissance</span>.
                 </h2>
                 <p className="text-slate-600 text-lg leading-relaxed">
                   En rejoignant La Clé d'Or, vous accédez à un écosystème conçu pour éliminer la paperasse, accélérer le traitement et fidéliser vos clients.
                 </p>
                 <ul className="space-y-6 pt-6">
                   <li className="flex gap-4 items-start bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
                     <div className="w-12 h-12 rounded-xl bg-primary-gold/10 text-primary-gold flex items-center justify-center shrink-0 font-black text-xl">1</div>
                     <div>
                       <div className="font-bold text-xl mb-1 text-slate-900">Demandez votre accès</div>
                       <div className="text-slate-500 font-medium leading-relaxed">Inscrivez votre agence gratuitement. Notre équipe valide votre profil sous 24h.</div>
                     </div>
                   </li>
                   <li className="flex gap-4 items-start bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
                     <div className="w-12 h-12 rounded-xl bg-primary-gold/10 text-primary-gold flex items-center justify-center shrink-0 font-black text-xl">2</div>
                     <div>
                       <div className="font-bold text-xl mb-1 text-slate-900">Accédez à la plateforme</div>
                       <div className="text-slate-500 font-medium leading-relaxed">Connectez-vous, rechargez votre portefeuille et découvrez votre espace dédié.</div>
                     </div>
                   </li>
                   <li className="flex gap-4 items-start bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
                     <div className="w-12 h-12 rounded-xl bg-primary-gold/10 text-primary-gold flex items-center justify-center shrink-0 font-black text-xl">3</div>
                     <div>
                       <div className="font-bold text-xl mb-1 text-slate-900">Gérez vos dossiers</div>
                       <div className="text-slate-500 font-medium leading-relaxed">Gagnez du temps, augmentez vos marges et la satisfaction de vos clients.</div>
                     </div>
                   </li>
                 </ul>
               </motion.div>
               <motion.div variants={fadeUp} className="relative">
                 <div className="aspect-square rounded-[3rem] bg-gradient-to-tr from-slate-100 to-slate-200 overflow-hidden relative shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop" alt="Team" className="w-full h-full object-cover mix-blend-overlay opacity-60" />
                    <div className="absolute inset-0 bg-primary-gold/10 mix-blend-multiply"></div>
                 </div>
                 <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 animate-bounce" style={{animationDuration: "3s"}}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                         <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">100% Sécurisé</div>
                        <div className="text-sm text-slate-500">Données protégées</div>
                      </div>
                    </div>
                 </div>
               </motion.div>
            </motion.div>
         </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 bg-white border-y border-slate-100 z-20 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Nos Partenaires de Confiance</h3>
           <motion.div 
             initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
             className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-70 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0"
           >
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/94/AXA_Logo.svg" alt="AXA Assurance" className="h-12 md:h-16 object-contain" />
              
              <div className="flex items-center gap-2 font-black text-3xl md:text-4xl text-[#1e58a7] tracking-tight relative">
                <Logo />
              </div>
           </motion.div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="bg-slate-900 text-slate-300 py-20 px-6 md:px-12 border-t-8 border-primary-gold">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div className="space-y-6 lg:col-span-1">
            <div className="mb-6 inline-block bg-white p-3 rounded-xl">
              <Logo />
            </div>
            <p className="text-slate-400 font-medium text-lg leading-relaxed">
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
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-gold/20 transition-colors"><Facebook className="w-4 h-4 text-slate-400 group-hover:text-primary-gold" /></div>
                  Facebook
               </a>
               <a href="https://www.instagram.com/la.cle.dor.travel?igsh=MWM5ZWdxN2plYTZoZQ==" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary-gold transition-colors font-medium text-lg group">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-gold/20 transition-colors"><Instagram className="w-4 h-4 text-slate-400 group-hover:text-primary-gold" /></div>
                  Instagram
               </a>
               <a href="https://www.tiktok.com/@la.cle.dor.travel?_r=1&_t=ZS-96KYhI0sPrA" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-white transition-colors font-medium text-lg group">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors"><Link2 className="w-4 h-4 text-slate-400 group-hover:text-white" /></div>
                  TikTok
               </a>
               <a href="https://youtube.com/@la.cle.dor.travel.service?si=fUybLNNYxjrAxtV1" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-red-500 transition-colors font-medium text-lg group">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-500/20 transition-colors"><Youtube className="w-4 h-4 text-slate-400 group-hover:text-red-500" /></div>
                  YouTube
               </a>
               <a href="https://whatsapp.com/channel/0029VbBSSDgKGGGQ2mCZwF0z" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary-gold transition-colors font-medium text-lg group">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-gold/20 transition-colors"><MessageCircle className="w-4 h-4 text-slate-400 group-hover:text-primary-gold" /></div>
                  WhatsApp
               </a>
             </div>
          </div>
          
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-slate-500">
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
`;

fs.writeFileSync('components/LandingPage.tsx', content);
