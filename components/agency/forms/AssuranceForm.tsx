import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AssuranceForm({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="col-span-1 sm:col-span-2 pb-2 border-b border-gray-100 mb-2">
        <h4 className="font-bold text-gray-800">Détails de l'Assuré</h4>
      </div>
      <Input placeholder="Prénom" value={data.firstName || ''} onChange={e=>onChange({...data, firstName: e.target.value})} />
      <Input placeholder="Nom" value={data.lastName || ''} onChange={e=>onChange({...data, lastName: e.target.value})} />
      <Input placeholder="Numéro de passeport" value={data.passportNumber || ''} onChange={e=>onChange({...data, passportNumber: e.target.value})} />
      <Input type="date" placeholder="Date de naissance" value={data.dob || ''} onChange={e=>onChange({...data, dob: e.target.value})} />
      
      <div className="col-span-1 sm:col-span-2 pb-2 border-b border-gray-100 mb-2 mt-2">
        <h4 className="font-bold text-gray-800">Couverture Souhaitée</h4>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-500 ml-1">Début de couverture</label>
        <Input type="date" value={data.travelStartDate || ''} onChange={e=>onChange({...data, travelStartDate: e.target.value})} />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-500 ml-1">Fin de couverture</label>
        <Input type="date" value={data.travelEndDate || ''} onChange={e=>onChange({...data, travelEndDate: e.target.value})} />
      </div>
      <div className="col-span-1 sm:col-span-2 space-y-1 mt-2">
        <label className="text-xs text-gray-500 ml-1">Plafond de garantie / Formule</label>
        <Select value={data.planType || ''} onValueChange={(v:any)=>onChange({...data, planType: v})}>
          <SelectTrigger className="bg-white">
             <SelectValue placeholder="Choisir une formule" />
          </SelectTrigger>
          <SelectContent>
             <SelectItem value="standard">Standard (30,000 €)</SelectItem>
             <SelectItem value="premium">Premium (50,000 €)</SelectItem>
             <SelectItem value="gold">Gold (100,000 € + Rapatriement VIP)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
