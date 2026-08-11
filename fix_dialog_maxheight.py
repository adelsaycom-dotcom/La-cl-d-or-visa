import re

content = open('components/agency/AgencySupport.tsx').read()

# Make the outer container scale gracefully up to 100% of the DialogContent
# and rely on the DialogContent's padding/margins.
container_pattern = r'<div className="flex flex-col h-\[85vh\] sm:h-\[80vh\] md:h-\[600px\] max-h-\[800px\]">'
new_container = '<div className="flex flex-col h-[75vh] sm:h-[80vh] md:h-[600px] max-h-full">'

content = content.replace(container_pattern, new_container)

open('components/agency/AgencySupport.tsx', 'w').write(content)
print("Updated Max Height")
