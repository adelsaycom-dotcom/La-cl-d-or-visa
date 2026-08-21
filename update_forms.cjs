const fs = require('fs');

const standardFieldsCode = `
import { Input } from "@/components/ui/input";

export function StandardFields({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  return (
    <>
      <div className="col-span-1 sm:col-span-2 pb-2 border-b border-gray-100 mb-2 mt-4">
        <h4 className="font-bold text-gray-800">Informations Personnelles</h4>
      </div>
      <Input placeholder="Nom" value={data.lastName || ''} onChange={e=>onChange({...data, lastName: e.target.value})} />
      <Input placeholder="Prénom" value={data.firstName || ''} onChange={e=>onChange({...data, firstName: e.target.value})} />
      <div className="space-y-1">
        <label className="text-xs text-gray-500 ml-1">Date de naissance</label>
        <Input type="date" value={data.dob || ''} onChange={e=>onChange({...data, dob: e.target.value})} />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-500 ml-1">Lieu de naissance</label>
        <Input placeholder="Lieu de naissance" value={data.birthPlace || ''} onChange={e=>onChange({...data, birthPlace: e.target.value})} />
      </div>
      
      <div className="col-span-1 sm:col-span-2 pb-2 border-b border-gray-100 mb-2 mt-4">
        <h4 className="font-bold text-gray-800">Coordonnées</h4>
      </div>
      <Input type="email" placeholder="Adresse email" value={data.email || ''} onChange={e=>onChange({...data, email: e.target.value})} />
      <Input type="tel" placeholder="Numéro de téléphone" value={data.phoneNumber || ''} onChange={e=>onChange({...data, phoneNumber: e.target.value})} />
      <Input className="col-span-1 sm:col-span-2" placeholder="Adresse de résidence" value={data.residenceAddress || ''} onChange={e=>onChange({...data, residenceAddress: e.target.value})} />

      <div className="col-span-1 sm:col-span-2 pb-2 border-b border-gray-100 mb-2 mt-4">
        <h4 className="font-bold text-gray-800">Passeport</h4>
      </div>
      <Input placeholder="Numéro de passeport" value={data.passportNumber || ''} onChange={e=>onChange({...data, passportNumber: e.target.value})} />
      <div className="space-y-1">
        <label className="text-xs text-gray-500 ml-1">Date de délivrance</label>
        <Input type="date" value={data.passportIssueDate || ''} onChange={e=>onChange({...data, passportIssueDate: e.target.value})} />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-500 ml-1">Date d'expiration</label>
        <Input type="date" value={data.passportExpiryDate || ''} onChange={e=>onChange({...data, passportExpiryDate: e.target.value})} />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-500 ml-1">Lieu de délivrance</label>
        <Input placeholder="Lieu de délivrance" value={data.passportIssuePlace || ''} onChange={e=>onChange({...data, passportIssuePlace: e.target.value})} />
      </div>

      <div className="col-span-1 sm:col-span-2 pb-2 border-b border-gray-100 mb-2 mt-4">
        <h4 className="font-bold text-gray-800">Filiation</h4>
      </div>
      <Input placeholder="Nom et prénom mère" value={data.motherFullName || ''} onChange={e=>onChange({...data, motherFullName: e.target.value})} />
      <Input placeholder="Prénom père" value={data.fatherFirstName || ''} onChange={e=>onChange({...data, fatherFirstName: e.target.value})} />
    </>
  );
}
`;

fs.writeFileSync('components/agency/forms/StandardFields.tsx', standardFieldsCode);

const standardVisaFormCode = `
import { StandardFields } from "./StandardFields";

export function StandardVisaForm({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StandardFields data={data} onChange={onChange} />
    </div>
  );
}
`;

fs.writeFileSync('components/agency/forms/StandardVisaForm.tsx', standardVisaFormCode);

const dossierFormCode = `
import { Input } from "@/components/ui/input";
import { StandardFields } from "./StandardFields";

export function DossierForm({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StandardFields data={data} onChange={onChange} />
      
      <div className="col-span-1 sm:col-span-2 pb-2 border-b border-gray-100 mb-2 mt-4">
        <h4 className="font-bold text-gray-800">Informations Professionnelles / Études</h4>
      </div>
      <Input className="col-span-1 sm:col-span-2" placeholder="Lieu de travail ou nom de l'école" value={data.workplaceOrSchool || ''} onChange={e=>onChange({...data, workplaceOrSchool: e.target.value})} />
      <Input placeholder="Numéro de l'employeur / école" value={data.employerPhone || ''} onChange={e=>onChange({...data, employerPhone: e.target.value})} />
      <Input placeholder="Email employeur / école" type="email" value={data.employerEmail || ''} onChange={e=>onChange({...data, employerEmail: e.target.value})} />
      <Input className="col-span-1 sm:col-span-2" placeholder="Adresse de travail / école" value={data.workplaceAddress || ''} onChange={e=>onChange({...data, workplaceAddress: e.target.value})} />
      
      <div className="col-span-1 sm:col-span-2 pb-2 border-b border-gray-100 mb-2 mt-4">
        <h4 className="font-bold text-gray-800">Détails du Voyage</h4>
      </div>
      <Input type="tel" placeholder="Numéro de téléphone du bénéficiaire" value={data.beneficiaryPhone || ''} onChange={e=>onChange({...data, beneficiaryPhone: e.target.value})} />
      <div></div>
      <div className="space-y-1">
        <label className="text-xs text-gray-500 ml-1">Date de départ prévue</label>
        <Input type="date" value={data.travelStartDate || ''} onChange={e=>onChange({...data, travelStartDate: e.target.value})} />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-500 ml-1">Date de retour prévue</label>
        <Input type="date" value={data.travelEndDate || ''} onChange={e=>onChange({...data, travelEndDate: e.target.value})} />
      </div>
    </div>
  );
}
`;
fs.writeFileSync('components/agency/forms/DossierForm.tsx', dossierFormCode);

const etudeFormCode = `
import { Input } from "@/components/ui/input";
import { StandardFields } from "./StandardFields";

export function EtudeForm({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StandardFields data={data} onChange={onChange} />
      
      <div className="col-span-1 sm:col-span-2 pb-2 border-b border-gray-100 mb-2 mt-4">
        <h4 className="font-bold text-gray-800">Informations Académiques</h4>
      </div>
      <Input placeholder="Niveau scolaire" value={data.studyLevel || ''} onChange={e=>onChange({...data, studyLevel: e.target.value})} />
      <Input placeholder="Moyenne" value={data.gradeAverage || ''} onChange={e=>onChange({...data, gradeAverage: e.target.value})} />
      <Input className="col-span-1 sm:col-span-2" placeholder="Spécialité" value={data.specialty || ''} onChange={e=>onChange({...data, specialty: e.target.value})} />
    </div>
  );
}
`;
fs.writeFileSync('components/agency/forms/EtudeForm.tsx', etudeFormCode);

const permisFormCode = `
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PermisForm({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="col-span-1 sm:col-span-2 pb-2 border-b border-gray-100 mb-2 mt-4">
        <h4 className="font-bold text-gray-800">Informations du Demandeur</h4>
      </div>
      <Input placeholder="Nom" value={data.lastName || ''} onChange={e=>onChange({...data, lastName: e.target.value})} />
      <Input placeholder="Prénom" value={data.firstName || ''} onChange={e=>onChange({...data, firstName: e.target.value})} />
      <div className="space-y-1">
        <label className="text-xs text-gray-500 ml-1">Date de naissance</label>
        <Input type="date" value={data.dob || ''} onChange={e=>onChange({...data, dob: e.target.value})} />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-500 ml-1">Lieu de naissance</label>
        <Input placeholder="Lieu de naissance" value={data.birthPlace || ''} onChange={e=>onChange({...data, birthPlace: e.target.value})} />
      </div>
      
      <div className="col-span-1 sm:col-span-2 pb-2 border-b border-gray-100 mb-2 mt-4">
        <h4 className="font-bold text-gray-800">Coordonnées</h4>
      </div>
      <Input type="email" placeholder="Adresse email" value={data.email || ''} onChange={e=>onChange({...data, email: e.target.value})} />
      <Input type="tel" placeholder="Numéro de téléphone" value={data.phoneNumber || ''} onChange={e=>onChange({...data, phoneNumber: e.target.value})} />
      
      <div className="col-span-1 sm:col-span-2 pb-2 border-b border-gray-100 mb-2 mt-4">
        <h4 className="font-bold text-gray-800">Détails du Permis</h4>
      </div>
      <div className="col-span-1 sm:col-span-2 space-y-1">
        <label className="text-xs text-gray-500 ml-1">Type de permis</label>
        <Select value={data.licenseType || ''} onValueChange={v => onChange({...data, licenseType: v})}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner le type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a1">Moto Légère (A1)</SelectItem>
            <SelectItem value="a">Moto (A)</SelectItem>
            <SelectItem value="b">Auto (B)</SelectItem>
            <SelectItem value="c">Poids Lourd (C)</SelectItem>
            <SelectItem value="d">Transport en commun (D)</SelectItem>
            <SelectItem value="eb">Auto + Remorque (E-B)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('components/agency/forms/PermisForm.tsx', permisFormCode);

let indexContent = fs.readFileSync('components/agency/forms/index.ts', 'utf8');
indexContent += `
export { StandardVisaForm } from './StandardVisaForm';
export { DossierForm } from './DossierForm';
export { EtudeForm } from './EtudeForm';
export { PermisForm } from './PermisForm';
`;
fs.writeFileSync('components/agency/forms/index.ts', indexContent);

