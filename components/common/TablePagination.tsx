import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
  isCompact?: boolean;
  itemLabel?: string;
}

export const TablePagination: React.FC<TablePaginationProps> = React.memo(({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  className = '',
  isCompact = false,
  itemLabel = 'dossiers'
}) => {
  if (totalCount <= pageSize) {
    return null; // Pas besoin de pagination si une seule page suffit
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className={`flex items-center justify-between gap-4 p-3 border-t border-slate-100 bg-white text-xs ${className}`}>
      {!isCompact && (
        <span className="text-slate-500 font-medium hidden sm:inline">
          Affichage de <strong className="text-slate-800 font-bold">{startItem}-{endItem}</strong> sur <strong className="text-slate-800 font-bold">{totalCount}</strong> {itemLabel}
        </span>
      )}

      <div className="flex items-center gap-1.5 ml-auto">
        <span className="text-slate-500 font-semibold mr-2">
          Page {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-8 w-8 p-0 rounded-lg border-slate-200 text-slate-700 disabled:opacity-40"
          title="Page précédente"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-8 w-8 p-0 rounded-lg border-slate-200 text-slate-700 disabled:opacity-40"
          title="Page suivante"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

TablePagination.displayName = 'TablePagination';
