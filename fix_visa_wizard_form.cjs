const fs = require('fs');

let c = fs.readFileSync('components/agency/VisaWizard.tsx', 'utf8');

if (!c.includes('const [customFormData, setCustomFormData] = useState<Record<string, any>>({});')) {
  c = c.replace(/const \[applicant, setApplicant\] = useState\(\{/, `const [customFormData, setCustomFormData] = useState<Record<string, any>>({});\n  const [applicant, setApplicant] = useState({`);
  
  c = c.replace(/price: selectedVisa\?.price \|\| 0,/, `price: selectedVisa?.price || 0,\n      customFormData,`);
  
  const customFieldsUI = `
                  {selectedVisa?.customFormFields && selectedVisa.customFormFields.length > 0 && (
                    <>
                      <div className="col-span-1 sm:col-span-2 lg:col-span-3 pb-1 border-b border-slate-200 mt-6">
                        <h4 className="font-bold text-slate-800">
                          Informations requises par l'administration
                        </h4>
                      </div>
                      {selectedVisa.customFormFields.map((field: any) => (
                        <div className="space-y-1" key={field.id}>
                          <label className="text-sm font-semibold text-slate-700">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          {field.type === 'file' ? (
                            <Input 
                              type="file"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => setCustomFormData({...customFormData, [field.id]: event.target?.result});
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="h-9 text-sm bg-white"
                            />
                          ) : (
                            <Input 
                              type={field.type} 
                              value={customFormData[field.id] || ''} 
                              onChange={e => setCustomFormData({...customFormData, [field.id]: e.target.value})} 
                              placeholder={field.label} 
                              className="h-9 text-sm bg-white"
                            />
                          )}
                        </div>
                      ))}
                    </>
                  )}
`;
  
  c = c.replace(/<div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">/, `${customFieldsUI}\n                <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">`);
  
  fs.writeFileSync('components/agency/VisaWizard.tsx', c);
  console.log('Visa wizard custom forms updated');
}
