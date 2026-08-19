import re

with open('src/store/useAppStore.ts', 'r') as f:
    content = f.read()

# Replace or add Service interface
service_interface = """export interface PrestationService {
  id: string;
  title: string;
  type: "Evisa" | "Residence" | "Permis" | "Assurance" | "Etude" | "Invitation" | "Rendez-vous" | "Dossier";
  destination: string; // 'Monde' or specific country
  flag?: string;
  price: number;
  processingTime: string;
  requiredDocuments: string[];
  conditions: string[];
  active: boolean;
}
"""

if "export interface PrestationService" not in content:
    content = content.replace("export interface OrganizedTrip", service_interface + "\nexport interface OrganizedTrip")

if "services: PrestationService[];" not in content:
    content = content.replace("countries: Country[];", "countries: Country[];\n  services: PrestationService[];\n  addService: (s: PrestationService) => void;\n  updateService: (id: string, s: Partial<PrestationService>) => void;\n  deleteService: (id: string) => void;")

if "services: []" not in content:
    content = content.replace("countries: [],", "countries: [],\n  services: [\n    { id: '1', title: 'Visa Touristique (E-Visa)', type: 'Evisa', destination: 'Turquie', flag: '🇹🇷', price: 15000, processingTime: '3-5 jours', requiredDocuments: ['Passeport', 'Photo'], conditions: ['Passeport valide 6 mois'], active: true },\n    { id: '2', title: 'Dossier Résidence (Non Lucrative)', type: 'Residence', destination: 'Espagne', flag: '🇪🇸', price: 25000, processingTime: '10 jours', requiredDocuments: ['Passeport', 'Fiche Familiale', 'Justificatif de revenus'], conditions: ['Revenus réguliers'], active: true },\n    { id: '3', title: 'Assurance Voyage 30 Jours', type: 'Assurance', destination: 'Monde Entier', flag: '🌍', price: 5000, processingTime: 'Immédiat', requiredDocuments: ['Passeport'], conditions: ['Age < 75 ans'], active: true }\n  ],")

if "addService:" not in content:
    content = content.replace("addOrganizedTrip:", "addService: (s) => set((state) => ({ services: [...state.services, s] })),\n  updateService: (id, s) => set((state) => ({ services: state.services.map(x => x.id === id ? { ...x, ...s } : x) })),\n  deleteService: (id) => set((state) => ({ services: state.services.filter(x => x.id !== id) })),\n  addOrganizedTrip:")

with open('src/store/useAppStore.ts', 'w') as f:
    f.write(content)
