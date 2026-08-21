import { auth } from "../../src/firebase";
import React, { useState } from 'react';
import { useAppStore, OrganizedTrip } from '../../src/store/useAppStore';
import { MapPin, Calendar, DollarSign, Users, Search, Check, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';

export default function OrganizedTrips() {
  const { organizedTrips, addTripReservation } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<OrganizedTrip | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [notes, setNotes] = useState('');
  const [customFormData, setCustomFormData] = useState<Record<string, any>>({});
  const [passengers, setPassengers] = useState(Array.from({ length: 1 }, () => ({ firstName: '', lastName: '', passportNumber: '' })));

  const activeTrips = (organizedTrips || []).filter(t => t.status === 'active' || !t.status);
  const filteredTrips = activeTrips.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBook = async () => {
    if (selectedTrip && clientName && numberOfPeople > 0) {
      try {
        await addTripReservation({
        tripId: selectedTrip.id,
        agencyId: auth.currentUser?.uid || 'agency_1',
        agencyName: auth.currentUser?.email || 'Agency',
        clientName,
        clientEmail,
        clientPhone,
        numberOfPeople,
        notes,
        customFormData: { ...customFormData, passengers },
        passengerNames: passengers.map(p => p.firstName + ' ' + p.lastName)
        });
        setIsBookingOpen(false);
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setNumberOfPeople(1);
      setNotes('');
      setCustomFormData({});
        // Optionally show success toast here
        alert('Réservation effectuée avec succès !');
      } catch (err: any) {
        alert("Erreur : " + (err.message || "Solde insuffisant ou erreur serveur."));
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Voyages Organisés</h1>
          <p className="text-slate-500 mt-1">Découvrez et réservez des voyages de groupe exclusifs pour vos clients.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center">
        <Search className="w-5 h-5 text-slate-400 mr-3" />
        <Input 
          className="border-0 shadow-none focus-visible:ring-0 px-0 text-lg" 
          placeholder="Rechercher une destination ou un titre de voyage..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTrips.map(trip => (
          <div key={trip.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-56 relative overflow-hidden group">
              <img src={trip.photoUrl} alt={trip.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-white/90 text-slate-800 backdrop-blur-sm border-0 font-bold px-3 py-1 shadow-sm">
                  {trip.price.toLocaleString()} DZD <span className="text-xs font-normal text-slate-500 ml-1">/ pers</span>
                </Badge>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-12">
                <h3 className="text-white font-bold text-xl leading-tight mb-1">{trip.title}</h3>
                <p className="text-blue-100 text-sm flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {trip.destination}
                </p>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <Calendar className="w-5 h-5 text-blue-500 mb-1" />
                  <span className="text-xs text-slate-500 uppercase font-semibold">Départ</span>
                  <span className="text-sm font-bold text-slate-800">{new Date(trip.startDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <Users className="w-5 h-5 text-emerald-500 mb-1" />
                  <span className="text-xs text-slate-500 uppercase font-semibold">Places Rst.</span>
                  <span className="text-sm font-bold text-slate-800">{trip.availableSeats}</span>
                </div>
              </div>

              <div className="mb-6 flex-1">
                <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" /> Aperçu du programme
                </h4>
                <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                  {trip.description}
                </p>
              </div>

              
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
                                          reader.onload = (event) => setCustomFormData({...customFormData, [field.id]: (event.target?.result as string) || ""});
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
                                onClick={() => {
                                const newCount = Math.max(1, numberOfPeople - 1);
                                setNumberOfPeople(newCount);
                                setPassengers(prev => prev.slice(0, newCount));
                              }}
                              >-</Button>
                              <span className="font-bold text-lg w-8 text-center">{numberOfPeople}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-md hover:bg-slate-100"
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
                          </div>
                          
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

                          <div className="mt-4">
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

            </div>
          </div>
        ))}
      </div>

      {filteredTrips.length === 0 && (
        <div className="text-center py-20">
          <MapPin className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-700">Aucun voyage disponible</h2>
          <p className="text-slate-500 mt-2">Nous n'avons pas trouvé de voyage correspondant à votre recherche.</p>
        </div>
      )}
    </div>
  );
}
