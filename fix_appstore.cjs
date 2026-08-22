const fs = require('fs');
let content = fs.readFileSync('src/store/useAppStore.ts', 'utf8');

// Update Application interface
content = content.replace(
  'status: "Pending" | "Processing" | "Approved" | "Rejected";',
  'status: "Pending" | "Processing" | "ActionRequired" | "Approved" | "Rejected";\n  timeline?: {\n    id: string;\n    date: string;\n    title: string;\n    message: string;\n    sender: "Admin" | "Agency" | "System";\n  }[];'
);

// Add missing function to AppStore definition
content = content.replace(
  'updateApplication: (id: string, updates: Partial<Application>) => void;',
  'updateApplication: (id: string, updates: Partial<Application>) => void;\n  addApplicationTimelineEntry: (id: string, entry: Omit<NonNullable<Application["timeline"]>[0], "id" | "date">) => Promise<void>;'
);

// Add implementation of addApplicationTimelineEntry
const implMatch = 'updateApplication: async (id, updates) => {\n    await updateDoc(doc(db, \'applications\', id), updates);\n  },';
const newImpl = `updateApplication: async (id, updates) => {
    await updateDoc(doc(db, 'applications', id), updates);
  },
  addApplicationTimelineEntry: async (id, entry) => {
    const appRef = doc(db, 'applications', id);
    const newEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString()
    };
    
    // Using arrayUnion directly via a direct firestore import or manual local update (simplified for store)
    // We'll update via the store's current apps to make it simple
    const currentApp = get().applications.find(a => a.id === id);
    if (currentApp) {
      const newTimeline = [...(currentApp.timeline || []), newEntry];
      await updateDoc(appRef, { timeline: newTimeline });
    }
  },`;

content = content.replace(implMatch, newImpl);
fs.writeFileSync('src/store/useAppStore.ts', content);
