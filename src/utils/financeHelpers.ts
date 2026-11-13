import type { Agency, RechargeRequest, Transaction } from '../store/useAppStore';

export interface RechargeSummary {
  pendingRecharges: RechargeRequest[];
  totalEncaissements: number;
  totalPendingAmount: number;
  encoursGlobal: number;
}

export function isImageBase64(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('data:image/');
}

export function getSafeTimestamp(dateStr?: string, fallbackStr?: string): number {
  const raw = dateStr || fallbackStr;
  if (!raw) return 0;
  const ts = new Date(raw).getTime();
  return Number.isNaN(ts) ? 0 : ts;
}

/**
 * Calcule en une seule passe O(N) les KPIs de trésorerie et la liste triée des demandes en attente.
 */
export function computeRechargeSummary(
  rechargeRequests: RechargeRequest[],
  agencies: Agency[]
): RechargeSummary {
  const pendingRecharges: RechargeRequest[] = [];
  let totalEncaissements = 0;
  let totalPendingAmount = 0;

  for (let i = 0; i < rechargeRequests.length; i++) {
    const req = rechargeRequests[i];
    const amount = req.amount || 0;
    if (req.status === 'Pending') {
      pendingRecharges.push(req);
      totalPendingAmount += amount;
    } else if (req.status === 'Approved') {
      totalEncaissements += amount;
    }
  }

  pendingRecharges.sort(
    (a, b) => getSafeTimestamp(b.date, b.createdAt) - getSafeTimestamp(a.date, a.createdAt)
  );

  let encoursGlobal = 0;
  for (let i = 0; i < agencies.length; i++) {
    encoursGlobal += agencies[i].balance || 0;
  }

  return {
    pendingRecharges,
    totalEncaissements,
    totalPendingAmount,
    encoursGlobal,
  };
}

export function sortTransactionsDesc(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort(
    (a, b) => getSafeTimestamp(b.date, b.createdAt) - getSafeTimestamp(a.date, a.createdAt)
  );
}

export function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return fallback;
}
