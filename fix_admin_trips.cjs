const fs = require('fs');

let content = fs.readFileSync('components/admin/OrganizedTripsManagement.tsx', 'utf8');

const replacement = `
          <ScrollArea className="h-[70vh]">
            <div className="space-y-6 pr-4">
              {selectedTrip && (
                <>
                  {(() => {
                    const reservations = getTripReservations(selectedTrip.id).filter(r => r.status !== 'cancelled');
                    const expectedTotal = reservations.reduce((acc, r) => acc + r.totalPrice, 0);
                    const paidTotal = reservations.reduce((acc, r) => acc + (r.paidAmount || 0), 0);
                    const balance = expectedTotal - paidTotal;
                    
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Attendu</p>
                          <p className="text-2xl font-black text-blue-900 mt-1">{expectedTotal.toLocaleString()} DZD</p>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Total Encaissé</p>
                          <p className="text-2xl font-black text-emerald-900 mt-1">{paidTotal.toLocaleString()} DZD</p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Reste à percevoir</p>
                          <p className="text-2xl font-black text-amber-900 mt-1">{balance.toLocaleString()} DZD</p>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}

              {selectedTrip && getTripReservations(selectedTrip.id).length > 0 ? (
                getTripReservations(selectedTrip.id).map(res => (
                  <div key={res.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-slate-800 text-lg">{res.clientName}</span>
                        <span className="text-sm font-medium text-slate-500">({res.agencyName || 'Agence'})</span>
                        <Badge className={
                          res.status === 'confirmed' ? 'bg-green-500' : 
                          res.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'
                        }>
                          {res.status === 'confirmed' ? 'Confirmée' : res.status === 'cancelled' ? 'Annulée' : 'En attente'}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-slate-600 space-y-2">
                        <p><span className="font-medium text-slate-700">Contact:</span> {res.clientEmail} | {res.clientPhone}</p>
                        <p><span className="font-medium text-slate-700">Personnes:</span> {res.numberOfPeople}</p>
                        {res.notes && <p><span className="font-medium text-amber-600">Notes:</span> {res.notes}</p>}
                        
                        {/* Custom Form Data (e.g. passengers info) */}
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
                                  <div key={fieldId} className="flex flex-col gap-1">
                                    <span className="font-medium text-slate-500">{label} :</span>
                                    {isFile ? (
                                      <a href={val as string} download={label + "_document"} className="text-blue-500 hover:underline flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Télécharger / Voir</a>
                                    ) : (
                                      <span className="text-slate-800 font-semibold">{val as string}</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        <p className="text-xs text-slate-400 mt-2">Effectuée le {new Date(res.createdAt).toLocaleString('fr-FR')}</p>
                      </div>

                    </div>
                    
                    <div className="w-full md:w-64 flex flex-col gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Total à payer</p>
                        <p className="text-xl font-bold text-slate-900">{res.totalPrice.toLocaleString()} DZD</p>
                      </div>
                      
                      <div className="pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-500 font-medium mb-1">Déjà payé</p>
                        <p className="text-lg font-bold text-emerald-600">{(res.paidAmount || 0).toLocaleString()} DZD</p>
                      </div>
                      
                      {res.status !== 'cancelled' && res.totalPrice > (res.paidAmount || 0) && (
                        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                           <p className="text-xs text-slate-500 font-medium mb-1">Ajouter un paiement</p>
                           <div className="flex gap-2">
                             <Input 
                               type="number" 
                               placeholder="Montant" 
                               className="h-8 text-sm"
                               id={\`pay-\${res.id}\`}
                             />
                             <Button 
                               size="sm" 
                               className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                               onClick={(e) => {
                                 const input = document.getElementById(\`pay-\${res.id}\`) as HTMLInputElement;
                                 const amount = Number(input.value);
                                 if (amount > 0) {
                                   updateTripReservationPayment(res.id, amount);
                                   input.value = '';
                                 }
                               }}
                             >
                               Ajouter
                             </Button>
                           </div>
                        </div>
                      )}
                      
                      <div className="pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-500 font-medium mb-1">Statut Réservation</p>
                        <Select value={res.status} onValueChange={(val: any) => updateTripReservationStatus(res.id, val)}>
                          <SelectTrigger className="w-full h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="confirmed">Confirmée</SelectItem>
                            <SelectItem value="cancelled">Annulée</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  Aucune réservation pour ce voyage pour le moment.
                </div>
              )}
            </div>
          </ScrollArea>
`;

const startIndex = content.indexOf('<ScrollArea className="h-[60vh]">');
const endIndex = content.indexOf('</ScrollArea>', startIndex) + '</ScrollArea>'.length;

content = content.slice(0, startIndex) + replacement + content.slice(endIndex);

fs.writeFileSync('components/admin/OrganizedTripsManagement.tsx', content);
