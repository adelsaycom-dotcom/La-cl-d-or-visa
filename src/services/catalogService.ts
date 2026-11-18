/**
 * Service de gestion du catalogue (Pays, Services, Voyages, Études).
 * - En mode MySQL Hostinger : 1 seule requête API /api/db/catalog (0 lecture Firestore).
 * - En mode secours Firestore : cache mémoire + localStorage persistant (TTL 15 min)
 *   afin d'éviter de reconsommer ~260 lectures à chaque actualisation F5.
 */

import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Country, PrestationService, OrganizedTrip, StudyProgram } from '../store/useAppStore';
import { getBackendMode } from './apiClient';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface CatalogBundle {
  countries: Country[];
  services: PrestationService[];
  organizedTrips: OrganizedTrip[];
  studyPrograms: StudyProgram[];
}

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const STORAGE_KEY_PREFIX = 'cldor_cat_v2_';

const memoryCache = {
  countries: null as CacheEntry<Country[]> | null,
  services: null as CacheEntry<PrestationService[]> | null,
  organizedTrips: null as CacheEntry<OrganizedTrip[]> | null,
  studyPrograms: null as CacheEntry<StudyProgram[]> | null,
};

let pendingMysqlCatalogFetch: Promise<CatalogBundle> | null = null;

function isCacheValid<T>(entry: CacheEntry<T> | null): boolean {
  if (!entry) return false;
  return Date.now() - entry.timestamp < CACHE_TTL_MS;
}

function readPersistentCache<T>(key: keyof typeof memoryCache): CacheEntry<T> | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry<T>;
    if (parsed && Array.isArray(parsed.data) && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
      return parsed;
    }
  } catch {
    // Ignorer erreur localStorage
  }
  return null;
}

function writePersistentCache<T>(key: keyof typeof memoryCache, data: T[]) {
  const entry = { data, timestamp: Date.now() };
  (memoryCache as any)[key] = entry;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, JSON.stringify(entry));
    }
  } catch {
    // Quota localStorage dépassé (ex: images lourdes) : le cache mémoire reste actif
  }
}

async function fetchMysqlCatalogBundle(): Promise<CatalogBundle> {
  if (pendingMysqlCatalogFetch) return pendingMysqlCatalogFetch;
  pendingMysqlCatalogFetch = (async () => {
    const res = await fetch('/api/db/catalog', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Erreur catalogue MySQL (${res.status})`);
    }
    const payload = (await res.json()) as CatalogBundle;
    writePersistentCache('countries', payload.countries || []);
    writePersistentCache('services', payload.services || []);
    writePersistentCache('organizedTrips', payload.organizedTrips || []);
    writePersistentCache('studyPrograms', payload.studyPrograms || []);
    return payload;
  })().finally(() => {
    pendingMysqlCatalogFetch = null;
  });
  return pendingMysqlCatalogFetch;
}

export const catalogService = {
  async getCountries(forceRefresh = false): Promise<Country[]> {
    if (!forceRefresh) {
      if (isCacheValid(memoryCache.countries)) return memoryCache.countries!.data;
      const persisted = readPersistentCache<Country[]>('countries');
      if (persisted) {
        memoryCache.countries = persisted;
        return persisted.data;
      }
    }

    try {
      const mode = await getBackendMode();
      if (mode === 'mysql') {
        const bundle = await fetchMysqlCatalogBundle();
        return bundle.countries || [];
      }

      const snap = await getDocs(query(collection(db, 'countries'), limit(50)));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Country[];
      writePersistentCache('countries', data);
      return data;
    } catch (err) {
      console.warn('[CatalogService] Erreur lecture countries:', err);
      return memoryCache.countries?.data || [];
    }
  },

  async getServices(forceRefresh = false): Promise<PrestationService[]> {
    if (!forceRefresh) {
      if (isCacheValid(memoryCache.services)) return memoryCache.services!.data;
      const persisted = readPersistentCache<PrestationService[]>('services');
      if (persisted) {
        memoryCache.services = persisted;
        return persisted.data;
      }
    }

    try {
      const mode = await getBackendMode();
      if (mode === 'mysql') {
        const bundle = await fetchMysqlCatalogBundle();
        return bundle.services || [];
      }

      const snap = await getDocs(query(collection(db, 'services'), limit(100)));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as PrestationService[];
      writePersistentCache('services', data);
      return data;
    } catch (err) {
      console.warn('[CatalogService] Erreur lecture services:', err);
      return memoryCache.services?.data || [];
    }
  },

  async getOrganizedTrips(forceRefresh = false): Promise<OrganizedTrip[]> {
    if (!forceRefresh) {
      if (isCacheValid(memoryCache.organizedTrips)) return memoryCache.organizedTrips!.data;
      const persisted = readPersistentCache<OrganizedTrip[]>('organizedTrips');
      if (persisted) {
        memoryCache.organizedTrips = persisted;
        return persisted.data;
      }
    }

    try {
      const mode = await getBackendMode();
      if (mode === 'mysql') {
        const bundle = await fetchMysqlCatalogBundle();
        return bundle.organizedTrips || [];
      }

      const snap = await getDocs(query(collection(db, 'organizedTrips'), limit(50)));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as OrganizedTrip[];
      writePersistentCache('organizedTrips', data);
      return data;
    } catch (err) {
      console.warn('[CatalogService] Erreur lecture organizedTrips:', err);
      return memoryCache.organizedTrips?.data || [];
    }
  },

  async getStudyPrograms(forceRefresh = false): Promise<StudyProgram[]> {
    if (!forceRefresh) {
      if (isCacheValid(memoryCache.studyPrograms)) return memoryCache.studyPrograms!.data;
      const persisted = readPersistentCache<StudyProgram[]>('studyPrograms');
      if (persisted) {
        memoryCache.studyPrograms = persisted;
        return persisted.data;
      }
    }

    try {
      const mode = await getBackendMode();
      if (mode === 'mysql') {
        const bundle = await fetchMysqlCatalogBundle();
        return bundle.studyPrograms || [];
      }

      const snap = await getDocs(query(collection(db, 'studyPrograms'), limit(60)));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as StudyProgram[];
      writePersistentCache('studyPrograms', data);
      return data;
    } catch (err) {
      console.warn('[CatalogService] Erreur lecture studyPrograms:', err);
      return memoryCache.studyPrograms?.data || [];
    }
  },

  invalidateCache(target?: 'countries' | 'services' | 'organizedTrips' | 'studyPrograms') {
    const targets: Array<keyof typeof memoryCache> = target
      ? [target]
      : ['countries', 'services', 'organizedTrips', 'studyPrograms'];

    for (const key of targets) {
      memoryCache[key] = null;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
        }
      } catch {
        // Ignorer
      }
    }
  }
};
