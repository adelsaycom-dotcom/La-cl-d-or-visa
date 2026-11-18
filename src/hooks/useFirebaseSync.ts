import { useEffect, useRef } from 'react';
import { collection, onSnapshot, query, where, doc, getDoc, limit } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAppStore } from '../store/useAppStore';
import { catalogService } from '../services/catalogService';
import { getBackendMode, apiFetch } from '../services/apiClient';

const VERIFIED_ADMIN_EMAILS = new Set<string>([
  'adel.saycom@gmail.com',
  'admin@cle-dor.com',
  'admin@lacle-dor.com',
  'admin@cle-dor-visa.com',
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
      // Nettoyer les écouteurs / timers précédents de manière synchrone
      unsubsRef.current.forEach(fn => {
        try { fn(); } catch (_) {}
      });
      unsubsRef.current = [];
      currentUidRef.current = user ? user.uid : null;
      const expectedUid = currentUidRef.current;

      const mode = await getBackendMode(true);
      if (currentUidRef.current !== expectedUid) return;
      setStore({ databaseMode: mode });

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
        const currentState = useAppStore.getState();
        const isAlreadyResolved =
          currentState.authReady &&
          currentState.authUserUid === user.uid &&
          currentState.authRole !== null;

        if (!isAlreadyResolved) {
          setStore({ authReady: false });
        }

        // =====================================================================
        // MODE 1 : MYSQL HOSTINGER ACTIF (0 LECTURE FIRESTORE)
        // =====================================================================
        if (mode === 'mysql') {
          try {
            let boot: any = null;
            try {
              boot = await apiFetch('/api/db/bootstrap');
            } catch (firstErr: any) {
              // Court retry en cas d'inscription toute récente
              await new Promise(resolve => setTimeout(resolve, 350));
              if (currentUidRef.current !== expectedUid) return;
              try {
                boot = await apiFetch('/api/db/bootstrap');
              } catch {
                throw firstErr;
              }
            }

            if (currentUidRef.current !== expectedUid) return;

            const agency = boot.currentAgency || null;
            const roleRaw = String(boot.role || agency?.role || '').trim().toLowerCase();
            const resolvedRole: 'admin' | 'agency' | null =
              roleRaw === 'admin' ? 'admin' : roleRaw === 'agency' ? 'agency' : null;

            if (boot.restricted) {
              setStore({
                authReady: true,
                authUserUid: user.uid,
                authRole: resolvedRole,
                currentAgency: agency,
                agencyBalance: Number(agency?.balance || 0),
                b2cMarginPercent: typeof agency?.b2cMarginPercent === 'number' ? agency.b2cMarginPercent : 15,
                quotaExceeded: false,
                databaseMode: 'mysql',
              });
              return;
            }

            setStore({
              authReady: true,
              authUserUid: user.uid,
              authRole: resolvedRole,
              currentAgency: agency,
              agencyBalance: Number(agency?.balance || 0),
              b2cMarginPercent: typeof agency?.b2cMarginPercent === 'number' ? agency.b2cMarginPercent : 15,
              countries: boot.countries || [],
              services: boot.services || [],
              organizedTrips: boot.organizedTrips || [],
              studyPrograms: boot.studyPrograms || [],
              applications: boot.applications || [],
              studyApplications: boot.studyApplications || [],
              tripReservations: boot.tripReservations || [],
              transactions: boot.transactions || [],
              rechargeRequests: boot.rechargeRequests || [],
              supportTickets: boot.supportTickets || [],
              notifications: boot.notifications || [],
              agencies: boot.agencies || [],
              catalogLoading: false,
              catalogLoaded: true,
              quotaExceeded: false,
              databaseMode: 'mysql',
            });

            // Rafraîchissement léger toutes les 30s (uniquement si onglet visible)
            const pollTimer = window.setInterval(() => {
              if (
                document.visibilityState === 'visible' &&
                currentUidRef.current === expectedUid
              ) {
                useAppStore.getState().refreshAllFromMysql().catch(() => {});
              }
            }, 30000);

            unsubsRef.current.push(() => window.clearInterval(pollTimer));
            return;
          } catch (mysqlErr) {
            console.warn('[MySQL Sync] Erreur bootstrap MySQL:', mysqlErr);
            if (isAlreadyResolved) {
              setStore({ authReady: true, databaseMode: 'mysql' });
            } else {
              const fallbackAdmin =
                user.email && VERIFIED_ADMIN_EMAILS.has(user.email.toLowerCase())
                  ? ('admin' as const)
                  : null;
              setStore({
                authReady: true,
                authUserUid: user.uid,
                authRole: fallbackAdmin,
                databaseMode: 'mysql',
              });
            }
            return;
          }
        }

        // =====================================================================
        // MODE 2 : FIRESTORE (SECOURS QUAND MYSQL N'EST PAS CONFIGURÉ)
        // =====================================================================
        let resolvedRole: 'admin' | 'agency' | null = null;
        let initialAgencyData: any = null;

        try {
          let userDoc = await getDoc(doc(db, 'users', user.uid));
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
          } else if (user.email && VERIFIED_ADMIN_EMAILS.has(user.email.toLowerCase())) {
            resolvedRole = 'admin';
          }
        } catch (err: any) {
          if (err?.code === 'resource-exhausted' || err?.message?.includes('Quota exceeded')) {
            console.warn('[Firestore Quota] Quota atteint lors de la vérification du profil.');
            setStore({ quotaExceeded: true });
          }
          if (user.email && VERIFIED_ADMIN_EMAILS.has(user.email.toLowerCase())) {
            resolvedRole = 'admin';
          }
        }

        if (currentUidRef.current !== expectedUid) return;

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

        if (!resolvedRole || (resolvedRole === 'agency' && normalizedStatus === 'PENDING')) {
          return;
        }

        loadCachedCatalog();

        const getQuery = (collName: string, maxItems = 40) => {
          if (resolvedRole === 'admin') return query(collection(db, collName), limit(maxItems));
          return query(collection(db, collName), where('agencyId', '==', user.uid), limit(maxItems));
        };

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
