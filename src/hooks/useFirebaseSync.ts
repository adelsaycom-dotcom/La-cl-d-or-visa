import { useEffect } from 'react';
import { collection, onSnapshot, query, where, getDocs, setDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAppStore } from '../store/useAppStore';

export function useFirebaseSync() {
  const setStore = useAppStore.setState;

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(user => {
      if (user) {
        // We could fetch user role here and set it in store, but for simplicity:
        // Set up listeners
        const unsubs: (() => void)[] = [];

        // Applications
        unsubs.push(onSnapshot(collection(db, 'applications'), snapshot => {
          const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ applications: apps as any });
        }));

        
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

        // Countries
        unsubs.push(onSnapshot(collection(db, 'countries'), snapshot => {
          const countries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ countries: countries as any });
        }));

        // Organized Trips
        unsubs.push(onSnapshot(collection(db, 'organizedTrips'), snapshot => {
          const trips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ organizedTrips: trips as any });
        }));

        // Trip Reservations
        unsubs.push(onSnapshot(collection(db, 'tripReservations'), snapshot => {
          const res = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStore({ tripReservations: res as any });
        }));
        
        // Agency Balance & User Data
        unsubs.push(onSnapshot(doc(db, 'users', user.uid), docSnap => {
          if (docSnap.exists()) {
            setStore({ agencyBalance: docSnap.data().balance || 0 });
          }
        }));

        return () => unsubs.forEach(fn => fn());
      } else {
        // Clear store?
      }
    });
    return () => unsubAuth();
  }, [setStore]);
}
