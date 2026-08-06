const fs = require('fs');
let c = fs.readFileSync('components/agency/VisaWizard.tsx', 'utf8');

c = c.replace(/h-12/g, 'h-10');
c = c.replace(/gap-6 bg-slate-50\/50 p-6/g, 'gap-4 bg-slate-50/50 p-4');
c = c.replace(/gap-6/g, 'gap-4');
c = c.replace(/space-y-8/g, 'space-y-6');
c = c.replace(/space-y-2/g, 'space-y-1.5');
c = c.replace(/pb-2/g, 'pb-1');
c = c.replace(/pt-4/g, 'pt-3');

fs.writeFileSync('components/agency/VisaWizard.tsx', c);
console.log('done');
