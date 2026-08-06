const fs = require('fs');
let c = fs.readFileSync('components/LandingPage.tsx', 'utf8');

c = c.replace(/hidden md:flex items-center gap-8 text-sm font-bold/g, "hidden lg:flex items-center gap-8 text-sm font-bold");

fs.writeFileSync('components/LandingPage.tsx', c);
console.log("Landing page fixed");
