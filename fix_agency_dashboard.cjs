const fs = require('fs');

let content = fs.readFileSync('components/agency/Dashboard.tsx', 'utf8');

// 1. Add imports
content = content.replace(
  'import { Link } from "react-router-dom";',
  'import { Link, useNavigate } from "react-router-dom";\nimport { useState, useEffect } from "react";\nimport { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";\nimport { MapPin, Info, DollarSign, Star } from "lucide-react";'
);

// 2. Add organizedTrips and state to component
const storeCall = '  const { agencyBalance, applications } = useAppStore();';
const newStoreCall = `  const { agencyBalance, applications, organizedTrips } = useAppStore();
  const navigate = useNavigate();
  const [newTripPopupOpen, setNewTripPopupOpen] = useState(false);
  const [popupTrip, setPopupTrip] = useState<any>(null);

  const featuredTrips = organizedTrips.filter(t => t.featured && t.status === 'active');
  const activeTrips = organizedTrips.filter(t => t.status === 'active');

  useEffect(() => {
    // Show popup for the most recently added active trip if not seen
    if (activeTrips.length > 0) {
      // Sort by creation date if available, or just take the last one
      const sortedTrips = [...activeTrips].sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0; // Fallback
      });
      
      const latestTrip = sortedTrips[0];
      const seenTripId = sessionStorage.getItem('seenNewTripId');
      
      if (latestTrip && seenTripId !== latestTrip.id) {
        setPopupTrip(latestTrip);
        setNewTripPopupOpen(true);
      }
    }
  }, [activeTrips]);

  const handleDismissPopup = () => {
    if (popupTrip) {
      sessionStorage.setItem('seenNewTripId', popupTrip.id);
    }
    setNewTripPopupOpen(false);
  };
  
  const handleAccessPopup = () => {
    handleDismissPopup();
    navigate('/agency/trips');
  };`;
content = content.replace(storeCall, newStoreCall);

// 3. Add Carousel UI
const servicesDiv = `          {/* Quick Actions / Services */}`;
const carouselHTML = `          {/* Featured Trips Carousel */}
          {featuredTrips.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                  Voyages à la une
                </h2>
                <Link to="/agency/trips" className="text-sm text-blue-600 font-bold hover:underline">Voir tout</Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                {featuredTrips.map(trip => (
                  <div key={trip.id} className="min-w-[280px] sm:min-w-[320px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden snap-start group relative">
                    <div className="h-32 relative overflow-hidden">
                      <img src={trip.photoUrl} alt={trip.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <Star className="w-3 h-3 fill-current" /> À la une
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-bold text-lg leading-tight truncate">{trip.title}</h3>
                        <p className="text-blue-100 text-xs flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3 h-3" /> {trip.destination}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-400">Prix B2B</span>
                          <span className="font-black text-slate-800 text-lg leading-none">{trip.price.toLocaleString()} DZD</span>
                        </div>
                        <Link to="/agency/trips" className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                          Voir détails
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Quick Actions / Services */}`;
content = content.replace(servicesDiv, carouselHTML);

// 4. Add the Dialog at the end of the return statement
const endDiv = `    </div>
  );
}`;
const popupHTML = `      
      {/* New Trip Popup */}
      <Dialog open={newTripPopupOpen} onOpenChange={(open) => { if(!open) handleDismissPopup(); }}>
        <DialogContent className="sm:max-w-md bg-white p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
          {popupTrip && (
            <div className="flex flex-col">
              <div className="h-48 relative">
                <img src={popupTrip.photoUrl} alt={popupTrip.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-6">
                  <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-200 border border-blue-400/30 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold w-fit mb-3">
                    <Star className="w-3.5 h-3.5 fill-current" /> Nouvelle offre disponible
                  </div>
                  <h2 className="text-white font-black text-2xl leading-tight mb-1">{popupTrip.title}</h2>
                  <p className="text-slate-300 text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> {popupTrip.destination}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {popupTrip.description}
                </p>
                
                <div className="flex items-center justify-between mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <div>
                     <span className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Tarif B2B</span>
                     <span className="font-black text-xl text-slate-900">{popupTrip.price.toLocaleString()} DZD</span>
                   </div>
                   <div className="text-right">
                     <span className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Places dispo</span>
                     <span className="font-bold text-slate-700">{popupTrip.availableSeats}</span>
                   </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-slate-200" onClick={handleDismissPopup}>
                    Retirer
                  </Button>
                  <Button className="flex-1 h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20" onClick={handleAccessPopup}>
                    Y accéder
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}`;
content = content.replace(endDiv, popupHTML);

fs.writeFileSync('components/agency/Dashboard.tsx', content);
