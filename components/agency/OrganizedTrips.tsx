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
                <DialogContent className="w-[95vw] sm:max-w-3xl md:max-w-4xl bg-white p-0 max-h-[95vh] overflow-hidden rounded-2xl flex flex-col">
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
                  <div className="flex-1 overflow-y-auto min-h-0">
                    <div className="p-4 sm:p-6 md:p-8">
                      
                      <div className="mb-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><Info className="w-5 h-5 text-blue-500"/> Détails du Programme</h3>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {trip.description}
                        </div>
                      </div>

                      
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

                          
                          </div>
                          
                          
                          <div className="border-t border-slate-100 pt-8 mt-8">
                            <h3 className="font-black text-slate-800 mb-6 text-xl tracking-tight flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

                        
                        <div className="mt-8 pt-8 border-t border-slate-100">
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
                          <Button onClick={handleBook} disabled={!clientName} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black h-14 rounded-xl text-lg shadow-emerald-500/20 shadow-lg transition-all hover:-translate-y-0.5 whitespace-normal leading-tight">
                            Confirmer la réservation
                          </Button>
                          <p className="text-xs text-slate-400 mt-4 text-center font-medium">Votre réservation sera étudiée par l'administrateur. Vous serez notifié du statut.</p>
                        </div>
                  </div>
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
