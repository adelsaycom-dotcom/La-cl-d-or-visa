import { Input } from "@/components/ui/input";

export function GenericServiceForm({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="col-span-1 sm:col-span-2 pb-2 border-b border-gray-100 mb-2">
        <h4 className="font-bold text-gray-800">Informations de base</h4>
      </div>
      <Input placeholder="Prénom" value={data.firstName || ''} onChange={e=>onChange({...data, firstName: e.target.value})} />
      <Input placeholder="Nom" value={data.lastName || ''} onChange={e=>onChange({...data, lastName: e.target.value})} />
      <Input placeholder="Numéro de document / passeport" value={data.passportNumber || ''} onChange={e=>onChange({...data, passportNumber: e.target.value})} />
      <Input type="date" placeholder="Date de naissance" value={data.dob || ''} onChange={e=>onChange({...data, dob: e.target.value})} />
      
      <div className="col-span-1 sm:col-span-2 pb-2 border-b border-gray-100 mb-2 mt-2">
        <h4 className="font-bold text-gray-800">Notes & Détails supplémentaires</h4>
      </div>
      <Input className="col-span-1 sm:col-span-2" placeholder="Précisez la demande si nécessaire..." value={data.notes || ''} onChange={e=>onChange({...data, notes: e.target.value})} />
    </div>
  );
}
