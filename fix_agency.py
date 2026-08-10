import re

content = open('components/admin/AgencyManagement.tsx').read()
content = content.replace('Agencies</h2>', 'Agences</h2>')
content = content.replace('Add Agency manually</Button>', 'Ajouter une agence manuellement</Button>')

# Add state for dialog
if 'const [isAddAgencyOpen, setIsAddAgencyOpen] = useState(false);' not in content:
    content = content.replace('const [selectedAgency, setSelectedAgency] = useState<any>(null);', 'const [selectedAgency, setSelectedAgency] = useState<any>(null);\n  const [isAddAgencyOpen, setIsAddAgencyOpen] = useState(false);')

content = content.replace('<Button className="bg-black text-white hover:bg-gray-800">Ajouter une agence manuellement</Button>', '<Button onClick={() => setIsAddAgencyOpen(true)} className="bg-black text-white hover:bg-gray-800">Ajouter une agence manuellement</Button>')

# Let's add the Dialog structure
dialog_html = """      <Dialog open={isAddAgencyOpen} onOpenChange={setIsAddAgencyOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col gap-4 py-4">
            <h3 className="text-lg font-bold">Ajouter une agence</h3>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Nom de l'agence</label>
              <Input placeholder="Nom" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="Email" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Téléphone</label>
              <Input placeholder="Téléphone" />
            </div>
            <Button onClick={() => setIsAddAgencyOpen(false)} className="w-full bg-primary-gold hover:bg-accent-bronze text-white">Ajouter</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>"""

content = content.replace('    </div>\n  );\n}', dialog_html + '\n  );\n}')

open('components/admin/AgencyManagement.tsx', 'w').write(content)
