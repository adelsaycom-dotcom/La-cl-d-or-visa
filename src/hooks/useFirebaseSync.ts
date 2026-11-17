import { useEffect, useRef } from 'react';
import { collection, onSnapshot, query, where, doc, getDoc, limit } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAppStore } from '../store/useAppStore';
import { catalogService } from '../services/catalogService';

const VERIFIED_ADMIN_EMAILS = new Set<string>([
  'adel.saycom@gmail.com',
  'admin@cle-dor.com',
  'admin@lacle-dor.com',
]);

export function useFirebaseSync() {
  const setStore = useAppStore.setState;
  const unsubsRef = useRef<(() => void)[]>([]);
  const currentUidRef = useRef<string | null>(null);

  useEffect(() => {
    const loadCachedCatalog = async () => {
      setStore({ catalogLoading: true });
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
          studyPrograms: programs as any,
          catalogLoading: false,
          catalogLoaded: true
        });
      } catch (err) {
        console.warn('[Catalog] Erreur initialisation catalogue:', err);
        setStore({ catalogLoading: false, catalogLoaded: true });
      }
    };

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
          unsubsRef.current.forEach(fn => {
            try { fn(); } catch (_) {}
          });
          unsubsRef.current = [];
        } else {
          console.warn(`[Firestore Sync] Erreur d'écoute sur '${collectionName}':`, err);
        }
      };

      if (user) {
        // Éviter toute redirection prématurée de ProtectedRoute pendant la résolution du profil
        const currentState = useAppStore.getState();
        const isAlreadyResolved =
          currentState.authReady &&
          currentState.authUserUid === user.uid &&
          currentState.authRole !== null;

        if (!isAlreadyResolved) {
          setStore({ authReady: false });
        }

        let resolvedRole: 'admin' | 'agency' | null = null;
        let initialAgencyData: any = null;

        try {
          let userDoc = await getDoc(doc(db, 'users', user.uid));
          // Court retry en cas d'inscription toute récente (création Auth juste avant setDoc)
          if (!userDoc.exists()) {
            await new Promise(resolve => setTimeout(resolve, 350));
            if (currentUidRef.current !== expectedUid) return;
            userDoc = await getDoc(doc(db, 'users', user.uid));
          }

          if (userDoc.exists()) {
            initialAgencyData = { id: userDoc.id, ...userDoc.data() };
            const normalizedRole = String(initialAgencyData.role || '').trim().toLowerCase();
            if (normalizedRole === 'admin') {
              resolvedRole = 'admin';
            } else if (normalizedRole === 'agency') {
              resolvedRole = 'agency';
            }
          } else if (user.emailVerified && user.email && VERIFIED_ADMIN_EMAILS.has(user.email.toLowerCase())) {
            resolvedRole = 'admin';
          }
        } catch (err: any) {
          if (err?.code === 'resource-exhausted' || err?.message?.includes('Quota exceeded')) {
            console.warn('[Firestore Quota] Quota atteint lors de la vérification du profil.');
            setStore({ quotaExceeded: true });
          }
          if (user.emailVerified && user.email && VERIFIED_ADMIN_EMAILS.has(user.email.toLowerCase())) {
            resolvedRole = 'admin';
          }
        }

        if (currentUidRef.current !== expectedUid) return;

        // Si Login.tsx a déjà pré-peuplé un profil valide pour ce même UID et que getDoc a échoué temporairement, préserver les données valides
        if (!resolvedRole && isAlreadyResolved) {
          resolvedRole = currentState.authRole;
          initialAgencyData = currentState.currentAgency;
        }

        setStore({
          authReady: true,
          authUserUid: user.uid,
          authRole: resolvedRole,
          currentAgency: initialAgencyData,
          agencyBalance: Number(initialAgencyData?.balance || 0),
          b2cMarginPercent: typeof initialAgencyData?.b2cMarginPercent === 'number' ? initialAgencyData.b2cMarginPercent : 15
        });

        const normalizedStatus = String(initialAgencyData?.status || 'ACTIVE').trim().toUpperCase();

        // Si le rôle n'est pas valide ou que le compte est en attente, ne pas ouvrir d'écouteurs protégés
        if (!resolvedRole || (resolvedRole === 'agency' && normalizedStatus === 'PENDING')) {
          return;
        }

        // Chargement du catalogue uniquement pour les utilisateurs authentifiés et autorisés
        loadCachedCatalog();

        const getQuery = (collName: string, maxItems = 40) => {
          if (resolvedRole === 'admin') return query(collection(db, collName), limit(maxItems));
          return query(collection(db, collName), where('agencyId', '==', user.uid), limit(maxItems));
        };

        // Écouteur temps réel 1 : Solde et profil de l'utilisateur actif
        try {
          unsubsRef.current.push(
            onSnapshot(
              doc(db, 'users', user.uid),
              docSnap => {
                if (docSnap.exists()) {
                  const data = docSnap.data();
                  const liveRoleRaw = String(data.role || '').trim().toLowerCase();
                  const liveRole: 'admin' | 'agency' | null =
                    liveRoleRaw === 'admin' ? 'admin' : liveRoleRaw === 'agency' ? 'agency' : null;
                  setStore({
                    agencyBalance: Number(data.balance || 0),
                    currentAgency: { id: docSnap.id, ...data } as any,
                    authRole: liveRole,
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

        // Écouteur temps réel 2 : Notifications (limité à 25)
        const notifQuery = resolvedRole === 'admin'
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

        // Écouteur temps réel 3 : Dossiers de visas récents (limité à 40)
        try {
          unsubsRef.current.push(
            onSnapshot(
              getQuery('applications', 40),
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

        // Écouteur temps réel 4 : Transactions financières
        try {
          unsubsRef.current.push(
            onSnapshot(
              getQuery('transactions', 50),
              snapshot => {
                const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                setStore({ transactions: docs as any });
              },
              err => handleSnapshotError('transactions', err)
            )
          );
        } catch (e) {
          handleSnapshotError('transactions', e);
        }

        // Écouteur temps réel 5 : Tickets de support
        try {
          unsubsRef.current.push(
            onSnapshot(
              getQuery('supportTickets', 40),
              snapshot => {
                const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                setStore({ supportTickets: docs as any });
              },
              err => handleSnapshotError('supportTickets', err)
            )
          );
        } catch (e) {
          handleSnapshotError('supportTickets', e);
        }

        // Écouteurs conditionnels pour l'administration vs agence
        if (resolvedRole === 'admin') {
          try {
            unsubsRef.current.push(
              onSnapshot(
                query(collection(db, 'rechargeRequests'), limit(50)),
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
                query(collection(db, 'users'), limit(100)),
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
          try {
            unsubsRef.current.push(
              onSnapshot(
                getQuery('rechargeRequests', 25),
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
              getQuery('studyApplications', 35),
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
              getQuery('tripReservations', 35),
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
        setStore({
          authReady: true,
          authUserUid: null,
          authRole: null,
          currentAgency: null,
          agencyBalance: 0,
          agencies: [],
          applications: [],
          supportTickets: [],
          transactions: [],
          rechargeRequests: [],
          tripReservations: [],
          studyApplications: [],
          notifications: [],
          catalogLoading: false,
          catalogLoaded: false
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
