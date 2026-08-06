const fs = require('fs');
let c = fs.readFileSync('components/agency/OrganizedTrips.tsx', 'utf8');

const newDialogUI = `
              <Dialog open={isBookingOpen && selectedTrip?.id === trip.id} onOpenChange={(open) => {
                if(open) setSelectedTrip(trip);
                setIsBookingOpen(open);
              }}>
                <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl text-md font-bold shadow-md shadow-blue-500/20"
                    disabled={trip.availableSeats <= 0}
                    onClick={() => { setSelectedTrip(trip); setIsBookingOpen(true); }}
                  >
                    {trip.availableSeats > 0 ? 'Voir & Réserver' : 'Complet'}
                  </Button>
                <DialogContent className="sm:max-w-[700px] bg-white p-0 overflow-hidden rounded-2xl">
                  <div className="h-48 relative">
                     <img src={trip.photoUrl} className="w-full h-full object-cover" alt="Cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                        <div>
                          <h2 className="text-white font-bold text-2xl mb-1">{trip.title}</h2>
                          <p className="text-blue-100 flex items-center gap-2"><MapPin className="w-4 h-4"/> {trip.destination}</p>
                        </div>
                     </div>
                     <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-bold text-slate-800 shadow-sm">
                       {trip.price.toLocaleString()} DZD <span className="text-sm font-normal text-slate-500">/ pers</span>
                     </div>
                  </div>
                  <ScrollArea className="max-h-[60vh]">
                    <div className="p-6">
                      
                      <div className="mb-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><Info className="w-5 h-5 text-blue-500"/> Détails du Programme</h3>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {trip.description}
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-6">
                        <h3 className="font-bold text-slate-800 mb-4 text-lg">Formulaire de réservation</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-1">Nom du client principal</label>
                            <Input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nom et Prénom" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-semibold text-slate-700 block mb-1">Email</label>
                              <Input value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="email@exemple.com" />
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-slate-700 block mb-1">Téléphone</label>
                              <Input value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="Numéro de téléphone" />
                            </div>
                          </div>
                          
                          {selectedTrip?.customFormFields && selectedTrip.customFormFields.length > 0 && (
                            <div className="border border-blue-100 bg-blue-50/50 p-4 rounded-xl space-y-4 my-4">
                              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                Informations requises par l'organisateur
                              </h4>
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
                                          reader.onload = (event) => setCustomFormData({...customFormData, [field.id]: event.target?.result});
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                      className="bg-white"
                                    />
                                  ) : (
                                    <Input 
                                      type={field.type} 
                                      value={customFormData[field.id] || ''} 
                                      onChange={e => setCustomFormData({...customFormData, [field.id]: e.target.value})} 
                                      placeholder={field.label} 
                                      className="bg-white"
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <label className="text-sm font-bold text-slate-800 block">Nombre de personnes</label>
                              <p className="text-xs text-slate-500">Places restantes: {trip.availableSeats}</p>
                            </div>
                            <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-slate-200">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-md hover:bg-slate-100"
                                onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                              >-</Button>
                              <span className="font-bold text-lg w-8 text-center">{numberOfPeople}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-md hover:bg-slate-100"
                                onClick={() => setNumberOfPeople(Math.min(trip.availableSeats, numberOfPeople + 1))}
                              >+</Button>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-1">Notes / Demandes spéciales</label>
                            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Régime alimentaire, etc..." />
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="text-center sm:text-left">
                            <p className="text-sm text-slate-500">Montant total estimé</p>
                            <p className="text-2xl font-bold text-blue-600">{(trip.price * numberOfPeople).toLocaleString()} DZD</p>
                          </div>
                          <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-xl font-bold w-full sm:w-auto" onClick={handleBook} disabled={!clientName}>
                            Confirmer la réservation
                          </Button>
                        </div>
                      </div>

                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
`;

c = c.replace(/<Dialog open=\{isBookingOpen[\s\S]*?<\/Dialog>/, newDialogUI);

fs.writeFileSync('components/agency/OrganizedTrips.tsx', c);
