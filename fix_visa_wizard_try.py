import re

with open('components/agency/VisaWizard.tsx', 'r') as f:
    content = f.read()

content = content.replace("  const handleSubmit = () => {\n    const price = selectedVisa?.price || 0;\n    addApplication({", "  const handleSubmit = async () => {\n    const price = selectedVisa?.price || 0;\n    try {\n      await addApplication({")

with open('components/agency/VisaWizard.tsx', 'w') as f:
    f.write(content)
