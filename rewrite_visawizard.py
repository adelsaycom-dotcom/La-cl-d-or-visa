import re

with open('components/agency/VisaWizard.tsx', 'r') as f:
    content = f.read()

# Add imports for forms
if "import { EvisaForm, ResidenceForm, AssuranceForm, GenericServiceForm } from" not in content:
    content = content.replace('import { motion, AnimatePresence } from "framer-motion";', 'import { motion, AnimatePresence } from "framer-motion";\nimport { EvisaForm, ResidenceForm, AssuranceForm, GenericServiceForm } from "./forms";')

# We need to change the store destructuring
content = content.replace("const { countries, addApplication, agencyBalance, setAgencyBalance } = useAppStore();", "const { services, addApplication, agencyBalance, setAgencyBalance } = useAppStore();")

# We change `selectedCountry` to `selectedService`
content = content.replace("const [selectedCountry, setSelectedCountry] = useState<any>(null);", "const [selectedService, setSelectedService] = useState<any>(null);")
content = content.replace("selectedCountry", "selectedService")

# In step 1, instead of mapping countries, we map `services` filtered by `serviceParam`.
# First, let's replace the whole step 1 block.
step_1_regex = r"\{step === 1 && \([\s\S]*?\)\}\n\s*\{step === 2 && \("
step_1_replacement = """{step === 1 && (
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
                        className={`p-6 rounded-2xl border-2 transition-all duration-200 group cursor-pointer
                        ${
                          selectedService?.id === s.id
                            ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100/50"
                            : "border-slate-100 hover:border-blue-200 hover:shadow-sm bg-white"
                        }`}
                        onClick={() => setSelectedService(s)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${selectedService?.id === s.id ? 'bg-white' : 'bg-gray-50'}`}>
                            {s.flag}
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-bold ${selectedService?.id === s.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {s.price.toLocaleString()} DZD
                          </div>
                        </div>
                        <h4 className="font-bold text-slate-900 text-lg leading-tight mb-1">{s.title}</h4>
                        <p className="text-sm text-slate-500 font-medium">{s.destination}</p>
                        
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Info className="w-3.5 h-3.5" /> {s.processingTime}</span>
                        </div>
                      </div>
                    ))}
                    
                  {services.filter((s) => s.active && s.type.toLowerCase() === (serviceParam === 'dossier' ? 'dossier' : serviceParam.toLowerCase())).length === 0 && (
                    <div className="col-span-full p-8 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                       Aucune prestation active trouvée pour ce type de service.
                    </div>
                  )}
                </div>
              </div>
            )}
            {step === 2 && ("""
content = re.sub(step_1_regex, step_1_replacement, content)

# Now Step 2 replacement
step_2_regex = r"\{step === 2 && \([\s\S]*?\}\n\s*\{step === 3 && \("
step_2_replacement = """{step === 2 && (
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
                  {selectedService?.type === 'Evisa' && <EvisaForm data={applicant} onChange={setApplicant} />}
                  {selectedService?.type === 'Residence' && <ResidenceForm data={applicant} onChange={setApplicant} />}
                  {selectedService?.type === 'Assurance' && <AssuranceForm data={applicant} onChange={setApplicant} />}
                  {!['Evisa', 'Residence', 'Assurance'].includes(selectedService?.type) && <GenericServiceForm data={applicant} onChange={setApplicant} />}
                </div>
              </div>
            )}
            {step === 3 && ("""
content = re.sub(step_2_regex, step_2_replacement, content)

# Step 3 adjustments
# In Step 3, we use `selectedService?.requiredDocuments` instead of `selectedVisa?.requiredDocuments`
content = content.replace("selectedVisa?.requiredDocuments", "selectedService?.requiredDocuments")
content = content.replace("selectedVisa.requiredDocuments", "selectedService.requiredDocuments")

# Step 4 adjustments
# Replace selectedCountry?.name with selectedService?.destination
# Replace selectedVisa?.name with selectedService?.title
content = content.replace("selectedService?.name || \"Général\"", "selectedService?.destination || \"Général\"")
content = content.replace("{selectedVisa?.name}", "{selectedService?.title}")

content = content.replace("!selectedService || !selectedVisa", "!selectedService")
content = content.replace("selectedService?.price", "(selectedService?.price || 0)")
content = content.replace("selectedVisa?.price", "(selectedService?.price || 0)")
content = content.replace("selectedVisa?.processingTime", "selectedService?.processingTime")
content = content.replace("{selectedService?.flag || \"🌍\"}", "{selectedService?.flag || \"🌍\"}")


with open('components/agency/VisaWizard.tsx', 'w') as f:
    f.write(content)
