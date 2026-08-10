import re

for f in ['components/admin/AgencyManagement.tsx', 'components/admin/SupportManagement.tsx', 'components/agency/AgencySupport.tsx']:
    content = open(f).read()
    
    # Remove the orphaned array elements. We know they start right after `const MOCK_X: any[] = [];`
    # Actually, it's easier to just remove lines that look like `{ id: "1"`
    content = re.sub(r'\s*\{ id: "\d+",.*?\},', '', content)
    content = re.sub(r'\s*\{ id: "\d+",.*?\}\s*];?', '', content)
    
    open(f, 'w').write(content)

