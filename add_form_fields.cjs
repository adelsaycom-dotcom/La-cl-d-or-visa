const fs = require('fs');

let c = fs.readFileSync('components/admin/OrganizedTripsManagement.tsx', 'utf8');

if (!c.includes('customFormFields: newTrip.customFormFields')) {
  // Update handleAddTrip
  c = c.replace(/status: newTrip\.status as OrganizedTrip\['status'\]/, `status: newTrip.status as OrganizedTrip['status'],\n        customFormFields: newTrip.customFormFields`);
  
  // Reset newTrip
  c = c.replace(/status: 'active' \}\);/, `status: 'active', customFormFields: [] });`);

  // Initial state
  c = c.replace(/status: 'active'\n  \}\);/, `status: 'active', customFormFields: []\n  });`);
  
  const formBuilderUI = `
              <div className="col-span-2 border-t pt-4 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-800">Formulaire de réservation personnalisé</label>
                  <Button variant="outline" size="sm" onClick={() => setNewTrip({
                    ...newTrip,
                    customFormFields: [...(newTrip.customFormFields || []), { id: Math.random().toString(36).substr(2,9), label: '', type: 'text', required: false }]
                  })}>
                    <Plus className="w-3 h-3 mr-1" /> Ajouter un champ
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mb-3">Définissez les informations et documents nécessaires lors de la réservation (ex: Copie passeport, type de chambre...)</p>
                
                <div className="space-y-3">
                  {(newTrip.customFormFields || []).map((field, idx) => (
                    <div key={field.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <Input 
                        className="h-8 text-sm" 
                        placeholder="Nom du champ (ex: Passeport)" 
                        value={field.label}
                        onChange={e => {
                          const fields = [...(newTrip.customFormFields || [])];
                          fields[idx].label = e.target.value;
                          setNewTrip({...newTrip, customFormFields: fields});
                        }}
                      />
                      <Select 
                        value={field.type} 
                        onValueChange={(val: any) => {
                          const fields = [...(newTrip.customFormFields || [])];
                          fields[idx].type = val;
                          setNewTrip({...newTrip, customFormFields: fields});
                        }}
                      >
                        <SelectTrigger className="w-[120px] h-8 text-sm"><SelectValue/></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Texte</SelectItem>
                          <SelectItem value="number">Nombre</SelectItem>
                          <SelectItem value="file">Fichier / Image</SelectItem>
                        </SelectContent>
                      </Select>
                      <label className="flex items-center gap-1 text-xs whitespace-nowrap cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={field.required}
                          onChange={e => {
                            const fields = [...(newTrip.customFormFields || [])];
                            fields[idx].required = e.target.checked;
                            setNewTrip({...newTrip, customFormFields: fields});
                          }}
                        /> Obligatoire
                      </label>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => {
                        const fields = [...(newTrip.customFormFields || [])];
                        fields.splice(idx, 1);
                        setNewTrip({...newTrip, customFormFields: fields});
                      }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {(!newTrip.customFormFields || newTrip.customFormFields.length === 0) && (
                    <div className="text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-slate-400 text-sm">
                      Aucun champ personnalisé
                    </div>
                  )}
                </div>
              </div>
`;
  
  c = c.replace(/<\/div>\n\s*<\/ScrollArea>/, `\n${formBuilderUI}\n            </div>\n            </ScrollArea>`);

  fs.writeFileSync('components/admin/OrganizedTripsManagement.tsx', c);
}
console.log("Admin trips updated");
