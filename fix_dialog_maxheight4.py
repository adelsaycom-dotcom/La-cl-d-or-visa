import re

content = open('components/agency/AgencySupport.tsx').read()

# Let's fix the dialog content CSS. In Radix UI/Shadcn, DialogContent max-h is usually limited. We need to let it breathe on mobile.
# We also need to fix the input padding that makes the textarea tall.
container_pattern = r'<DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl">'
new_container = '<DialogContent className="max-w-2xl p-0 overflow-hidden sm:rounded-3xl rounded-none w-full max-h-[100dvh] h-[100dvh] sm:h-auto sm:max-h-[85vh] m-0">'

content = content.replace(container_pattern, new_container)

container_pattern_2 = r'<div className="flex flex-col h-\[70vh\] min-h-\[400px\] sm:h-\[80vh\] md:h-\[600px\] max-h-\[85vh\]">'
new_container_2 = '<div className="flex flex-col h-full sm:h-[80vh] md:h-[600px]">'

content = content.replace(container_pattern_2, new_container_2)


# Make the textarea more compact on mobile to not take up too much space.
textarea_pattern = r'<Textarea \n                        value={replyText}'
new_textarea = '<Textarea \n                        value={replyText}'
content = content.replace(textarea_pattern, new_textarea)
content = content.replace('min-h-[44px] py-3', 'min-h-[44px] py-2 sm:py-3')

open('components/agency/AgencySupport.tsx', 'w').write(content)
print("Updated Max Height Again 4")
