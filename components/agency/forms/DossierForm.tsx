
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
