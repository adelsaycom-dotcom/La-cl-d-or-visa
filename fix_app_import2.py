import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('const AdminSettings = lazy(() => import("@/components/admin/AdminSettings").then(m => ({ default: m.AdminSettings })));', 'const AdminSettings = lazy(() => import("@/components/admin/AdminSettings").then(m => ({ default: m.AdminSettings })));\nconst ServiceCatalog = lazy(() => import("@/components/admin/ServiceCatalog").then(m => ({ default: m.ServiceCatalog })));')

with open('src/App.tsx', 'w') as f:
    f.write(content)
