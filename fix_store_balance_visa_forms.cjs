const fs = require('fs');

let c = fs.readFileSync('src/store/useAppStore.ts', 'utf8');

if (!c.includes('customFormFields?: CustomFormField[]') || c.indexOf('customFormFields?: CustomFormField[]') === c.lastIndexOf('customFormFields?: CustomFormField[]')) {
  // Add to VisaType
  c = c.replace(/export interface VisaType \{/, "export interface VisaType {\n  customFormFields?: CustomFormField[];");
}

if (!c.includes('agencyBalance:')) {
  c = c.replace(/export interface AppState \{/, "export interface AppState {\n  agencyBalance: number;\n  setAgencyBalance: (balance: number) => void;");
  
  c = c.replace(/persist\(\n\s*\(\w+\) => \(\{/, "persist(\n    (set) => ({\n      agencyBalance: 4500,\n      setAgencyBalance: (balance) => set({ agencyBalance: balance }),");
}

// Add customFormData to Application
if (!c.includes('customFormData?: Record<string, string>;') || c.indexOf('customFormData?: Record<string, string>;') === c.lastIndexOf('customFormData?: Record<string, string>;')) {
   c = c.replace(/export interface Application \{/, "export interface Application {\n  customFormData?: Record<string, string>;");
}

fs.writeFileSync('src/store/useAppStore.ts', c);
