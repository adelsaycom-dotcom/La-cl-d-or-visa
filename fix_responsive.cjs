const fs = require('fs');

let c = fs.readFileSync('components/agency/AgencyLayout.tsx', 'utf8');
c = c.replace(/hidden md:flex/g, "hidden xl:flex");
c = c.replace(/md:hidden/g, "xl:hidden");
fs.writeFileSync('components/agency/AgencyLayout.tsx', c);

let c2 = fs.readFileSync('src/App.tsx', 'utf8');
c2 = c2.replace(/hidden lg:flex/g, "hidden xl:flex");
c2 = c2.replace(/lg:hidden/g, "xl:hidden");
fs.writeFileSync('src/App.tsx', c2);

console.log("Responsive fixed");
