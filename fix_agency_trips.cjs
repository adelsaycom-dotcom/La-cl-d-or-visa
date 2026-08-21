const fs = require('fs');

let content = fs.readFileSync('components/agency/OrganizedTrips.tsx', 'utf8');

// Replace the number of people buttons logic
const oldDecrease = `onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}`;
const newDecrease = `onClick={() => {
                                const newCount = Math.max(1, numberOfPeople - 1);
                                setNumberOfPeople(newCount);
                                setPassengers(prev => prev.slice(0, newCount));
                              }}`;
                              
const oldIncrease = `onClick={() => setNumberOfPeople(Math.min(trip.availableSeats, numberOfPeople + 1))}`;
const newIncrease = `onClick={() => {
                                const newCount = Math.min(trip.availableSeats, numberOfPeople + 1);
                                setNumberOfPeople(newCount);
                                setPassengers(prev => {
                                  const newArr = [...prev];
                                  if (newCount > newArr.length) {
                                    newArr.push({ firstName: '', lastName: '', passportNumber: '' });
                                  }
                                  return newArr;
                                });
                              }}`;
                              
content = content.replace(oldDecrease, newDecrease);
content = content.replace(oldIncrease, newIncrease);

// Inject passenger inputs
const passengerInputs = `
                          <div className="border-t border-slate-100 pt-6">
                            <h3 className="font-bold text-slate-800 mb-4 text-lg">Informations des Voyageurs</h3>
                            <div className="space-y-4">
                              {passengers.map((p, idx) => (
                                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                  <h4 className="font-bold text-slate-800 mb-3 text-sm">Passager {idx + 1}</h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Input 
                                      placeholder="Nom" 
                                      value={p.lastName} 
                                      onChange={e => {
                                        const newP = [...passengers];
                                        newP[idx].lastName = e.target.value;
                                        setPassengers(newP);
                                      }}
                                    />
                                    <Input 
                                      placeholder="Prénom" 
                                      value={p.firstName} 
                                      onChange={e => {
                                        const newP = [...passengers];
                                        newP[idx].firstName = e.target.value;
                                        setPassengers(newP);
                                      }}
                                    />
                                    <Input 
                                      className="sm:col-span-2"
                                      placeholder="N° de Passeport" 
                                      value={p.passportNumber} 
                                      onChange={e => {
                                        const newP = [...passengers];
                                        newP[idx].passportNumber = e.target.value;
                                        setPassengers(newP);
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
`;

content = content.replace(
  '<div>\n                            <label className="text-sm font-semibold text-slate-700 block mb-1">Notes / Demandes',
  passengerInputs + '\n                          <div className="mt-4">\n                            <label className="text-sm font-semibold text-slate-700 block mb-1">Notes / Demandes'
);

// Fix total payment info
content = content.replace(
  `<Button onClick={handleBook} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl text-lg mt-6">
                        Payer {(trip.price * numberOfPeople).toLocaleString()} DZD & Réserver
                      </Button>`,
  `<div className="mt-6 border-t border-slate-100 pt-6">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                          <div className="flex justify-between items-center text-sm mb-1">
                            <span className="text-blue-700">Prix unitaire B2B</span>
                            <span className="font-bold text-blue-900">{trip.price.toLocaleString()} DZD</span>
                          </div>
                          <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-blue-700">Personnes</span>
                            <span className="font-bold text-blue-900">x {numberOfPeople}</span>
                          </div>
                          <div className="border-t border-blue-200 pt-2 flex justify-between items-center">
                            <span className="text-blue-800 font-bold">Total B2B (à payer)</span>
                            <span className="font-black text-xl text-blue-900">{(trip.price * numberOfPeople).toLocaleString()} DZD</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 text-center">Aucun montant ne sera débité. Cette réservation sera transmise à l'administrateur pour confirmation.</p>
                        <Button onClick={handleBook} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl text-lg">
                          Transmettre la Réservation
                        </Button>
                      </div>`
);

fs.writeFileSync('components/agency/OrganizedTrips.tsx', content);
