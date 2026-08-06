const fs = require('fs');

let c = fs.readFileSync('components/admin/VisaEditor.tsx', 'utf8');

c = c.replace(/description: generalInfo\.duration \+ " visa validity: " \+ generalInfo\.validity,/, `description: generalInfo.duration + " visa validity: " + generalInfo.validity,\n      customFormFields: fields as any,`);

fs.writeFileSync('components/admin/VisaEditor.tsx', c);
console.log("Visa editor fixed");
