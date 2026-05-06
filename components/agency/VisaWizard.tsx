import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, ChevronRight, FileUp, Info, Globe2, User, CreditCard, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COUNTRIES = [
  { id: "c1", name: "Émirats Arabes Unis", flag: "🇦🇪", price: 150, duration: "30 Jours", type: "e-Visa Touristique" },
  { id: "c2", name: "Arabie Saoudite", flag: "🇸🇦", price: 200, duration: "90 Jours", type: "e-Visa Entrées Multiples" },
  { id: "c3", name: "Turquie", flag: "🇹🇷", price: 60, duration: "30 Jours", type: "e-Visa Entrée Unique" },
  { id: "c4", name: "Oman", flag: "🇴🇲", price: 50, duration: "30 Jours", type: "e-Visa Touristique" }
];

export function VisaWizard() {
  const [step, setStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  
  const nextStep = () => setStep(s => Math.min(4, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const steps = [
    { title: "Destination", icon: Globe2 },
    { title: "Demandeur", icon: User },
    { title: "Documents", icon: FileUp },
    { title: "Paiement", icon: CreditCard },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Demande de Visa</h2>
        <p className="text-slate-500 mt-3 text-lg max-w-2xl mx-auto">Complétez les quatre étapes ci-dessous pour soumettre la demande de votre client.</p>
      </div>

      {/* Modern Stepper */}
      <div className="relative mb-12 max-w-3xl mx-auto">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        ></div>
        
        <div className="relative flex justify-between">
          {steps.map((s, idx) => {
            const i = idx + 1;
            const StepIcon = s.icon;
            const isActive = step === i;
            const isCompleted = step > i;

            return (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 border-4 cursor-default
                    ${isActive ? 'bg-blue-600 text-white border-blue-100 ring-4 ring-blue-50' : 
                      isCompleted ? 'bg-blue-600 text-white border-white' : 'bg-white text-slate-400 border-slate-100'}`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                </div>
                <div className={`mt-3 text-sm font-semibold transition-colors
                  ${isActive || isCompleted ? 'text-blue-900' : 'text-slate-400'}`}>
                  {s.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-200/60 min-h-[500px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Où voyagent-ils ?</h3>
                  <p className="text-slate-500 mt-1">Sélectionnez le pays de destination et le type de visa.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {COUNTRIES.map(c => (
                    <div 
                      key={c.id} 
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 group
                        ${selectedCountry?.id === c.id 
                          ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100/50' 
                          : 'border-slate-100 hover:border-blue-200 hover:shadow-sm'}`}
                      onClick={() => setSelectedCountry(c)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl bg-white w-16 h-16 rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                            {c.flag}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{c.name}</div>
                            <div className="text-sm font-medium text-slate-500 mt-0.5">{c.type}</div>
                            <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{c.duration}</div>
                          </div>
                        </div>
                        <div className="font-mono font-bold text-xl text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm">
                          {c.price} <span className="text-sm text-slate-500 font-sans">DA</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-4">
                    <span>{selectedCountry?.flag}</span> {selectedCountry?.name}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Détails du demandeur</h3>
                  <p className="text-slate-500 mt-1">Saisissez les informations exactement comme elles apparaissent sur le passeport.</p>
                </div>
                
                <div className="bg-blue-50/50 text-blue-900 p-4 rounded-xl flex gap-3 text-sm border border-blue-100/50">
                  <Info className="w-5 h-5 shrink-0 text-blue-600" />
                  <p>Toute information incorrecte entraînera un rejet sans remboursement. Veuillez vérifier attentivement tous les champs.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Prénom <span className="text-red-500">*</span></label>
                    <Input className="h-12 bg-white" placeholder="Prénoms" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Nom de famille <span className="text-red-500">*</span></label>
                    <Input className="h-12 bg-white" placeholder="Nom" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Numéro de passeport <span className="text-red-500">*</span></label>
                    <Input className="h-12 bg-white font-mono uppercase text-lg" placeholder="AB123456" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Date de naissance <span className="text-red-500">*</span></label>
                    <Input className="h-12 bg-white" type="date" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">Nationalité <span className="text-red-500">*</span></label>
                    <Select>
                      <SelectTrigger className="h-12 bg-white"><SelectValue placeholder="Sélectionnez la nationalité..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dz">Algérienne</SelectItem>
                        <SelectItem value="fr">Française</SelectItem>
                        <SelectItem value="uk">Britannique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900">Télécharger les documents</h3>
                  <p className="text-slate-500 mt-1">Fournissez des scans clairs et en couleur des documents requis.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer group bg-white relative overflow-hidden">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                      <FileUp className="w-8 h-8" />
                    </div>
                    <div className="font-bold text-slate-900">Page de données du passeport</div>
                    <div className="text-sm text-slate-500 mt-2 max-w-[200px]">JPEG ou PDF. Max 5Mo. En couleur.</div>
                  </div>
                  
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer group bg-white relative overflow-hidden">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                      <User className="w-8 h-8" />
                    </div>
                    <div className="font-bold text-slate-900">Photo personnelle</div>
                    <div className="text-sm text-slate-500 mt-2 max-w-[200px]">Fond blanc. JPEG uniquement. Max 2Mo.</div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900">Confirmer & Payer</h3>
                  <p className="text-slate-500 mt-1">Vérifiez les détails de la demande et finalisez le paiement.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-3 space-y-6">
                    <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                        <div className="text-4xl bg-white w-16 h-16 rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                          {selectedCountry?.flag}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xl">{selectedCountry?.name}</div>
                          <div className="text-slate-500 font-medium">{selectedCountry?.type}</div>
                        </div>
                      </div>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 text-sm">
                        <div>
                          <dt className="text-slate-500 font-medium mb-1">Nom du demandeur</dt>
                          <dd className="font-bold text-slate-900 text-base">John Doe</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500 font-medium mb-1">Numéro de passeport</dt>
                          <dd className="font-mono font-bold text-slate-900 text-base">AB123456</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500 font-medium mb-1">Nationalité</dt>
                          <dd className="font-bold text-slate-900 text-base">Algérien</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500 font-medium mb-1">Documents</dt>
                          <dd className="font-bold text-green-600 flex items-center gap-1.5 text-base">
                            <CheckCircle2 className="w-5 h-5"/> 2 Fichiers Téléchargés
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <CreditCard className="w-32 h-32" />
                      </div>
                      <h4 className="font-bold mb-6 text-slate-300 text-sm uppercase tracking-widest relative z-10">Résumé du Paiement</h4>
                      
                      <div className="space-y-4 mb-6 pb-6 border-b border-white/10 relative z-10">
                        <div className="flex justify-between text-base">
                          <span className="text-slate-300">Solde du portefeuille</span>
                          <span className="font-mono font-medium">4,500 DA</span>
                        </div>
                        <div className="flex justify-between text-base">
                          <span className="text-slate-300">Frais de visa</span>
                          <span className="font-mono font-medium text-red-300">-{selectedCountry?.price} DA</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-end relative z-10">
                        <span className="text-slate-300 font-medium">Restant</span>
                        <span className="font-mono text-3xl font-black text-emerald-400">
                          {4500 - (selectedCountry?.price || 0)} <span className="text-lg text-emerald-400/70">DA</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center mt-8 px-2">
        <Button 
          variant="ghost" 
          onClick={prevStep} 
          disabled={step === 1} 
          className="px-6 h-12 text-slate-500 hover:text-slate-900 font-semibold"
        >
          <ChevronLeft className="w-5 h-5 mr-2" /> Retour
        </Button>
        
        {step < 4 ? (
          <Button 
            onClick={nextStep} 
            disabled={step === 1 && !selectedCountry}
            className="px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all text-base"
          >
            Continuer <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <Button className="px-10 h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all text-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Soumettre la demande
          </Button>
        )}
      </div>
    </div>
  );
}

