import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Activation de la persistance hors-ligne Firestore (cache IndexedDB navigateur)
// Réduit drastiquement les requêtes de lecture répétées lors des navigations
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Plusieurs onglets ouverts simultanément
      console.info('[Firestore Cache] Persistance multi-onglets active.');
    } else if (err.code === 'unimplemented') {
      // Navigateur sans support complet IndexedDB
      console.info('[Firestore Cache] Navigateur sans support persistance IndexedDB.');
    }
  });
}

