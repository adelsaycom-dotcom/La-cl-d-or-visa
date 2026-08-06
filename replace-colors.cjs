const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  return results;
};

const map = {
  '#0a192f': '#2C2C2C', // primary dark -> text-dark
  '#112240': '#735D30', // secondary dark -> accent-bronze
  'orange-500': 'amber-500', // nearest tailwind to gold
  'orange-600': 'amber-600',
  'orange-400': 'amber-400',
  'orange-100': 'amber-100',
  'orange-50': 'amber-50',
  'text-orange-': 'text-amber-',
  'bg-orange-': 'bg-amber-',
  'border-orange-': 'border-amber-',
  'ring-orange-': 'ring-amber-',
  'blue-600': 'amber-600', // changing blue accents to gold too? Let's be careful. The user wants to apply the golden charter on the whole platform.
};

const files = walk('./src').concat(walk('./components'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  // Custom hex replacements
  newContent = newContent.replace(/#0a192f/g, '#2C2C2C');
  newContent = newContent.replace(/#112240/g, '#735D30');
  
  // Tailwind orange -> golden variations using hex
  // Actually, replacing 'orange' with 'amber' is safest to map to a gold-like tailwind color.
  newContent = newContent.replace(/orange-([0-9]{2,3})/g, 'amber-$1');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated', file);
  }
});
