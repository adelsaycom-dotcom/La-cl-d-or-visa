const fs = require('fs');

let content = fs.readFileSync('components/admin/OrganizedTripsManagement.tsx', 'utf8');

// Fix the dialog widths
content = content.replace(
  '<DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh]">',
  '<DialogContent className="w-[95vw] sm:max-w-[700px] bg-white max-h-[90vh] overflow-hidden flex flex-col">'
);
content = content.replace(
  '<ScrollArea className="h-[60vh] pr-4">',
  '<ScrollArea className="flex-1 pr-4 -mr-4">'
);
content = content.replace(
  '<DialogContent className="max-w-4xl bg-white max-h-[90vh]">',
  '<DialogContent className="w-[95vw] sm:max-w-4xl md:max-w-5xl bg-white max-h-[95vh] overflow-hidden flex flex-col">'
);

// We should also replace the h-[70vh] of the second scroll area
content = content.replace(
  '<ScrollArea className="h-[70vh]">',
  '<ScrollArea className="flex-1">'
);

// Make the Add Trip form look better by grouping
const oldFormStart = '<div className="grid grid-cols-2 gap-4 py-4">';
const newFormStart = `
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
            
              <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-2">
`;

// Replace from '<div className="grid grid-cols-2 gap-4 py-4">' to '<div className="col-span-2 border-t pt-4 mt-2">'
const regex = /<div className="grid grid-cols-2 gap-4 py-4">[\s\S]*?<div className="col-span-2 border-t pt-4 mt-2">/;
content = content.replace(regex, newFormStart);

fs.writeFileSync('components/admin/OrganizedTripsManagement.tsx', content);
