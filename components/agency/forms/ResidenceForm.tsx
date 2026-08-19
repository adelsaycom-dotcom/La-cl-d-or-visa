import { Input } from "@/components/ui/input";

export function ResidenceForm({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="col-span-1 sm:col-span-2 pb-2 border-b border-gray-100 mb-2">
        <h4 className="font-bold text-gray-800">Identité Complète</h4>
      </div>
      <Input placeholder="Prénom" value={data.firstName || ''} onChange={e=>onChange({...data, firstName: e.target.value})} />
      <Input placeholder="Nom" value={data.lastName || ''} onChange={e=>onChange({...data, lastName: e.target.value})} />
      <Input placeholder="Prénom du Père (FR)" value={data.fatherNameFr || ''} onChange={e=>onChange({...data, fatherNameFr: e.target.value})} />
      <Input placeholder="Prénom de la Mère (FR)" value={data.motherNameFr || ''} onChange={e=>onChange({...data, motherNameFr: e.target.value})} />
      <Input placeholder="Profession" value={data.profession || ''} onChange={e=>onChange({...data, profession: e.target.value})} />
      <Input placeholder="Situation Familiale" value={data.maritalStatus || ''} onChange={e=>onChange({...data, maritalStatus: e.target.value})} />

      <div className="col-span-1 sm:col-span-2 pb-2 border-b border-gray-100 mb-2 mt-2">
        <h4 className="font-bold text-gray-800">Adresse et Contact</h4>
      </div>
      <Input className="col-span-1 sm:col-span-2" placeholder="Adresse complète de résidence" value={data.residenceAddress || ''} onChange={e=>onChange({...data, residenceAddress: e.target.value})} />
      <Input placeholder="Téléphone" value={data.phoneNumber || ''} onChange={e=>onChange({...data, phoneNumber: e.target.value})} />
      <Input placeholder="Email" value={data.email || ''} onChange={e=>onChange({...data, email: e.target.value})} />
    </div>
  );
}
