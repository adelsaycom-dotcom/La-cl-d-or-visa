import re

content = open('src/store/useAppStore.ts').read()
if 'clearData: () => set(' not in content:
    content = content.replace('updateApplication: (id: string, updates: Partial<Application>) => void;', 'updateApplication: (id: string, updates: Partial<Application>) => void;\n  clearData: () => void;')
    content = content.replace('updateApplication: async (id, updates) => {\n    await updateDoc(doc(db, \'applications\', id), updates);\n  }', 'updateApplication: async (id, updates) => {\n    await updateDoc(doc(db, \'applications\', id), updates);\n  },\n  clearData: () => {\n    set({ agencies: [], supportTickets: [], transactions: [], rechargeRequests: [], countries: [], applications: [], organizedTrips: [], tripReservations: [] });\n  }')
    open('src/store/useAppStore.ts', 'w').write(content)
