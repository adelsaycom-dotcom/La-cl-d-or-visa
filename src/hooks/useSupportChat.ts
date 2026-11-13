import { useRef, useEffect, useCallback } from 'react';
import type { SupportTicket, SupportTicketAttachment } from '../store/useAppStore';
import { uploadFileToServer } from '../utils/fileUpload';

export interface TicketFilterOptions {
  statusFilter: string;
  categoryFilter?: string;
  search: string;
}

export function isTicketResolved(status?: string): boolean {
  return status === 'RESOLVED' || status === 'Résolu';
}

export function hasTicketAttachments(ticket: SupportTicket): boolean {
  if (ticket.attachments && ticket.attachments.length > 0) return true;
  if (ticket.messages) {
    for (let i = 0; i < ticket.messages.length; i++) {
      const atts = ticket.messages[i].attachments;
      if (atts && atts.length > 0) return true;
    }
  }
  return false;
}

export function filterAndSortTickets(
  tickets: SupportTicket[],
  { statusFilter, categoryFilter = 'ALL', search }: TicketFilterOptions
): SupportTicket[] {
  const q = search.trim().toLowerCase();

  const filtered = tickets.filter((ticket) => {
    const resolved = isTicketResolved(ticket.status);

    let matchesStatus = true;
    if (statusFilter === 'ACTIVE' || statusFilter === 'active') {
      matchesStatus = !resolved;
    } else if (statusFilter === 'ARCHIVED' || statusFilter === 'archived') {
      matchesStatus = resolved;
    } else if (statusFilter === 'URGENT' || statusFilter === 'urgent') {
      matchesStatus = Boolean(ticket.isUrgent);
    } else if (statusFilter !== 'ALL' && statusFilter !== 'all') {
      matchesStatus = ticket.status === statusFilter;
    }

    if (!matchesStatus) return false;

    if (categoryFilter !== 'ALL' && ticket.category !== categoryFilter) {
      return false;
    }

    if (!q) return true;

    const agencyLabel = (ticket.agencyName || ticket.agency || '').toLowerCase();
    const subject = (ticket.subject || '').toLowerCase();
    const id = (ticket.id || '').toLowerCase();
    const appRef = (ticket.applicationRef || '').toLowerCase();
    const traveler = (ticket.applicationSummary?.travelerName || '').toLowerCase();

    return (
      subject.includes(q) ||
      id.includes(q) ||
      agencyLabel.includes(q) ||
      appRef.includes(q) ||
      traveler.includes(q)
    );
  });

  return filtered.sort((a, b) => {
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;
    const tsA = new Date(a.createdAt || a.date || 0).getTime();
    const tsB = new Date(b.createdAt || b.date || 0).getTime();
    return (Number.isNaN(tsB) ? 0 : tsB) - (Number.isNaN(tsA) ? 0 : tsA);
  });
}

/**
 * Hook partagé pour téléverser les pièces jointes de support avec protection contre le démontage.
 */
export function useSupportAttachmentUploader(folder: string, idPrefix: string) {
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const uploadFiles = useCallback(
    async (files: FileList): Promise<SupportTicketAttachment[] | null> => {
      const uploaded: SupportTicketAttachment[] = [];
      const baseTs = Date.now();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadFileToServer(file, folder);
        if (!isMountedRef.current) return null;
        uploaded.push({
          id: `${idPrefix}_${baseTs}_${i}`,
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          dataUrl: res.url,
        });
      }

      return isMountedRef.current ? uploaded : null;
    },
    [folder, idPrefix]
  );

  return { uploadFiles, isMountedRef };
}
