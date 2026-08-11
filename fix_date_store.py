import re

content = open('src/store/useAppStore.ts').read()
content = content.replace('description?: string;', 'description?: string;\n  createdAt?: string;\n  date?: string;')
open('src/store/useAppStore.ts', 'w').write(content)
