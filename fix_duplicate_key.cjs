const fs = require('fs');
let content = fs.readFileSync('components/agency/OrganizedTrips.tsx', 'utf8');
content = content.replace(
  `        passengerNames: passengers.map(p => p.firstName + ' ' + p.lastName),\n        tripId: selectedTrip.id,`,
  `        tripId: selectedTrip.id,`
);
fs.writeFileSync('components/agency/OrganizedTrips.tsx', content);
