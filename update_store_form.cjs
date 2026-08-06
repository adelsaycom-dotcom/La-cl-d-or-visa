const fs = require('fs');
let c = fs.readFileSync('src/store/useAppStore.ts', 'utf8');

if (!c.includes('export interface CustomFormField')) {
  const newInterfaces = `
export interface CustomFormField {
  id: string;
  label: string;
  type: 'text' | 'file' | 'number';
  required: boolean;
}
`;
  c = c.replace(/export interface OrganizedTrip \{/, newInterfaces + 'export interface OrganizedTrip {\n  customFormFields?: CustomFormField[];');
  c = c.replace(/export interface TripReservation \{/, 'export interface TripReservation {\n  customFormData?: Record<string, string>;');
  fs.writeFileSync('src/store/useAppStore.ts', c);
}
console.log("Store updated");
