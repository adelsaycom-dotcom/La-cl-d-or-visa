const fs = require('fs');

let content = fs.readFileSync('components/LandingPage.tsx', 'utf8');

// Replace image
content = content.replace(
  '<img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop" alt="Team" className="w-full h-full object-cover mix-blend-overlay opacity-60" />',
  `{/* INSTRUCTION: Pour remplacer cette image, importez une photo nommée "agence-photo.jpg" dans le dossier "public" de votre éditeur de code. */}
                    <img 
                      src="/agence-photo.jpg" 
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop"; }}
                      alt="Agence Team" 
                      className="w-full h-full object-cover mix-blend-overlay opacity-60" 
                    />`
);

// We need to add lucide icons: Star, ChevronDown if not present. Let's just add Star, ChevronDown, Check to the import.
content = content.replace('Users, ArrowRight, BarChart, Phone, Mail, MapPin, Facebook, Instagram, Youtube, MessageCircle, Link2, Eye, LogIn, CheckCircle, Globe2, Plane }', 'Users, ArrowRight, BarChart, Phone, Mail, MapPin, Facebook, Instagram, Youtube, MessageCircle, Link2, Eye, LogIn, CheckCircle, Globe2, Plane, Star, ChevronDown, Check }');


const newSections = `
      {/* Testimonials */}
      <section className="py-24 bg-slate-50 relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
           <motion.div variants={fadeUp} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="text-center max-w-3xl mx-auto mb-16">
             <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-6">Ce que pensent nos agences partenaires</h2>
             <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
               Découvrez comment La Clé d'Or a transformé le quotidien de centaines d'agences de voyage.
             </p>
           </motion.div>

           <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { name: "Karim M.", agency: "Voyage Plus, Alger", text: "Depuis que nous utilisons ce portail, le temps de traitement de nos dossiers a été divisé par trois. C'est un gain de temps inestimable pour notre équipe." },
               { name: "Sarah B.", agency: "Horizon Travel, Oran", text: "L'interface est super intuitive et le suivi en temps réel rassure énormément nos clients. Un partenariat gagnant-gagnant !" },
               { name: "Amine T.", agency: "Evasion Tours, Constantine", text: "Le service d'assurances voyage intégré et la gestion des visas sur une seule plateforme, c'est exactement ce qu'il nous fallait." }
             ].map((review, idx) => (
               <motion.div variants={fadeUp} key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative">
                 <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-primary-gold text-primary-gold" />)}
                 </div>
                 <p className="text-slate-600 text-lg font-medium leading-relaxed italic mb-8">"{review.text}"</p>
                 <div>
                    <div className="font-bold text-slate-900 text-lg">{review.name}</div>
                    <div className="text-slate-500 text-sm">{review.agency}</div>
                 </div>
               </motion.div>
             ))}
           </motion.div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-24 bg-white relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center">
           <motion.div variants={fadeUp} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }}>
             <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight mb-8">
               Une gestion centralisée pour <span className="text-primary-gold">plus de sérénité</span>.
             </h2>
             <ul className="space-y-6">
               {[
                 "Suivi en temps réel de tous les dossiers",
                 "Messagerie interne avec nos conseillers",
                 "Facturation automatisée et historique",
                 "Alertes de mise à jour des documents manquants"
               ].map((feature, idx) => (
                 <li key={idx} className="flex items-center gap-4">
                   <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                     <CheckCircle className="w-5 h-5" />
                   </div>
                   <span className="text-slate-700 font-medium text-lg">{feature}</span>
                 </li>
               ))}
             </ul>
           </motion.div>
           <motion.div variants={fadeUp} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="relative">
             <div className="aspect-[4/3] rounded-[2rem] bg-slate-900 overflow-hidden relative shadow-2xl p-8 flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-slate-900"></div>
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-gold rounded-full mix-blend-overlay blur-3xl opacity-50"></div>
                <div className="relative z-10 space-y-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="h-6 w-32 bg-white/20 rounded-md"></div>
                  <div className="space-y-2 pt-4">
                    <div className="h-4 w-full bg-white/10 rounded-md"></div>
                    <div className="h-4 w-[90%] bg-white/10 rounded-md"></div>
                    <div className="h-4 w-[80%] bg-white/10 rounded-md"></div>
                  </div>
                </div>
                <div className="relative z-10 mt-12 grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                     <div className="text-white/70 text-xs font-bold mb-1">Visas Acceptés</div>
                     <div className="text-white font-black text-2xl">342</div>
                  </div>
                  <div className="bg-primary-gold/20 backdrop-blur-md rounded-xl p-4 border border-primary-gold/30">
                     <div className="text-primary-gold text-xs font-bold mb-1">Croissance</div>
                     <div className="text-white font-black text-2xl">+45%</div>
                  </div>
                </div>
             </div>
           </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-50 relative z-20">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.div variants={fadeUp} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-6">Questions Fréquentes</h2>
            <p className="text-slate-600 text-lg">Tout ce que vous devez savoir pour démarrer avec La Clé d'Or B2B.</p>
          </motion.div>
          <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="space-y-4">
             {[
               { q: "L'inscription est-elle payante ?", a: "Non, l'inscription est totalement gratuite. Vous ne payez que les frais de traitement des dossiers que vous nous soumettez." },
               { q: "Combien de temps faut-il pour valider mon compte agence ?", a: "Notre équipe s'efforce de valider chaque nouveau profil d'agence dans un délai maximum de 24 à 48 heures ouvrables." },
               { q: "Puis-je suivre l'état de mes dossiers en direct ?", a: "Oui, notre tableau de bord vous offre un suivi en temps réel (En attente, En cours, Approuvé, Rejeté) avec des alertes pour chaque mise à jour." },
               { q: "Comment se passe la facturation ?", a: "La facturation est automatisée. Un portefeuille virtuel est rattaché à votre compte, vous le rechargez et le solde est déduit à chaque traitement." }
             ].map((faq, idx) => (
               <motion.div variants={fadeUp} key={idx} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                 <h4 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h4>
                 <p className="text-slate-600 leading-relaxed">{faq.a}</p>
               </motion.div>
             ))}
          </motion.div>
        </div>
      </section>
`;

content = content.replace('{/* Partners Section */}', newSections + '\n      {/* Partners Section */}');

fs.writeFileSync('components/LandingPage.tsx', content);
