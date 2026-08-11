import re

content = open('components/agency/AgencySupport.tsx').read()

# On some mobile layouts, letting the browser decide is the safest choice instead of forcing a strict `vh` that fights the soft keyboard.
container_pattern = r'<div className="flex flex-col h-\[70vh\] sm:h-\[80vh\] md:h-\[600px\] max-h-full">'
new_container = '<div className="flex flex-col h-[70vh] min-h-[400px] sm:h-[80vh] md:h-[600px] max-h-[85vh]">'

content = content.replace(container_pattern, new_container)

open('components/agency/AgencySupport.tsx', 'w').write(content)
print("Updated Max Height Again 3")
