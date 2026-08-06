const fs = require('fs');

function fixFile(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');

  // Compacting gap and padding
  c = c.replace(/gap-x-6 gap-y-4/g, 'gap-x-4 gap-y-2');
  c = c.replace(/p-5 rounded-xl/g, 'p-4 rounded-xl');
  c = c.replace(/mb-4 flex/g, 'mb-2 flex');
  
  // More compact text
  c = c.replace(/block text-xs font-semibold mb-1/g, 'block text-[11px] uppercase tracking-wider font-semibold mb-0.5');
  
  // Strip borders and margins
  c = c.replace(/className="pt-2 border-t border-blue-50\/50 mt-2"/g, '');
  c = c.replace(/className="col-span-1 sm:col-span-2 mt-4 pt-4 border-t border-blue-100"/g, 'className="col-span-1 sm:col-span-2 mt-2"');
  
  // In AgencyApplications
  c = c.replace(/bg-blue-50\/40 p-5/g, 'bg-blue-50/40 p-4');
  c = c.replace(/gap-x-4 gap-y-4/g, 'gap-x-3 gap-y-2');

  fs.writeFileSync(filePath, c);
}

fixFile('components/admin/ApplicationManagement.tsx');
fixFile('components/agency/AgencyApplications.tsx');

console.log('done');
