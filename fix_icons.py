import re

content = open('components/auth/Login.tsx').read()
content = content.replace('import { ArrowRight, PlaneTakeoff, ShieldCheck, Sparkles, Building2 } from "lucide-react";', 'import { ArrowRight, PlaneTakeoff, ShieldCheck, Sparkles, Building2, Eye, EyeOff } from "lucide-react";')
open('components/auth/Login.tsx', 'w').write(content)

content = open('components/auth/Register.tsx').read()
if 'import { Eye, EyeOff } from "lucide-react";' not in content:
    content = content.replace('import { Textarea } from "@/components/ui/textarea";', 'import { Textarea } from "@/components/ui/textarea";\nimport { Eye, EyeOff } from "lucide-react";')
open('components/auth/Register.tsx', 'w').write(content)

