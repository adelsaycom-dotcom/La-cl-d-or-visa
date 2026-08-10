import re

content = open('components/agency/VisaWizard.tsx').read()
content = content.replace('import { useAppStore } from "../../src/store/useAppStore";', 'import { useAppStore } from "../../src/store/useAppStore";\nimport { auth } from "../../src/firebase";')

content = content.replace('agencyId: "a1",', 'agencyId: auth.currentUser?.uid || "a1",')
content = content.replace('agencyName: "Current Agency", // mockup', 'agencyName: auth.currentUser?.email || "Current Agency",')

open('components/agency/VisaWizard.tsx', 'w').write(content)
