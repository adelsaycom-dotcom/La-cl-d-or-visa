import re

with open('src/store/useAppStore.ts', 'r') as f:
    content = f.read()

content = content.replace('customFormData?: Record<string, any>;\n}', 'customFormData?: Record<string, any>;\n  finalDocument?: string;\n  adminNotes?: string;\n}')

with open('src/store/useAppStore.ts', 'w') as f:
    f.write(content)
