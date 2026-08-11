import re

content = open('components/auth/Register.tsx').read()

# Add phone state
if 'const [phone, setPhone] = useState("");' not in content:
    content = content.replace('const [agencyName, setAgencyName] = useState("");', 'const [agencyName, setAgencyName] = useState("");\n  const [phone, setPhone] = useState("");\n  const [managerName, setManagerName] = useState("");\n  const [rc, setRc] = useState("");')

# Add values to inputs
content = content.replace('placeholder="RC / NIF"', 'value={rc} onChange={e=>setRc(e.target.value)} placeholder="RC / NIF"')
content = content.replace('placeholder="Jean Dupont"', 'value={managerName} onChange={e=>setManagerName(e.target.value)} placeholder="Jean Dupont"')
content = content.replace('placeholder="+213 555 12 34 56" type="tel"', 'value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+213 555 12 34 56" type="tel"')

# Add values to setDoc
content = content.replace('balance: 0,', 'balance: 0,\n        status: "PENDING",\n        phone: phone,\n        managerName: managerName,\n        rc: rc,\n        applicationsCount: 0,')

open('components/auth/Register.tsx', 'w').write(content)
