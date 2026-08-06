const fs = require('fs');

function fixDialogTrigger(file) {
  let c = fs.readFileSync(file, 'utf8');
  
  if (file.includes('OrganizedTripsManagement.tsx')) {
    c = c.replace(/<DialogTrigger asChild>\s*<Button className="bg-blue-600 hover:bg-blue-700">\s*<Plus className="w-4 h-4 mr-2" \/>\s*Nouveau Voyage\s*<\/Button>\s*<\/DialogTrigger>/, 
      '<div onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium"><Plus className="w-4 h-4 mr-2" /> Nouveau Voyage</div>'
    );
    // Actually we can just trigger it manually since setIsAddOpen is available, or use DialogTrigger without asChild.
    // Wait, the Dialog component has `open={isAddOpen} onOpenChange={setIsAddOpen}`, so we don't even need DialogTrigger!
    c = c.replace(/<DialogTrigger asChild>[\s\S]*?<\/DialogTrigger>/, 
      '<Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddOpen(true)}><Plus className="w-4 h-4 mr-2" /> Nouveau Voyage</Button>'
    );
  } else if (file.includes('OrganizedTrips.tsx')) {
    c = c.replace(/<DialogTrigger asChild>\s*<Button([\s\S]*?)>([\s\S]*?)<\/Button>\s*<\/DialogTrigger>/, 
      '<Button$1>$2</Button>'
    );
  }

  fs.writeFileSync(file, c);
}

fixDialogTrigger('components/admin/OrganizedTripsManagement.tsx');
fixDialogTrigger('components/agency/OrganizedTrips.tsx');

console.log('done');
