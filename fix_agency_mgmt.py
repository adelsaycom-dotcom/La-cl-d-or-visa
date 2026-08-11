import re

content = open('components/admin/AgencyManagement.tsx').read()
if 'import { useAppStore } from "@/src/store/useAppStore"' not in content and 'import { useAppStore }' not in content:
    content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { useAppStore } from "../../src/store/useAppStore";')
    content = content.replace('const [agencies, setAgencies] = useState(MOCK_AGENCIES);', 'const { agencies, updateAgencyStatus } = useAppStore();')
    
    # Also update the updateStatus function which was likely local
    content = re.sub(r'const updateStatus = \(id: string, newStatus: string\) => \{.*?\};', 'const updateStatus = (id: string, newStatus: string) => { updateAgencyStatus(id, newStatus); };', content, flags=re.DOTALL)
    
    open('components/admin/AgencyManagement.tsx', 'w').write(content)
