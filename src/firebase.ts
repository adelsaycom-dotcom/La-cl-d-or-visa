import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

let lazyDbPromise: Promise<Firestore> | null = null;

/**
 * Charge Firestore uniquement à la demande (mode secours ou import admin),
 * évitant de télécharger et d'initialiser le SDK Firestore lorsque MySQL Hostinger est actif.
 */
export async function getFirestoreDb(): Promise<Firestore> {
  if (!lazyDbPromise) {
    lazyDbPromise = (async () => {
      const { getFirestore } = await import('firebase/firestore');
      return getFirestore(app, firebaseConfig.firestoreDatabaseId);
    })();
  }
  return lazyDbPromise;
}

