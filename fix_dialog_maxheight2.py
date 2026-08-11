import re

content = open('components/agency/AgencySupport.tsx').read()

# Make the dialog use a flex column that expands properly inside the dialog layout without breaking out
# Instead of hardcoded vh which causes issues on mobile iOS/Android URL bars, we will use an explicit grid or a h-full max-h-[80vh]
container_pattern = r'<div className="flex flex-col h-\[75vh\] sm:h-\[80vh\] md:h-\[600px\] max-h-full">'
new_container = '<div className="flex flex-col h-[70vh] sm:h-[80vh] md:h-[600px] max-h-full">'

content = content.replace(container_pattern, new_container)

open('components/agency/AgencySupport.tsx', 'w').write(content)
print("Updated Max Height Again")
