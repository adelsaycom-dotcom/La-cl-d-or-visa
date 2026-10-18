export interface Agency {
  id: string;
  name?: string;
  agencyName?: string;
  companyName?: string;
  email: string;
  phone: string;
  rc?: string;
  rcNumber?: string;
  nif?: string;
  nifNumber?: string;
  managerName?: string;
  address?: string;
  wilaya?: string;
  status: string;
  balance: number;
  applicationsCount: number;
  role: string;
  bannedUntil?: string;
  banReason?: string;
  b2cMarginPercent?: number;
  createdAt?: string;
}
import { create } from "zustand";
import { collection, doc, setDoc, updateDoc, deleteDoc, runTransaction, writeBatch, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export function sanitizeFirestoreData<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data
      .filter(item => item !== undefined)
      .map(item => sanitizeFirestoreData(item)) as any;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeFirestoreData(value);
      }
    }
    return cleaned;
  }
  return data;
}

export interface VisaType {
  id: string;
  name?: string;
  agencyName?: string;
  price: number;
  processingTime: string;
  description: string;
  requiredDocuments: string[];
  conditions: string[];
  customFormFields?: any[];
}

export interface Country {
  id: string;
  name?: string;
  agencyName?: string;
  flag: string;
  active: boolean;
  visaTypes: VisaType[];
}

export type PrestationCategory = "Visa" | "Evisa" | "Invitation" | "Residence" | "Permis" | "Assurance" | "Etude" | "Rendez-vous" | "Dossier" | "Voyage" | string;

export interface PrestationService {
  id: string;
  title: string;
  type: PrestationCategory;
  destination: string; // 'Monde' or specific country
  flag?: string;
  price: number;
  processingTime: string;
  description?: string;
  requiredDocuments: string[];
  conditions: string[];
  active: boolean;
}

export interface OrganizedTrip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  price: number;
  description: string;
  totalSeats: number;
  availableSeats: number;
  image?: string;
  photoUrl?: string;
  featured?: boolean;
  status?: string;
  customFormFields?: any[];
  createdAt: string;
}

export interface TripReservation {
  id: string;
  tripId: string;
  agencyId: string;
  agencyName?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  notes?: string;
  customFormData?: any;
  numberOfPeople: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  paidAmount?: number;
  createdAt: string;
  passengerNames?: string[];
}

export interface StudyProgram {
  id: string;
  title: string;
  country: string;
  university: string;
  type: string; // e.g., 'Bachelor', 'Master', 'Language', 'PhD'
  description: string;
  price: number; // Agency price / Service fee
  requiredDocuments: string[];
  image?: string;
  status: 'active' | 'draft';
  createdAt: string;
}

export interface StudyApplication {
  id: string;
  programId: string;
  programTitle?: string;
  agencyId: string;
  agencyName: string;
  studentName: string;
  passportNumber: string;
  email: string;
  phone: string;
  status: "Pending" | "Processing" | "ActionRequired" | "Approved" | "Rejected";
  documents: Record<string, string>; // Maps document name to base64 or URL
  timeline?: {
    id: string;
    date: string;
    title: string;
    message: string;
    sender: "Admin" | "Agency" | "System";
  }[];
  submissionDate: string;
  price: number;
  finalDocument?: string;
  adminNotes?: string;
}

export type ServiceType = "Evisa" | "Invitation" | "Rendez-vous" | "Dossier" | "Residence" | "Permis" | "Assurance" | "Etude";

export interface Application {
  id: string;
  agencyId: string;
  agencyName: string;
  serviceType: ServiceType;
  country: string;
  visaType: string;
  travelerName: string;
  passportNumber: string;
  status: "Pending" | "Processing" | "ActionRequired" | "Approved" | "Rejected";
  timeline?: {
    id: string;
    date: string;
    title: string;
    message: string;
    sender: "Admin" | "Agency" | "System";
  }[];
  submissionDate: string;
  price: number;
  extraData?: Record<string, string>;
  customFormData?: Record<string, any>;
  finalDocument?: string;
  finalDocumentName?: string;
  finalDocumentDate?: string;
  attachments?: Array<{
    id: string;
    name: string;
    category: string;
    type: string;
    size: number;
    dataUrl: string;
    uploadedAt: string;
    uploadedBy: "Agency" | "Admin";
  }>;
  adminNotes?: string;
}

export interface AppState {
  supportTickets: SupportTicket[];
  transactions: Transaction[];
  rechargeRequests: RechargeRequest[];
  addSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt'>) => void;
  updateSupportTicket: (id: string, updates: Partial<SupportTicket>) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  addRechargeRequest: (req: Omit<RechargeRequest, 'id' | 'createdAt'>) => void;
  updateRechargeRequestStatus: (id: string, status: string) => void;

  agencyBalance: number;
  setAgencyBalance: (balance: number) => void;
  
  countries: Country[];
  services: PrestationService[];
  addService: (s: PrestationService) => void;
  updateService: (id: string, s: Partial<PrestationService>) => void;
  deleteService: (id: string) => void;
  agencies: Agency[];
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: (agencyId: string) => void;
  updateAgencyStatus: (id: string, status: string) => void;
  applications: Application[];
  organizedTrips: OrganizedTrip[];
  tripReservations: TripReservation[];
  studyPrograms: StudyProgram[];
  studyApplications: StudyApplication[];

  addOrganizedTrip: (trip: Omit<OrganizedTrip, 'id' | 'createdAt' | 'availableSeats'>) => void;
  updateOrganizedTrip: (id: string, trip: Partial<OrganizedTrip>) => void;
  deleteOrganizedTrip: (id: string) => void;

  addTripReservation: (reservation: Omit<TripReservation, 'id' | 'createdAt' | 'status' | 'totalPrice'>) => void;
  updateTripReservationStatus: (id: string, status: TripReservation['status']) => void;
  updateTripReservationPayment: (id: string, amount: number) => void;

  addStudyProgram: (program: Omit<StudyProgram, 'id' | 'createdAt'>) => void;
  updateStudyProgram: (id: string, program: Partial<StudyProgram>) => void;
  deleteStudyProgram: (id: string) => void;

  addStudyApplication: (application: Omit<StudyApplication, 'id' | 'submissionDate'>) => Promise<void>;
  updateStudyApplicationStatus: (id: string, status: StudyApplication['status']) => void;
  updateStudyApplication: (id: string, updates: Partial<StudyApplication>) => void;
  addStudyTimelineEntry: (id: string, entry: Omit<NonNullable<StudyApplication["timeline"]>[0], "id" | "date">) => Promise<void>;

  addCountry: (country: Country) => void;
  updateCountry: (id: string, data: Partial<Country>) => void;
  removeCountry: (id: string) => void;
  
  addVisaType: (countryId: string, visaType: VisaType) => void;
  updateVisaType: (countryId: string, visaId: string, data: Partial<VisaType>) => void;
  removeVisaType: (countryId: string, visaId: string) => void;

  currentAgency: Agency | null;
  setCurrentAgency: (agency: Agency | null) => void;
  b2cMode: boolean;
  setB2cMode: (mode: boolean) => void;
  b2cMarginPercent: number;
  setB2cMarginPercent: (percent: number) => void;
  updateAgency: (id: string, updates: Partial<Agency>) => Promise<void>;

  addApplication: (application: Application) => void;
  updateApplicationStatus: (id: string, status: Application["status"]) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  addApplicationTimelineEntry: (id: string, entry: Omit<NonNullable<Application["timeline"]>[0], "id" | "date">) => Promise<void>;
  clearData: () => void;
}

export const useAppStore = create<AppState>()((set, get) => ({
  currentAgency: null,
  setCurrentAgency: (agency) => set({ currentAgency: agency }),
  b2cMode: false,
  setB2cMode: (mode) => set({ b2cMode: mode }),
  b2cMarginPercent: 15,
  setB2cMarginPercent: (percent) => set({ b2cMarginPercent: percent }),

  agencyBalance: 0,
  setAgencyBalance: (balance) => {
    // In a real app, you'd update this in Firestore via a Cloud Function or Admin rule
    set({ agencyBalance: balance });
  },

  updateAgency: async (id, updates) => {
    await updateDoc(doc(db, "users", id), sanitizeFirestoreData(updates));
  },

  
  supportTickets: [],
  transactions: [],
  rechargeRequests: [],

  addSupportTicket: async (ticket) => {
    const id = doc(collection(db, 'supportTickets')).id;
    await setDoc(doc(db, 'supportTickets', id), sanitizeFirestoreData({ ...ticket, id, createdAt: new Date().toISOString() }));
  },
  updateSupportTicket: async (id, updates) => {
    await updateDoc(doc(db, 'supportTickets', id), sanitizeFirestoreData(updates));
    
    // Check if new message was added by agency
    if (updates.messages) {
      const messages = updates.messages as any[];
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.sender === 'agency') {
        const ticket = get().supportTickets.find(t => t.id === id);
        const notifId = doc(collection(db, 'notifications')).id;
        await setDoc(doc(db, 'notifications', notifId), {
          id: notifId,
          agencyId: 'admin',
          title: 'Nouveau message Support',
          message: `${ticket?.agencyName || 'Agence'} a répondu au ticket: "${ticket?.subject}"`,
          type: 'info',
          read: false,
          createdAt: new Date().toISOString(),
          link: '/admin/support'
        });
      }
      
      if (lastMessage && lastMessage.sender === 'admin') {
         const ticket = get().supportTickets.find(t => t.id === id);
         const notifId = doc(collection(db, 'notifications')).id;
         await setDoc(doc(db, 'notifications', notifId), {
          id: notifId,
          agencyId: ticket?.agencyId,
          title: 'Réponse Support',
          message: `L'administrateur a répondu à votre ticket: "${ticket?.subject}"`,
          type: 'info',
          read: false,
          createdAt: new Date().toISOString(),
          link: '/agency/support'
        });
      }
    }
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
    // Add Notification
    const req = get().rechargeRequests.find(r => r.id === id);
    if (req && status !== 'Pending') {
      const notifId = doc(collection(db, 'notifications')).id;
      await setDoc(doc(db, 'notifications', notifId), {
        id: notifId,
        agencyId: req.agencyId,
        title: status === 'Approved' ? 'Recharge Approuvée' : 'Recharge Rejetée',
        message: status === 'Approved' ? `Votre demande de recharge de ${req.amount} DA a été approuvée.` : `Votre demande de recharge de ${req.amount} DA a été rejetée.`,
        type: status === 'Approved' ? 'success' : 'error',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/agency/wallet'
      });
    }
  },

  markNotificationAsRead: async (id) => {
    await updateDoc(doc(db, 'notifications', id), { read: true });
  },
  markAllNotificationsAsRead: async (agencyId) => {
    // This will be done in the component by looping or batch, but we can do a simple batch here
    const q = query(collection(db, 'notifications'), where('agencyId', '==', agencyId), where('read', '==', false));
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.update(d.ref, { read: true }));
    await batch.commit();
  },
  agencies: [],
  notifications: [],
  updateAgencyStatus: async (id, status) => { await updateDoc(doc(db, "users", id), { status }); },
  countries: [],
  services: [],
  applications: [],
  organizedTrips: [],
  tripReservations: [],
  studyPrograms: [],
  studyApplications: [],

  addService: async (s) => {
    const sId = s.id || doc(collection(db, 'services')).id;
    await setDoc(doc(db, 'services', sId), sanitizeFirestoreData({ ...s, id: sId }));
  },
  updateService: async (id, s) => {
    await updateDoc(doc(db, 'services', id), sanitizeFirestoreData(s));
  },
  deleteService: async (id) => {
    await deleteDoc(doc(db, 'services', id));
  },

  addOrganizedTrip: async (tripData) => {
    const tripId = doc(collection(db, 'organizedTrips')).id;
    await setDoc(doc(db, 'organizedTrips', tripId), {
      ...tripData,
      id: tripId,
      createdAt: new Date().toISOString(),
      availableSeats: tripData.totalSeats,
    });
  },

  updateOrganizedTrip: async (id, tripData) => {
    await updateDoc(doc(db, 'organizedTrips', id), tripData);
  },

  deleteOrganizedTrip: async (id) => {
    await deleteDoc(doc(db, 'organizedTrips', id));
  },

  addTripReservation: async (resData) => {
    const trip = get().organizedTrips.find(t => t.id === resData.tripId);
    if (!trip || trip.availableSeats < resData.numberOfPeople) return;

    const resId = doc(collection(db, 'tripReservations')).id;
    await setDoc(doc(db, 'tripReservations', resId), {
      ...resData,
      id: resId,
      createdAt: new Date().toISOString(),
      status: 'pending',
      totalPrice: trip.price * resData.numberOfPeople,
      paidAmount: 0
    });

    // Deduct seats
    await updateDoc(doc(db, 'organizedTrips', resData.tripId), {
      availableSeats: trip.availableSeats - resData.numberOfPeople
    });
  },

  updateTripReservationPayment: async (id, amount) => {
    const reservation = get().tripReservations.find(r => r.id === id);
    if (!reservation) return;
    const newPaidAmount = (reservation.paidAmount || 0) + amount;
    await updateDoc(doc(db, 'tripReservations', id), { paidAmount: newPaidAmount });
  },

  updateTripReservationStatus: async (id, status) => {
    const reservation = get().tripReservations.find(r => r.id === id);
    if (!reservation) return;

    await updateDoc(doc(db, 'tripReservations', id), { status });

    if (status === 'cancelled' && reservation.status !== 'cancelled') {
      const trip = get().organizedTrips.find(t => t.id === reservation.tripId);
      if (trip) {
        await updateDoc(doc(db, 'organizedTrips', reservation.tripId), {
          availableSeats: trip.availableSeats + reservation.numberOfPeople
        });
      }
    }
  },

  addCountry: async (country) => {
    await setDoc(doc(db, 'countries', country.id), country);
  },

  addStudyProgram: async (programData) => {
    const progId = doc(collection(db, 'studyPrograms')).id;
    await setDoc(doc(db, 'studyPrograms', progId), {
      ...programData,
      id: progId,
      createdAt: new Date().toISOString()
    });
  },

  updateStudyProgram: async (id, programData) => {
    await updateDoc(doc(db, 'studyPrograms', id), programData);
  },

  deleteStudyProgram: async (id) => {
    await deleteDoc(doc(db, 'studyPrograms', id));
  },

  addStudyApplication: async (application) => {
    const appId = doc(collection(db, 'studyApplications')).id;
    const userRef = doc(db, 'users', application.agencyId);
    
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error("Agence introuvable");
      }
      
      const currentBalance = userDoc.data().balance || 0;
      const price = application.price || 0;
      
      if (currentBalance < price) {
        throw new Error("Solde insuffisant pour cette opération.");
      }
      
      transaction.update(userRef, { balance: currentBalance - price });
      transaction.set(doc(db, 'studyApplications', appId), {
        ...application,
        id: appId,
        submissionDate: new Date().toISOString()
      });
      
      const txRef = doc(collection(db, 'transactions'));
      transaction.set(txRef, {
        id: txRef.id,
        agencyId: application.agencyId,
        agencyName: application.agencyName || '',
        amount: price,
        type: 'debit',
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
        description: `Paiement pour programme d'études (${application.studentName || ''})`
      });
      
      const notifRef = doc(collection(db, 'notifications'));
      transaction.set(notifRef, {
        id: notifRef.id,
        agencyId: 'admin',
        title: 'Nouveau dossier Études',
        message: `${application.agencyName} a soumis un dossier d'études pour ${application.studentName}.`,
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/admin/study'
      });
    });
  },

  updateStudyApplicationStatus: async (id, status) => {
    await updateDoc(doc(db, 'studyApplications', id), { status });
    const app = get().studyApplications.find(a => a.id === id);
    if (app) {
      const notifId = doc(collection(db, 'notifications')).id;
      await setDoc(doc(db, 'notifications', notifId), {
        id: notifId,
        agencyId: app.agencyId,
        title: `Dossier Études ${status}`,
        message: `Le statut de la demande d'études pour ${app.studentName} est maintenant: ${status}.`,
        type: status === 'Approved' ? 'success' : (status === 'Rejected' ? 'error' : 'info'),
        read: false,
        createdAt: new Date().toISOString(),
        link: '/agency/study'
      });
    }
  },

  updateStudyApplication: async (id, updates) => {
    await updateDoc(doc(db, 'studyApplications', id), updates);
  },

  addStudyTimelineEntry: async (id, entry) => {
    const appRef = doc(db, 'studyApplications', id);
    const newEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString()
    };
    const currentApp = get().studyApplications.find(a => a.id === id);
    if (currentApp) {
      const newTimeline = [...(currentApp.timeline || []), newEntry];
      await updateDoc(appRef, { timeline: newTimeline });
    }
  },

  updateCountry: async (id, data) => {
    await updateDoc(doc(db, 'countries', id), data);
  },

  removeCountry: async (id) => {
    await deleteDoc(doc(db, 'countries', id));
  },

  addVisaType: async (countryId, visaType) => {
    const country = get().countries.find(c => c.id === countryId);
    if (country) {
      const newVisaTypes = [...country.visaTypes, visaType];
      await updateDoc(doc(db, 'countries', countryId), { visaTypes: newVisaTypes });
    }
  },

  updateVisaType: async (countryId, visaId, data) => {
    const country = get().countries.find(c => c.id === countryId);
    if (country) {
      const newVisaTypes = country.visaTypes.map(v => v.id === visaId ? { ...v, ...data } : v);
      await updateDoc(doc(db, 'countries', countryId), { visaTypes: newVisaTypes });
    }
  },

  removeVisaType: async (countryId, visaId) => {
    const country = get().countries.find(c => c.id === countryId);
    if (country) {
      const newVisaTypes = country.visaTypes.filter(v => v.id !== visaId);
      await updateDoc(doc(db, 'countries', countryId), { visaTypes: newVisaTypes });
    }
  },

  addApplication: async (application) => {
    const appId = application.id || doc(collection(db, 'applications')).id;
    const userRef = doc(db, 'users', application.agencyId);
    
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error("Agence introuvable");
      }
      
      const currentBalance = userDoc.data().balance || 0;
      const price = application.price || 0;
      
      if (currentBalance < price) {
        throw new Error("Solde insuffisant pour cette opération.");
      }
      
      transaction.update(userRef, { balance: currentBalance - price });
      transaction.set(doc(db, 'applications', appId), {
        ...application,
        id: appId
      });
      
      // Also create a transaction record
      const txRef = doc(collection(db, 'transactions'));
      transaction.set(txRef, {
        id: txRef.id,
        agencyId: application.agencyId,
        agencyName: application.agencyName || '',
        amount: price,
        type: 'debit',
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
        description: `Paiement pour visa ${application.visaType || 'Service'} (${application.travelerName || ''})`
      });
      
      // Notify Admin
      const notifRef = doc(collection(db, 'notifications'));
      transaction.set(notifRef, {
        id: notifRef.id,
        agencyId: 'admin',
        title: 'Nouvelle demande de Visa',
        message: `${application.agencyName || 'Une agence'} a soumis une demande pour ${application.travelerName || 'un client'}.`,
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/admin/applications'
      });
    });
  },

  updateApplicationStatus: async (id, status) => {
    await updateDoc(doc(db, 'applications', id), { status });
    // Add Notification
    const app = get().applications.find(a => a.id === id);
    if (app) {
      const notifId = doc(collection(db, 'notifications')).id;
      await setDoc(doc(db, 'notifications', notifId), {
        id: notifId,
        agencyId: app.agencyId,
        title: `Visa ${status}`,
        message: `Le statut de la demande de visa pour ${app.travelerName || 'votre client'} est maintenant: ${status}.`,
        type: status === 'Approved' ? 'success' : (status === 'Rejected' ? 'error' : 'info'),
        read: false,
        createdAt: new Date().toISOString(),
        link: '/agency/applications'
      });
    }
  },

  updateApplication: async (id, updates) => {
    await updateDoc(doc(db, 'applications', id), sanitizeFirestoreData(updates));
  },
  addApplicationTimelineEntry: async (id, entry) => {
    const appRef = doc(db, 'applications', id);
    const newEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString()
    };
    
    // Using arrayUnion directly via a direct firestore import or manual local update (simplified for store)
    // We'll update via the store's current apps to make it simple
    const currentApp = get().applications.find(a => a.id === id);
    if (currentApp) {
      const newTimeline = [...(currentApp.timeline || []), newEntry];
      await updateDoc(appRef, { timeline: newTimeline });
    }
  },
  clearData: () => {
    set({
      agencies: [],
      notifications: [],
      supportTickets: [],
      transactions: [],
      rechargeRequests: [],
      countries: [],
      services: [],
      applications: [],
      organizedTrips: [],
      tripReservations: [],
      studyPrograms: [],
      studyApplications: []
    });
  }
}));

// Add support tickets, transactions, and recharge requests to the store
export interface Notification {
  id: string;
  agencyId: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface SupportTicketAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

export interface SupportTicketMessage {
  id?: string;
  sender: 'agency' | 'admin' | string;
  text: string;
  date: string;
  attachments?: SupportTicketAttachment[];
}

export interface SupportTicket {
  id: string;
  agencyId: string;
  agencyName: string;
  agency?: string;
  isUrgent?: boolean;
  subject: string;
  description?: string;
  date?: string;
  category: string;
  priority: "Faible" | "Moyenne" | "Haute" | "Critique" | string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "Ouvert" | "En cours" | "Résolu" | string;
  applicationId?: string;
  applicationRef?: string;
  applicationSummary?: {
    travelerName: string;
    destination: string;
    serviceType: string;
    status: string;
  };
  attachments?: SupportTicketAttachment[];
  messages: SupportTicketMessage[];
  createdAt: string;
}

export interface Transaction {
  id: string;
  agencyId: string;
  agencyName?: string;
  type: string;
  amount: number;
  date: string;
  ref?: string;
  note?: string;
  description?: string;
  status?: string;
  createdAt: string;
}

export interface RechargeRequest {
  id: string;
  agencyId: string;
  agencyName: string;
  amount: number;
  note: string;
  status: string;
  date: string;
  createdAt: string;
}

// NOTE: We should update AppState interface, but since we are redefining the store, let's just use Zustand's set method directly for now, or we can just append to the store.
