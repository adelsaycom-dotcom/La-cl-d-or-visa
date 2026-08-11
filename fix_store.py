import re

content = open('src/store/useAppStore.ts').read()
content = content.replace('description?: string;\n  createdAt?: string;\n  date?: string;', 'description?: string;')
open('src/store/useAppStore.ts', 'w').write(content)
