import re

with open('components/agency/AgencyApplications.tsx', 'r') as f:
    content = f.read()

def replacer(match):
    val = match.group(1)
    if 'typeof' in val or 'JSON.stringify' in val or 'getStatusBadge' in val or 'entry.sender' in val or 'new Date' in val or 'isImageBase64' in val:
        return match.group(0)
    return f"{{typeof {val} === 'object' ? JSON.stringify({val}) : String({val} || '')}}"

content = re.sub(r'\{([a-zA-Z0-9_\.]+)\}', replacer, content)
content = content.replace('{selectedApp.price.toLocaleString()}', '{typeof selectedApp.price === "number" ? selectedApp.price.toLocaleString() : "0"}')

with open('components/agency/AgencyApplications.tsx', 'w') as f:
    f.write(content)
