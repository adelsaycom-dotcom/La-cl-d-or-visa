const fs = require('fs');
let c = fs.readFileSync('src/store/useAppStore.ts', 'utf8');

c = c.replace(/organizedTrips: \[/g, 'organizedTrips: (state.organizedTrips || [])'); // this would be wrong for initial state

// Let's just fix the access in the components instead, or the getters
// But wait, the initial state has:
//   organizedTrips: [],
//   tripReservations: [],
//   applications: [ ... ]
