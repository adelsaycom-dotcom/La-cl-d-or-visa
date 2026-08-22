const fs = require('fs');

let content = fs.readFileSync('components/admin/OrganizedTripsManagement.tsx', 'utf8');
const lines = content.split('\n');
let newLines = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<div className="md:col-span-2 border-t border-slate-100 pt-6 mt-2">')) {
    skip = true;
  }
  
  if (!skip) {
    newLines.push(lines[i]);
  }
  
  if (skip && lines[i].includes('              </div>') && lines[i-1].includes('                </div>') && lines[i-2].includes('                  )}')) {
    skip = false;
  }
}
fs.writeFileSync('components/admin/OrganizedTripsManagement.tsx', newLines.join('\n'));
