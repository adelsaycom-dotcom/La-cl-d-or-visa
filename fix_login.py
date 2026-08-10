import re

content = open('components/auth/Login.tsx').read()
content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { auth, db } from "../../src/firebase";\nimport { signInWithEmailAndPassword } from "firebase/auth";\nimport { doc, getDoc } from "firebase/firestore";')

login_logic = """
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCred.user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        if (role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/agency");
        }
      } else {
        alert("Utilisateur introuvable dans la base de données.");
      }
    } catch(err: any) {
      alert("Erreur de connexion: " + err.message);
    }
  };
"""
content = re.sub(r'const handleLogin = \(e: React.FormEvent\) => \{.*?\};', login_logic.strip(), content, flags=re.DOTALL)

content = content.replace('const [email, setEmail] = useState("");', 'const [email, setEmail] = useState("");\n')

content = content.replace('type="password"\n                   placeholder="••••••••"\n                   className', 'type="password"\n                   value={password}\n                   onChange={(e) => setPassword(e.target.value)}\n                   placeholder="••••••••"\n                   className')

open('components/auth/Login.tsx', 'w').write(content)
