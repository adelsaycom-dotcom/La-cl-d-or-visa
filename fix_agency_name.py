import re

content = open('components/admin/AgencyManagement.tsx').read()
content = content.replace('agency.name.toLowerCase()', '(agency.name || agency.agencyName || "").toLowerCase()')
content = content.replace('agency.email.toLowerCase()', '(agency.email || "").toLowerCase()')
content = content.replace('{agency.name}', '{agency.name || agency.agencyName || "Nom non défini"}')
open('components/admin/AgencyManagement.tsx', 'w').write(content)
