import re

content = open('components/admin/AgencyManagement.tsx').read()
if 'await secondaryAuth.signOut();' not in content:
    content = content.replace(
        'createdAt: new Date().toISOString()\n                });',
        'createdAt: new Date().toISOString()\n                });\n                await secondaryAuth.signOut();'
    )
    open('components/admin/AgencyManagement.tsx', 'w').write(content)
