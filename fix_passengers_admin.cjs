const fs = require('fs');
let content = fs.readFileSync('components/admin/OrganizedTripsManagement.tsx', 'utf8');

// Replace the custom form data block with a passengers block
const oldBlock = `{/* Custom Form Data (e.g. passengers info) */}
                        {res.customFormData && Object.keys(res.customFormData).length > 0 && (
                          <div className="mt-4 bg-white p-4 rounded border border-slate-100 text-xs shadow-sm">
                            <p className="font-bold text-slate-700 mb-3">Informations supplémentaires (Passagers) :</p>
                            <div className="grid grid-cols-1 gap-3">
                              {Object.entries(res.customFormData).map(([fieldId, val]) => {
                                const fieldDef = selectedTrip?.customFormFields?.find(f => f.id === fieldId);
                                const label = fieldDef ? fieldDef.label : fieldId;
                                const isFile = val && val.toString().startsWith('data:');
                                
                                if (Array.isArray(val)) {
                                  // Handling passenger arrays if any
                                  return (
                                    <div key={fieldId} className="flex flex-col gap-1 col-span-1">
                                      <span className="font-medium text-slate-500">{label} :</span>
                                      <div className="space-y-1">
                                        {val.map((p, i) => (
                                          <div key={i} className="bg-slate-50 p-2 rounded border border-slate-100 flex items-center gap-2">
                                            <span className="font-semibold text-slate-800">{p.lastName} {p.firstName}</span>
                                            {p.passportNumber && <span className="text-slate-500 ml-2">Pass: {p.passportNumber}</span>}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                }
                                
                                return (
                                  <div key={fieldId} className="flex flex-col gap-1 col-span-1">
                                    <span className="font-medium text-slate-500">{label} :</span>
                                    {isFile ? (
                                      <a href={val as string} download="document" className="text-blue-500 hover:underline flex items-center gap-1"><FileText className="w-3 h-3"/> Télécharger le document</a>
                                    ) : (
                                      <span className="text-slate-800 font-semibold">{val as string}</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}`;

const newBlock = `{/* Passengers info */}
                        {res.customFormData?.passengers && res.customFormData.passengers.length > 0 && (
                          <div className="mt-4 bg-white p-4 rounded border border-slate-100 text-xs shadow-sm">
                            <p className="font-bold text-slate-700 mb-3">Liste des Passagers :</p>
                            <div className="space-y-1">
                              {res.customFormData.passengers.map((p: any, i: number) => (
                                <div key={i} className="bg-slate-50 p-2 rounded border border-slate-100 flex flex-wrap items-center gap-2">
                                  <span className="font-semibold text-slate-800 uppercase">{p.lastName}</span>
                                  <span className="font-medium text-slate-700">{p.firstName}</span>
                                  {p.passportNumber && (
                                    <span className="text-slate-500 ml-auto bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px]">
                                      Passeport: <span className="font-bold">{p.passportNumber}</span>
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}`;

if(content.includes(oldBlock)) {
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync('components/admin/OrganizedTripsManagement.tsx', content);
    console.log("Replaced successfully!");
} else {
    console.log("Could not find the block to replace. Here is the block from the file instead:");
    const lines = content.split('\\n');
    let found = -1;
    for(let i=0; i<lines.length; i++) {
        if(lines[i].includes('{/* Custom Form Data (e.g. passengers info) */}')) {
            found = i;
            break;
        }
    }
    if (found !== -1) {
        console.log(lines.slice(found, found+10).join('\\n'));
    }
}
