import re

content = open('src/hooks/useFirebaseSync.ts').read()
replacement = '''
import { useEffect } from 'react';
import { collection, onSnapshot, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAppStore } from '../store/useAppStore';

export function useFirebaseSync() {
  const setStore = useAppStore.setState;

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(async user => {
      if (user) {
        // Fetch role
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const role = userDoc.exists() ? userDoc.data().role : 'agency';

        const unsubs: (() => void)[] = [];

        // Helper to get query
        const getQuery = (collName: string) => {
          if (role === 'admin') return collection(db, collName);
          return query(collection(db, collName), where('agencyId', '==', user.uid));
        };

        unsubs.push(onSnapshot(collection(db, 'users'), snapshot => {
          const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ agencies: users as any });
        }));

        unsubs.push(onSnapshot(getQuery('applications'), snapshot => {
          const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ applications: apps as any });
        }));
        
        unsubs.push(onSnapshot(getQuery('supportTickets'), snapshot => {
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ supportTickets: docs as any });
        }));

        unsubs.push(onSnapshot(getQuery('transactions'), snapshot => {
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ transactions: docs as any });
        }));

        unsubs.push(onSnapshot(getQuery('rechargeRequests'), snapshot => {
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ rechargeRequests: docs as any });
        }));

        unsubs.push(onSnapshot(collection(db, 'countries'), snapshot => {
          const countries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ countries: countries as any });
        }));

        unsubs.push(onSnapshot(collection(db, 'organizedTrips'), snapshot => {
          const trips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ organizedTrips: trips as any });
        }));

        unsubs.push(onSnapshot(getQuery('tripReservations'), snapshot => {
          const res = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ tripReservations: res as any });
        }));
        
        unsubs.push(onSnapshot(doc(db, 'users', user.uid), docSnap => {
          if (docSnap.exists()) {
            setStore({ agencyBalance: docSnap.data().balance || 0 });
          }
        }));

        return () => unsubs.forEach(fn => fn());
      } else {
        setStore({ agencies: [], applications: [], supportTickets: [], transactions: [], rechargeRequests: [], countries: [], organizedTrips: [], tripReservations: [] });
      }
    });

    return () => unsubAuth();
  }, [setStore]);
}
'''
open('src/hooks/useFirebaseSync.ts', 'w').write(replacement)
