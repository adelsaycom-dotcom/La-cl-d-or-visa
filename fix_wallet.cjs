const fs = require('fs');

let content = fs.readFileSync('components/agency/AgencyWallet.tsx', 'utf-8');

// Fix 1: Type issue on currentAgency
content = content.replace(
  'const currentAgency = agencies.find(a => a.id === agencyId) || { balance: agencyBalance };',
  'const currentAgency: any = agencies.find(a => a.id === agencyId) || { balance: agencyBalance, agencyName: "", name: "" };'
);

// Fix 2: asChild error on DialogTrigger. We'll pass the classes directly to DialogTrigger or remove asChild and use it as a normal button if it accepts classes, which radix usually does.
// Let's replace the <DialogTrigger asChild> and inner <Button> with a custom styled div inside the DialogTrigger, but button inside button is bad. We can just use the classes on DialogTrigger if it's a Radix primitive. Or use a div with onClick if we handle open manually.
// We are already controlling open state with `rechargeOpen` and `setRechargeOpen`.
// So we can just use a normal Button and drop DialogTrigger!

const oldTrigger = `<DialogTrigger asChild>
              <Button className="bg-white text-slate-900 hover:bg-slate-100 h-14 px-8 font-black text-lg shadow-lg rounded-xl transition-transform active:scale-95">
                <ArrowUpRight className="w-5 h-5 mr-2" />
                Recharger le compte
              </Button>
            </DialogTrigger>`;

const newTrigger = `<Button onClick={() => setRechargeOpen(true)} className="bg-white text-slate-900 hover:bg-slate-100 h-14 px-8 font-black text-lg shadow-lg rounded-xl transition-transform active:scale-95">
                <ArrowUpRight className="w-5 h-5 mr-2" />
                Recharger le compte
              </Button>`;

content = content.replace(oldTrigger, newTrigger);

fs.writeFileSync('components/agency/AgencyWallet.tsx', content);
