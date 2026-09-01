import { useState, useMemo, useEffect } from "react";
import { useAppStore, PrestationService } from "../../src/store/useAppStore";
import { auth } from "../../src/firebase";
import { 
  ChevronRight, ChevronLeft, MapPin, Clock, CreditCard, 
  FileText, CheckCircle2, AlertCircle, Upload, FileUp, Building2, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export function VisaWizard() {
  const { services, addApplication, agencyBalance, setAgencyBalance } = useAppStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get("service") || "E-Visa";

  const [step, setStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<PrestationService | null>(null);
  
  // Applicant Data
  const [applicant, setApplicant] = useState({
    firstName: "",
    lastName: "",
    passportNumber: ""
  });

  // Dynamic Files and Fields based on requiredDocuments
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | string>>({});
  const [textFields, setTextFields] = useState<Record<string, string>>({});

  // 1. Get unique countries that offer the requested service
  const availableCountries = useMemo(() => {
    const matchingServices = services.filter(s => s.type === requestedService && s.active);
    const countries = new Set(matchingServices.map(s => s.destination));
    return Array.from(countries).sort();
  }, [services, requestedService]);

  // 2. Get options for the selected country & service
  const availableOptions = useMemo(() => {
    if (!selectedCountry) return [];
    return services.filter(s => s.type === requestedService && s.destination === selectedCountry && s.active);
  }, [services, requestedService, selectedCountry]);

  // Reset if the URL service parameter changes
  useEffect(() => {
    setStep(1);
    setSelectedCountry("");
    setSelectedOption(null);
  }, [requestedService]);


  const handleFileUpload = (docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFiles(prev => ({ ...prev, [docName]: file }));
    }
  };

  const handleTextField = (fieldName: string, value: string) => {
    setTextFields(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedOption) return;

    if (agencyBalance < selectedOption.price) {
      alert("Solde insuffisant pour passer cette commande.");
      return;
    }

    try {
      // Create the application
      const newApp = {
        id: Math.random().toString(36).substring(7),
        agencyId: auth.currentUser?.uid || "unknown",
        agencyName: "Mon Agence", // Should come from context, simplified here
        type: selectedOption.type,
        destination: selectedOption.destination,
        serviceName: selectedOption.title,
        applicantName: `${applicant.lastName} ${applicant.firstName}`,
        passportNumber: applicant.passportNumber,
        status: "Pending",
        price: selectedOption.price,
        documents: Object.keys(uploadedFiles), // In a real app, upload to storage and store URLs
        customFields: textFields,
        date: new Date().toISOString().split("T")[0],
      };

      await addApplication(newApp as any);
      setAgencyBalance(agencyBalance - selectedOption.price);
      
      // Success
      setStep(4);
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors de la soumission.");
    }
  };


  const renderStep1 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Où souhaitez-vous aller ?</h2>
        <p className="text-slate-500">Sélectionnez la destination pour le service <strong className="text-blue-600">{requestedService}</strong>.</p>
      </div>

      {availableCountries.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p>Aucune destination disponible pour ce service actuellement.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {availableCountries.map(country => (
            <button
              key={country}
              onClick={() => {
                setSelectedCountry(country);
                setStep(2);
              }}
              className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <span className="font-bold text-slate-800 text-lg">{country}</span>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => setStep(1)} className="rounded-full hover:bg-slate-100">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-1">Choisissez votre option</h2>
          <p className="text-slate-500">Les offres disponibles pour la destination : <strong className="text-blue-600">{selectedCountry}</strong></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableOptions.map(opt => (
          <div key={opt.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col hover:border-blue-300 transition-colors shadow-sm">
            <div className="mb-4">
              <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 mb-3">{opt.type}</Badge>
              <h3 className="text-xl font-black text-slate-900">{opt.title}</h3>
            </div>
            
            <div className="flex items-center justify-between mb-6 bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Tarif B2B</span>
                <div className="text-2xl font-black text-blue-700 font-mono">
                  {opt.price.toLocaleString()} <span className="text-sm">DZD</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase">Délai estimé</span>
                <div className="flex items-center gap-1 font-bold text-slate-700 mt-1">
                  <Clock className="w-4 h-4" /> {opt.processingTime || "Standard"}
                </div>
              </div>
            </div>

            {opt.conditions && opt.conditions.length > 0 && opt.conditions[0].trim() !== "" && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-sm font-medium text-amber-800">{opt.conditions[0]}</p>
                </div>
              </div>
            )}

            <div className="mt-auto pt-4 border-t border-slate-100">
              <Button 
                onClick={() => {
                  setSelectedOption(opt);
                  setStep(3);
                }}
                className="w-full h-12 text-lg font-bold bg-slate-900 hover:bg-blue-600 text-white transition-colors"
              >
                Sélectionner cette option <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex items-center gap-4 mb-6 border-b border-slate-200 pb-6">
        <Button variant="ghost" size="icon" onClick={() => setStep(2)} className="rounded-full hover:bg-slate-100">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Dossier & Prérequis</h2>
          <p className="text-slate-500">{selectedOption?.title} - {selectedCountry}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulaire dynamique */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Infos Voyageur (Toujours présentes) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> 1. Informations du voyageur
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input value={applicant.lastName} onChange={e => setApplicant({...applicant, lastName: e.target.value})} className="h-12" placeholder="Nom de famille" />
              </div>
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input value={applicant.firstName} onChange={e => setApplicant({...applicant, firstName: e.target.value})} className="h-12" placeholder="Prénom" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Numéro de Passeport</Label>
                <Input value={applicant.passportNumber} onChange={e => setApplicant({...applicant, passportNumber: e.target.value})} className="h-12 uppercase font-mono" placeholder="Ex: 123456789" />
              </div>
            </div>
          </div>

          {/* Documents Requis Dynamiques */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" /> 2. Pièces jointes & Informations supplémentaires
            </h3>
            
            {(!selectedOption?.requiredDocuments || selectedOption.requiredDocuments.length === 0) ? (
              <p className="text-slate-500 text-sm">Aucun document supplémentaire n'est requis pour cette option.</p>
            ) : (
              <div className="space-y-6">
                {selectedOption.requiredDocuments.map(req => {
                  const isTextField = req.toLowerCase().includes("(texte)");
                  const cleanName = req.replace("(Texte)", "").trim();

                  if (isTextField) {
                    return (
                      <div key={req} className="space-y-2">
                        <Label className="font-bold text-slate-700">{cleanName} <span className="text-red-500">*</span></Label>
                        <Input 
                          className="h-12" 
                          placeholder={`Saisir ${cleanName.toLowerCase()}...`}
                          value={textFields[req] || ""}
                          onChange={(e) => handleTextField(req, e.target.value)}
                        />
                      </div>
                    );
                  }

                  // Else it's a file upload
                  return (
                    <div key={req} className="space-y-2">
                      <Label className="font-bold text-slate-700">{req} <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Input 
                          type="file" 
                          onChange={(e) => handleFileUpload(req, e)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className={`flex items-center justify-between p-4 border-2 border-dashed rounded-xl transition-colors ${uploadedFiles[req] ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-blue-400 bg-slate-50'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${uploadedFiles[req] ? 'bg-emerald-100 text-emerald-600' : 'bg-white shadow-sm text-slate-400'}`}>
                              {uploadedFiles[req] ? <CheckCircle2 className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                            </div>
                            <div className="text-sm">
                              {uploadedFiles[req] ? (
                                <p className="font-bold text-emerald-700">{(uploadedFiles[req] as File).name}</p>
                              ) : (
                                <p className="font-medium text-slate-600">Cliquer ou glisser le document ici</p>
                              )}
                            </div>
                          </div>
                          {!uploadedFiles[req] && <Button type="button" variant="secondary" size="sm">Parcourir</Button>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recap & Payment */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-black mb-4 border-b border-slate-700 pb-4">Résumé de la commande</h3>
            
            <div className="space-y-3 mb-6 text-slate-300 text-sm">
              <div className="flex justify-between">
                <span>Service</span>
                <span className="font-bold text-white text-right">{selectedOption?.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Destination</span>
                <span className="font-bold text-white text-right">{selectedCountry}</span>
              </div>
              <div className="flex justify-between">
                <span>Voyageur</span>
                <span className="font-bold text-white text-right uppercase">{applicant.lastName} {applicant.firstName}</span>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-slate-400">Total à payer</span>
                <span className="text-2xl font-black font-mono">{selectedOption?.price.toLocaleString()} DZD</span>
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/30"
            >
              Payer et Soumettre
            </Button>
            <p className="text-xs text-center text-slate-400 mt-4">
              Ce montant sera déduit de votre Wallet Agence : <strong className="text-white">{agencyBalance.toLocaleString()} DZD</strong>
            </p>
          </div>
        </div>
        
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      <h2 className="text-3xl font-black text-slate-900 mb-4">Commande Confirmée !</h2>
      <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
        Le dossier pour <strong className="text-slate-900">{applicant.lastName} {applicant.firstName}</strong> a bien été transmis. Le montant de <strong className="text-slate-900">{selectedOption?.price.toLocaleString()} DZD</strong> a été déduit de votre Wallet.
      </p>
      <div className="flex justify-center gap-4">
        <Button onClick={() => navigate("/agency/applications")} variant="outline" className="h-12 px-6 font-bold">
          Voir mes dossiers
        </Button>
        <Button onClick={() => {
          setApplicant({ firstName: "", lastName: "", passportNumber: "" });
          setUploadedFiles({});
          setTextFields({});
          setStep(1);
        }} className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold">
          Nouveau Dossier
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Stepper Indicator */}
      {step < 4 && (
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                step === s ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 
                step > s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-1 ml-2 rounded-full ${step > s ? 'bg-slate-900' : 'bg-slate-100'}`} />
              )}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </AnimatePresence>
    </div>
  );
}
