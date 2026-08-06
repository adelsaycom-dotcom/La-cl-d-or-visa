const fs = require('fs');
let c = fs.readFileSync('components/agency/VisaWizard.tsx', 'utf8');

c = c.replace(/className="h-10/g, 'className="h-9 text-sm');
c = c.replace(/space-y-1\.5/g, 'space-y-1');
c = c.replace(/py-8/g, 'py-4 md:py-6');
c = c.replace(/mb-10/g, 'mb-6');
c = c.replace(/mb-12/g, 'mb-8');
c = c.replace(/p-8 md:p-12/g, 'p-5 md:p-8');
c = c.replace(/min-h-\[500px\]/g, 'min-h-[400px]');
c = c.replace(/h-9 text-sm text-slate-500 hover:text-slate-900 font-semibold"/g, 'h-10 text-slate-500 hover:text-slate-900 font-semibold"'); // revert button height

fs.writeFileSync('components/agency/VisaWizard.tsx', c);
console.log('done');
