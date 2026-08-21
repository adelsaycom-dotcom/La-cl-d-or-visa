
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
