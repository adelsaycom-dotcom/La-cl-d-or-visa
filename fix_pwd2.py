import re

for f in ['components/auth/Login.tsx', 'components/auth/Register.tsx']:
    content = open(f).read()
    
    # Check if there is an Eye/EyeOff import
    if 'Eye,' not in content:
        content = content.replace('LogOut,', 'LogOut, Eye, EyeOff,')
        content = content.replace('ArrowRight }', 'ArrowRight, Eye, EyeOff }')
        
    content = content.replace('type="password" value={password} onChange={(e) => setPassword(e.target.value)}', 'type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}')
    
    new_input = """type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>"""
                  
    content = content.replace('type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />', new_input)
    open(f, 'w').write(content)
