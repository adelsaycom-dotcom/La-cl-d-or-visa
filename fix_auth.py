import re

with open('components/agency/AgencyLayout.tsx', 'r') as f:
    content = f.read()

if 'import { auth }' not in content:
    content = content.replace('import { Logo }', 'import { Logo }\nimport { auth } from "../../src/firebase";')

content = content.replace('"current-user-agencyId"', 'auth.currentUser?.uid || ""')

with open('components/agency/AgencyLayout.tsx', 'w') as f:
    f.write(content)
