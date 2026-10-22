import { auth } from "../../src/firebase";
import React, { useState } from 'react';
import { useAppStore, OrganizedTrip, TripReservation } from '../../src/store/useAppStore';
import { 
  MapPin, Calendar, DollarSign, Users, Search, Check, 
  Info, CheckCircle2, Clock, AlertCircle, ArrowRight, 
  FileText, ShieldCheck, Loader2, Sparkles, Copy, Printer,
  BookmarkCheck, Share2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { useLanguage } from "../../src/i18n/LanguageContext";

export default function OrganizedTrips() {
  const { language, t } = useLanguage();
  const isEn = language === "en";

  const { organizedTrips, tripReservations, addTripReservation, agencyBalance } = useAppStore();
  const currentAgencyId = auth.currentUser?.uid || 'agency_1';

  const [activeTab, setActiveTab] = useState<'catalog' | 'my-reservations'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<OrganizedTrip | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'confirmation' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [completedReservation, setCompletedReservation] = useState<TripReservation | null>(null);
  const [lastBookedId, setLastBookedId] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

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

  // Réservations de l'agence connectée
  const myReservations = (tripReservations || []).filter(r => 
    r.agencyId === currentAgencyId || r.agencyName === auth.currentUser?.email
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Nombre de places réservées par cette agence pour un voyage spécifique
  const getBookedSeatsForTrip = (tripId: string) => {
    return myReservations
      .filter(r => r.tripId === tripId && r.status !== 'cancelled')
      .reduce((sum, r) => sum + (r.numberOfPeople || 0), 0);
  };

  const handleOpenBooking = (trip: OrganizedTrip) => {
    setSelectedTrip(trip);
    setStep('form');
    setBookingError(null);
    setCompletedReservation(null);
    setCopiedRef(false);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setNumberOfPeople(1);
    setNotes('');
    setCustomFormData({});
    setPassengers(Array.from({ length: 1 }, () => ({ firstName: '', lastName: '', passportNumber: '' })));
    setIsBookingOpen(true);
  };

  const handleGoToConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    if (!clientName.trim()) {
      setBookingError(isEn ? "Please enter the primary contact name." : "Veuillez renseigner le nom du contact principal.");
      return;
    }
    setStep('confirmation');
  };

  const handleConfirmBooking = async () => {
    if (!selectedTrip || isSubmitting) return;

    setIsSubmitting(true);
    setBookingError(null);

    try {
      const created = await addTripReservation({
        tripId: selectedTrip.id,
        agencyId: currentAgencyId,
        agencyName: auth.currentUser?.email || 'Mon Agence B2B',
        clientName,
        clientEmail,
        clientPhone,
        numberOfPeople,
        notes,
        customFormData: { ...customFormData, passengers },
        passengerNames: passengers
          .map(p => `${p.firstName} ${p.lastName}`.trim())
          .filter(Boolean)
      });

      setCompletedReservation(created);
      setLastBookedId(created.id);
      setStep('success');
      
      setSuccessToast(
        isEn 
          ? `Booking confirmed successfully! Ref: ${created.id}` 
          : `Réservation effectuée avec succès ! Réf: ${created.id}`
      );
    } catch (err: any) {
      console.error("Erreur confirmation réservation:", err);
      setBookingError(err.message || (isEn ? "Failed to finalize booking. Please try again." : "Échec de l'enregistrement de la réservation. Veuillez réessayer."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = (refId: string) => {
    navigator.clipboard.writeText(refId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const handlePrintReceipt = (reservation: TripReservation, trip: OrganizedTrip | null) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reçu de Réservation - ${reservation.id}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 30px; color: #1e293b; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #7B1B38; padding-bottom: 15px; margin-bottom: 25px; }
          .brand { font-size: 24px; font-weight: 900; color: #7B1B38; }
          .badge { background: #dcfce7; color: #15803d; padding: 6px 12px; border-radius: 8px; font-weight: bold; font-size: 13px; display: inline-block; }
          .ref { font-family: monospace; font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 5px; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 13px; text-transform: uppercase; font-weight: bold; color: #64748b; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .item { font-size: 14px; }
          .label { color: #64748b; font-weight: 600; }
          .value { font-weight: bold; color: #0f172a; }
          .total { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center; }
          .total-label { font-size: 16px; font-weight: bold; color: #1e293b; }
          .total-amount { font-size: 22px; font-weight: 900; color: #7B1B38; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 15px; }
          @media print { body { margin: 15mm; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">VISA B2B PLATFORM</div>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Centrale de Réservation & Voyages Organisés</div>
          </div>
          <div style="text-align: right;">
            <div class="badge">RÉSERVATION CONFIRMÉE</div>
            <div class="ref">${reservation.id}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Détails du Voyage</div>
          <div class="grid">
            <div class="item"><span class="label">Circuit :</span> <span class="value">${trip?.title || 'Voyage Organisé'}</span></div>
            <div class="item"><span class="label">Destination :</span> <span class="value">${trip?.destination || 'N/A'}</span></div>
            <div class="item"><span class="label">Date de départ :</span> <span class="value">${trip?.startDate ? new Date(trip.startDate).toLocaleDateString() : 'N/A'}</span></div>
            <div class="item"><span class="label">Date d'enregistrement :</span> <span class="value">${new Date(reservation.createdAt).toLocaleString()}</span></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Informations Client & Voyageurs</div>
          <div class="grid">
            <div class="item"><span class="label">Contact Principal :</span> <span class="value">${reservation.clientName}</span></div>
            <div class="item"><span class="label">Téléphone :</span> <span class="value">${reservation.clientPhone || 'Non renseigné'}</span></div>
            <div class="item"><span class="label">Nombre de Places :</span> <span class="value">${reservation.numberOfPeople} personne(s)</span></div>
            <div class="item"><span class="label">Agence :</span> <span class="value">${reservation.agencyName}</span></div>
          </div>
          ${reservation.passengerNames && reservation.passengerNames.length > 0 ? `
            <div style="margin-top: 10px; font-size: 13px;">
              <span class="label">Passagers :</span> <span class="value">${reservation.passengerNames.join(', ')}</span>
            </div>
          ` : ''}
        </div>

        <div class="total">
          <div class="total-label">Montant Total de la Réservation :</div>
          <div class="total-amount">${reservation.totalPrice?.toLocaleString()} DZD</div>
        </div>

        <div class="footer">
          Document généré le ${new Date().toLocaleDateString()} • Reçu officiel de réservation B2B
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Toast de succès */}
      {successToast && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between gap-4 animate-in slide-in-from-top">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <span className="font-bold text-sm">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-100 hover:text-white text-xs font-bold underline">
            {isEn ? "Dismiss" : "Fermer"}
          </button>
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#7B1B38] rounded-full"></div>
            {isEn ? "Organized Trips & Group Tours" : "Voyages Organisés"}
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            {isEn 
              ? "Discover and reserve exclusive group departures with instant seat availability." 
              : "Découvrez et réservez des circuits de groupe exclusifs pour vos voyageurs."}
          </p>
        </div>

        {/* Sélecteur d'onglets */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 self-stretch sm:self-auto">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'catalog' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isEn ? "Departure Catalog" : "Catalogue des départs"}
          </button>
          <button
            onClick={() => setActiveTab('my-reservations')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'my-reservations' 
                ? 'bg-[#7B1B38] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{isEn ? "My Bookings" : "Mes Réservations"}</span>
            {myReservations.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'my-reservations' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
              }`}>
                {myReservations.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ONGLET 1 : CATALOGUE DES DÉPARTS */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center">
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <Input 
              className="border-0 shadow-none focus-visible:ring-0 px-0 text-base" 
              placeholder={isEn ? "Search destination, circuit or trip title..." : "Rechercher une destination ou un titre de voyage..."} 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map(trip => {
              const bookedSeats = getBookedSeatsForTrip(trip.id);

              return (
                <div key={trip.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:border-[#7B1B38]/30 hover:shadow-lg transition-all duration-300">
                  <div className="h-52 relative overflow-hidden group">
                    <img 
                      src={trip.photoUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80"} 
                      alt={trip.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    
                    {/* Badge Prix B2B */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/95 text-slate-900 backdrop-blur-md border-0 font-black px-3 py-1 shadow-sm text-xs">
                        {trip.price.toLocaleString()} DZD <span className="text-[10px] font-medium text-slate-500 ml-1">/{isEn ? "person" : "pers"}</span>
                      </Badge>
                    </div>

                    {/* Indicateur si l'agence a déjà réservé ce voyage */}
                    {bookedSeats > 0 && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-emerald-500 text-white border-0 font-black px-3 py-1 text-xs shadow-md flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {isEn ? `Booked (${bookedSeats} seats)` : `Réservé (${bookedSeats} places)`}
                        </Badge>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 pt-10">
                      <h3 className="text-white font-black text-lg leading-tight mb-0.5">{trip.title}</h3>
                      <p className="text-slate-200 text-xs flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#7B1B38]" /> {trip.destination}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-slate-50 rounded-xl p-2.5 flex flex-col items-center justify-center text-center border border-slate-100">
                        <Calendar className="w-4 h-4 text-[#7B1B38] mb-1" />
                        <span className="text-[10px] text-slate-400 uppercase font-bold">{isEn ? "Departure" : "Départ"}</span>
                        <span className="text-xs font-bold text-slate-800">{new Date(trip.startDate).toLocaleDateString(isEn ? 'en-US' : 'fr-FR')}</span>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2.5 flex flex-col items-center justify-center text-center border border-slate-100">
                        <Users className="w-4 h-4 text-emerald-600 mb-1" />
                        <span className="text-[10px] text-slate-400 uppercase font-bold">{isEn ? "Seats Left" : "Places Dispo"}</span>
                        <span className="text-xs font-black text-emerald-700">{trip.availableSeats}</span>
                      </div>
                    </div>

                    <div className="mb-5 flex-1">
                      <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed">
                        {trip.description}
                      </p>
                    </div>

                    <Button 
                      className={`w-full h-11 rounded-xl text-xs font-black shadow-sm ${
                        trip.availableSeats <= 0 
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                          : bookedSeats > 0
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : 'bg-[#7B1B38] hover:bg-[#63142c] text-white'
                      }`}
                      disabled={trip.availableSeats <= 0}
                      onClick={() => handleOpenBooking(trip)}
                    >
                      {trip.availableSeats > 0 
                        ? (bookedSeats > 0 
                            ? (isEn ? `Add Travelers (Already ${bookedSeats})` : `Ajouter des voyageurs (Déjà ${bookedSeats})`)
                            : (isEn ? 'Book for Traveler' : 'Réserver pour un voyageur'))
                        : (isEn ? 'Fully Booked' : 'Complet')}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTrips.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">{isEn ? "No trips found" : "Aucun voyage disponible"}</h3>
              <p className="text-xs text-slate-500 mt-1">{isEn ? "No tour matching your search." : "Aucun voyage ne correspond à votre recherche."}</p>
            </div>
          )}
        </div>
      )}

      {/* ONGLET 2 : MES RÉSERVATIONS */}
      {activeTab === 'my-reservations' && (
        <div className="space-y-6">

          {/* Bannière d'alerte positive si une réservation vient d'être faite */}
          {lastBookedId && (
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-emerald-950">
                    {isEn ? "Booking confirmed with success!" : "Réservation effectuée avec succès !"}
                  </h4>
                  <p className="text-xs text-emerald-800 font-medium">
                    {isEn ? "Your reservation reference" : "Votre réservation"} <span className="font-mono font-black bg-white px-2 py-0.5 rounded-lg border border-emerald-300 text-slate-900">{lastBookedId}</span> {isEn ? "is registered and active below." : "est bien enregistrée et active ci-dessous."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setLastBookedId(null)}
                  className="text-xs font-bold text-emerald-800 hover:bg-emerald-100 rounded-xl"
                >
                  {isEn ? "Dismiss" : "Masquer"}
                </Button>
              </div>
            </div>
          )}

          {myReservations.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">{isEn ? "No bookings yet" : "Aucune réservation effectuée"}</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                {isEn ? "Browse the departure catalog to book group trips for your travelers." : "Consultez le catalogue des départs pour enregistrer des réservations pour vos clients."}
              </p>
              <Button onClick={() => setActiveTab('catalog')} className="bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-xs h-10 px-6 rounded-xl">
                {isEn ? "Explore Departure Catalog" : "Parcourir le catalogue"}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myReservations.map(res => {
                const trip = (organizedTrips || []).find(t => t.id === res.tripId);
                const isRecentlyBooked = res.id === lastBookedId;

                return (
                  <div 
                    key={res.id} 
                    className={`bg-white rounded-3xl border p-6 shadow-sm transition-all flex flex-col justify-between ${
                      isRecentlyBooked 
                        ? 'border-2 border-emerald-500 shadow-md ring-4 ring-emerald-50' 
                        : 'border-slate-200 hover:border-[#7B1B38]/30'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">Réf: {res.id}</span>
                          {isRecentlyBooked && (
                            <Badge className="bg-emerald-500 text-white border-0 font-bold text-[10px] animate-pulse">
                              {isEn ? "New" : "Nouvelle Réservation"}
                            </Badge>
                          )}
                        </div>
                        <Badge className={
                          res.status === 'confirmed' 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold text-xs' 
                            : res.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800 border-rose-200 font-bold text-xs'
                            : 'bg-amber-100 text-amber-800 border-amber-200 font-bold text-xs'
                        }>
                          {res.status === 'confirmed' 
                            ? (isEn ? "Confirmed" : "Confirmée") 
                            : res.status === 'cancelled'
                            ? (isEn ? "Cancelled" : "Annulée")
                            : (isEn ? "Pending Admin Approval" : "En attente de confirmation")}
                        </Badge>
                      </div>

                      <h3 className="text-base font-black text-slate-900 mb-1">
                        {trip ? trip.title : (isEn ? "Organized Tour" : "Circuit Organisé")}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mb-4 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#7B1B38]" /> {trip?.destination || "Destination internationale"}
                        {trip?.startDate && (
                          <span className="text-slate-400">• Départ : {new Date(trip.startDate).toLocaleDateString()}</span>
                        )}
                      </p>

                      <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-2 mb-4 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">{isEn ? "Lead Traveler" : "Contact / Responsable"} :</span>
                          <span className="font-bold text-slate-800">{res.clientName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">{isEn ? "Travelers Count" : "Nombre de personnes"} :</span>
                          <span className="font-black text-[#7B1B38] font-mono">{res.numberOfPeople} pers.</span>
                        </div>
                        {res.passengerNames && res.passengerNames.length > 0 && (
                          <div className="pt-2 border-t border-slate-200/60">
                            <span className="text-slate-500 font-medium block mb-1">{isEn ? "Travelers list:" : "Liste des voyageurs :"}</span>
                            <div className="flex flex-wrap gap-1">
                              {res.passengerNames.map((pName, pIdx) => (
                                <span key={pIdx} className="bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700">
                                  {pName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePrintReceipt(res, trip || null)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 gap-1.5 h-8 px-2.5 rounded-xl hover:bg-slate-100"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{isEn ? "Print Voucher" : "Imprimer le reçu"}</span>
                      </Button>
                      <span className="font-black text-[#7B1B38] text-sm font-mono">
                        {res.totalPrice?.toLocaleString()} DZD
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* DIALOG DE RÉSERVATION AVEC CONFIRMATION ANTI MULTI-CLICS */}
      <Dialog open={isBookingOpen} onOpenChange={(open) => {
        if (!isSubmitting) {
          setIsBookingOpen(open);
        }
      }}>
        <DialogContent className="w-[95vw] max-w-xl sm:!max-w-2xl max-h-[92vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6 sm:rounded-3xl bg-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900">
              {step === 'form' 
                ? (isEn ? "Book Group Trip" : "Réserver ce voyage organisé")
                : step === 'confirmation'
                ? (isEn ? "Confirm Your Booking" : "Vérification de la réservation")
                : (isEn ? "Booking Successful!" : "Réservation Confirmée avec Succès !")}
            </DialogTitle>
          </DialogHeader>

          {selectedTrip && (
            <div className="mt-4 space-y-6 w-full min-w-0">
              
              {/* Message d'erreur visible si problème */}
              {bookingError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                  <div className="text-xs">
                    <strong className="block font-bold">{isEn ? "Booking Error" : "Erreur lors de la réservation"}</strong>
                    <span>{bookingError}</span>
                  </div>
                </div>
              )}

              {/* Récapitulatif du voyage masqué uniquement si succès complet pour laisser la place au reçu */}
              {step !== 'success' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4 w-full min-w-0">
                  <div className="min-w-0 overflow-hidden">
                    <h4 className="font-black text-slate-900 text-sm truncate">{selectedTrip.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#7B1B38] shrink-0" /> {selectedTrip.destination} • Départ : {new Date(selectedTrip.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">{isEn ? "Rate / Person" : "Tarif / pers"}</span>
                    <span className="font-black text-[#7B1B38] text-sm font-mono">{selectedTrip.price.toLocaleString()} DZD</span>
                  </div>
                </div>
              )}

              {/* ÉTAPE 1 : FORMULAIRE VOYAGEURS */}
              {step === 'form' ? (
                <form onSubmit={handleGoToConfirmation} className="space-y-5 w-full min-w-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        {isEn ? "Lead Client Full Name *" : "Nom & Prénom du Contact Principal *"}
                      </label>
                      <Input 
                        required 
                        value={clientName} 
                        onChange={e => setClientName(e.target.value)} 
                        placeholder="Ex: BENALI Karim" 
                        className="h-11 rounded-xl text-xs bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        {isEn ? "Contact Phone Number" : "Numéro de Téléphone"}
                      </label>
                      <Input 
                        value={clientPhone} 
                        onChange={e => setClientPhone(e.target.value)} 
                        placeholder="Ex: 0550 12 34 56" 
                        className="h-11 rounded-xl text-xs bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {isEn ? "Number of Travelers (Seats) *" : "Nombre de Places / Voyageurs *"}
                    </label>
                    <Input 
                      type="number" 
                      min={1} 
                      max={selectedTrip.availableSeats}
                      value={numberOfPeople} 
                      onChange={e => {
                        const val = Math.max(1, Math.min(selectedTrip.availableSeats, parseInt(e.target.value) || 1));
                        setNumberOfPeople(val);
                        setPassengers(Array.from({ length: val }, (_, i) => passengers[i] || { firstName: '', lastName: '', passportNumber: '' }));
                      }} 
                      className="h-11 rounded-xl text-xs bg-slate-50 font-bold"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      {selectedTrip.availableSeats} {isEn ? "seats currently available on this departure." : "places disponibles actuellement sur ce circuit."}
                    </span>
                  </div>

                  {/* Détail nominatif des voyageurs */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      {isEn ? `Details for ${numberOfPeople} traveler(s)` : `Identité des ${numberOfPeople} voyageur(s)`}
                    </span>

                    {passengers.map((p, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <Input 
                          placeholder={`Prénom voyageur ${idx + 1}`}
                          value={p.firstName}
                          onChange={e => {
                            const newP = [...passengers];
                            newP[idx].firstName = e.target.value;
                            setPassengers(newP);
                          }}
                          className="h-9 text-xs bg-white"
                        />
                        <Input 
                          placeholder={`Nom voyageur ${idx + 1}`}
                          value={p.lastName}
                          onChange={e => {
                            const newP = [...passengers];
                            newP[idx].lastName = e.target.value;
                            setPassengers(newP);
                          }}
                          className="h-9 text-xs bg-white"
                        />
                        <Input 
                          placeholder="N° Passeport (optionnel)"
                          value={p.passportNumber}
                          onChange={e => {
                            const newP = [...passengers];
                            newP[idx].passportNumber = e.target.value;
                            setPassengers(newP);
                          }}
                          className="h-9 text-xs bg-white"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {isEn ? "Special Requests / Notes" : "Précisions ou demandes particulières (Optionnel)"}
                    </label>
                    <Textarea 
                      value={notes} 
                      onChange={e => setNotes(e.target.value)} 
                      placeholder={isEn ? "Bed preferences, dietary requirements, etc." : "Ex: Chambre lits jumeaux, végétarien..."}
                      className="min-h-[80px] rounded-xl text-xs bg-slate-50"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center gap-4">
                    <div>
                      <span className="text-[11px] text-slate-400 block">{isEn ? "Estimated Total" : "Montant total estimé"}</span>
                      <span className="font-black text-xl text-[#7B1B38] font-mono">
                        {(selectedTrip.price * numberOfPeople).toLocaleString()} DZD
                      </span>
                    </div>

                    <Button 
                      type="submit"
                      className="bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-xs h-11 px-6 rounded-xl gap-2 shadow-md shadow-[#7B1B38]/20 shrink-0"
                    >
                      {isEn ? "Review Booking Summary" : "Vérifier et Valider"} <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              ) : step === 'confirmation' ? (
                /* ÉTAPE 2 : ÉCRAN DE CONFIRMATION FORMELLE ANTI-DOUBLON */
                <div className="space-y-6 animate-in fade-in w-full min-w-0">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-900 leading-relaxed">
                      <strong>{isEn ? "Confirmation step:" : "Étape de confirmation :"}</strong> {isEn 
                        ? "Please review the summary below before confirming. This will reserve the requested seats."
                        : "Veuillez vérifier les informations ci-dessous. Dès validation, ces places seront réservées auprès de l'organisateur."}
                    </div>
                  </div>

                  {/* Récapitulatif clair sans overflow */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs w-full min-w-0 overflow-hidden">
                    <div className="flex justify-between items-center py-2 border-b border-slate-200/80 gap-3 min-w-0">
                      <span className="text-slate-500 shrink-0">{isEn ? "Circuit / Departure" : "Circuit / Voyage"} :</span>
                      <span className="font-bold text-slate-900 text-right truncate">{selectedTrip.title}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-200/80 gap-3 min-w-0">
                      <span className="text-slate-500 shrink-0">{isEn ? "Departure Date" : "Date de départ"} :</span>
                      <span className="font-bold text-slate-800 text-right">{new Date(selectedTrip.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-200/80 gap-3 min-w-0">
                      <span className="text-slate-500 shrink-0">{isEn ? "Main Contact" : "Contact client"} :</span>
                      <span className="font-bold text-slate-800 text-right truncate">{clientName} {clientPhone ? `(${clientPhone})` : ''}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-200/80 gap-3 min-w-0">
                      <span className="text-slate-500 shrink-0">{isEn ? "Reserved Seats" : "Places réservées"} :</span>
                      <span className="font-black text-[#7B1B38] font-mono text-sm">{numberOfPeople} voyageur(s)</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 gap-3 min-w-0">
                      <span className="text-slate-700 font-bold text-sm shrink-0">{isEn ? "Total Amount to Charge" : "Montant total de la réservation"} :</span>
                      <span className="font-black text-2xl text-[#7B1B38] font-mono text-right">
                        {(selectedTrip.price * numberOfPeople).toLocaleString()} DZD
                      </span>
                    </div>
                  </div>

                  {/* Boutons d'action adaptés mobile et desktop */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
                    <Button 
                      type="button" 
                      variant="outline" 
                      disabled={isSubmitting}
                      onClick={() => {
                        setBookingError(null);
                        setStep('form');
                      }}
                      className="flex-1 h-12 rounded-xl text-xs font-bold border-slate-300"
                    >
                      {isEn ? "Edit Information" : "Modifier mes informations"}
                    </Button>
                    <Button 
                      type="button" 
                      disabled={isSubmitting}
                      onClick={handleConfirmBooking}
                      className="flex-1 h-12 rounded-xl text-xs font-black bg-[#7B1B38] hover:bg-[#63142c] text-white shadow-lg shadow-[#7B1B38]/30 gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{isEn ? "Registering..." : "Enregistrement en cours..."}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isEn ? "Confirm & Finalize Booking" : "Confirmer définitivement"}</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                /* ÉTAPE 3 : ÉCRAN OFFICIEL DE SUCCÈS CLAIR ET PRÉCIS */
                <div className="space-y-6 animate-in zoom-in-95 duration-300">
                  <div className="text-center py-3 space-y-2">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      {isEn ? "Reservation Confirmed Successfully!" : "Réservation Effectuée avec Succès !"}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
                      {isEn 
                        ? "Your seats are secured and recorded in the system. An official confirmation voucher has been issued."
                        : "Vos places sont réservées et bloquées avec succès. Le dossier a été transmis et votre bon de réservation est disponible."}
                    </p>
                  </div>

                  {/* Référence officielle du dossier */}
                  <div className="bg-emerald-50/80 border-2 border-emerald-400 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                    <div>
                      <span className="text-[10px] uppercase font-black text-emerald-800 tracking-wider block">
                        {isEn ? "Official Booking Reference" : "Référence Officielle du Dossier"}
                      </span>
                      <span className="font-mono font-black text-lg text-slate-900">
                        {completedReservation?.id || 'RES-CONFIRMED'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleCopyRef(completedReservation?.id || '')}
                        className="h-9 px-3 rounded-xl text-xs font-bold bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-100 gap-1.5"
                      >
                        {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedRef ? (isEn ? "Copied!" : "Copié !") : (isEn ? "Copy Ref" : "Copier la réf")}</span>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handlePrintReceipt(completedReservation!, selectedTrip)}
                        className="h-9 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{isEn ? "Print Voucher" : "Imprimer le reçu"}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Synthèse du reçu */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-200/80">
                      <span className="text-slate-500">{isEn ? "Trip / Circuit" : "Voyage / Circuit"} :</span>
                      <span className="font-bold text-slate-900">{selectedTrip.title}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-200/80">
                      <span className="text-slate-500">{isEn ? "Destination & Departure" : "Destination & Départ"} :</span>
                      <span className="font-bold text-slate-800">{selectedTrip.destination} • {new Date(selectedTrip.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-200/80">
                      <span className="text-slate-500">{isEn ? "Lead Traveler" : "Responsable Client"} :</span>
                      <span className="font-bold text-slate-800">{clientName} {clientPhone ? `(${clientPhone})` : ''}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-200/80">
                      <span className="text-slate-500">{isEn ? "Reserved Seats" : "Places réservées"} :</span>
                      <span className="font-black text-emerald-700 font-mono text-sm">{numberOfPeople} personne(s)</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-slate-700 font-bold text-sm">{isEn ? "Total Price" : "Montant Total"} :</span>
                      <span className="font-black text-2xl text-[#7B1B38] font-mono">
                        {((completedReservation?.totalPrice) || (selectedTrip.price * numberOfPeople)).toLocaleString()} DZD
                      </span>
                    </div>
                  </div>

                  {/* Boutons de redirection après succès */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button 
                      type="button" 
                      onClick={() => {
                        setIsBookingOpen(false);
                        setActiveTab('my-reservations');
                      }}
                      className="flex-1 h-12 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 gap-2"
                    >
                      <BookmarkCheck className="w-4 h-4" />
                      <span>{isEn ? "View in My Bookings" : "Accéder à Mes Réservations"}</span>
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setStep('form');
                        setCompletedReservation(null);
                        setClientName('');
                        setClientEmail('');
                        setClientPhone('');
                        setNumberOfPeople(1);
                        setNotes('');
                        setPassengers(Array.from({ length: 1 }, () => ({ firstName: '', lastName: '', passportNumber: '' })));
                      }}
                      className="h-12 rounded-xl text-xs font-bold border-slate-300"
                    >
                      {isEn ? "New Booking" : "Réserver un autre client"}
                    </Button>
                  </div>
                </div>
              )}

            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
