import re

content = open('src/store/useAppStore.ts').read()
content = content.replace('name: string;', 'name?: string;\n  agencyName?: string;')
open('src/store/useAppStore.ts', 'w').write(content)
