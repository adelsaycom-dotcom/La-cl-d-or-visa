import React, { useState } from 'react';
import { useAppStore, OrganizedTrip, TripReservation } from '../../src/store/useAppStore';
import { Plus, Edit, Trash2, Users, MapPin, Calendar, DollarSign, Search, Image as ImageIcon, ChevronRight, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

export default function OrganizedTripsManagement() {
  const { organizedTrips, tripReservations, addOrganizedTrip, updateOrganizedTrip, deleteOrganizedTrip, updateTripReservationStatus, updateTripReservationPayment } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<OrganizedTrip | null>(null);
  const [isReservationsOpen, setIsReservationsOpen] = useState(false);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);

  const [newTrip, setNewTrip] = useState<Partial<OrganizedTrip>>({
    title: '', destination: '', description: '', photoUrl: '', totalSeats: 0, price: 0, startDate: '', endDate: '', status: 'active', customFormFields: []
  });

  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setNewTrip(prev => ({ ...prev, photoUrl: dataUrl }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTrip = () => {
    if (newTrip.title && newTrip.destination && newTrip.totalSeats && newTrip.price && newTrip.startDate && newTrip.endDate) {
      const tripData = {
        title: newTrip.title,
        destination: newTrip.destination,
        description: newTrip.description || '',
        photoUrl: newTrip.photoUrl || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80',
        totalSeats: Number(newTrip.totalSeats),
        price: Number(newTrip.price),
        startDate: newTrip.startDate,
        endDate: newTrip.endDate,
        status: newTrip.status as OrganizedTrip['status'],
        customFormFields: newTrip.customFormFields
      };
      
      if (editingTripId) {
        updateOrganizedTrip(editingTripId, tripData);
      } else {
        addOrganizedTrip({ ...tripData, createdAt: new Date().toISOString() });
      }
      
      setIsAddOpen(false);
      setEditingTripId(null);
      setNewTrip({ title: '', destination: '', description: '', photoUrl: '', totalSeats: 0, price: 0, startDate: '', endDate: '', status: 'active', customFormFields: [] });
    }
  };
  
  const handleEditClick = (trip: OrganizedTrip) => {
    setEditingTripId(trip.id);
    setNewTrip({
      title: trip.title,
      destination: trip.destination,
      description: trip.description,
      photoUrl: trip.photoUrl,
      totalSeats: trip.totalSeats,
      price: trip.price,
      startDate: trip.startDate,
      endDate: trip.endDate,
      status: trip.status,
      customFormFields: trip.customFormFields
    });
    setIsAddOpen(true);
  };

  const filteredTrips = (organizedTrips || []).filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (t.status || 'active') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTripReservations = (tripId: string) => {
    return tripReservations.filter(r => r.tripId === tripId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Voyages Organisés</h2>
          <p className="text-slate-500 text-sm">Gérez les offres de voyages de groupe pour les agences</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <div onClick={() => { setEditingTripId(null); setNewTrip({ title: '', destination: '', description: '', photoUrl: '', totalSeats: 0, price: 0, startDate: '', endDate: '', status: 'active', customFormFields: [] }); setIsAddOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium"><Plus className="w-4 h-4 mr-2" /> Nouveau Voyage</div>
          <DialogContent className="w-[95vw] sm:max-w-[700px] bg-white max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{editingTripId ? "Modifier le Voyage Organisé" : "Publier un Voyage Organisé"}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto min-h-0 pr-4 -mr-4 p-1">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 px-1">
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-slate-700 mb-1.5 block">Titre de l'offre</label>
                <Input className="h-11 bg-slate-50 border-slate-200 focus:bg-white" value={newTrip.title} onChange={e => setNewTrip({...newTrip, title: e.target.value})} placeholder="Ex: Merveilles de la Cappadoce" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1.5 block">Destination</label>
                <Input className="h-11 bg-slate-50 border-slate-200 focus:bg-white" value={newTrip.destination} onChange={e => setNewTrip({...newTrip, destination: e.target.value})} placeholder="Ex: Turquie" />
              </div>
              
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1.5 block">Photo d'illustration</label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <Button type="button" variant="outline" className="h-11 bg-slate-50 border-slate-200">Choisir une image</Button>
                  </div>
                  {newTrip.photoUrl && newTrip.photoUrl.startsWith('data:') && (
                    <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 shadow-sm">
                       <img src={newTrip.photoUrl} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 block">Date de départ</label>
                  <Input type="date" className="h-11 bg-white" value={newTrip.startDate} onChange={e => setNewTrip({...newTrip, startDate: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 block">Date de retour</label>
                  <Input type="date" className="h-11 bg-white" value={newTrip.endDate} onChange={e => setNewTrip({...newTrip, endDate: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 block">Nombre de places</label>
                  <Input type="number" min="1" className="h-11 bg-white font-bold" value={newTrip.totalSeats} onChange={e => setNewTrip({...newTrip, totalSeats: Number(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 mb-1.5 block">Prix net B2B (DZD)</label>
                <Input type="number" min="0" className="h-11 bg-slate-50 border-slate-200 font-bold text-emerald-600 focus:bg-white" value={newTrip.price} onChange={e => setNewTrip({...newTrip, price: Number(e.target.value)})} />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 mb-1.5 block">Statut initial</label>
                <Select value={newTrip.status} onValueChange={(val) => setNewTrip({...newTrip, status: val})}>
                  <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:bg-white"><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif (Visible par les agences)</SelectItem>
                    <SelectItem value="draft">Brouillon (Caché)</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-bold text-slate-700 mb-1.5 block">Programme détaillé</label>
                <Textarea className="min-h-[120px] bg-slate-50 border-slate-200 focus:bg-white leading-relaxed" value={newTrip.description} onChange={e => setNewTrip({...newTrip, description: e.target.value})} placeholder="Jour 1: Arrivée et transfert...&#10;Jour 2: Visite de la ville..." />
              </div>
            

            </div>
            </div>
            <div className="flex justify-end gap-2 mt-4 border-t pt-4">
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Annuler</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveTrip}>{editingTripId ? "Enregistrer" : "Créer l'offre"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input className="pl-9" placeholder="Rechercher par titre ou destination..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actifs</SelectItem>
            <SelectItem value="draft">Brouillons</SelectItem>
            <SelectItem value="completed">Terminés</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTrips.map(trip => {
          const tripRes = getTripReservations(trip.id);
          const totalReserved = tripRes.reduce((acc, r) => r.status !== 'cancelled' ? acc + r.numberOfPeople : acc, 0);
          const occupancyPercentage = Math.round((totalReserved / trip.totalSeats) * 100) || 0;

          return (
            <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="h-48 relative overflow-hidden group">
                {trip.photoUrl ? (
                  <img src={trip.photoUrl} alt={trip.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-slate-300" />
                  </div>
                )}
                                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={trip.status === 'active' ? 'bg-green-500' : trip.status === 'draft' ? 'bg-slate-500' : 'bg-blue-500'}>
                    {trip.status === 'active' ? 'Publié' : trip.status === 'draft' ? 'Brouillon' : 'Terminé'}
                  </Badge>
                  {trip.featured && (
                    <Badge className="bg-amber-500 text-white border-none shadow-md shadow-amber-500/20 px-2 py-0.5 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> À la une
                    </Badge>
                  )}
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 rounded-full shadow-sm backdrop-blur-sm ${trip.featured ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-white/80 text-slate-400 hover:bg-amber-50 hover:text-amber-500'}`}
                    onClick={() => updateOrganizedTrip(trip.id, { featured: !trip.featured })}
                  >
                    <Star className={`w-4 h-4 ${trip.featured ? 'fill-current' : ''}`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 shadow-sm"
                    onClick={() => handleEditClick(trip)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-red-50 hover:text-red-600 shadow-sm"
                    onClick={(e) => {
                      if(window.confirm('Voulez-vous vraiment supprimer ce voyage ?')) deleteOrganizedTrip(trip.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4">
                  <h3 className="text-white font-bold text-lg leading-tight">{trip.title}</h3>
                  <p className="text-blue-100 text-sm flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {trip.destination}
                  </p>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{new Date(trip.startDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold text-slate-800">{trip.price} DZD</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Places occupées</span>
                        <span className="font-medium text-slate-800">{totalReserved} / {trip.totalSeats}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${occupancyPercentage > 90 ? 'bg-red-500' : occupancyPercentage > 70 ? 'bg-amber-500' : 'bg-green-500'}`} 
                          style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => { setSelectedTrip(trip); setIsReservationsOpen(true); }}>
                    <Users className="w-4 h-4 mr-2" />
                    Réservations ({tripRes.length})
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => deleteOrganizedTrip(trip.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filteredTrips.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-800">Aucun voyage organisé</h3>
          <p className="text-slate-500">Ajoutez des voyages organisés pour permettre aux agences de réserver.</p>
        </div>
      )}

      {/* Reservations Modal */}
      <Dialog open={isReservationsOpen} onOpenChange={setIsReservationsOpen}>
        <DialogContent className="w-[95vw] sm:max-w-4xl md:max-w-5xl bg-white max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Réservations - {selectedTrip?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto min-h-0 p-1">
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
                               id={`pay-${res.id}`}
                             />
                             <Button 
                               size="sm" 
                               className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                               onClick={(e) => {
                                 const input = document.getElementById(`pay-${res.id}`) as HTMLInputElement;
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
          </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}
