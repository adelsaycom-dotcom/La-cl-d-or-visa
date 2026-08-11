import re

# 1. Update Agency Management (Admin) to have the same fields as Register
content = open('components/admin/AgencyManagement.tsx').read()
if 'newAgencyRc' not in content:
    content = content.replace('const [newAgencyPwd, setNewAgencyPwd] = useState("");', 'const [newAgencyPwd, setNewAgencyPwd] = useState("");\n  const [newAgencyRc, setNewAgencyRc] = useState("");\n  const [newAgencyManager, setNewAgencyManager] = useState("");')
    
    dialog_old = '''<div className="grid gap-2">
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
            </div>'''
    dialog_new = '''<div className="grid gap-2">
              <label className="text-sm font-medium">Nom de l'agence</label>
              <Input value={newAgencyName} onChange={e=>setNewAgencyName(e.target.value)} placeholder="Wanderlust Tours" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">N° de registre du commerce</label>
              <Input value={newAgencyRc} onChange={e=>setNewAgencyRc(e.target.value)} placeholder="RC / NIF" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Nom complet du gérant</label>
              <Input value={newAgencyManager} onChange={e=>setNewAgencyManager(e.target.value)} placeholder="Jean Dupont" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Téléphone</label>
              <Input value={newAgencyPhone} onChange={e=>setNewAgencyPhone(e.target.value)} placeholder="+213 555 12 34 56" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={newAgencyEmail} onChange={e=>setNewAgencyEmail(e.target.value)} placeholder="contact@agence.com" />
            </div>'''
    content = content.replace(dialog_old, dialog_new)
    
    # Update setDoc
    content = content.replace('phone: newAgencyPhone,', 'phone: newAgencyPhone,\n                  rc: newAgencyRc,\n                  managerName: newAgencyManager,\n                  applicationsCount: 0,')

    open('components/admin/AgencyManagement.tsx', 'w').write(content)

# 2. Fix Finances Management to actually increment the agency's balance!
content = open('components/admin/FinancesManagement.tsx').read()
if 'import { doc, updateDoc, getDoc }' not in content:
    content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { doc, updateDoc, getDoc } from "firebase/firestore";\nimport { db } from "../../src/firebase";')

if 'await updateDoc(doc(db, "users", selectedReq.agencyId)' not in content:
    pattern = r"updateRechargeRequestStatus\(selectedReq\.id,\s*'Approved'\);"
    replacement = '''updateRechargeRequestStatus(selectedReq.id, 'Approved');
    // Mettre à jour le solde
    const userRef = doc(db, 'users', selectedReq.agencyId);
    getDoc(userRef).then(docSnap => {
      if(docSnap.exists()) {
        updateDoc(userRef, { balance: (docSnap.data().balance || 0) + Number(creditAmount) });
      }
    });'''
    content = re.sub(pattern, replacement, content)
    open('components/admin/FinancesManagement.tsx', 'w').write(content)

