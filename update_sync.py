import re

with open('src/hooks/useFirebaseSync.ts', 'r') as f:
    content = f.read()

# Add notifications listener
if 'getQuery(\'notifications\')' not in content:
    notif_listener = """
        unsubsRef.current.push(onSnapshot(getQuery('notifications'), snapshot => {
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ notifications: docs as any });
        }));"""
    content = content.replace("unsubsRef.current.push(onSnapshot(getQuery('applications')", notif_listener + "\n        unsubsRef.current.push(onSnapshot(getQuery('applications')")

with open('src/hooks/useFirebaseSync.ts', 'w') as f:
    f.write(content)
