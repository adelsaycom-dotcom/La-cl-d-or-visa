const fs = require('fs');
let content = fs.readFileSync('components/agency/OrganizedTrips.tsx', 'utf8');

content = content.replace(
  '<div className="p-6">',
  '<div className="p-4 sm:p-6 md:p-8">'
);

content = content.replace(
  '<h3 className="font-black text-slate-800 mb-6 text-xl tracking-tight flex items-center justify-between">',
  '<h3 className="font-black text-slate-800 mb-6 text-xl tracking-tight flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">'
);

content = content.replace(
  'Confirmer et transmettre la réservation',
  'Confirmer la réservation'
);

content = content.replace(
  '<Button onClick={handleBook} disabled={!clientName} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black h-14 rounded-xl text-lg shadow-emerald-500/20 shadow-lg transition-all hover:-translate-y-0.5">',
  '<Button onClick={handleBook} disabled={!clientName} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black h-14 rounded-xl text-lg shadow-emerald-500/20 shadow-lg transition-all hover:-translate-y-0.5 whitespace-normal leading-tight">'
);

fs.writeFileSync('components/agency/OrganizedTrips.tsx', content);
