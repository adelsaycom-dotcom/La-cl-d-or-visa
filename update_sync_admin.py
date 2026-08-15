import re

with open('src/hooks/useFirebaseSync.ts', 'r') as f:
    content = f.read()

old_notif = r"""        unsubsRef\.current\.push\(onSnapshot\(getQuery\('notifications'\), snapshot => \{
          const docs = snapshot\.docs\.map\(doc => \(\{ id: doc\.id, \.\.\.doc\.data\(\) \}\)\);
          setStore\(\{ notifications: docs as any \}\);
        \}\)\);"""

new_notif = """        const notifQuery = role === 'admin' ? query(collection(db, 'notifications'), where('agencyId', '==', 'admin')) : getQuery('notifications');
        unsubsRef.current.push(onSnapshot(notifQuery, snapshot => {
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ notifications: docs as any });
        }));"""

content = re.sub(old_notif, new_notif, content)

with open('src/hooks/useFirebaseSync.ts', 'w') as f:
    f.write(content)
