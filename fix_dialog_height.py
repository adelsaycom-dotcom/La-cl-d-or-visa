import re

content = open('components/agency/AgencySupport.tsx').read()

# For mobile devices, sometimes h-[80vh] is still too tall with the keyboard open. Let's use max-h-[85vh] or h-[100dvh] for mobile screens.
# Since DialogContent already centers, let's adjust the flex container inside.
container_pattern = r'<div className="flex flex-col h-\[80vh\] md:h-\[600px\]">'
new_container = '<div className="flex flex-col h-[85vh] sm:h-[80vh] md:h-[600px] max-h-[800px]">'

content = content.replace(container_pattern, new_container)

open('components/agency/AgencySupport.tsx', 'w').write(content)
print("Updated Dialog Container Height")
