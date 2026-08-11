import re
content = open('components/agency/AgencySupport.tsx').read()
matches = re.findall(r'\{\/\* Chat body \*\/\}.*?\{\/\* Footer \/ Input \*\/\}.*?\}\)', content, flags=re.DOTALL)
print(len(matches))
