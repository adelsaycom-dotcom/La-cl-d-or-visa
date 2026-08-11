import re

content = open('src/hooks/useFirebaseSync.ts').read()
replacement = '''
import { useEffect, useRef } from 'react';
import { collection, onSnapshot, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAppStore } from '../store/useAppStore';

export function useFirebaseSync() {
  const setStore = useAppStore.setState;
  const unsubsRef = useRef<(() => void)[]>([]);
  const currentUidRef = useRef<string | null>(null);

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(async user => {
      // Clear previous listeners synchronously
      unsubsRef.current.forEach(fn => fn());
      unsubsRef.current = [];
      currentUidRef.current = user ? user.uid : null;
      const expectedUid = currentUidRef.current;

      if (user) {
        // Fetch role
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        // If auth state changed while fetching role, abort to prevent dangling listeners
        if (currentUidRef.current !== expectedUid) return;
        
        const role = userDoc.exists() ? userDoc.data().role : 'agency';

        // Helper to get query
        const getQuery = (collName: string) => {
          if (role === 'admin') return collection(db, collName);
          return query(collection(db, collName), where('agencyId', '==', user.uid));
        };

        if (role === 'admin') {
          unsubsRef.current.push(onSnapshot(collection(db, 'users'), snapshot => {
            const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStore({ agencies: users as any });
          }));
        }

        unsubsRef.current.push(onSnapshot(getQuery('applications'), snapshot => {
          const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ applications: apps as any });
        }));
        
        unsubsRef.current.push(onSnapshot(getQuery('supportTickets'), snapshot => {
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ supportTickets: docs as any });
        }));

        unsubsRef.current.push(onSnapshot(getQuery('transactions'), snapshot => {
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ transactions: docs as any });
        }));

        unsubsRef.current.push(onSnapshot(getQuery('rechargeRequests'), snapshot => {
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ rechargeRequests: docs as any });
        }));

        unsubsRef.current.push(onSnapshot(collection(db, 'countries'), snapshot => {
          const countries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ countries: countries as any });
        }));

        unsubsRef.current.push(onSnapshot(collection(db, 'organizedTrips'), snapshot => {
          const trips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ organizedTrips: trips as any });
        }));

        unsubsRef.current.push(onSnapshot(getQuery('tripReservations'), snapshot => {
          const res = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ tripReservations: res as any });
        }));
        
        unsubsRef.current.push(onSnapshot(doc(db, 'users', user.uid), docSnap => {
          if (docSnap.exists()) {
            setStore({ agencyBalance: docSnap.data().balance || 0 });
          }
        }));

      } else {
        setStore({ agencies: [], applications: [], supportTickets: [], transactions: [], rechargeRequests: [], countries: [], organizedTrips: [], tripReservations: [] });
      }
    });

    return () => {
      unsubAuth();
      unsubsRef.current.forEach(fn => fn());
      unsubsRef.current = [];
      currentUidRef.current = null;
    };
  }, [setStore]);
}
'''
open('src/hooks/useFirebaseSync.ts', 'w').write(replacement)
