const fs = require('fs');

let c = fs.readFileSync('components/admin/ApplicationManagement.tsx', 'utf8');

const displayCustomData = `
                {selectedApp.customFormData && Object.keys(selectedApp.customFormData).length > 0 && (
                  <div className="border rounded-lg p-4 bg-blue-50/50 mt-6">
                    <h3 className="font-semibold mb-3 border-b pb-2 text-blue-900">
                      Informations Requises Personnalisées
                    </h3>
                    <div className="space-y-3 text-sm">
                      {Object.entries(selectedApp.customFormData).map(([fieldId, val]) => {
                        const isFile = val && typeof val === 'string' && val.startsWith('data:');
                        return (
                          <div key={fieldId} className="flex flex-col gap-1">
                            <span className="text-gray-500 text-xs">Champs additionnel : {fieldId}</span>
                            {isFile ? (
                              <a href={val} download={"document_" + fieldId} className="text-blue-600 hover:underline flex items-center gap-1 font-medium"><FileDown className="w-4 h-4" /> Télécharger Document</a>
                            ) : (
                              <span className="font-medium text-slate-800">{val}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
`;

c = c.replace(/\{\/\* Action panel \*\/\}/, `${displayCustomData}\n                {/* Action panel */}`);
fs.writeFileSync('components/admin/ApplicationManagement.tsx', c);

let c2 = fs.readFileSync('components/agency/AgencyApplications.tsx', 'utf8');
c2 = c2.replace(/\{\/\* Documents \*\/\}/, `${displayCustomData}\n                {/* Documents */}`);
fs.writeFileSync('components/agency/AgencyApplications.tsx', c2);

console.log("App management custom forms updated");
