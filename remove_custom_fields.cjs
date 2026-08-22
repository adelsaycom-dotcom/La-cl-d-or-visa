const fs = require('fs');

let content = fs.readFileSync('components/agency/OrganizedTrips.tsx', 'utf8');
const regex = /\{selectedTrip\?\.customFormFields &&[\s\S]*?\}\)[\s\S]*?<\/div>[\s\S]*?\}\)[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?\)\}/;
// Actually, let's use string splitting or just regex that captures everything correctly.
// Let's just use string slice since we know the lines
let lines = content.split('\n');
let newLines = [];
let skip = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('{selectedTrip?.customFormFields && selectedTrip.customFormFields.length > 0 && (')) {
    skip = true;
  }
  if (!skip) {
    // Keep line 225 if it's not part of it? No, wait.
    newLines.push(lines[i]);
  }
  if (skip && lines[i] === '                          )}') {
    skip = false;
    // Skip the next line if it's empty
    if (lines[i+1].trim() === '') {
      i++;
    }
    if (lines[i+1].trim() === '</div>') {
      i++;
    }
  }
}
fs.writeFileSync('components/agency/OrganizedTrips.tsx', newLines.join('\n'));
