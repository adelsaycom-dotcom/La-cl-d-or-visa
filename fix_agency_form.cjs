const fs = require('fs');

let content = fs.readFileSync('components/agency/OrganizedTrips.tsx', 'utf8');

// Replace the dialog wrapper for the booking form
content = content.replace(
  '<DialogContent className="sm:max-w-[700px] bg-white p-0 overflow-hidden rounded-2xl">',
  '<DialogContent className="w-[95vw] sm:max-w-3xl md:max-w-4xl bg-white p-0 max-h-[95vh] overflow-hidden rounded-2xl flex flex-col">'
);

content = content.replace(
  '<ScrollArea className="max-h-[60vh]">',
  '<ScrollArea className="flex-1">'
);

const newContactSection = `
                      <div className="border-t border-slate-100 pt-8 mt-8">
                        <h3 className="font-black text-slate-800 mb-6 text-xl tracking-tight">Vos Coordonnées</h3>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="md:col-span-2">
                            <label className="text-sm font-bold text-slate-700 block mb-2">Nom du client principal (ou Agence)</label>
                            <Input className="h-12 bg-white border-slate-200" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nom et Prénom" />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-slate-700 block mb-2">Email de contact</label>
                            <Input className="h-12 bg-white border-slate-200" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="email@exemple.com" />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-slate-700 block mb-2">Téléphone</label>
                            <Input className="h-12 bg-white border-slate-200" value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="Numéro de téléphone" />
                          </div>
                        </div>
                      </div>
`;

// Replace from '<div className="border-t border-slate-100 pt-6">' down to '{selectedTrip?.customFormFields'
const regexContact = /<div className="border-t border-slate-100 pt-6">[\s\S]*?<div className="space-y-4">[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?{selectedTrip\?\.customFormFields/;
content = content.replace(regexContact, newContactSection + '\n                          {selectedTrip?.customFormFields');

// Replace custom fields section
const oldCustomFields = /<div className="border border-blue-100 bg-blue-50\/50 p-4 rounded-xl space-y-4 my-4">[\s\S]*?<\/h4>[\s\S]*?<\/div>\n                          \)}/;
const newCustomFields = `<div className="mt-8 border border-blue-100 bg-blue-50/30 p-6 rounded-2xl space-y-5">
                              <h4 className="font-black text-blue-900 flex items-center gap-2 text-lg">
                                Documents & Informations requises
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {selectedTrip.customFormFields.map(field => (
                                <div key={field.id} className={field.type === 'file' || field.type === 'textarea' ? "md:col-span-2" : ""}>
                                  <label className="text-sm font-bold text-slate-700 block mb-2">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                  </label>
                                  {field.type === 'file' ? (
                                    <div className="relative">
                                      <Input 
                                        type="file"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => setCustomFormData({...customFormData, [field.id]: (event.target?.result as string) || ""});
                                            reader.readAsDataURL(file);
                                          }
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                      />
                                      <div className="flex items-center gap-3">
                                        <Button type="button" variant="outline" className="h-12 bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800">
                                          Joindre un fichier
                                        </Button>
                                        {customFormData[field.id] && <span className="text-sm text-emerald-600 font-bold flex items-center gap-1"><Check className="w-4 h-4"/> Fichier joint</span>}
                                      </div>
                                    </div>
                                  ) : (
                                    <Input 
                                      type={field.type} 
                                      value={customFormData[field.id] || ''} 
                                      onChange={e => setCustomFormData({...customFormData, [field.id]: e.target.value})} 
                                      placeholder={field.label} 
                                      className="h-12 bg-white border-blue-100"
                                    />
                                  )}
                                </div>
                              ))}
                              </div>
                            </div>
                          )}`;
content = content.replace(oldCustomFields, newCustomFields);

// Replace the Passengers section
const oldPassengers = /<div className="border-t border-slate-100 pt-6 mt-6">[\s\S]*?<div className="space-y-4">[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<div className="mt-4">[\s\S]*?<label className="text-sm font-semibold text-slate-700 block mb-1">Notes \/ Demandes spéciales<\/label>[\s\S]*?<\/div>/;

const newPassengers = `
                          <div className="border-t border-slate-100 pt-8 mt-8">
                            <h3 className="font-black text-slate-800 mb-6 text-xl tracking-tight flex items-center justify-between">
                              Informations des Voyageurs
                              <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl border border-slate-200">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                                  onClick={() => {
                                    const newCount = Math.max(1, numberOfPeople - 1);
                                    setNumberOfPeople(newCount);
                                    setPassengers(prev => prev.slice(0, newCount));
                                  }}
                                >-</Button>
                                <span className="font-black text-lg w-8 text-center text-slate-800">{numberOfPeople}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                                  onClick={() => {
                                    const newCount = Math.min(trip.availableSeats, numberOfPeople + 1);
                                    setNumberOfPeople(newCount);
                                    setPassengers(prev => {
                                      const newArr = [...prev];
                                      if (newCount > newArr.length) {
                                        newArr.push({ firstName: '', lastName: '', passportNumber: '' });
                                      }
                                      return newArr;
                                    });
                                  }}
                                >+</Button>
                              </div>
                            </h3>
                            
                            <div className="space-y-4">
                              {passengers.map((p, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                  <h4 className="font-bold text-slate-400 mb-4 text-xs uppercase tracking-wider">Voyageur {idx + 1}</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Nom</label>
                                      <Input 
                                        placeholder="Nom de famille" 
                                        className="h-11 bg-slate-50 border-slate-200 focus:bg-white"
                                        value={p.lastName} 
                                        onChange={e => {
                                          const newP = [...passengers];
                                          newP[idx].lastName = e.target.value;
                                          setPassengers(newP);
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Prénom</label>
                                      <Input 
                                        placeholder="Prénom" 
                                        className="h-11 bg-slate-50 border-slate-200 focus:bg-white"
                                        value={p.firstName} 
                                        onChange={e => {
                                          const newP = [...passengers];
                                          newP[idx].firstName = e.target.value;
                                          setPassengers(newP);
                                        }}
                                      />
                                    </div>
                                    <div className="md:col-span-2 lg:col-span-1">
                                      <label className="text-xs font-bold text-slate-700 block mb-1.5">N° de Passeport</label>
                                      <Input 
                                        placeholder="Optionnel" 
                                        className="h-11 bg-slate-50 border-slate-200 focus:bg-white"
                                        value={p.passportNumber} 
                                        onChange={e => {
                                          const newP = [...passengers];
                                          newP[idx].passportNumber = e.target.value;
                                          setPassengers(newP);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-8">
                            <label className="text-sm font-bold text-slate-700 block mb-2">Notes / Demandes spéciales (Optionnel)</label>
                            <Textarea className="min-h-[100px] bg-slate-50 border-slate-200 focus:bg-white leading-relaxed" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Régime alimentaire, type de lit, allergies..." />
                          </div>
`;
content = content.replace(oldPassengers, newPassengers);


// We need to clean up the old "+ / - Nombre de personnes" which we moved inside the Travelers section header
const oldPeopleCounter = /<div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">[\s\S]*?<\/div>[\s\S]*?<\/div>/;
content = content.replace(oldPeopleCounter, '');

// Update the billing section
const oldBilling = /<div className="mt-6 border-t border-slate-100 pt-6">[\s\S]*?Transmettre la Réservation[\s\S]*?<\/Button>[\s\S]*?<\/div>/;
const newBilling = `<div className="mt-8 pt-8 border-t border-slate-100">
                        <div className="bg-blue-900 p-6 rounded-2xl mb-6 shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 opacity-10">
                            <DollarSign className="w-32 h-32 text-white" />
                          </div>
                          <div className="relative z-10">
                            <div className="flex justify-between items-center text-blue-100 mb-2">
                              <span className="font-medium">Prix unitaire B2B</span>
                              <span className="font-bold">{trip.price.toLocaleString()} DZD</span>
                            </div>
                            <div className="flex justify-between items-center text-blue-100 mb-4">
                              <span className="font-medium">Nombre de voyageurs</span>
                              <span className="font-bold">x {numberOfPeople}</span>
                            </div>
                            <div className="border-t border-blue-700/50 pt-4 flex justify-between items-end">
                              <div>
                                <span className="text-blue-200 text-sm font-bold uppercase tracking-wider block mb-1">Total B2B (à payer)</span>
                                <span className="text-xs text-blue-300">Aucun débit immédiat</span>
                              </div>
                              <span className="font-black text-3xl text-white">{(trip.price * numberOfPeople).toLocaleString()} DZD</span>
                            </div>
                          </div>
                        </div>
                        <Button onClick={handleBook} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black h-14 rounded-xl text-lg shadow-emerald-500/20 shadow-lg transition-all hover:-translate-y-0.5">
                          Confirmer et transmettre la réservation
                        </Button>
                        <p className="text-xs text-slate-400 mt-4 text-center font-medium">Votre réservation sera étudiée par l'administrateur. Vous serez notifié du statut.</p>
                      </div>`;
content = content.replace(oldBilling, newBilling);


fs.writeFileSync('components/agency/OrganizedTrips.tsx', content);
