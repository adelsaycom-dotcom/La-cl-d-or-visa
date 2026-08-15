import re

with open('components/agency/VisaWizard.tsx', 'r') as f:
    content = f.read()

content = content.replace("      },\n      });\n      alert", "      }\n      });\n      alert")

with open('components/agency/VisaWizard.tsx', 'w') as f:
    f.write(content)
