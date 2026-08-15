with open('components/agency/AgencyLayout.tsx', 'r') as f:
    content = f.read()

import re
old_dropdown = re.search(r'\{/\* Notifications \*/\}.*?</DropdownMenu>', content, flags=re.DOTALL)
if old_dropdown:
    print("Found dropdown. Length:", len(old_dropdown.group(0)))
else:
    print("Dropdown not found")
