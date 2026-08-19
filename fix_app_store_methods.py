import re

with open('src/store/useAppStore.ts', 'r') as f:
    content = f.read()

replacement = """  addService: (s) => set((state) => ({ services: [...state.services, s] })),
  updateService: (id, s) => set((state) => ({ services: state.services.map(x => x.id === id ? { ...x, ...s } : x) })),
  deleteService: (id) => set((state) => ({ services: state.services.filter(x => x.id !== id) })),
"""

if "addService: (s) => set" not in content:
    content = content.replace("  addOrganizedTrip: async (tripData) => {", replacement + "\n  addOrganizedTrip: async (tripData) => {")

with open('src/store/useAppStore.ts', 'w') as f:
    f.write(content)
