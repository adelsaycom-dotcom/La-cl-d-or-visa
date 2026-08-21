const fs = require('fs');
let content = fs.readFileSync('components/admin/OrganizedTripsManagement.tsx', 'utf8');
content = content.replace(
  'updateTripReservationStatus } = useAppStore();',
  'updateTripReservationStatus, updateTripReservationPayment } = useAppStore();'
);
fs.writeFileSync('components/admin/OrganizedTripsManagement.tsx', content);
