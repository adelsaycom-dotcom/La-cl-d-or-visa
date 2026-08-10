import re
import os

for file_name in ['components/auth/Login.tsx', 'components/auth/Register.tsx']:
    content = open(file_name).read()
    if 'import { Eye, EyeOff } from "lucide-react";' not in content:
        content = content.replace('import { Mail, Lock, Building, User, LogIn, ArrowRight } from "lucide-react";', 'import { Mail, Lock, Building, User, LogIn, ArrowRight, Eye, EyeOff } from "lucide-react";')
        content = content.replace('import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";', 'import { Mail, Lock, LogIn, ArrowRight, Eye, EyeOff } from "lucide-react";')
        
    if 'const [showPassword, setShowPassword] = useState(false);' not in content:
        content = re.sub(r'(const \[password, setPassword\] = useState\(""\);)', r'\1\n  const [showPassword, setShowPassword] = useState(false);', content)
        
    content = re.sub(r'type="password"([^>]+)onChange\{\(e\) => setPassword\(e\.target\.value\)\}([^>]*)/?>', r'type={showPassword ? "text" : "password"}\1onChange={(e) => setPassword(e.target.value)}\2/>', content)
    
    # Also add the icon button inside the relative div
    icon_button = """<button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>"""
                  
    content = re.sub(r'(<Input\s+id="password".*?onChange=\{\(e\) => setPassword\(e\.target\.value\)\}.*?/>)', r'\1\n                  ' + icon_button, content, flags=re.DOTALL)
    
    open(file_name, 'w').write(content)
