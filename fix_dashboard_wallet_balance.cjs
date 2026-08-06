const fs = require('fs');

let c = fs.readFileSync('components/agency/Dashboard.tsx', 'utf8');
c = c.replace(/export default function Dashboard\(\) \{/, `import { useAppStore } from "../../src/store/useAppStore";\n\nexport default function Dashboard() {\n  const { agencyBalance } = useAppStore();\n  const balanceColor = agencyBalance > 10000 ? "text-green-500" : agencyBalance > 0 ? "text-amber-500" : "text-red-500";`);
c = c.replace(/<div className="font-bold text-text-dark">4,500 DA<\/div>/, `<div className={"font-bold " + balanceColor}>{agencyBalance.toLocaleString()} DZD</div>`);
c = c.replace(/<div className="font-black text-primary-gold">4,500 DA<\/div>/, `<div className={"font-black " + balanceColor}>{agencyBalance.toLocaleString()} DZD</div>`);
fs.writeFileSync('components/agency/Dashboard.tsx', c);

let c2 = fs.readFileSync('components/agency/AgencyWallet.tsx', 'utf8');
c2 = c2.replace(/export default function AgencyWallet\(\) \{/, `import { useAppStore } from "../../src/store/useAppStore";\n\nexport default function AgencyWallet() {\n  const { agencyBalance } = useAppStore();\n  const balanceColor = agencyBalance > 10000 ? "text-green-500" : agencyBalance > 0 ? "text-amber-500" : "text-red-500";`);
c2 = c2.replace(/<div className="text-5xl font-bold font-mono tracking-tight">4,500 <span className="text-2xl">DA<\/span><\/div>/, `<div className={"text-5xl font-bold font-mono tracking-tight " + balanceColor}>{agencyBalance.toLocaleString()} <span className="text-2xl">DZD</span></div>`);
fs.writeFileSync('components/agency/AgencyWallet.tsx', c2);
