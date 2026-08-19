import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('import { AdminSettings } from "./components/admin/AdminSettings";', 'import { AdminSettings } from "./components/admin/AdminSettings";\nimport { ServiceCatalog } from "./components/admin/ServiceCatalog";')

with open('src/App.tsx', 'w') as f:
    f.write(content)
