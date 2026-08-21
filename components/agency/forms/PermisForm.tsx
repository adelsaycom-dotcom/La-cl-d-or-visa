
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
