import { useState, useMemo, useEffect, useCallback } from 'react';
import { Application } from '../store/useAppStore';

export interface UseApplicationFiltersOptions {
  applications: Application[];
  initialStatus?: string;
  pageSize?: number;
}

export interface UseApplicationFiltersReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalCount: number;
  paginatedApplications: Application[];
  filteredApplications: Application[];
  statusCounts: Record<string, number>;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

/**
 * Hook personnalisé optimisé pour le filtrage, la recherche et la pagination des dossiers
 * Évite les re-calculs O(N) inutiles et fenétre le rendu DOM
 */
export function useApplicationFilters({
  applications,
  initialStatus = 'ALL',
  pageSize = 10
}: UseApplicationFiltersOptions): UseApplicationFiltersReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [currentPage, setCurrentPage] = useState(1);

  // Réinitialisation de la pagination lors d'un changement de filtre
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Filtrage mémoïsé
  const filteredApplications = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return applications.filter(app => {
      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
      if (!matchesStatus) return false;

      if (!term) return true;

      const tName = (app.travelerName || (app as unknown as { applicantName?: string }).applicantName || '').toLowerCase();
      const pNumber = (app.passportNumber || '').toLowerCase();
      const aName = (app.agencyName || '').toLowerCase();
      const appId = (app.id || '').toLowerCase();

      return tName.includes(term) || pNumber.includes(term) || aName.includes(term) || appId.includes(term);
    });
  }, [applications, statusFilter, searchTerm]);

  // Compteurs statistiques mémoïsés en une seule passe O(N)
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: applications.length,
      ActionRequired: 0,
      Processing: 0,
      Approved: 0,
      Pending: 0,
      Rejected: 0
    };
    for (const app of applications) {
      if (counts[app.status] !== undefined) {
        counts[app.status]++;
      }
    }
    return counts;
  }, [applications]);

  const totalCount = filteredApplications.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  // Fenêtrage mémoire strict des dossiers affichés
  const paginatedApplications = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredApplications.slice(start, start + pageSize);
  }, [filteredApplications, safePage, pageSize]);

  const nextPage = useCallback(() => {
    setCurrentPage(p => Math.min(p + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage(p => Math.max(p - 1, 1));
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }, [totalPages]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage: safePage,
    setCurrentPage,
    totalPages,
    totalCount,
    paginatedApplications,
    filteredApplications,
    statusCounts,
    nextPage,
    prevPage,
    goToPage
  };
}
