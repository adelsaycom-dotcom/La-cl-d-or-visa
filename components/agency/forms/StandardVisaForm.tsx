
import { StandardFields } from "./StandardFields";

export function StandardVisaForm({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StandardFields data={data} onChange={onChange} />
    </div>
  );
}
