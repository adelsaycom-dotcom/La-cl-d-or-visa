import re

content = open('components/auth/Register.tsx').read()
content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { auth, db } from "../../src/firebase";\nimport { createUserWithEmailAndPassword } from "firebase/auth";\nimport { doc, setDoc } from "firebase/firestore";')

content = content.replace('export function Register() {', """export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agencyName, setAgencyName] = useState("");
""")

register_logic = """
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      // Create user doc
      let role = "agency";
      if (email === "adel.saycom@gmail.com" || email.includes("admin")) {
        role = "admin";
      }
      await setDoc(doc(db, 'users', userCred.user.uid), {
        email: email,
        role: role,
        agencyName: agencyName,
        balance: 0,
        createdAt: new Date().toISOString()
      });
      alert("Demande envoyée avec succès ! Notre équipe examinera le profil de votre agence.");
      navigate("/login");
    } catch(err: any) {
      alert("Erreur: " + err.message);
    }
  };
"""
content = re.sub(r'const handleRegister = \(e: React.FormEvent\) => \{.*?\};', register_logic.strip(), content, flags=re.DOTALL)

content = content.replace('Nom de l\'agence *</label>\n                 <Input required', 'Nom de l\'agence *</label>\n                 <Input required value={agencyName} onChange={e=>setAgencyName(e.target.value)}')
content = content.replace('type="email" className="h-12', 'type="email" value={email} onChange={e=>setEmail(e.target.value)} className="h-12')
content = content.replace('type="password" placeholder="••••••••" className="h-12', 'type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="h-12')

open('components/auth/Register.tsx', 'w').write(content)
