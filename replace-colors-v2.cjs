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

const mapRegex = [
  { p: /text-(blue|green|purple|yellow|pink|cyan|rose|amber)-([0-9]{2,3})/g, r: 'text-primary-gold' },
  { p: /bg-(blue|green|purple|yellow|pink|cyan|rose|amber)-([0-9]{2,3})/g, r: 'bg-primary-gold' },
  { p: /border-(blue|green|purple|yellow|pink|cyan|rose|amber)-([0-9]{2,3})/g, r: 'border-primary-gold' },
]

const files = walk('./src').concat(walk('./components'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  // Custom hex overrides
  newContent = newContent.replace(/#2C2C2C/g, 'var(--color-text-dark)');
  newContent = newContent.replace(/#735D30/g, 'var(--color-accent-bronze)');
  newContent = newContent.replace(/#64ffda/g, 'var(--color-light-gold)');

  // Convert other colors in specific places where it's best to standardise (e.g. Dashboard services)
  if (file.includes('Dashboard.tsx')) {
    // Specifically target the services grid
     newContent = newContent.replace(/text-(amber|blue|green|purple|yellow|pink|cyan|rose|orange)-(400|500|600)/g, 'text-primary-gold');
     newContent = newContent.replace(/bg-gray-100/g, 'bg-bg-white');
     newContent = newContent.replace(/text-gray-900/g, 'text-text-dark');
  }

  if (file.includes('LandingPage.tsx')) {
     newContent = newContent.replace(/bg-gray-50/g, 'bg-bg-white');
     newContent = newContent.replace(/text-gray-900/g, 'text-text-dark');
     newContent = newContent.replace(/text-(amber|blue|green|purple|yellow|pink|cyan|rose|orange)-(400|500|600)/g, 'text-primary-gold');
     newContent = newContent.replace(/bg-(amber|blue|green|purple|yellow|pink|cyan|rose|orange)-(400|500|600)/g, 'bg-primary-gold');
     newContent = newContent.replace(/bg-(amber|blue|green|purple|yellow|pink|cyan|rose|orange)-(50|100)/g, 'bg-primary-gold/10');
  }
  
  if (file.includes('AgencyLayout.tsx')) {
     newContent = newContent.replace(/bg-\[\#f8fafc\]/g, 'bg-bg-white');
     newContent = newContent.replace(/text-gray-900/g, 'text-text-dark');
  }

  // Update button classes to use the charter's bronze/gold
  newContent = newContent.replace(/bg-var\(--color-text-dark\)/g, 'bg-text-dark');
  newContent = newContent.replace(/hover:bg-var\(--color-accent-bronze\)/g, 'hover:bg-accent-bronze');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated', file);
  }
});
