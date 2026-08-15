import re

with open('components/LandingPage.tsx', 'r') as f:
    content = f.read()

# Replace all inline logo occurrences with Logo component
pattern2 = r'<div className="flex items-center gap-2"><div className="bg-[^>]+><Globe2[^>]+></div><span className="text-[^>]+>La Clé d\'Or <span[^>]+>Visa</span></span></div>'
content = re.sub(pattern2, '<Logo />', content, flags=re.DOTALL)

with open('components/LandingPage.tsx', 'w') as f:
    f.write(content)

