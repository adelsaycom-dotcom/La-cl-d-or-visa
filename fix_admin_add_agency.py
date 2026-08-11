import re

content = open('components/admin/AgencyManagement.tsx').read()
if 'const [newAgencyEmail, setNewAgencyEmail]' not in content:
    content = content.replace('const [isAddAgencyOpen, setIsAddAgencyOpen] = useState(false);', '''const [isAddAgencyOpen, setIsAddAgencyOpen] = useState(false);
  const [newAgencyName, setNewAgencyName] = useState("");
  const [newAgencyEmail, setNewAgencyEmail] = useState("");
  const [newAgencyPhone, setNewAgencyPhone] = useState("");
  const [newAgencyPwd, setNewAgencyPwd] = useState("");''')

    dialog_old = '''<div className="flex flex-col gap-4 py-4">
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
          </div>'''
          
    dialog_new = '''<div className="flex flex-col gap-4 py-4">
            <h3 className="text-lg font-bold">Ajouter une agence</h3>
            <p className="text-sm text-gray-500 mb-2">Note: L'ajout d'une agence manuellement nécessite une inscription normale. Nous vous recommandons de dire à l'agence de s'inscrire, puis vous pourrez l'approuver ici.</p>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Nom de l'agence</label>
              <Input value={newAgencyName} onChange={e=>setNewAgencyName(e.target.value)} placeholder="Nom" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={newAgencyEmail} onChange={e=>setNewAgencyEmail(e.target.value)} placeholder="Email" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Téléphone</label>
              <Input value={newAgencyPhone} onChange={e=>setNewAgencyPhone(e.target.value)} placeholder="Téléphone" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Mot de passe temporaire</label>
              <Input type="password" value={newAgencyPwd} onChange={e=>setNewAgencyPwd(e.target.value)} placeholder="••••••••" />
            </div>
            <Button onClick={async () => {
              // Creating a secondary app instance to avoid logging out the admin
              try {
                const { getApp, initializeApp } = await import("firebase/app");
                const { getAuth, createUserWithEmailAndPassword } = await import("firebase/auth");
                const { doc, setDoc } = await import("firebase/firestore");
                const { db } = await import("../../src/firebase");
                
                let secondaryApp;
                try {
                  secondaryApp = getApp("SecondaryApp");
                } catch(e) {
                  const firebaseConfig = getApp().options;
                  secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
                }
                const secondaryAuth = getAuth(secondaryApp);
                const userCred = await createUserWithEmailAndPassword(secondaryAuth, newAgencyEmail, newAgencyPwd);
                await setDoc(doc(db, "users", userCred.user.uid), {
                  email: newAgencyEmail,
                  role: "agency",
                  agencyName: newAgencyName,
                  phone: newAgencyPhone,
                  balance: 0,
                  status: "ACTIVE",
                  createdAt: new Date().toISOString()
                });
                setIsAddAgencyOpen(false);
                alert("Agence ajoutée avec succès !");
              } catch(err: any) {
                alert("Erreur lors de l'ajout: " + err.message);
              }
            }} className="w-full bg-primary-gold hover:bg-accent-bronze text-white">Ajouter</Button>
          </div>'''
          
    content = content.replace(dialog_old, dialog_new)
    open('components/admin/AgencyManagement.tsx', 'w').write(content)
