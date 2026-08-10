import re

content = open('src/store/useAppStore.ts').read()

interfaces = """
export interface SupportTicket {
  id: string;
  agencyId: string;
  agencyName: string;
  subject: string;
  category: string;
  priority: "Faible" | "Moyenne" | "Haute" | "Critique" | string;
  status: "Ouvert" | "En cours" | "Résolu" | string;
  messages: { sender: string; text: string; date: string }[];
  createdAt: string;
}

export interface Transaction {
  id: string;
  agencyId: string;
  type: "CREDIT" | "DEBIT" | string;
  amount: number;
  date: string;
  ref: string;
  note: string;
  createdAt: string;
}

export interface RechargeRequest {
  id: string;
  agencyId: string;
  agencyName: string;
  amount: number;
  note: string;
  status: "Pending" | "Approved" | "Rejected" | string;
  date: string;
  createdAt: string;
}
"""

if "SupportTicket" not in content:
    content = content.replace("export interface AppState {", interfaces + "\nexport interface AppState {")

state_props = """
  supportTickets: SupportTicket[];
  transactions: Transaction[];
  rechargeRequests: RechargeRequest[];
  addSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt'>) => void;
  updateSupportTicket: (id: string, updates: Partial<SupportTicket>) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  addRechargeRequest: (req: Omit<RechargeRequest, 'id' | 'createdAt'>) => void;
  updateRechargeRequestStatus: (id: string, status: string) => void;
"""

if "supportTickets: SupportTicket[];" not in content:
    content = content.replace("export interface AppState {", "export interface AppState {" + state_props)

state_impl = """
  supportTickets: [],
  transactions: [],
  rechargeRequests: [],

  addSupportTicket: async (ticket) => {
    const id = doc(collection(db, 'supportTickets')).id;
    await setDoc(doc(db, 'supportTickets', id), { ...ticket, id, createdAt: new Date().toISOString() });
  },
  updateSupportTicket: async (id, updates) => {
    await updateDoc(doc(db, 'supportTickets', id), updates);
  },
  addTransaction: async (tx) => {
    const id = doc(collection(db, 'transactions')).id;
    await setDoc(doc(db, 'transactions', id), { ...tx, id, createdAt: new Date().toISOString() });
  },
  addRechargeRequest: async (req) => {
    const id = doc(collection(db, 'rechargeRequests')).id;
    await setDoc(doc(db, 'rechargeRequests', id), { ...req, id, createdAt: new Date().toISOString() });
  },
  updateRechargeRequestStatus: async (id, status) => {
    await updateDoc(doc(db, 'rechargeRequests', id), { status });
  },
"""

if "supportTickets: []," not in content:
    content = content.replace("countries: [],", state_impl + "\n  countries: [],")

open('src/store/useAppStore.ts', 'w').write(content)
