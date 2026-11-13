import { useEffect, useRef } from 'react';
import { collection, onSnapshot, query, where, doc, getDoc, limit } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAppStore } from '../store/useAppStore';
import { catalogService } from '../services/catalogService';

export function useFirebaseSync() {
  const setStore = useAppStore.setState;
  const unsubsRef = useRef<(() => void)[]>([]);
  const currentUidRef = useRef<string | null>(null);

  useEffect(() => {
    // 1. Chargement ponctuel et ultra-économe du catalogue (Cache TTL 15 min)
    // Évite 4 écouteurs onSnapshot continus sur les collections statiques
    const loadCachedCatalog = async () => {
      try {
        const [countries, services, trips, programs] = await Promise.all([
          catalogService.getCountries(),
          catalogService.getServices(),
          catalogService.getOrganizedTrips(),
          catalogService.getStudyPrograms()
        ]);

        setStore({
          countries: countries as any,
          services: services as any,
          organizedTrips: trips as any,
          studyPrograms: programs as any
        });
      } catch (err) {
        console.warn('[Catalog] Erreur initialisation catalogue:', err);
      }
    };

    loadCachedCatalog();

    // 2. Synchronisation sélective et ciblée pour l'utilisateur connecté
    const unsubAuth = auth.onAuthStateChanged(async user => {
      // Nettoyer les écouteurs précédents de manière synchrone
      unsubsRef.current.forEach(fn => {
        try { fn(); } catch (_) {}
      });
      unsubsRef.current = [];
      currentUidRef.current = user ? user.uid : null;
      const expectedUid = currentUidRef.current;

      const handleSnapshotError = (collectionName: string, err: any) => {
        if (err?.code === 'resource-exhausted' || err?.message?.includes('Quota exceeded')) {
          console.warn(`[Firestore Quota] Quota journalier atteint sur '${collectionName}'. Maintien du cache local.`);
          setStore({ quotaExceeded: true });
          // Déconnexion préventive des écouteurs pour ne pas saturer le quota
          unsubsRef.current.forEach(fn => {
            try { fn(); } catch (_) {}
          });
          unsubsRef.current = [];
        } else {
          console.warn(`[Firestore Sync] Erreur d'écoute sur '${collectionName}':`, err);
        }
      };

      if (user) {
        let role = 'agency';
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            role = userDoc.data().role || 'agency';
          }
        } catch (err: any) {
          if (err?.code === 'resource-exhausted' || err?.message?.includes('Quota exceeded')) {
            console.warn('[Firestore Quota] Quota atteint lors de la vérification du profil.');
            setStore({ quotaExceeded: true });
          }
          if (user.email === 'adel.saycom@gmail.com' || user.email?.startsWith('admin@')) {
            role = 'admin';
          }
        }

        if (currentUidRef.current !== expectedUid) return;

        // Fonction de construction des requêtes strictement paginées
        const getQuery = (collName: string, maxItems = 40) => {
          if (role === 'admin') return query(collection(db, collName), limit(maxItems));
          return query(collection(db, collName), where('agencyId', '==', user.uid), limit(maxItems));
        };

        // Écouteur temps réel 1 : Solde et profil de l'utilisateur actif (1 seul document !)
        try {
          unsubsRef.current.push(
            onSnapshot(
              doc(db, 'users', user.uid),
              docSnap => {
                if (docSnap.exists()) {
                  const data = docSnap.data();
                  setStore({ 
                    agencyBalance: data.balance || 0,
                    currentAgency: { id: docSnap.id, ...data } as any,
                    b2cMarginPercent: typeof data.b2cMarginPercent === 'number' ? data.b2cMarginPercent : 15
                  });
                }
              },
              err => handleSnapshotError('currentUser', err)
            )
          );
        } catch (e) {
          handleSnapshotError('currentUser', e);
        }

        // Écouteur temps réel 2 : Notifications non lues (limité à 25)
        const notifQuery = role === 'admin'
          ? query(collection(db, 'notifications'), where('agencyId', '==', 'admin'), limit(25))
          : getQuery('notifications', 25);

        try {
          unsubsRef.current.push(
            onSnapshot(
              notifQuery,
              snapshot => {
                const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                setStore({ notifications: docs as any });
              },
              err => handleSnapshotError('notifications', err)
            )
          );
        } catch (e) {
          handleSnapshotError('notifications', e);
        }

        // Écouteur temps réel 3 : Dossiers de visas récents (limité à 30)
        try {
          unsubsRef.current.push(
            onSnapshot(
              getQuery('applications', 30),
              snapshot => {
                const apps = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                setStore({ applications: apps as any });
              },
              err => handleSnapshotError('applications', err)
            )
          );
        } catch (e) {
          handleSnapshotError('applications', e);
        }

        // Écouteurs conditionnels pour l'administration (recharges en attente et tickets)
        if (role === 'admin') {
          try {
            unsubsRef.current.push(
              onSnapshot(
                query(collection(db, 'rechargeRequests'), where('status', '==', 'pending'), limit(20)),
                snapshot => {
                  const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                  setStore({ rechargeRequests: docs as any });
                },
                err => handleSnapshotError('rechargeRequests', err)
              )
            );
          } catch (e) {
            handleSnapshotError('rechargeRequests', e);
          }

          try {
            unsubsRef.current.push(
              onSnapshot(
                query(collection(db, 'users'), limit(50)),
                snapshot => {
                  const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                  setStore({ agencies: users as any });
                },
                err => handleSnapshotError('users', err)
              )
            );
          } catch (e) {
            handleSnapshotError('users', e);
          }
        } else {
          // Pour l'agence : recharges et tickets propres (limités à 15)
          try {
            unsubsRef.current.push(
              onSnapshot(
                getQuery('rechargeRequests', 15),
                snapshot => {
                  const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                  setStore({ rechargeRequests: docs as any });
                },
                err => handleSnapshotError('rechargeRequests', err)
              )
            );
          } catch (e) {
            handleSnapshotError('rechargeRequests', e);
          }
        }

        // Candidatures d'études récentes
        try {
          unsubsRef.current.push(
            onSnapshot(
              getQuery('studyApplications', 25),
              snapshot => {
                const apps = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                setStore({ studyApplications: apps as any });
              },
              err => handleSnapshotError('studyApplications', err)
            )
          );
        } catch (e) {
          handleSnapshotError('studyApplications', e);
        }

        // Réservations de voyages récentes
        try {
          unsubsRef.current.push(
            onSnapshot(
              getQuery('tripReservations', 25),
              snapshot => {
                const res = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                setStore({ tripReservations: res as any });
              },
              err => handleSnapshotError('tripReservations', err)
            )
          );
        } catch (e) {
          handleSnapshotError('tripReservations', e);
        }

      } else {
        // En cas de déconnexion, vider uniquement les données privées
        setStore({
          agencies: [],
          applications: [],
          supportTickets: [],
          transactions: [],
          rechargeRequests: [],
          tripReservations: [],
          studyApplications: []
        });
      }
    });

    return () => {
      unsubAuth();
      unsubsRef.current.forEach(fn => {
        try { fn(); } catch (_) {}
      });
      unsubsRef.current = [];
      currentUidRef.current = null;
    };
  }, [setStore]);
}
