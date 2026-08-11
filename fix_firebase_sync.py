import re

content = open('src/hooks/useFirebaseSync.ts').read()

if "collection(db, 'users')" not in content:
    sync_users = """
        // Users (Agencies)
        unsubs.push(onSnapshot(collection(db, 'users'), snapshot => {
          const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ agencies: users as any });
        }));
"""
    content = content.replace('// Applications', sync_users + '        // Applications')
    open('src/hooks/useFirebaseSync.ts', 'w').write(content)
