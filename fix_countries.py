import re

content = open('src/App.tsx').read()
content = content.replace('Countries & Visa Types', 'Pays & Types de Visas')
content = content.replace('Add Country</button>', 'Ajouter un pays</button>')

# Add state
content = content.replace('const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);', 'const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);\n  const [isAddCountryOpen, setIsAddCountryOpen] = useState(false);\n  const [newCountryName, setNewCountryName] = useState("");\n  const [newCountryFlag, setNewCountryFlag] = useState("🏳️");')

content = content.replace('onClick={handleAddCountry}', 'onClick={() => setIsAddCountryOpen(true)}')

# Add Dialog
dialog_html = """      <Dialog open={isAddCountryOpen} onOpenChange={setIsAddCountryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col gap-4 py-4">
            <h3 className="text-lg font-bold">Ajouter un pays</h3>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Nom du pays</label>
              <input className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={newCountryName} onChange={(e) => setNewCountryName(e.target.value)} placeholder="Ex: France" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Drapeau (Emoji)</label>
              <input className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={newCountryFlag} onChange={(e) => setNewCountryFlag(e.target.value)} placeholder="Ex: 🇫🇷" />
            </div>
            <button onClick={() => {
              if (newCountryName) {
                addCountry({
                  id: Date.now().toString(),
                  name: newCountryName,
                  flag: newCountryFlag || "🏳️",
                  active: true,
                  visaTypes: []
                });
                setIsAddCountryOpen(false);
                setNewCountryName("");
                setNewCountryFlag("🏳️");
              }
            }} className="w-full bg-black hover:bg-gray-800 text-white h-10 rounded-md font-medium">Ajouter</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>"""

content = content.replace('</DialogContent>\n      </Dialog>\n    </div>', '</DialogContent>\n      </Dialog>\n' + dialog_html)

open('src/App.tsx', 'w').write(content)
