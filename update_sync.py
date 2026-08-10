import re

content = open('src/hooks/useFirebaseSync.ts').read()

sync_code = """
        // Support Tickets
        unsubs.push(onSnapshot(collection(db, 'supportTickets'), snapshot => {
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ supportTickets: docs as any });
        }));

        // Transactions
        unsubs.push(onSnapshot(collection(db, 'transactions'), snapshot => {
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ transactions: docs as any });
        }));

        // Recharge Requests
        unsubs.push(onSnapshot(collection(db, 'rechargeRequests'), snapshot => {
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ rechargeRequests: docs as any });
        }));
"""

if "supportTickets" not in content:
    content = content.replace("// Countries", sync_code + "\n        // Countries")

open('src/hooks/useFirebaseSync.ts', 'w').write(content)
