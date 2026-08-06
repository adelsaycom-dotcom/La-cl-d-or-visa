const fs = require('fs');
let c = fs.readFileSync('components/agency/OrganizedTrips.tsx', 'utf8');

if (!c.includes('customFormData, setCustomFormData')) {
  c = c.replace(/const \[notes, setNotes\] = useState\(''\);/, `const [notes, setNotes] = useState('');\n  const [customFormData, setCustomFormData] = useState<Record<string, string>>({});`);
  
  c = c.replace(/addTripReservation\(\{[\s\S]*?notes\n      \}\);/, `addTripReservation({
        tripId: selectedTrip.id,
        agencyId: 'agency_1', // Using mock agency for now, since auth is not fully hooked up
        clientName,
        clientEmail,
        clientPhone,
        numberOfPeople,
        notes,
        customFormData
      });`);
      
  c = c.replace(/setNotes\(''\);/, `setNotes('');\n      setCustomFormData({});`);
  
  const customFieldsUI = `
                      {selectedTrip?.customFormFields && selectedTrip.customFormFields.length > 0 && (
                        <div className="border-t pt-4 mt-4 space-y-4">
                          <h4 className="font-bold text-slate-800 mb-2">Informations requises</h4>
                          {selectedTrip.customFormFields.map(field => (
                            <div key={field.id}>
                              <label className="text-sm font-semibold text-slate-700 block mb-1">
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                              </label>
                              {field.type === 'file' ? (
                                <Input 
                                  type="file"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (event) => setCustomFormData({...customFormData, [field.id]: event.target?.result as string});
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              ) : (
                                <Input 
                                  type={field.type} 
                                  value={customFormData[field.id] || ''} 
                                  onChange={e => setCustomFormData({...customFormData, [field.id]: e.target.value})} 
                                  placeholder={field.label} 
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
`;
  
  c = c.replace(/<div>\s*<label className="text-sm font-semibold text-slate-700 block mb-1">Notes \/ Demandes spéciales<\/label>/, `${customFieldsUI}\n                      <div>\n                        <label className="text-sm font-semibold text-slate-700 block mb-1">Notes / Demandes spéciales</label>`);
  
  fs.writeFileSync('components/agency/OrganizedTrips.tsx', c);
}
console.log("Agency trips updated");
