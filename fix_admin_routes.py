import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import
if "import { ServiceCatalog }" not in content:
    content = content.replace('import { AdminSettings } from "../components/admin/AdminSettings";', 'import { AdminSettings } from "../components/admin/AdminSettings";\nimport { ServiceCatalog } from "../components/admin/ServiceCatalog";')

# Replace component reference
content = content.replace('<Route path="countries" element={<AdminCountries />} />', '<Route path="countries" element={<ServiceCatalog />} />')

# Replace sidebar text
content = content.replace('<Earth className="h-4 w-4" /> Pays & Visas', '<Globe2 className="h-4 w-4" /> Catalogue Services')

with open('src/App.tsx', 'w') as f:
    f.write(content)
