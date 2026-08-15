import re

with open('components/auth/Register.tsx', 'r') as f:
    content = f.read()

# Make sure we import collection if needed. Wait, setDoc is already imported.
if 'collection' not in content:
    content = content.replace("import { doc, setDoc } from \"firebase/firestore\";", "import { doc, setDoc, collection } from \"firebase/firestore\";")

old_code = r"""      await setDoc\(doc\(db, 'users', userCred\.user\.uid\), \{
        email: email,
        role: role,
        agencyName: agencyName,
        balance: 0,
        status: "PENDING",
        phone: phone,
        managerName: managerName,
        rc: rc,
        applicationsCount: 0,
        createdAt: new Date\(\)\.toISOString\(\)
      \}\);"""

new_code = """      await setDoc(doc(db, 'users', userCred.user.uid), {
        email: email,
        role: role,
        agencyName: agencyName,
        balance: 0,
        status: "PENDING",
        phone: phone,
        managerName: managerName,
        rc: rc,
        applicationsCount: 0,
        createdAt: new Date().toISOString()
      });
      
      if (role === 'agency') {
        const notifRef = doc(collection(db, 'notifications'));
        await setDoc(notifRef, {
          id: notifRef.id,
          agencyId: 'admin',
          title: 'Nouvelle Inscription',
          message: `L'agence ${agencyName} vient de s'inscrire et attend votre validation.`,
          type: 'warning',
          read: false,
          createdAt: new Date().toISOString(),
          link: '/admin/agencies'
        });
      }"""

content = re.sub(old_code, new_code, content)

with open('components/auth/Register.tsx', 'w') as f:
    f.write(content)
