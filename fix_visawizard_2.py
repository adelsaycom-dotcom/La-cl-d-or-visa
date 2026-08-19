import re

with open('components/agency/VisaWizard.tsx', 'r') as f:
    content = f.read()

content = content.replace("selectedVisa?.name", "selectedService?.title")
content = content.replace("selectedVisa?.type", "selectedService?.type")
content = content.replace("selectedVisa?.", "selectedService?.")

with open('components/agency/VisaWizard.tsx', 'w') as f:
    f.write(content)
