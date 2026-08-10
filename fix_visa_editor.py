import re

content = open('components/admin/VisaEditor.tsx').read()
content = content.replace('customFormFields: fields as any,', 'customFormFields: fields as any,\n      requiredDocuments: reqDocs,\n      conditions: conditions.split("\\n").filter(c => c.trim().length > 0)')
open('components/admin/VisaEditor.tsx', 'w').write(content)
