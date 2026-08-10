import re

content = open('components/auth/Register.tsx').read()
pattern = r'(<Input required type="password".*?placeholder="••••••••".*?/>)'
replacement = r'''<div className="relative">
                 <Input required type={showPassword ? "text" : "password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="h-12 bg-gray-50 border-gray-200 focus:border-primary-gold" />
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                 </button>
               </div>'''
content = re.sub(pattern, replacement, content)
open('components/auth/Register.tsx', 'w').write(content)
