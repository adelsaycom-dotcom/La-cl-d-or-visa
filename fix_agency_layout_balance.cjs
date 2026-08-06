const fs = require('fs');
let c = fs.readFileSync('components/agency/AgencyLayout.tsx', 'utf8');

c = c.replace(/export function AgencyLayout\(\) \{/, `import { useAppStore } from "../../src/store/useAppStore";\n\nexport function AgencyLayout() {\n  const { agencyBalance } = useAppStore();\n  const balanceColor = agencyBalance > 10000 ? "text-green-500" : agencyBalance > 0 ? "text-amber-500" : "text-red-500";`);

c = c.replace(/<span className="text-sm font-bold text-\[var\(--color-light-gold\)\]">4,500 DA<\/span>/, `<span className={"text-sm font-bold " + balanceColor}>{agencyBalance.toLocaleString()} DZD</span>`);
c = c.replace(/<div className="text-2xl font-bold text-\[var\(--color-light-gold\)\] mt-1 shrink-0">4,500 DA<\/div>/, `<div className={"text-2xl font-bold mt-1 shrink-0 " + balanceColor}>{agencyBalance.toLocaleString()} DZD</div>`);

fs.writeFileSync('components/agency/AgencyLayout.tsx', c);
