const fs = require('fs');

let contentAgency = fs.readFileSync('components/agency/OrganizedTrips.tsx', 'utf8');
contentAgency = contentAgency.replace(
  '<div className="flex-1 overflow-y-auto">',
  '<div className="flex-1 overflow-y-auto min-h-0">'
);
fs.writeFileSync('components/agency/OrganizedTrips.tsx', contentAgency);


let contentAdmin = fs.readFileSync('components/admin/OrganizedTripsManagement.tsx', 'utf8');
contentAdmin = contentAdmin.replace(
  '<div className="flex-1 overflow-y-auto pr-4 -mr-4 p-1">',
  '<div className="flex-1 overflow-y-auto min-h-0 pr-4 -mr-4 p-1">'
);
contentAdmin = contentAdmin.replace(
  '<div className="flex-1 overflow-y-auto p-1">',
  '<div className="flex-1 overflow-y-auto min-h-0 p-1">'
);
fs.writeFileSync('components/admin/OrganizedTripsManagement.tsx', contentAdmin);
