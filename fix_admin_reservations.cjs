const fs = require('fs');

let c = fs.readFileSync('components/admin/OrganizedTripsManagement.tsx', 'utf8');

const displayCustomData = `
                      <div className="text-sm text-slate-600 space-y-1">
                        <p><span className="font-medium">Contact:</span> {res.clientEmail} | {res.clientPhone}</p>
                        <p><span className="font-medium">Personnes:</span> {res.numberOfPeople} <span className="mx-2 text-slate-300">|</span> <span className="font-medium">Total:</span> {res.totalPrice} DZD</p>
                        {res.notes && <p><span className="font-medium text-amber-600">Notes:</span> {res.notes}</p>}
                        {res.customFormData && Object.keys(res.customFormData).length > 0 && (
                          <div className="mt-3 bg-white p-3 rounded border border-slate-100 text-xs">
                            <p className="font-bold text-slate-700 mb-2">Informations requises :</p>
                            <div className="space-y-2">
                              {Object.entries(res.customFormData).map(([fieldId, val]) => {
                                const fieldDef = selectedTrip?.customFormFields?.find(f => f.id === fieldId);
                                const label = fieldDef ? fieldDef.label : fieldId;
                                const isFile = val && val.toString().startsWith('data:');
                                return (
                                  <div key={fieldId} className="flex flex-col gap-1">
                                    <span className="font-medium text-slate-500">{label} :</span>
                                    {isFile ? (
                                      <a href={val} download={label + "_document"} className="text-blue-500 hover:underline flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Télécharger / Voir</a>
                                    ) : (
                                      <span className="text-slate-800 font-semibold">{val}</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        <p className="text-xs text-slate-400 mt-2">Effectuée le {new Date(res.createdAt).toLocaleString('fr-FR')}</p>
                      </div>
`;

c = c.replace(/<div className="text-sm text-slate-600 space-y-1">[\s\S]*?Effectuée le \{new Date\(res\.createdAt\)\.toLocaleString\('fr-FR'\)\}<\/p>\s*<\/div>/, displayCustomData);

fs.writeFileSync('components/admin/OrganizedTripsManagement.tsx', c);
