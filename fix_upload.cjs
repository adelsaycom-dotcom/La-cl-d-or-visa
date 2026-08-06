const fs = require('fs');
let c = fs.readFileSync('components/admin/OrganizedTripsManagement.tsx', 'utf8');

const uploadFn = `
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setNewTrip(prev => ({ ...prev, photoUrl: dataUrl }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTrip = () => {`;

c = c.replace(/const handleAddTrip = \(\) => {/, uploadFn);

const inputField = `
              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm font-semibold mb-1 block">Photo (Téléverser)</label>
                <div className="flex items-center gap-2">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} className="cursor-pointer file:text-blue-600 file:font-semibold file:bg-blue-50 file:border-0 file:rounded-md file:px-3 file:py-1 hover:file:bg-blue-100" />
                  {newTrip.photoUrl && newTrip.photoUrl.startsWith('data:') && (
                    <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-slate-200">
                       <img src={newTrip.photoUrl} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                </div>
              </div>`;

c = c.replace(/<div className="col-span-2 sm:col-span-1">\s*<label className="text-sm font-semibold mb-1 block">URL de la photo<\/label>\s*<Input value={newTrip\.photoUrl} onChange=\{e => setNewTrip\(\{\.\.\.newTrip, photoUrl: e\.target\.value\}\)\} placeholder="https:\/\/\.\.\." \/>\s*<\/div>/, inputField);

fs.writeFileSync('components/admin/OrganizedTripsManagement.tsx', c);
