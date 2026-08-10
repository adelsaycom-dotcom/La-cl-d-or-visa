import re

for f in ['components/auth/Login.tsx', 'components/auth/Register.tsx']:
    content = open(f).read()
    
    pattern = r'(<Input\s+type=\{showPassword \? "text" : "password"\}.*?placeholder="••••••••".*?/>\s*<button type="button".*?</button>)'
    replacement = r'<div className="relative">\n                  \1\n                </div>'
    
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    open(f, 'w').write(content)
