with open('components/agency/AgencyLayout.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { Logo }\nimport { auth } from \"../../src/firebase\"; from '@/components/Logo';", "import { Logo } from '@/components/Logo';\nimport { auth } from \"../../src/firebase\";")

with open('components/agency/AgencyLayout.tsx', 'w') as f:
    f.write(content)
