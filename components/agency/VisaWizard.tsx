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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, ServiceType } from "../../src/store/useAppStore";
import { useNavigate, useSearchParams } from "react-router-dom";

export function VisaWizard() {
  const { countries, addApplication, agencyBalance, setAgencyBalance } = useAppStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get("service") || "evisa";

  const [step, setStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedVisa, setSelectedVisa] = useState<any>(null);

  const [customFormData, setCustomFormData] = useState<Record<string, any>>({});
  const [applicant, setApplicant] = useState({
    firstName: "",
    lastName: "",
    passportNumber: "",
    dob: "",
    nationality: "",
    phoneNumber: "",
    email: "",
    residenceAddress: "",
    fatherNameFr: "",
    fatherNameAr: "",
    motherNameFr: "",
    motherNameAr: "",
    passportIssueDate: "",
    passportExpiryDate: "",
    travelStartDate: "",
    travelEndDate: "",
    nationalLicenseNumber: "",
    bloodType: "",
    consulate: "",
    preferredDate: "",
    studyLevel: "",
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

  const handleSubmit = () => {
    const price = selectedVisa?.price || 0;
    addApplication({
      id: "APP-" + Math.floor(Math.random() * 100000),
      agencyId: auth.currentUser?.uid || "a1",
      agencyName: auth.currentUser?.email || "Current Agency",
      country: selectedCountry?.name || "Unknown",
      visaType: selectedVisa?.name || "Standard",
      serviceType: currentService.type,
      travelerName: `${applicant.firstName} ${applicant.lastName}`,
      passportNumber: applicant.passportNumber,
      status: "Pending",
      submissionDate: new Date().toISOString().split("T")[0],
      price: price,
      customFormData,
      extraData: {
        dob: applicant.dob,
        nationality: applicant.nationality,
        phoneNumber: applicant.phoneNumber,
        email: applicant.email,
        residenceAddress: applicant.residenceAddress,
        fatherNameFr: applicant.fatherNameFr,
        fatherNameAr: applicant.fatherNameAr,
        motherNameFr: applicant.motherNameFr,
        motherNameAr: applicant.motherNameAr,
        passportIssueDate: applicant.passportIssueDate,
        passportExpiryDate: applicant.passportExpiryDate,
        travelStartDate: applicant.travelStartDate,
        travelEndDate: applicant.travelEndDate,
        nationalLicenseNumber: applicant.nationalLicenseNumber,
        bloodType: applicant.bloodType,
        consulate: applicant.consulate,
        preferredDate: applicant.preferredDate,
        studyLevel: applicant.studyLevel,
        university: applicant.university,
        inviterName: applicant.inviterName,
        relationship: applicant.relationship,
        notes: applicant.notes,
      },
    });
    setAgencyBalance(agencyBalance - price);
    alert("Demande soumise avec succès !");
    navigate("/agency/applications");
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
                    Où voyagent-ils ? / Option
                  </h3>
                  <p className="text-slate-500 mt-1">
                    Sélectionnez le pays de destination et l'option de{" "}
                    {currentService.title.toLowerCase()}.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {countries
                    .filter((c) => c.active)
                    .map((c) => (
                      <div
                        key={c.id}
                        className={`p-6 rounded-2xl border-2 transition-all duration-200 group
                        ${
                          selectedCountry?.id === c.id
                            ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100/50"
                            : "border-slate-100 hover:border-blue-200 hover:shadow-sm"
                        }`}
                      >
                        <div
                          className="flex justify-between items-start cursor-pointer"
                          onClick={() => setSelectedCountry(c)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-4xl bg-white w-16 h-16 rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                              {c.flag}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                                {c.name}
                              </div>
                            </div>
                          </div>
                        </div>

                        {selectedCountry?.id === c.id &&
                          c.visaTypes.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-blue-200/50">
                              <h4 className="text-sm font-semibold mb-2 text-slate-700">
                                Choisir l'option:
                              </h4>
                              <div className="space-y-1">
                                {c.visaTypes.map((v) => (
                                  <div key={v.id} className="space-y-1">
                                    <div
                                      onClick={() => setSelectedVisa(v)}
                                      className={`p-3 rounded-lg border cursor-pointer text-sm flex justify-between items-center ${selectedVisa?.id === v.id ? "bg-blue-600 text-white border-blue-700" : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"}`}
                                    >
                                      <div>
                                        <div className="font-semibold">
                                          {v.name}
                                        </div>
                                        <div className={`text-xs opacity-80`}>
                                          {v.processingTime}
                                        </div>
                                      </div>
                                      <div className="font-bold">
                                        {v.price} DA
                                      </div>
                                    </div>
                                    {selectedVisa?.id === v.id &&
                                      v.conditions &&
                                      v.conditions.length > 0 && (
                                        <div className="bg-amber-50 text-amber-900 text-xs p-3 rounded-lg border border-amber-200/60 flex flex-col gap-1.5">
                                          <div className="font-bold flex items-center gap-1.5">
                                            <Info className="w-3.5 h-3.5" />{" "}
                                            Conditions
                                          </div>
                                          <ul className="list-disc pl-4 space-y-0.5">
                                            {v.conditions.map(
                                              (
                                                condition: string,
                                                i: number,
                                              ) => (
                                                <li key={i}>{condition}</li>
                                              ),
                                            )}
                                          </ul>
                                        </div>
                                      )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        {selectedCountry?.id === c.id &&
                          c.visaTypes.length === 0 && (
                            <div className="mt-4 pt-3 border-t border-blue-200/50 text-sm text-red-500">
                              Aucune option disponible pour ce pays.
                            </div>
                          )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-4">
                    <span>{selectedCountry?.flag}</span> {selectedCountry?.name}{" "}
                    - {selectedVisa?.name}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Détails du demandeur
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <div className="col-span-1 sm:col-span-2 lg:col-span-3 pb-1 border-b border-slate-200">
                    <h4 className="font-bold text-slate-800">
                      Informations Personnelles
                    </h4>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <Input
                      className="h-9 text-sm bg-white"
                      placeholder="Prénoms"
                      value={applicant.firstName}
                      onChange={(e) =>
                        setApplicant({
                          ...applicant,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Nom de famille <span className="text-red-500">*</span>
                    </label>
                    <Input
                      className="h-9 text-sm bg-white"
                      placeholder="Nom"
                      value={applicant.lastName}
                      onChange={(e) =>
                        setApplicant({ ...applicant, lastName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Date de naissance <span className="text-red-500">*</span>
                    </label>
                    <Input
                      className="h-9 text-sm bg-white"
                      type="date"
                      value={applicant.dob}
                      onChange={(e) =>
                        setApplicant({ ...applicant, dob: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1 lg:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Nationalité <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={applicant.nationality}
                      onValueChange={(v) =>
                        setApplicant({ ...applicant, nationality: v })
                      }
                    >
                      <SelectTrigger className="h-9 text-sm bg-white">
                        <SelectValue placeholder="Sélectionnez la nationalité..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dz">Algérienne</SelectItem>
                        <SelectItem value="fr">Française</SelectItem>
                        <SelectItem value="uk">Britannique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-1 sm:col-span-2 lg:col-span-3 pb-1 pt-3 border-b border-slate-200">
                    <h4 className="font-bold text-slate-800">Coordonnées</h4>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Numéro de téléphone{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      className="h-9 text-sm bg-white"
                      placeholder="Ex: 0555 12 34 56"
                      value={applicant.phoneNumber}
                      onChange={(e) =>
                        setApplicant({
                          ...applicant,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Adresse email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      className="h-9 text-sm bg-white"
                      placeholder="Email"
                      value={applicant.email}
                      onChange={(e) =>
                        setApplicant({ ...applicant, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1 lg:col-span-3">
                    <label className="text-sm font-semibold text-slate-700">
                      Adresse de résidence{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      className="h-9 text-sm bg-white"
                      placeholder="Adresse complète"
                      value={applicant.residenceAddress}
                      onChange={(e) =>
                        setApplicant({
                          ...applicant,
                          residenceAddress: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-2 lg:col-span-3 pb-1 pt-3 border-b border-slate-200">
                    <h4 className="font-bold text-slate-800">Filiation</h4>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Nom et prénom du père (Français)
                    </label>
                    <Input
                      className="h-9 text-sm bg-white"
                      placeholder="En français"
                      value={applicant.fatherNameFr}
                      onChange={(e) =>
                        setApplicant({
                          ...applicant,
                          fatherNameFr: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Nom et prénom du père (Arabe)
                    </label>
                    <Input
                      className="h-9 text-sm bg-white text-right"
                      placeholder="بالعربية"
                      value={applicant.fatherNameAr}
                      onChange={(e) =>
                        setApplicant({
                          ...applicant,
                          fatherNameAr: e.target.value,
                        })
                      }
                      dir="rtl"
                    />
                  </div>
                  <div className="hidden lg:block"></div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Nom et prénom de la mère (Français)
                    </label>
                    <Input
                      className="h-9 text-sm bg-white"
                      placeholder="En français"
                      value={applicant.motherNameFr}
                      onChange={(e) =>
                        setApplicant({
                          ...applicant,
                          motherNameFr: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Nom et prénom de la mère (Arabe)
                    </label>
                    <Input
                      className="h-9 text-sm bg-white text-right"
                      placeholder="بالعربية"
                      value={applicant.motherNameAr}
                      onChange={(e) =>
                        setApplicant({
                          ...applicant,
                          motherNameAr: e.target.value,
                        })
                      }
                      dir="rtl"
                    />
                  </div>
                  <div className="hidden lg:block"></div>

                  <div className="col-span-1 sm:col-span-2 lg:col-span-3 pb-1 pt-3 border-b border-slate-200">
                    <h4 className="font-bold text-slate-800">Passeport</h4>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Numéro de passeport{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      className="h-9 text-sm bg-white font-mono uppercase text-lg"
                      placeholder="AB123456"
                      value={applicant.passportNumber}
                      onChange={(e) =>
                        setApplicant({
                          ...applicant,
                          passportNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Date de délivrance <span className="text-red-500">*</span>
                    </label>
                    <Input
                      className="h-9 text-sm bg-white"
                      type="date"
                      value={applicant.passportIssueDate}
                      onChange={(e) =>
                        setApplicant({
                          ...applicant,
                          passportIssueDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Date d'expiration <span className="text-red-500">*</span>
                    </label>
                    <Input
                      className="h-9 text-sm bg-white"
                      type="date"
                      value={applicant.passportExpiryDate}
                      onChange={(e) =>
                        setApplicant({
                          ...applicant,
                          passportExpiryDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  {currentService.type === "Assurance" && (
                    <>
                      <div className="col-span-1 sm:col-span-2 lg:col-span-3 pb-1 pt-3 border-b border-slate-200">
                        <h4 className="font-bold text-slate-800">
                          Détails de l'assurance
                        </h4>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">
                          Date de départ prévue
                        </label>
                        <Input
                          className="h-9 text-sm bg-white"
                          type="date"
                          value={applicant.travelStartDate}
                          onChange={(e) =>
                            setApplicant({
                              ...applicant,
                              travelStartDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">
                          Date de retour prévue
                        </label>
                        <Input
                          className="h-9 text-sm bg-white"
                          type="date"
                          value={applicant.travelEndDate}
                          onChange={(e) =>
                            setApplicant({
                              ...applicant,
                              travelEndDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  {currentService.type === "Permis" && (
                    <>
                      <div className="col-span-1 sm:col-span-2 lg:col-span-3 pb-1 pt-3 border-b border-slate-200">
                        <h4 className="font-bold text-slate-800">
                          Permis de conduire national
                        </h4>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">
                          Numéro du permis national
                        </label>
                        <Input
                          className="h-9 text-sm bg-white"
                          placeholder="N° de permis"
                          value={applicant.nationalLicenseNumber}
                          onChange={(e) =>
                            setApplicant({
                              ...applicant,
                              nationalLicenseNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">
                          Groupe sanguin
                        </label>
                        <Select
                          value={applicant.bloodType}
                          onValueChange={(v) =>
                            setApplicant({ ...applicant, bloodType: v })
                          }
                        >
                          <SelectTrigger className="h-9 text-sm bg-white">
                            <SelectValue placeholder="Sélectionnez..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {currentService.type === "Rendez-vous" && (
                    <>
                      <div className="col-span-1 sm:col-span-2 lg:col-span-3 pb-1 pt-3 border-b border-slate-200">
                        <h4 className="font-bold text-slate-800">
                          Préférences du rendez-vous
                        </h4>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">
                          Consulat / Ambassade / Centre
                        </label>
                        <Input
                          className="h-9 text-sm bg-white"
                          placeholder="Ex: TLS Contact, VFS Global"
                          value={applicant.consulate}
                          onChange={(e) =>
                            setApplicant({
                              ...applicant,
                              consulate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">
                          Date souhaitée
                        </label>
                        <Input
                          className="h-9 text-sm bg-white"
                          type="date"
                          value={applicant.preferredDate}
                          onChange={(e) =>
                            setApplicant({
                              ...applicant,
                              preferredDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  {currentService.type === "Etude" && (
                    <>
                      <div className="col-span-1 sm:col-span-2 lg:col-span-3 pb-1 pt-3 border-b border-slate-200">
                        <h4 className="font-bold text-slate-800">
                          Détails des études
                        </h4>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">
                          Niveau d'étude prévu
                        </label>
                        <Input
                          className="h-9 text-sm bg-white"
                          placeholder="Ex: Licence, Master"
                          value={applicant.studyLevel}
                          onChange={(e) =>
                            setApplicant({
                              ...applicant,
                              studyLevel: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">
                          Nom de l'établissement
                        </label>
                        <Input
                          className="h-9 text-sm bg-white"
                          placeholder="Université / Ecole"
                          value={applicant.university}
                          onChange={(e) =>
                            setApplicant({
                              ...applicant,
                              university: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  {currentService.type === "Invitation" && (
                    <>
                      <div className="col-span-1 sm:col-span-2 lg:col-span-3 pb-1 pt-3 border-b border-slate-200">
                        <h4 className="font-bold text-slate-800">
                          Informations de l'invitant
                        </h4>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">
                          Nom complet de l'invitant
                        </label>
                        <Input
                          className="h-9 text-sm bg-white"
                          placeholder="Nom et prénom"
                          value={applicant.inviterName}
                          onChange={(e) =>
                            setApplicant({
                              ...applicant,
                              inviterName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">
                          Lien de parenté / Relation
                        </label>
                        <Input
                          className="h-9 text-sm bg-white"
                          placeholder="Ex: Oncle, Ami"
                          value={applicant.relationship}
                          onChange={(e) =>
                            setApplicant({
                              ...applicant,
                              relationship: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">
                          Date d'arrivée prévue
                        </label>
                        <Input
                          className="h-9 text-sm bg-white"
                          type="date"
                          value={applicant.travelStartDate}
                          onChange={(e) =>
                            setApplicant({
                              ...applicant,
                              travelStartDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  <div className="col-span-1 sm:col-span-2 lg:col-span-3 pb-1 pt-3 border-b border-slate-200">
                    <h4 className="font-bold text-slate-800">
                      Notes / Informations complémentaires
                    </h4>
                  </div>
                  <div className="space-y-1 lg:col-span-3">
                    <Input
                      className="h-9 text-sm bg-white"
                      placeholder="Remarques (optionnel)"
                      value={applicant.notes}
                      onChange={(e) =>
                        setApplicant({ ...applicant, notes: e.target.value })
                      }
                    />
                  </div>
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
                  {selectedVisa?.requiredDocuments &&
                  selectedVisa.requiredDocuments.length > 0 ? (
                    selectedVisa.requiredDocuments.map(
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
                              if (file) {
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
                          if (file) {
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
                          if (file) {
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
                        files.forEach((file, index) => {
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
                          {selectedCountry?.flag || "🌍"}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xl">
                            {currentService.title} -{" "}
                            {selectedCountry?.name || "Général"}
                          </div>
                          <div className="text-slate-500 font-medium">
                            {selectedVisa?.name}
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
                            {selectedVisa?.requiredDocuments &&
                            selectedVisa.requiredDocuments.length > 0
                              ? selectedVisa.requiredDocuments.length
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
                            -{selectedVisa?.price || 0} DA
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-end relative z-10">
                        <span className="text-slate-300 font-medium">
                          Restant
                        </span>
                        <span className="font-mono text-3xl font-black text-emerald-400">
                          {4500 - (selectedVisa?.price || 0)}{" "}
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
              (step === 1 && (!selectedCountry || !selectedVisa)) ||
              (step === 2 &&
                (!applicant.firstName ||
                  !applicant.lastName ||
                  !applicant.passportNumber))
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
