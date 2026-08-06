const fs = require('fs');
let c = fs.readFileSync('components/agency/OrganizedTrips.tsx', 'utf8');

// Also show trips without status (for backward compatibility)
c = c.replace(/t\.status === 'active'/g, "t.status === 'active' || !t.status");

fs.writeFileSync('components/agency/OrganizedTrips.tsx', c);

let c2 = fs.readFileSync('components/admin/OrganizedTripsManagement.tsx', 'utf8');
c2 = c2.replace(/t\.status === statusFilter;/g, "(t.status || 'active') === statusFilter;");
fs.writeFileSync('components/admin/OrganizedTripsManagement.tsx', c2);

console.log("Patched trips status");
