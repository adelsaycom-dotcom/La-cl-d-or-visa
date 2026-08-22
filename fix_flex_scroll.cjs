const fs = require('fs');

let contentAgency = fs.readFileSync('components/agency/OrganizedTrips.tsx', 'utf8');

// replace ScrollArea with div overflow-y-auto
contentAgency = contentAgency.replace(
  '<ScrollArea className="flex-1">',
  '<div className="flex-1 overflow-y-auto">'
);
contentAgency = contentAgency.replace(
  '</ScrollArea>',
  '</div>'
);

fs.writeFileSync('components/agency/OrganizedTrips.tsx', contentAgency);

let contentAdmin = fs.readFileSync('components/admin/OrganizedTripsManagement.tsx', 'utf8');

contentAdmin = contentAdmin.replace(
  '<ScrollArea className="flex-1 pr-4 -mr-4">',
  '<div className="flex-1 overflow-y-auto pr-4 -mr-4 p-1">'
);
contentAdmin = contentAdmin.replace(
  '<ScrollArea className="flex-1">',
  '<div className="flex-1 overflow-y-auto p-1">'
);

// We need to replace the closing tags for ScrollArea in Admin
contentAdmin = contentAdmin.replace(
  '</ScrollArea>',
  '</div>'
);
contentAdmin = contentAdmin.replace(
  '</ScrollArea>',
  '</div>'
);

fs.writeFileSync('components/admin/OrganizedTripsManagement.tsx', contentAdmin);
