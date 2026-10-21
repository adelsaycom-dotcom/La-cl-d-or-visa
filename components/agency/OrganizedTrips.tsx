import { auth } from "../../src/firebase";
import React, { useState } from 'react';
import { useAppStore, OrganizedTrip } from '../../src/store/useAppStore';
import { MapPin, Calendar, DollarSign, Users, Search, Check, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { useLanguage } from "../../src/i18n/LanguageContext";

export default function OrganizedTrips() {
  const { language, t } = useLanguage();
  const isEn = language === "en";

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
        alert(isEn ? 'Booking registered successfully!' : 'Réservation effectuée avec succès !');
      } catch (err: any) {
        alert((isEn ? "Error: " : "Erreur : ") + (err.message || (isEn ? "Server error or insufficient balance." : "Solde insuffisant ou erreur serveur.")));
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {isEn ? "Organized Trips & Group Tours" : "Voyages Organisés"}
          </h1>
          <p className="text-slate-500 mt-1">
            {isEn ? "Discover and book exclusive group departures and packages for your travelers." : "Découvrez et réservez des voyages de groupe exclusifs pour vos clients."}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center">
        <Search className="w-5 h-5 text-slate-400 mr-3" />
        <Input 
          className="border-0 shadow-none focus-visible:ring-0 px-0 text-lg" 
          placeholder={isEn ? "Search destination, city or trip title..." : "Rechercher une destination ou un titre de voyage..."} 
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
                  {trip.price.toLocaleString()} DZD <span className="text-xs font-normal text-slate-500 ml-1">/{isEn ? "person" : "pers"}</span>
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
                  <span className="text-xs text-slate-500 uppercase font-semibold">{isEn ? "Departure" : "Départ"}</span>
                  <span className="text-sm font-bold text-slate-800">{new Date(trip.startDate).toLocaleDateString(isEn ? 'en-US' : 'fr-FR')}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <Users className="w-5 h-5 text-emerald-500 mb-1" />
                  <span className="text-xs text-slate-500 uppercase font-semibold">{isEn ? "Seats Left" : "Places Rst."}</span>
                  <span className="text-sm font-bold text-slate-800">{trip.availableSeats}</span>
                </div>
              </div>

              <div className="mb-6 flex-1">
                <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" /> {isEn ? "Program Overview" : "Aperçu du programme"}
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
                    className="w-full bg-[#7B1B38] hover:bg-[#63142c] h-12 rounded-xl text-md font-bold shadow-md shadow-[#7B1B38]/20"
                    disabled={trip.availableSeats <= 0}
                    onClick={() => { setSelectedTrip(trip); setIsBookingOpen(true); }}
                  >
                    {trip.availableSeats > 0 ? (isEn ? 'View & Book' : 'Voir & Réserver') : (isEn ? 'Fully Booked' : 'Complet')}
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
                       {trip.price.toLocaleString()} DZD <span className="text-sm font-normal text-slate-500">/{isEn ? "person" : "pers"}</span>
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto min-h-0">
                    <div className="p-4 sm:p-6 md:p-8">
                      
                      <div className="mb-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><Info className="w-5 h-5 text-blue-500"/> {isEn ? "Itinerary & Details" : "Détails du Programme"}</h3>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {trip.description}
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-8 mt-8">
                        <h3 className="font-black text-slate-800 mb-6 text-xl tracking-tight">
                          {isEn ? "Agency / Client Contact" : "Vos Coordonnées"}
                        </h3>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="md:col-span-2">
                            <label className="text-sm font-bold text-slate-700 block mb-2">
                              {isEn ? "Lead Traveler Name (or Agency Contact)" : "Nom du client principal (ou Agence)"}
                            </label>
                            <Input className="h-12 bg-white border-slate-200" value={clientName} onChange={e => setClientName(e.target.value)} placeholder={isEn ? "Full Name" : "Nom et Prénom"} />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-slate-700 block mb-2">{isEn ? "Contact Email" : "Email de contact"}</label>
                            <Input className="h-12 bg-white border-slate-200" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="email@exemple.com" />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-slate-700 block mb-2">{isEn ? "Phone Number" : "Téléphone"}</label>
                            <Input className="h-12 bg-white border-slate-200" value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="05 XX XX XX XX" />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-8 mt-8">
                        <h3 className="font-black text-slate-800 mb-6 text-xl tracking-tight flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          {isEn ? "Passengers Information" : "Informations des Voyageurs"}
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
                              <div className="absolute top-0 left-0 w-1 h-full bg-[#7B1B38]"></div>
                              <h4 className="font-bold text-slate-400 mb-4 text-xs uppercase tracking-wider">
                                {isEn ? `Traveler ${idx + 1}` : `Voyageur ${idx + 1}`}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                  <label className="text-xs font-bold text-slate-700 block mb-1.5">{isEn ? "Last Name" : "Nom"}</label>
                                  <Input 
                                    placeholder={isEn ? "Family Name" : "Nom de famille"} 
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
                                  <label className="text-xs font-bold text-slate-700 block mb-1.5">{isEn ? "First Name" : "Prénom"}</label>
                                  <Input 
                                    placeholder={isEn ? "First Name" : "Prénom"} 
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
                                  <label className="text-xs font-bold text-slate-700 block mb-1.5">{isEn ? "Passport Number" : "N° de Passeport"}</label>
                                  <Input 
                                    placeholder={isEn ? "Optional" : "Optionnel"} 
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
                        <label className="text-sm font-bold text-slate-700 block mb-2">{isEn ? "Special Requests / Notes (Optional)" : "Notes / Demandes spéciales (Optionnel)"}</label>
                        <Textarea className="min-h-[100px] bg-slate-50 border-slate-200 focus:bg-white leading-relaxed" value={notes} onChange={e => setNotes(e.target.value)} placeholder={isEn ? "Dietary requirements, bed preferences, allergies..." : "Régime alimentaire, type de lit, allergies..."} />
                      </div>

                      <div className="mt-8 pt-8 border-t border-slate-100">
                        <div className="bg-slate-900 p-6 rounded-2xl mb-6 shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 opacity-10">
                            <DollarSign className="w-32 h-32 text-white" />
                          </div>
                          <div className="relative z-10">
                            <div className="flex justify-between items-center text-slate-300 mb-2">
                              <span className="font-medium">{isEn ? "Unit B2B Rate" : "Prix unitaire B2B"}</span>
                              <span className="font-bold">{trip.price.toLocaleString()} DZD</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-300 mb-4">
                              <span className="font-medium">{isEn ? "Number of Travelers" : "Nombre de voyageurs"}</span>
                              <span className="font-bold">x {numberOfPeople}</span>
                            </div>
                            <div className="border-t border-slate-800 pt-4 flex justify-between items-end">
                              <div>
                                <span className="text-rose-200 text-sm font-bold uppercase tracking-wider block mb-1">{isEn ? "Total B2B (Payable)" : "Total B2B (à payer)"}</span>
                                <span className="text-xs text-slate-400">{isEn ? "No immediate deduction" : "Aucun débit immédiat"}</span>
                              </div>
                              <span className="font-black text-3xl text-white">{(trip.price * numberOfPeople).toLocaleString()} DZD</span>
                            </div>
                          </div>
                        </div>
                        <Button onClick={handleBook} disabled={!clientName} className="w-full bg-[#7B1B38] hover:bg-[#63142c] text-white font-black h-14 rounded-xl text-lg shadow-[#7B1B38]/25 shadow-lg transition-all hover:-translate-y-0.5 whitespace-normal leading-tight">
                          {isEn ? "Confirm Group Reservation" : "Confirmer la réservation"}
                        </Button>
                        <p className="text-xs text-slate-400 mt-4 text-center font-medium">
                          {isEn ? "Your reservation will be reviewed by administration. You will be notified instantly." : "Votre réservation sera étudiée par l'administrateur. Vous serez notifié du statut."}
                        </p>
                      </div>
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
          <h2 className="text-xl font-bold text-slate-700">{isEn ? "No trips available" : "Aucun voyage disponible"}</h2>
          <p className="text-slate-500 mt-2">{isEn ? "No tour matching your search was found." : "Nous n'avons pas trouvé de voyage correspondant à votre recherche."}</p>
        </div>
      )}
    </div>
  );
}
