const fs = require('fs');

let content = fs.readFileSync('components/admin/OrganizedTripsManagement.tsx', 'utf8');

// 1. Add editingTripId state
content = content.replace(
  "const [isReservationsOpen, setIsReservationsOpen] = useState(false);",
  "const [isReservationsOpen, setIsReservationsOpen] = useState(false);\n  const [editingTripId, setEditingTripId] = useState<string | null>(null);"
);

// 2. Add Star to lucide-react imports
content = content.replace(
  "import { Plus, Edit, Trash2, Users, MapPin, Calendar, DollarSign, Search, Image as ImageIcon, ChevronRight } from 'lucide-react';",
  "import { Plus, Edit, Trash2, Users, MapPin, Calendar, DollarSign, Search, Image as ImageIcon, ChevronRight, Star } from 'lucide-react';"
);

// 3. Replace handleAddTrip with handleSaveTrip
const handleAddCode = `const handleAddTrip = () => {
    if (newTrip.title && newTrip.destination && newTrip.totalSeats && newTrip.price && newTrip.startDate && newTrip.endDate) {
      addOrganizedTrip({
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
      });
      setIsAddOpen(false);
      setNewTrip({ title: '', destination: '', description: '', photoUrl: '', totalSeats: 0, price: 0, startDate: '', endDate: '', status: 'active', customFormFields: [] });
    }
  };`;

const handleSaveCode = `const handleSaveTrip = () => {
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
  };`;

content = content.replace(handleAddCode, handleSaveCode);

// 4. Update the Dialog creation
content = content.replace(
  '<div onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium"><Plus className="w-4 h-4 mr-2" /> Nouveau Voyage</div>',
  '<div onClick={() => { setEditingTripId(null); setNewTrip({ title: \'\', destination: \'\', description: \'\', photoUrl: \'\', totalSeats: 0, price: 0, startDate: \'\', endDate: \'\', status: \'active\', customFormFields: [] }); setIsAddOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium"><Plus className="w-4 h-4 mr-2" /> Nouveau Voyage</div>'
);

content = content.replace(
  '<DialogTitle>Publier un Voyage Organisé</DialogTitle>',
  '<DialogTitle>{editingTripId ? "Modifier le Voyage Organisé" : "Publier un Voyage Organisé"}</DialogTitle>'
);

content = content.replace(
  '<Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddTrip}>Créer l\'offre</Button>',
  '<Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveTrip}>{editingTripId ? "Enregistrer" : "Créer l\'offre"}</Button>'
);

// 5. Add action buttons (Star, Edit, Trash) to the trip card
const actionButtonsHTML = `                <div className="absolute top-3 left-3 flex gap-2">
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
                    className={\`h-8 w-8 rounded-full shadow-sm backdrop-blur-sm \${trip.featured ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-white/80 text-slate-400 hover:bg-amber-50 hover:text-amber-500'}\`}
                    onClick={() => updateOrganizedTrip(trip.id, { featured: !trip.featured })}
                  >
                    <Star className={\`w-4 h-4 \${trip.featured ? 'fill-current' : ''}\`} />
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
                </div>`;

content = content.replace(
  `<div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={trip.status === 'active' ? 'bg-green-500' : trip.status === 'draft' ? 'bg-slate-500' : 'bg-blue-500'}>
                    {trip.status === 'active' ? 'Publié' : trip.status === 'draft' ? 'Brouillon' : 'Terminé'}
                  </Badge>
                </div>`,
  actionButtonsHTML
);

fs.writeFileSync('components/admin/OrganizedTripsManagement.tsx', content);
