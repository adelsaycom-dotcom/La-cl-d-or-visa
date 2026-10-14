import re

with open('components/admin/OrganizedTripsManagement.tsx', 'r') as f:
    content = f.read()

def replacer(match):
    val = match.group(1)
    if 'typeof' in val or 'JSON.stringify' in val or 'getStatusBadge' in val or 'entry.sender' in val or 'new Date' in val or 'isImageBase64' in val or 'res.status' in val:
        return match.group(0)
    return f"{{typeof {val} === 'object' ? JSON.stringify({val}) : String({val} || '')}}"

content = re.sub(r'\{([a-zA-Z0-9_\.]+)\}', replacer, content)

with open('components/admin/OrganizedTripsManagement.tsx', 'w') as f:
    f.write(content)
