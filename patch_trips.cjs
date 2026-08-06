const fs = require('fs');

function patch(file) {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/const activeTrips = organizedTrips\.filter/g, "const activeTrips = (organizedTrips || []).filter");
  c = c.replace(/organizedTrips\.filter/g, "(organizedTrips || []).filter");
  c = c.replace(/organizedTrips\.find/g, "(organizedTrips || []).find");
  fs.writeFileSync(file, c);
}

patch('components/agency/OrganizedTrips.tsx');

let c2 = fs.readFileSync('components/admin/OrganizedTripsManagement.tsx', 'utf8');
c2 = c2.replace(/const filteredTrips = organizedTrips\.filter/g, "const filteredTrips = (organizedTrips || []).filter");
c2 = c2.replace(/organizedTrips\.filter/g, "(organizedTrips || []).filter");
fs.writeFileSync('components/admin/OrganizedTripsManagement.tsx', c2);

let c3 = fs.readFileSync('src/store/useAppStore.ts', 'utf8');
c3 = c3.replace(/\.\.\.state\.organizedTrips/g, "...(state.organizedTrips || [])");
c3 = c3.replace(/state\.organizedTrips\.map/g, "(state.organizedTrips || []).map");
c3 = c3.replace(/state\.organizedTrips\.filter/g, "(state.organizedTrips || []).filter");
c3 = c3.replace(/state\.organizedTrips\.find/g, "(state.organizedTrips || []).find");
c3 = c3.replace(/\.\.\.state\.tripReservations/g, "...(state.tripReservations || [])");
c3 = c3.replace(/state\.tripReservations\.map/g, "(state.tripReservations || []).map");
c3 = c3.replace(/state\.tripReservations\.filter/g, "(state.tripReservations || []).filter");
c3 = c3.replace(/state\.tripReservations\.find/g, "(state.tripReservations || []).find");
fs.writeFileSync('src/store/useAppStore.ts', c3);
