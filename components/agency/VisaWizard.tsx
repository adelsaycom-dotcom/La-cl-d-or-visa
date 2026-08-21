import { auth } from "../../src/firebase";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  ChevronRight,
  FileUp,
  Info,
  Globe2,
  User,
  CreditCard,
  ChevronLeft,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StandardVisaForm, DossierForm, EtudeForm, PermisForm, AssuranceForm, GenericServiceForm } from "./forms";
import { useAppStore, ServiceType } from "../../src/store/useAppStore";
import { useNavigate, useSearchParams } from "react-router-dom";

export function VisaWizard() {
  const { services, addApplication, agencyBalance, setAgencyBalance } = useAppStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get("service") || "evisa";

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedVisa, setSelectedVisa] = useState<any>(null);

  const [customFormData, setCustomFormData] = useState<Record<string, any>>({});
  const [applicant, setApplicant] = useState({
    firstName: "",
    lastName: "",
    passportNumber: "",
    dob: "",
    birthPlace: "",
    nationality: "",
    phoneNumber: "",
    email: "",
    residenceAddress: "",
    fatherNameFr: "",
    fatherFirstName: "",
    fatherNameAr: "",
    motherNameFr: "",
    motherFullName: "",
    motherNameAr: "",
    passportIssueDate: "",
    passportExpiryDate: "",
    passportIssuePlace: "",
    travelStartDate: "",
    travelEndDate: "",
    workplaceOrSchool: "",
    employerPhone: "",
    workplaceAddress: "",
    employerEmail: "",
    beneficiaryPhone: "",
    studyLevel: "",
    gradeAverage: "",
    specialty: "",
    licenseType: "",
    nationalLicenseNumber: "",
    bloodType: "",
    consulate: "",
    preferredDate: "",
    university: "",
    inviterName: "",
    relationship: "",
    notes: "",
  });

  const nextStep = () => setStep((s) => Math.min(4, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const serviceTitles: Record<string, { title: string; type: ServiceType }> = {
    evisa: { title: "Demande de E-Visa", type: "Evisa" },
    residence: { title: "Demande de Résidence", type: "Residence" },
    permis: { title: "Permis International", type: "Permis" },
    assurance: { title: "Assurance de Voyage", type: "Assurance" },
    etude: { title: "Visa Étude", type: "Etude" },
    invitation: { title: "Lettre d'Invitation", type: "Invitation" },
    rendezvous: { title: "Prise de Rendez-vous", type: "Rendez-vous" },
    dossier: { title: "Traitement de Dossier", type: "Dossier" },
  };

  const currentService = serviceTitles[serviceParam] || serviceTitles["evisa"];

  const handleSubmit = async () => {
    const price = (selectedService?.price || 0) || 0;
    try {
      await addApplication({
      id: "APP-" + Math.floor(Math.random() * 100000),
      agencyId: auth.currentUser?.uid || "a1",
      agencyName: auth.currentUser?.email || "Current Agency",
      country: selectedService?.destination || "Unknown",
      visaType: selectedService?.title || "Standard",
      serviceType: selectedService?.type || "Evisa",
      travelerName: `${applicant.firstName} ${applicant.lastName}`,
      passportNumber: applicant.passportNumber,
      status: "Pending",
      submissionDate: new Date().toISOString().split("T")[0],
      price: price,
      customFormData,
      extraData: {
        dob: applicant.dob,
        birthPlace: applicant.birthPlace,
        nationality: applicant.nationality,
        phoneNumber: applicant.phoneNumber,
        email: applicant.email,
        residenceAddress: applicant.residenceAddress,
        fatherFirstName: applicant.fatherFirstName,
        fatherNameFr: applicant.fatherNameFr,
        fatherNameAr: applicant.fatherNameAr,
        motherFullName: applicant.motherFullName,
        motherNameFr: applicant.motherNameFr,
        motherNameAr: applicant.motherNameAr,
        passportIssueDate: applicant.passportIssueDate,
        passportExpiryDate: applicant.passportExpiryDate,
        passportIssuePlace: applicant.passportIssuePlace,
        travelStartDate: applicant.travelStartDate,
        travelEndDate: applicant.travelEndDate,
        workplaceOrSchool: applicant.workplaceOrSchool,
        employerPhone: applicant.employerPhone,
        workplaceAddress: applicant.workplaceAddress,
        employerEmail: applicant.employerEmail,
        beneficiaryPhone: applicant.beneficiaryPhone,
        studyLevel: applicant.studyLevel,
        gradeAverage: applicant.gradeAverage,
        specialty: applicant.specialty,
        licenseType: applicant.licenseType,
        nationalLicenseNumber: applicant.nationalLicenseNumber,
        bloodType: applicant.bloodType,
        consulate: applicant.consulate,
        preferredDate: applicant.preferredDate,
        university: applicant.university,
        inviterName: applicant.inviterName,
        relationship: applicant.relationship,
        notes: applicant.notes,
      }
      });
      alert("Demande soumise avec succès !");
      navigate("/agency/applications");
    } catch (err: any) {
      alert("Erreur lors de la soumission : " + (err.message || "Solde insuffisant ou erreur réseau."));
    }
  };

  const steps = [
    { title: "Destination / Offre", icon: Globe2 },
    { title: "Demandeur", icon: User },
    { title: "Documents", icon: FileUp },
    { title: "Paiement", icon: CreditCard },
  ];

  return (
    <div className="max-w-5xl mx-auto py-4 md:py-6 px-4 md:px-8">
      <div className="mb-6 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
          {currentService.title}
        </h2>
        <p className="text-slate-500 mt-3 text-lg max-w-2xl mx-auto">
          Complétez les quatre étapes ci-dessous pour soumettre la demande de
          votre client pour ce service.
        </p>
      </div>

      {/* Modern Stepper */}
      <div className="relative mb-8 max-w-3xl mx-auto">
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
                  className={`w-12 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 border-4 cursor-default
                    ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-100 ring-4 ring-blue-50"
                        : isCompleted
                          ? "bg-blue-600 text-white border-white"
                          : "bg-white text-slate-400 border-slate-100"
                    }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={`mt-3 text-sm font-semibold transition-colors
                  ${isActive || isCompleted ? "text-blue-900" : "text-slate-400"}`}
                >
                  {s.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/60 min-h-[400px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Choisir la prestation
                  </h3>
                  <p className="text-slate-500 mt-1">
                    Sélectionnez la prestation souhaitée dans le catalogue.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services
                    .filter((s) => s.active && s.type.toLowerCase() === (serviceParam === 'dossier' ? 'dossier' : serviceParam.toLowerCase()))
                    .map((s) => (
                      <div
                        key={s.id}
                        className={`p-6 rounded-2xl border-2 transition-all duration-200 group cursor-pointer relative overflow-hidden
                        ${
                          selectedService?.id === s.id
                            ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100/50"
                            : "border-slate-100 hover:border-blue-200 hover:shadow-sm bg-white"
                        }`}
                        onClick={() => setSelectedService(s)}
                      >
                        {selectedService?.id === s.id && (
                           <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
                        )}
                        <div className="flex justify-between items-start mb-4 relative z-10">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${selectedService?.id === s.id ? 'bg-white border border-blue-100' : 'bg-gray-50 border border-gray-100'}`}>
                            {s.flag}
                          </div>
                          <div className={`px-2 py-1 rounded-md text-xs font-bold shadow-sm ${selectedService?.id === s.id ? 'bg-blue-600 text-white' : 'bg-white border border-slate-100 text-slate-700'}`}>
                            {s.price.toLocaleString()} DA
                          </div>
                        </div>
                        <h4 className="font-bold text-slate-900 text-lg leading-tight mb-1 relative z-10">{s.title}</h4>
                        <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 relative z-10">
                          <Globe2 className="w-3.5 h-3.5" /> {s.destination}
                        </p>
                        
                        <div className={`mt-4 pt-4 border-t flex items-center gap-3 text-xs font-medium relative z-10 ${selectedService?.id === s.id ? 'border-blue-100 text-blue-700' : 'border-slate-100 text-slate-500'}`}>
                          <span className="flex items-center gap-1"><Info className="w-4 h-4" /> Délai: {s.processingTime}</span>
                        </div>
                      </div>
                    ))}
                    
                  {services.filter((s) => s.active && s.type.toLowerCase() === (serviceParam === 'dossier' ? 'dossier' : serviceParam.toLowerCase())).length === 0 && (
                    <div className="col-span-full p-8 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                       Aucune prestation active trouvée pour ce type de service.
                    </div>
                  )}
                </div>

                {selectedService && selectedService.description && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-blue-50/50 border border-blue-100 p-6 rounded-2xl"
                  >
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" /> 
                      Description & Conditions de la prestation
                    </h4>
                    <div className="text-sm text-blue-800/80 leading-relaxed whitespace-pre-wrap">
                      {selectedService.description}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-4">
                    <span>{selectedService?.flag}</span> {selectedService?.destination} - {selectedService?.title}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Détails du dossier
                  </h3>
                  <p className="text-slate-500 mt-1">
                    Saisissez les informations exactement comme elles
                    apparaissent sur le passeport/document d'identité.
                  </p>
                </div>

                <div className="bg-blue-50/50 text-blue-900 p-4 rounded-xl flex gap-3 text-sm border border-blue-100/50">
                  <Info className="w-5 h-5 shrink-0 text-blue-600" />
                  <p>
                    Toute information incorrecte entraînera un retard de
                    traitement. Veuillez vérifier attentivement tous les champs.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  {['Evisa', 'Residence', 'Rendez-vous', 'Invitation'].includes(selectedService?.type) && <StandardVisaForm data={applicant} onChange={setApplicant} />}
                  {selectedService?.type === 'Dossier' && <DossierForm data={applicant} onChange={setApplicant} />}
                  {selectedService?.type === 'Etude' && <EtudeForm data={applicant} onChange={setApplicant} />}
                  {selectedService?.type === 'Permis' && <PermisForm data={applicant} onChange={setApplicant} />}
                  {selectedService?.type === 'Assurance' && <AssuranceForm data={applicant} onChange={setApplicant} />}
                  {!['Evisa', 'Residence', 'Rendez-vous', 'Invitation', 'Dossier', 'Etude', 'Permis', 'Assurance'].includes(selectedService?.type) && <GenericServiceForm data={applicant} onChange={setApplicant} />}
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900">
                    Télécharger les documents
                  </h3>
                  <p className="text-slate-500 mt-1">
                    Fournissez des scans clairs et en couleur des documents
                    requis pour {currentService.title}.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedService?.requiredDocuments &&
                  selectedService.requiredDocuments.length > 0 ? (
                    selectedService.requiredDocuments.map(
                      (doc: string, i: number) => (
                        <label
                          key={i}
                          className={`border-2 border-dashed ${customFormData[doc] ? 'border-green-400 bg-green-50/20' : 'border-slate-200'} rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer group bg-white relative overflow-hidden h-full`}
                        >
                          <div className={`w-14 h-14 ${customFormData[doc] ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600 group-hover:scale-110'} rounded-2xl flex items-center justify-center mb-4 transition-transform shadow-sm shrink-0`}>
                            {customFormData[doc] ? <CheckCircle2 className="w-6 h-6" /> : <FileUp className="w-6 h-6" />}
                          </div>
                          <div className="font-bold text-slate-900 text-sm leading-snug">
                            {doc}
                          </div>
                          <div className={`text-xs mt-2 ${customFormData[doc] ? 'text-green-600 font-medium' : 'text-slate-500'}`}>
                            {customFormData[doc] ? "Document téléchargé" : "JPEG ou PDF. Max 5Mo."}
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) { if (file.size > 700 * 1024) { alert("Erreur : Le fichier est trop volumineux (Max 700 Ko) pour notre base de données de test Firestore. Veuillez compresser votre PDF ou utiliser un fichier plus léger."); return; }
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setCustomFormData(prev => ({
                                    ...prev,
                                    [doc]: event.target?.result
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      ),
                    )
                  ) : (
                    <>
                      <label className={`border-2 border-dashed ${customFormData["Passeport"] ? 'border-green-400 bg-green-50/20' : 'border-slate-200'} rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer group bg-white relative overflow-hidden h-full`}>
                        <div className={`w-14 h-14 ${customFormData["Passeport"] ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600 group-hover:scale-110'} rounded-2xl flex items-center justify-center mb-4 transition-transform shadow-sm shrink-0`}>
                          {customFormData["Passeport"] ? <CheckCircle2 className="w-6 h-6" /> : <FileUp className="w-6 h-6" />}
                        </div>
                        <div className="font-bold text-slate-900 text-sm leading-snug">
                          Document Principal (Passeport/ID)
                        </div>
                        <div className={`text-xs mt-2 ${customFormData["Passeport"] ? 'text-green-600 font-medium' : 'text-slate-500'}`}>
                          {customFormData["Passeport"] ? "Document téléchargé" : "JPEG ou PDF. Max 5Mo."}
                        </div>
                        <input type="file" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) { if (file.size > 700 * 1024) { alert("Erreur : Le fichier est trop volumineux (Max 700 Ko) pour notre base de données de test Firestore. Veuillez compresser votre PDF ou utiliser un fichier plus léger."); return; }
                            const reader = new FileReader();
                            reader.onload = (event) => setCustomFormData(prev => ({ ...prev, "Passeport": event.target?.result }));
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </label>
                      <label className={`border-2 border-dashed ${customFormData["Photo"] ? 'border-green-400 bg-green-50/20' : 'border-slate-200'} rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer group bg-white relative overflow-hidden h-full`}>
                        <div className={`w-14 h-14 ${customFormData["Photo"] ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600 group-hover:scale-110'} rounded-2xl flex items-center justify-center mb-4 transition-transform shadow-sm shrink-0`}>
                          {customFormData["Photo"] ? <CheckCircle2 className="w-6 h-6" /> : <User className="w-6 h-6" />}
                        </div>
                        <div className="font-bold text-slate-900 text-sm leading-snug">
                          Photo personnelle / Justificatif
                        </div>
                        <div className={`text-xs mt-2 ${customFormData["Photo"] ? 'text-green-600 font-medium' : 'text-slate-500'}`}>
                          {customFormData["Photo"] ? "Document téléchargé" : "Fond blanc. JPEG/PDF. Max 2Mo."}
                        </div>
                        <input type="file" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) { if (file.size > 700 * 1024) { alert("Erreur : Le fichier est trop volumineux (Max 700 Ko) pour notre base de données de test Firestore. Veuillez compresser votre PDF ou utiliser un fichier plus léger."); return; }
                            const reader = new FileReader();
                            reader.onload = (event) => setCustomFormData(prev => ({ ...prev, "Photo": event.target?.result }));
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </label>
                    </>
                  )}
                </div>

                {/* Documents additionnels */}
                <div className="mt-8 border-t border-slate-200 pt-8">
                  <h4 className="text-lg font-bold text-slate-800 mb-4">Documents additionnels (Optionnel)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <label className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer group bg-white relative overflow-hidden min-h-[160px]">
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 transition-transform shadow-sm shrink-0 group-hover:scale-110">
                        <FileUp className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-slate-900 text-sm leading-snug">
                        Ajouter d'autres fichiers
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        Sélectionnez plusieurs fichiers.
                      </div>
                      <input type="file" multiple className="hidden" onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach((file, index) => { if (file.size > 700 * 1024) { alert("Erreur : Le fichier " + file.name + " est trop volumineux (Max 700 Ko)."); return; }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setCustomFormData(prev => ({ 
                              ...prev, 
                              [`Document additionnel (${file.name})`]: event.target?.result 
                            }));
                          };
                          reader.readAsDataURL(file);
                        });
                      }} />
                    </label>

                    {Object.keys(customFormData).filter(k => k.startsWith('Document additionnel')).map((docKey, i) => (
                      <div key={i} className="border-2 border-dashed border-green-400 bg-green-50/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden h-full">
                        <div className="absolute top-2 right-2 cursor-pointer text-red-500 hover:text-red-700" onClick={(e) => {
                          e.preventDefault();
                          const newFormData = { ...customFormData };
                          delete newFormData[docKey];
                          setCustomFormData(newFormData);
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </div>
                        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4 transition-transform shadow-sm shrink-0">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="font-bold text-slate-900 text-sm leading-snug break-words max-w-full">
                          {docKey.replace('Document additionnel (', '').replace(')', '')}
                        </div>
                        <div className="text-xs mt-2 text-green-600 font-medium">
                          Document téléchargé
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900">
                    Confirmer & Payer
                  </h3>
                  <p className="text-slate-500 mt-1">
                    Vérifiez les détails de la demande et finalisez le paiement
                    avec votre solde.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-3 space-y-6">
                    <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                        <div className="text-4xl bg-white w-16 h-16 rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                          {selectedService?.flag || "🌍"}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xl">
                            {currentService.title} -{" "}
                            {selectedService?.destination || "Général"}
                          </div>
                          <div className="text-slate-500 font-medium">
                            {selectedService?.title}
                          </div>
                        </div>
                      </div>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 text-sm">
                        <div>
                          <dt className="text-slate-500 font-medium mb-1">
                            Nom du demandeur
                          </dt>
                          <dd className="font-bold text-slate-900 text-base">
                            {applicant.firstName} {applicant.lastName}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-500 font-medium mb-1">
                            Numéro de document
                          </dt>
                          <dd className="font-mono font-bold text-slate-900 text-base">
                            {applicant.passportNumber || "N/A"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-500 font-medium mb-1">
                            Date de naissance
                          </dt>
                          <dd className="font-bold text-slate-900 text-base">
                            {applicant.dob || "N/A"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-500 font-medium mb-1">
                            Documents
                          </dt>
                          <dd className="font-bold text-green-600 flex items-center gap-1.5 text-base">
                            <CheckCircle2 className="w-5 h-5" />{" "}
                            {selectedService?.requiredDocuments &&
                            selectedService.requiredDocuments.length > 0
                              ? selectedService.requiredDocuments.length
                              : 2}{" "}
                            Fichiers Téléchargés
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
                      <h4 className="font-bold mb-6 text-slate-300 text-sm uppercase tracking-widest relative z-10">
                        Résumé du Paiement
                      </h4>

                      <div className="space-y-4 mb-6 pb-6 border-b border-white/10 relative z-10">
                        <div className="flex justify-between text-base">
                          <span className="text-slate-300">
                            Solde du portefeuille
                          </span>
                          <span className="font-mono font-medium">
                            4,500 DA
                          </span>
                        </div>
                        <div className="flex justify-between text-base">
                          <span className="text-slate-300">
                            Frais de service
                          </span>
                          <span className="font-mono font-medium text-red-300">
                            -{(selectedService?.price || 0) || 0} DA
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-end relative z-10">
                        <span className="text-slate-300 font-medium">
                          Restant
                        </span>
                        <span className="font-mono text-3xl font-black text-emerald-400">
                          {4500 - ((selectedService?.price || 0) || 0)}{" "}
                          <span className="text-lg text-emerald-400/70">
                            DA
                          </span>
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
          className="px-6 h-10 text-slate-500 hover:text-slate-900 font-semibold"
        >
          <ChevronLeft className="w-5 h-5 mr-2" /> Retour
        </Button>

        {step < 4 ? (
          <Button
            onClick={nextStep}
            disabled={
              (step === 1 && (!selectedService)) ||
              (step === 2 &&
                (!applicant.firstName ||
                  !applicant.lastName))
            }
            className="px-8 h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all text-base"
          >
            Continuer <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="px-10 h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all text-lg flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" /> Soumettre la demande
          </Button>
        )}
      </div>
    </div>
  );
}
