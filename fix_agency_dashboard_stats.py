import re

content = open('components/agency/Dashboard.tsx').read()
if 'const pendingApps' not in content:
    # 1. Import useAppStore correctly if not already done, but it should be done already.
    # 2. Extract applications from store.
    content = content.replace('const { agencyBalance } = useAppStore();', 'const { agencyBalance, applications } = useAppStore();')
    
    # 3. Add calculations
    content = content.replace('const data = passportData[selectedPassport] || passportData["Algérien"];', '''const data = passportData[selectedPassport] || passportData["Algérien"];
  const pendingApps = applications.filter(a => a.status === "Pending").length;
  const approvedApps = applications.filter(a => a.status === "Approved").length;
  const rejectedApps = applications.filter(a => a.status === "Rejected").length;''')

    # 4. Replace hardcoded values
    content = content.replace('<div className="text-4xl font-black text-text-dark">12</div>', '<div className="text-4xl font-black text-text-dark">{pendingApps}</div>')
    content = content.replace('<div className="text-4xl font-black text-text-dark">8</div>', '<div className="text-4xl font-black text-text-dark">{approvedApps}</div>')
    content = content.replace('<div className="text-4xl font-black text-text-dark">1</div>', '<div className="text-4xl font-black text-text-dark">{rejectedApps}</div>')

    open('components/agency/Dashboard.tsx', 'w').write(content)
