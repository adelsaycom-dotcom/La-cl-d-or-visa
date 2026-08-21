
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
