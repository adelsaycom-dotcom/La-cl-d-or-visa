/**
 * Service de gestion ultra-économe du catalogue (Pays, Services, Voyages, Études).
 * Utilise un cache mémoire avec durée de vie (TTL) de 15 minutes pour éviter
 * les écoutes permanentes onSnapshot et réduire la consommation de lectures de 90%.
 */

import { collection, getDocs, doc, getDoc, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Country, PrestationService, OrganizedTrip, StudyProgram } from '../store/useAppStore';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

const memoryCache = {
  countries: null as CacheEntry<Country[]> | null,
  services: null as CacheEntry<PrestationService[]> | null,
  organizedTrips: null as CacheEntry<OrganizedTrip[]> | null,
  studyPrograms: null as CacheEntry<StudyProgram[]> | null,
};

function isCacheValid<T>(entry: CacheEntry<T> | null): boolean {
  if (!entry) return false;
  return Date.now() - entry.timestamp < CACHE_TTL_MS;
}

export const catalogService = {
  /**
   * Récupère la liste des pays avec cache
   */
  async getCountries(forceRefresh = false): Promise<Country[]> {
    if (!forceRefresh && isCacheValid(memoryCache.countries)) {
      return memoryCache.countries!.data;
    }

    try {
      const snap = await getDocs(query(collection(db, 'countries'), limit(50)));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Country[];
      memoryCache.countries = { data, timestamp: Date.now() };
      return data;
    } catch (err) {
      console.warn('[CatalogService] Erreur lecture countries:', err);
      return memoryCache.countries?.data || [];
    }
  },

  /**
   * Récupère la liste des services avec cache
   */
  async getServices(forceRefresh = false): Promise<PrestationService[]> {
    if (!forceRefresh && isCacheValid(memoryCache.services)) {
      return memoryCache.services!.data;
    }

    try {
      const snap = await getDocs(query(collection(db, 'services'), limit(100)));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as PrestationService[];
      memoryCache.services = { data, timestamp: Date.now() };
      return data;
    } catch (err) {
      console.warn('[CatalogService] Erreur lecture services:', err);
      return memoryCache.services?.data || [];
    }
  },

  /**
   * Récupère la liste des voyages organisés avec cache
   */
  async getOrganizedTrips(forceRefresh = false): Promise<OrganizedTrip[]> {
    if (!forceRefresh && isCacheValid(memoryCache.organizedTrips)) {
      return memoryCache.organizedTrips!.data;
    }

    try {
      const snap = await getDocs(query(collection(db, 'organizedTrips'), limit(50)));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as OrganizedTrip[];
      memoryCache.organizedTrips = { data, timestamp: Date.now() };
      return data;
    } catch (err) {
      console.warn('[CatalogService] Erreur lecture organizedTrips:', err);
      return memoryCache.organizedTrips?.data || [];
    }
  },

  /**
   * Récupère la liste des programmes d'études avec cache
   */
  async getStudyPrograms(forceRefresh = false): Promise<StudyProgram[]> {
    if (!forceRefresh && isCacheValid(memoryCache.studyPrograms)) {
      return memoryCache.studyPrograms!.data;
    }

    try {
      const snap = await getDocs(query(collection(db, 'studyPrograms'), limit(60)));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as StudyProgram[];
      memoryCache.studyPrograms = { data, timestamp: Date.now() };
      return data;
    } catch (err) {
      console.warn('[CatalogService] Erreur lecture studyPrograms:', err);
      return memoryCache.studyPrograms?.data || [];
    }
  },

  /**
   * Invalide l'ensemble du cache catalogue après une modification admin
   */
  invalidateCache(target?: 'countries' | 'services' | 'organizedTrips' | 'studyPrograms') {
    if (target) {
      memoryCache[target] = null;
    } else {
      memoryCache.countries = null;
      memoryCache.services = null;
      memoryCache.organizedTrips = null;
      memoryCache.studyPrograms = null;
    }
  }
};
