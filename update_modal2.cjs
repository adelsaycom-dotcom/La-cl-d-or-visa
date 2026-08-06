const fs = require('fs');

function fixFile(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');

  // reduce spaces between panes
  c = c.replace(/grid grid-cols-1 md:grid-cols-2 gap-6/g, 'grid grid-cols-1 lg:grid-cols-2 gap-6');
  // wait, let me just change space-y-6 to space-y-4
  c = c.replace(/className="space-y-6"/g, 'className="space-y-4"');

  fs.writeFileSync(filePath, c);
}

fixFile('components/admin/ApplicationManagement.tsx');
fixFile('components/agency/AgencyApplications.tsx');

console.log('done');
