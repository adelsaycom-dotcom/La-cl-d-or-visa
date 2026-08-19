import re

with open('components/agency/VisaWizard.tsx', 'r') as f:
    content = f.read()

content = content.replace('country: selectedService?.name || "Unknown",', 'country: selectedService?.destination || "Unknown",')
content = content.replace('serviceType: currentService.type,', 'serviceType: selectedService?.type || "Evisa",')

with open('components/agency/VisaWizard.tsx', 'w') as f:
    f.write(content)
