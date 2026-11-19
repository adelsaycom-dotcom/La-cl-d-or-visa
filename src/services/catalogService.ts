/**
 * Service de gestion du catalogue (Pays, Services, Voyages, Études).
 * - En mode MySQL Hostinger : 1 seule requête API /api/db/catalog (0 lecture Firestore).
 * - En mode secours Firestore : cache mémoire + localStorage persistant (TTL 15 min)
 *   afin d'éviter de reconsommer ~260 lectures à chaque actualisation F5.
 */

import { getFirestoreDb } from '../firebase';
import type { Country, PrestationService, OrganizedTrip, StudyProgram } from '../store/useAppStore';
import { getBackendMode } from './apiClient';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface CatalogBundle {
  catalogVersion?: string;
  countries: Country[];
  services: PrestationService[];
  organizedTrips: OrganizedTrip[];
  studyPrograms: StudyProgram[];
}

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const STORAGE_KEY_PREFIX = 'cldor_cat_v2_';
const VERSION_STORAGE_KEY = `${STORAGE_KEY_PREFIX}version`;

const memoryCache = {
  countries: null as CacheEntry<Country[]> | null,
  services: null as CacheEntry<PrestationService[]> | null,
  organizedTrips: null as CacheEntry<OrganizedTrip[]> | null,
  studyPrograms: null as CacheEntry<StudyProgram[]> | null,
};

let memoryCatalogVersion: CacheEntry<string> | null = null;
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
      const serialized = JSON.stringify(entry);
      if (serialized.length <= 262144) {
        window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, serialized);
      }
    }
  } catch {
    // Quota localStorage dépassé (ex: images lourdes) : le cache mémoire reste actif
  }
}

function writeCatalogVersion(version?: string | null) {
  if (!version) return;
  memoryCatalogVersion = { data: version, timestamp: Date.now() };
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(memoryCatalogVersion));
    }
  } catch {
    // Ignorer
  }
}

function readCatalogVersion(): string | null {
  if (isCacheValid(memoryCatalogVersion)) return memoryCatalogVersion!.data;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(VERSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CacheEntry<string>;
        if (parsed && typeof parsed.data === 'string' && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          memoryCatalogVersion = parsed;
          return parsed.data;
        }
      }
    }
  } catch {
    // Ignorer
  }
  return null;
}

async function fetchMysqlCatalogBundle(): Promise<CatalogBundle> {
  if (pendingMysqlCatalogFetch) return pendingMysqlCatalogFetch;
  pendingMysqlCatalogFetch = (async () => {
    const res = await fetch('/api/db/catalog', { cache: 'no-cache' });
    if (!res.ok) {
      throw new Error(`Erreur catalogue MySQL (${res.status})`);
    }
    const payload = (await res.json()) as CatalogBundle;
    writePersistentCache('countries', payload.countries || []);
    writePersistentCache('services', payload.services || []);
    writePersistentCache('organizedTrips', payload.organizedTrips || []);
    writePersistentCache('studyPrograms', payload.studyPrograms || []);
    writeCatalogVersion(payload.catalogVersion);
    return payload;
  })().finally(() => {
    pendingMysqlCatalogFetch = null;
  });
  return pendingMysqlCatalogFetch;
}

async function fetchFirestoreCollection<T>(collName: string, maxItems: number): Promise<T[]> {
  const [{ collection, getDocs, query, limit }, db] = await Promise.all([
    import('firebase/firestore'),
    getFirestoreDb(),
  ]);
  const snap = await getDocs(query(collection(db, collName), limit(maxItems)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as T[];
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

      const data = await fetchFirestoreCollection<Country>('countries', 50);
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

      const data = await fetchFirestoreCollection<PrestationService>('services', 100);
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

      const data = await fetchFirestoreCollection<OrganizedTrip>('organizedTrips', 50);
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

      const data = await fetchFirestoreCollection<StudyProgram>('studyPrograms', 60);
      writePersistentCache('studyPrograms', data);
      return data;
    } catch (err) {
      console.warn('[CatalogService] Erreur lecture studyPrograms:', err);
      return memoryCache.studyPrograms?.data || [];
    }
  },

  getCachedCatalogSnapshot(): Partial<CatalogBundle> | null {
    const countries = isCacheValid(memoryCache.countries)
      ? memoryCache.countries!.data
      : readPersistentCache<Country[]>('countries')?.data;
    const services = isCacheValid(memoryCache.services)
      ? memoryCache.services!.data
      : readPersistentCache<PrestationService[]>('services')?.data;
    const organizedTrips = isCacheValid(memoryCache.organizedTrips)
      ? memoryCache.organizedTrips!.data
      : readPersistentCache<OrganizedTrip[]>('organizedTrips')?.data;
    const studyPrograms = isCacheValid(memoryCache.studyPrograms)
      ? memoryCache.studyPrograms!.data
      : readPersistentCache<StudyProgram[]>('studyPrograms')?.data;

    if (!countries && !services && !organizedTrips && !studyPrograms) {
      return null;
    }

    return {
      catalogVersion: readCatalogVersion() || undefined,
      countries: countries || [],
      services: services || [],
      organizedTrips: organizedTrips || [],
      studyPrograms: studyPrograms || [],
    };
  },

  getCachedCatalogVersion(): string | null {
    const snapshot = this.getCachedCatalogSnapshot();
    if (!snapshot) return null;
    return readCatalogVersion();
  },

  seedFromBootstrap(bundle: Partial<CatalogBundle>, catalogVersion?: string | null) {
    if (Array.isArray(bundle.countries)) writePersistentCache('countries', bundle.countries);
    if (Array.isArray(bundle.services)) writePersistentCache('services', bundle.services);
    if (Array.isArray(bundle.organizedTrips)) writePersistentCache('organizedTrips', bundle.organizedTrips);
    if (Array.isArray(bundle.studyPrograms)) writePersistentCache('studyPrograms', bundle.studyPrograms);
    writeCatalogVersion(catalogVersion || bundle.catalogVersion);
  },

  invalidateCache(target?: 'countries' | 'services' | 'organizedTrips' | 'studyPrograms') {
    const targets: Array<keyof typeof memoryCache> = target
      ? [target]
      : ['countries', 'services', 'organizedTrips', 'studyPrograms'];

    memoryCatalogVersion = null;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(VERSION_STORAGE_KEY);
      }
    } catch {
      // Ignorer
    }

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
