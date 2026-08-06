const fs = require('fs');
let c = fs.readFileSync('components/admin/OrganizedTripsManagement.tsx', 'utf8');

c = c.replace(/status: 'draft'/g, "status: 'active'");

fs.writeFileSync('components/admin/OrganizedTripsManagement.tsx', c);
