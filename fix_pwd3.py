import re

for f in ['components/auth/Login.tsx', 'components/auth/Register.tsx']:
    content = open(f).read()
    
    # We will search for `<Input ... placeholder="••••••••" ... />`
    
    pattern = r'(<Input\s+type=\{showPassword \? "text" : "password"\}.*?placeholder="••••••••".*?/>)'
    replacement = r'\1\n                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400 hover:text-gray-600">\n                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}\n                  </button>'
    
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    # Also we need to wrap the input in a relative div if it's not already
    
    open(f, 'w').write(content)
