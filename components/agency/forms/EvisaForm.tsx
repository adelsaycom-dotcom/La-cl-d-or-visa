import { Input } from "@/components/ui/input";

export function EvisaForm({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="col-span-1 sm:col-span-2 pb-2 border-b border-gray-100 mb-2">
        <h4 className="font-bold text-gray-800">Informations Personnelles</h4>
      </div>
      <Input placeholder="Prénom (selon passeport)" value={data.firstName || ''} onChange={e=>onChange({...data, firstName: e.target.value})} />
      <Input placeholder="Nom de famille" value={data.lastName || ''} onChange={e=>onChange({...data, lastName: e.target.value})} />
      <Input placeholder="Numéro de passeport" value={data.passportNumber || ''} onChange={e=>onChange({...data, passportNumber: e.target.value})} />
      <Input type="date" placeholder="Date de naissance" value={data.dob || ''} onChange={e=>onChange({...data, dob: e.target.value})} />
      <Input placeholder="Nationalité" value={data.nationality || ''} onChange={e=>onChange({...data, nationality: e.target.value})} />
      
      <div className="col-span-1 sm:col-span-2 pb-2 border-b border-gray-100 mb-2 mt-2">
        <h4 className="font-bold text-gray-800">Dates du Séjour</h4>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-500 ml-1">Date d'arrivée prévue</label>
        <Input type="date" value={data.travelStartDate || ''} onChange={e=>onChange({...data, travelStartDate: e.target.value})} />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-500 ml-1">Date de départ prévue</label>
        <Input type="date" value={data.travelEndDate || ''} onChange={e=>onChange({...data, travelEndDate: e.target.value})} />
      </div>
    </div>
  );
}
