import re
import os

def replace_in_file(filepath, pattern, replacement, import_stmt=None):
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()
    
    if import_stmt and 'import { Logo }' not in content:
        # Add import after other imports
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if line.startswith('import ') or line.startswith('//'):
                continue
            lines.insert(i, import_stmt)
            break
        content = '\n'.join(lines)
    
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    with open(filepath, 'w') as f:
        f.write(new_content)
    print(f"Updated {filepath}")

# 1. LandingPage.tsx
landing_pattern = r'<div className="flex items-center gap-2"><div className="bg-[^>]+><Globe2[^>]+></div><span className="text-[^>]+>La Clé d\'Or <span[^>]+>Visa</span></span></div>'
replace_in_file('components/LandingPage.tsx', landing_pattern, '<Logo />', "import { Logo } from '@/components/Logo';")

# 2. AgencyLayout.tsx
agency_pattern = r'<div className="bg-gradient-[^>]+>\s*<Globe className="w-5 h-5" />\s*</div>\s*<span className="tracking-tight">La Clé d\'Or <span className="text-amber-400">Visa</span></span>'
replace_in_file('components/agency/AgencyLayout.tsx', agency_pattern, '<Logo imageClassName="h-8 sm:h-10" />', "import { Logo } from '@/components/Logo';")

# 3. src/App.tsx (Admin Layout)
admin_pattern = r'<div className="bg-gradient-[^>]+>\s*<Earth className="w-5 h-5" />\s*</div>\s*<span className="tracking-tight">La Clé d\'Or <span className="text-amber-500">Visa</span></span>'
replace_in_file('src/App.tsx', admin_pattern, '<Logo imageClassName="h-8 sm:h-10" />', "import { Logo } from '@/components/Logo';")

