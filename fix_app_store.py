import re

with open('src/store/useAppStore.ts', 'r') as f:
    content = f.read()

# Fix mock intitializer at the end of the file
if "addService:" not in content.split("create(")[-1]:
    content = content.replace("clearData: () => {", "addService: (s) => {}, updateService: (id, s) => {}, deleteService: (id) => {}, clearData: () => {")

with open('src/store/useAppStore.ts', 'w') as f:
    f.write(content)
