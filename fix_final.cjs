const fs = require('fs');
let content = fs.readFileSync('components/agency/OrganizedTrips.tsx', 'utf8');

const regex = /<div className="border-t border-slate-100 pt-6">[\s\S]*?<div className="mt-8">[\s\S]*?<\/div>\s*<\/div>/;

const newSection = `
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

content = content.replace(regex, newSection);

// Also remove that stray `</div>` at line 225
content = content.replace('                          )}\n\n                          </div>\n                          \n                          <div className="border-t border-slate-100 pt-8 mt-8">', '                          )}\n                          \n                          <div className="border-t border-slate-100 pt-8 mt-8">');

fs.writeFileSync('components/agency/OrganizedTrips.tsx', content);
