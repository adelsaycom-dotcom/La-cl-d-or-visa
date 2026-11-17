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
import { catalogService } from '../services/catalogService';

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
  countryFlag?: string;
  university: string;
  city?: string;
  type: string; // e.g., 'Bachelor', 'Master', 'Language', 'PhD', 'Préparatoire'
  description: string;
  admissionConditions?: string[];
  conditions?: string;
  processingTime?: string;
  intake?: string;
  languageOfStudy?: string;
  price: number; // Frais de traitement / service (DZD)
  tuitionFeeYear?: string;
  requiredDocuments: string[];
  image?: string;
  status: 'active' | 'draft';
  createdAt: string;
}

export interface StudyApplication {
  id: string;
  programId: string;
  programTitle?: string;
  country?: string;
  countryFlag?: string;
  university?: string;
  city?: string;
  agencyId: string;
  agencyName: string;
  studentName: string;
  passportNumber: string;
  email: string;
  phone: string;
  status: "Pending" | "Processing" | "ActionRequired" | "Approved" | "Rejected";
  documents: Record<string, string>; // Maps document name to base64 or URL
  attachments?: Array<{
    id: string;
    name: string;
    category: string;
    type: string;
    size: number;
    dataUrl: string;
    url?: string;
    storageId?: string;
    uploadedAt: string;
    uploadedBy: "Agency" | "Admin";
  }>;
  timeline?: {
    id: string;
    date: string;
    title: string;
    message: string;
    sender: "Admin" | "Agency" | "System";
  }[];
  submissionDate: string;
  price: number;
  paidAmount?: number;
  paymentStatus?: 'unpaid' | 'partial' | 'paid';
  finalDocument?: string;
  finalDocumentName?: string;
  finalDocumentDate?: string;
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
    url?: string;
    storageId?: string;
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

  addTripReservation: (reservation: Omit<TripReservation, 'id' | 'createdAt' | 'status' | 'totalPrice'>) => Promise<TripReservation>;
  updateTripReservationStatus: (id: string, status: TripReservation['status']) => void;
  updateTripReservationPayment: (id: string, amount: number) => void;

  addStudyProgram: (program: Omit<StudyProgram, 'id' | 'createdAt'>) => void;
  updateStudyProgram: (id: string, program: Partial<StudyProgram>) => void;
  deleteStudyProgram: (id: string) => void;

  addStudyApplication: (application: Omit<StudyApplication, 'id' | 'submissionDate'>) => Promise<void>;
  updateStudyApplicationStatus: (id: string, status: StudyApplication['status']) => void;
  updateStudyApplication: (id: string, updates: Partial<StudyApplication>) => void;
  updateStudyApplicationPayment: (id: string, amount: number) => Promise<void>;
  addStudyTimelineEntry: (id: string, entry: Omit<NonNullable<StudyApplication["timeline"]>[0], "id" | "date">) => Promise<void>;

  addCountry: (country: Country) => void;
  updateCountry: (id: string, data: Partial<Country>) => void;
  removeCountry: (id: string) => void;
  
  addVisaType: (countryId: string, visaType: VisaType) => void;
  updateVisaType: (countryId: string, visaId: string, data: Partial<VisaType>) => void;
  removeVisaType: (countryId: string, visaId: string) => void;

  authReady: boolean;
  authUserUid: string | null;
  authRole: 'admin' | 'agency' | null;
  currentAgency: Agency | null;
  setCurrentAgency: (agency: Agency | null) => void;
  b2cMode: boolean;
  setB2cMode: (mode: boolean) => void;
  b2cMarginPercent: number;
  setB2cMarginPercent: (percent: number) => void;
  updateAgency: (id: string, updates: Partial<Agency>) => Promise<void>;

  catalogLoading: boolean;
  catalogLoaded: boolean;
  refreshCatalog: (force?: boolean) => Promise<void>;

  quotaExceeded: boolean;
  setQuotaExceeded: (exceeded: boolean) => void;

  addApplication: (application: Application) => Promise<void>;
  updateApplicationStatus: (id: string, status: Application["status"]) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  addApplicationTimelineEntry: (id: string, entry: Omit<NonNullable<Application["timeline"]>[0], "id" | "date">) => Promise<void>;
  clearData: () => void;
}

export const useAppStore = create<AppState>()((set, get) => ({
  authReady: false,
  authUserUid: null,
  authRole: null,
  catalogLoading: false,
  catalogLoaded: false,
  quotaExceeded: false,
  setQuotaExceeded: (exceeded) => set({ quotaExceeded: exceeded }),

  refreshCatalog: async (force = true) => {
    set({ catalogLoading: true });
    try {
      if (force) catalogService.invalidateCache();
      const [countries, services, organizedTrips, studyPrograms] = await Promise.all([
        catalogService.getCountries(force),
        catalogService.getServices(force),
        catalogService.getOrganizedTrips(force),
        catalogService.getStudyPrograms(force)
      ]);
      set({
        countries: countries as any,
        services: services as any,
        organizedTrips: organizedTrips as any,
        studyPrograms: studyPrograms as any,
        catalogLoading: false,
        catalogLoaded: true
      });
    } catch (err) {
      console.warn('[Catalog] Erreur rafraîchissement catalogue:', err);
      set({ catalogLoading: false, catalogLoaded: true });
    }
  },

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
    const sanitized = sanitizeFirestoreData(updates);
    await updateDoc(doc(db, "users", id), sanitized);
    set((state) => ({
      agencies: state.agencies.map(a => a.id === id ? { ...a, ...updates } : a)
    }));
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
  updateAgencyStatus: async (id, status) => { 
    await updateDoc(doc(db, "users", id), { status }); 
    set((state) => ({
      agencies: state.agencies.map(a => a.id === id ? { ...a, status } : a)
    }));
  },
  countries: [],
  services: [],
  applications: [],
  organizedTrips: [],
  tripReservations: [],
  studyPrograms: [],
  studyApplications: [],

  addService: async (s) => {
    const sId = s.id || doc(collection(db, 'services')).id;
    const finalService = { ...s, id: sId };
    await setDoc(doc(db, 'services', sId), sanitizeFirestoreData(finalService));
    catalogService.invalidateCache('services');
    set(state => ({
      services: [finalService, ...state.services.filter(item => item.id !== sId)]
    }));
  },
  updateService: async (id, s) => {
    await updateDoc(doc(db, 'services', id), sanitizeFirestoreData(s));
    catalogService.invalidateCache('services');
    set(state => ({
      services: state.services.map(item => item.id === id ? { ...item, ...s } : item)
    }));
  },
  deleteService: async (id) => {
    await deleteDoc(doc(db, 'services', id));
    catalogService.invalidateCache('services');
    set(state => ({
      services: state.services.filter(item => item.id !== id)
    }));
  },

  addOrganizedTrip: async (tripData) => {
    const tripId = doc(collection(db, 'organizedTrips')).id;
    const newTrip: OrganizedTrip = {
      ...tripData,
      id: tripId,
      createdAt: new Date().toISOString(),
      availableSeats: tripData.totalSeats,
    } as OrganizedTrip;
    await setDoc(doc(db, 'organizedTrips', tripId), sanitizeFirestoreData(newTrip));
    catalogService.invalidateCache('organizedTrips');
    set(state => ({
      organizedTrips: [newTrip, ...state.organizedTrips.filter(t => t.id !== tripId)]
    }));
  },

  updateOrganizedTrip: async (id, tripData) => {
    await updateDoc(doc(db, 'organizedTrips', id), sanitizeFirestoreData(tripData));
    catalogService.invalidateCache('organizedTrips');
    set(state => ({
      organizedTrips: state.organizedTrips.map(t => t.id === id ? { ...t, ...tripData } : t)
    }));
  },

  deleteOrganizedTrip: async (id) => {
    await deleteDoc(doc(db, 'organizedTrips', id));
    catalogService.invalidateCache('organizedTrips');
    set(state => ({
      organizedTrips: state.organizedTrips.filter(t => t.id !== id)
    }));
  },

  addTripReservation: async (resData) => {
    const peopleCount = Number(resData.numberOfPeople);
    if (!Number.isInteger(peopleCount) || peopleCount < 1 || peopleCount > 50) {
      throw new Error("Le nombre de voyageurs doit être un entier compris entre 1 et 50.");
    }

    const resId = `RES-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const tripRef = doc(db, 'organizedTrips', resData.tripId);
    const resRef = doc(db, 'tripReservations', resId);
    const notifAdminRef = doc(collection(db, 'notifications'));
    const notifAgencyRef = doc(collection(db, 'notifications'));

    let finalReservation: TripReservation | null = null;
    let finalUpdatedSeats = 0;

    await runTransaction(db, async (transaction) => {
      const tripDoc = await transaction.get(tripRef);
      if (!tripDoc.exists()) {
        throw new Error("Ce voyage organisé n'est plus disponible.");
      }

      const tripData = tripDoc.data() as OrganizedTrip;
      if (tripData.status && tripData.status !== 'active') {
        throw new Error("Ce voyage organisé n'est actuellement pas ouvert aux réservations.");
      }

      const freshAvailableSeats = Number(tripData.availableSeats || 0);
      if (freshAvailableSeats < peopleCount) {
        throw new Error(`Nombre de places insuffisant : seulement ${freshAvailableSeats} place(s) disponible(s).`);
      }

      const unitPrice = Number(tripData.price || 0);
      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        throw new Error("Tarif du voyage invalide.");
      }

      const totalPrice = unitPrice * peopleCount;
      finalUpdatedSeats = Math.max(0, freshAvailableSeats - peopleCount);

      finalReservation = {
        ...resData,
        id: resId,
        numberOfPeople: peopleCount,
        createdAt: new Date().toISOString(),
        status: 'pending',
        totalPrice,
        paidAmount: 0
      };

      const sanitized = sanitizeFirestoreData(finalReservation);

      transaction.update(tripRef, { availableSeats: finalUpdatedSeats });
      transaction.set(resRef, sanitized);
      transaction.set(notifAdminRef, {
        id: notifAdminRef.id,
        agencyId: 'admin',
        title: 'Nouvelle réservation Voyage Organisé',
        message: `${resData.agencyName || 'Une agence'} a réservé ${peopleCount} place(s) pour « ${tripData.title} » (Client: ${resData.clientName || 'N/A'}).`.slice(0, 580),
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/admin/trips'
      });
      transaction.set(notifAgencyRef, {
        id: notifAgencyRef.id,
        agencyId: resData.agencyId,
        title: 'Réservation Enregistrée avec Succès',
        message: `Votre réservation pour « ${tripData.title} » (${peopleCount} personne(s)) est enregistrée sous la référence ${resId}.`.slice(0, 580),
        type: 'success',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/agency/trips'
      });
    });

    catalogService.invalidateCache('organizedTrips');

    if (!finalReservation) {
      throw new Error("Échec de l'enregistrement de la réservation.");
    }

    const committedReservation: TripReservation = finalReservation;

    // Mise à jour immédiate du store local
    set((state) => ({
      tripReservations: [committedReservation, ...state.tripReservations.filter(r => r.id !== resId)],
      organizedTrips: state.organizedTrips.map(t =>
        t.id === resData.tripId
          ? { ...t, availableSeats: finalUpdatedSeats }
          : t
      )
    }));

    return committedReservation;
  },

  updateTripReservationPayment: async (id, amount) => {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Montant de paiement invalide.");
    }
    const resRef = doc(db, 'tripReservations', id);
    await runTransaction(db, async (transaction) => {
      const resSnap = await transaction.get(resRef);
      if (!resSnap.exists()) throw new Error("Réservation introuvable.");
      const data = resSnap.data() as TripReservation;
      const newPaidAmount = Math.min(Number(data.totalPrice || 0), (Number(data.paidAmount || 0)) + amount);
      transaction.update(resRef, { paidAmount: newPaidAmount });
    });
  },

  updateTripReservationStatus: async (id, status) => {
    const resRef = doc(db, 'tripReservations', id);
    await runTransaction(db, async (transaction) => {
      const resSnap = await transaction.get(resRef);
      if (!resSnap.exists()) return;
      const reservation = resSnap.data() as TripReservation;

      const tripRef = doc(db, 'organizedTrips', reservation.tripId);
      const tripSnap = await transaction.get(tripRef);

      transaction.update(resRef, { status });

      if (status === 'cancelled' && reservation.status !== 'cancelled' && tripSnap.exists()) {
        const tripData = tripSnap.data() as OrganizedTrip;
        const maxSeats = Number(tripData.totalSeats || 0);
        const restoredSeats = Number(tripData.availableSeats || 0) + Number(reservation.numberOfPeople || 0);
        transaction.update(tripRef, {
          availableSeats: maxSeats > 0 ? Math.min(maxSeats, restoredSeats) : restoredSeats
        });
      }
    });
    catalogService.invalidateCache('organizedTrips');
  },

  addCountry: async (country) => {
    await setDoc(doc(db, 'countries', country.id), sanitizeFirestoreData(country));
    catalogService.invalidateCache('countries');
    set(state => ({
      countries: [country, ...state.countries.filter(c => c.id !== country.id)]
    }));
  },

  addStudyProgram: async (programData) => {
    const progId = doc(collection(db, 'studyPrograms')).id;
    const newProg: StudyProgram = {
      ...programData,
      id: progId,
      createdAt: new Date().toISOString()
    } as StudyProgram;
    const sanitized = sanitizeFirestoreData(newProg);
    await setDoc(doc(db, 'studyPrograms', progId), sanitized);
    catalogService.invalidateCache('studyPrograms');
    set(state => ({
      studyPrograms: [newProg, ...state.studyPrograms.filter(p => p.id !== progId)]
    }));
  },

  updateStudyProgram: async (id, programData) => {
    const sanitized = sanitizeFirestoreData(programData);
    await updateDoc(doc(db, 'studyPrograms', id), sanitized);
    catalogService.invalidateCache('studyPrograms');
    set(state => ({
      studyPrograms: state.studyPrograms.map(p => p.id === id ? { ...p, ...programData } : p)
    }));
  },

  deleteStudyProgram: async (id) => {
    await deleteDoc(doc(db, 'studyPrograms', id));
    catalogService.invalidateCache('studyPrograms');
    set(state => ({
      studyPrograms: state.studyPrograms.filter(p => p.id !== id)
    }));
  },

  addStudyApplication: async (application) => {
    const appId = (application as any).id || `ETUD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const price = Number(application.price || 0);
    if (!Number.isFinite(price) || price < 0) {
      throw new Error("Tarif du programme d'études invalide.");
    }

    // Protection anti-dépassement Firestore (1 Mo) : normaliser les documents et pièces jointes
    const safeDocuments: Record<string, string> = {};
    if (application.documents) {
      for (const [k, v] of Object.entries(application.documents)) {
        if (typeof v === 'string') {
          if (v.startsWith('data:') && v.length > 500) {
            safeDocuments[k] = `att_${Date.now()}_${k.replace(/[^a-zA-Z0-9]/g, '_')}`;
          } else {
            safeDocuments[k] = v;
          }
        }
      }
    }

    const safeAttachments = ((application as any).attachments || []).map((att: any) => ({
      id: att.id || att.storageId || `att_${Date.now()}`,
      storageId: att.storageId || att.id,
      name: att.name || 'document',
      category: att.category || 'Dossier',
      type: att.type || 'application/octet-stream',
      size: att.size || 0,
      url: att.url && !att.url.startsWith('data:') ? att.url : (att.storageId || ''),
      uploadedAt: att.uploadedAt || new Date().toISOString(),
      uploadedBy: att.uploadedBy || 'Agency'
    }));

    const newStudyApp: StudyApplication = {
      ...application,
      id: appId,
      price: price,
      paidAmount: 0,
      paymentStatus: 'unpaid',
      submissionDate: new Date().toISOString(),
      status: "Pending",
      documents: safeDocuments,
      attachments: safeAttachments,
      timeline: [
        {
          id: `entry_${Date.now()}`,
          date: new Date().toISOString(),
          title: "Dossier Études Déposé",
          message: `Dossier d'admission pour « ${application.programTitle || 'Programme Études'} » (${application.university || ''} - ${application.country || ''}) déposé par l'agence.`,
          sender: "Agency"
        }
      ]
    };

    const sanitized = sanitizeFirestoreData(newStudyApp);
    const mainAppData = sanitizeFirestoreData({
      id: appId,
      agencyId: application.agencyId,
      agencyName: application.agencyName || 'Mon Agence',
      serviceType: 'Etude',
      country: application.country || 'Destination Universitaire',
      visaType: `Visa Études - ${application.programTitle || 'Admission Universitaire'}`,
      travelerName: application.studentName,
      passportNumber: application.passportNumber,
      status: 'Pending',
      price: price,
      submissionDate: new Date().toISOString(),
      attachments: safeAttachments,
      customFormData: {
        programId: application.programId,
        programTitle: application.programTitle,
        university: application.university,
        country: application.country,
        city: application.city,
        email: application.email,
        phone: application.phone,
        documents: safeDocuments
      },
      timeline: newStudyApp.timeline
    });

    const notifAdminRef = doc(collection(db, 'notifications'));
    const notifAgencyRef = doc(collection(db, 'notifications'));

    // Écriture groupée atomique (writeBatch) pour minimiser les requêtes et garantir la cohérence
    const batch = writeBatch(db);
    batch.set(doc(db, 'studyApplications', appId), sanitized);
    batch.set(doc(db, 'applications', appId), mainAppData);
    batch.set(notifAdminRef, {
      id: notifAdminRef.id,
      agencyId: 'admin',
      title: 'Nouveau dossier Visa Études',
      message: `${application.agencyName || 'Une agence'} a soumis un dossier d'études pour ${application.studentName} (${application.university || ''} - ${application.country || ''}).`,
      type: 'info',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/admin/study'
    });
    batch.set(notifAgencyRef, {
      id: notifAgencyRef.id,
      agencyId: application.agencyId,
      title: 'Dossier Études Enregistré',
      message: `Votre dossier pour ${application.studentName} (${application.university || ''}) est bien enregistré sous la référence ${appId}.`,
      type: 'success',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/agency/study'
    });

    await batch.commit();

    // Mise à jour immédiate du store local
    set((state) => ({
      studyApplications: [newStudyApp, ...state.studyApplications.filter(a => a.id !== appId)]
    }));
  },

  updateStudyApplicationStatus: async (id, status) => {
    await updateDoc(doc(db, 'studyApplications', id), { status });
    set(state => ({
      studyApplications: state.studyApplications.map(a => a.id === id ? { ...a, status } : a)
    }));
    const app = get().studyApplications.find(a => a.id === id);
    if (app) {
      const notifId = doc(collection(db, 'notifications')).id;
      await setDoc(doc(db, 'notifications', notifId), {
        id: notifId,
        agencyId: app.agencyId,
        title: `Dossier Études : ${status}`,
        message: `Le statut du dossier de ${app.studentName} (${app.university || 'Université'}) est maintenant : ${status}.`,
        type: status === 'Approved' ? 'success' : (status === 'Rejected' ? 'error' : 'info'),
        read: false,
        createdAt: new Date().toISOString(),
        link: '/agency/study'
      });
    }
  },

  updateStudyApplicationPayment: async (id, amount) => {
    const app = get().studyApplications.find(a => a.id === id);
    if (!app) return;
    const newPaidAmount = (app.paidAmount || 0) + amount;
    const paymentStatus = newPaidAmount >= app.price ? 'paid' : (newPaidAmount > 0 ? 'partial' : 'unpaid');
    await updateDoc(doc(db, 'studyApplications', id), {
      paidAmount: newPaidAmount,
      paymentStatus
    });
    set(state => ({
      studyApplications: state.studyApplications.map(a => 
        a.id === id ? { ...a, paidAmount: newPaidAmount, paymentStatus } : a
      )
    }));
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
    await updateDoc(doc(db, 'countries', id), sanitizeFirestoreData(data));
    catalogService.invalidateCache('countries');
    set(state => ({
      countries: state.countries.map(c => c.id === id ? { ...c, ...data } : c)
    }));
  },

  removeCountry: async (id) => {
    await deleteDoc(doc(db, 'countries', id));
    catalogService.invalidateCache('countries');
    set(state => ({
      countries: state.countries.filter(c => c.id !== id)
    }));
  },

  addVisaType: async (countryId, visaType) => {
    const country = get().countries.find(c => c.id === countryId);
    if (country) {
      const newVisaTypes = [...country.visaTypes, visaType];
      await updateDoc(doc(db, 'countries', countryId), { visaTypes: sanitizeFirestoreData(newVisaTypes) });
      catalogService.invalidateCache('countries');
      set(state => ({
        countries: state.countries.map(c => c.id === countryId ? { ...c, visaTypes: newVisaTypes } : c)
      }));
    }
  },

  updateVisaType: async (countryId, visaId, data) => {
    const country = get().countries.find(c => c.id === countryId);
    if (country) {
      const newVisaTypes = country.visaTypes.map(v => v.id === visaId ? { ...v, ...data } : v);
      await updateDoc(doc(db, 'countries', countryId), { visaTypes: sanitizeFirestoreData(newVisaTypes) });
      catalogService.invalidateCache('countries');
      set(state => ({
        countries: state.countries.map(c => c.id === countryId ? { ...c, visaTypes: newVisaTypes } : c)
      }));
    }
  },

  removeVisaType: async (countryId, visaId) => {
    const country = get().countries.find(c => c.id === countryId);
    if (country) {
      const newVisaTypes = country.visaTypes.filter(v => v.id !== visaId);
      await updateDoc(doc(db, 'countries', countryId), { visaTypes: sanitizeFirestoreData(newVisaTypes) });
      catalogService.invalidateCache('countries');
      set(state => ({
        countries: state.countries.map(c => c.id === countryId ? { ...c, visaTypes: newVisaTypes } : c)
      }));
    }
  },

  addApplication: async (application) => {
    const appId = application.id || doc(collection(db, 'applications')).id;
    const userRef = doc(db, 'users', application.agencyId);
    const serviceId = application.customFormData?.serviceId
      ? String(application.customFormData.serviceId)
      : null;

    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error("Agence introuvable.");
      }

      const userData = userDoc.data();
      if (userData.status !== 'ACTIVE') {
        throw new Error("Votre compte agence doit être actif pour soumettre une demande.");
      }

      // Vérification autoritaire du tarif depuis Firestore si un serviceId est lié
      let authoritativePrice = Number(application.price ?? 0);
      if (serviceId) {
        const serviceDoc = await transaction.get(doc(db, 'services', serviceId));
        if (!serviceDoc.exists() || serviceDoc.data().active === false) {
          throw new Error("Cette prestation n'est plus disponible au catalogue.");
        }
        authoritativePrice = Number(serviceDoc.data().price ?? 0);
      }

      if (!Number.isFinite(authoritativePrice) || authoritativePrice < 0) {
        throw new Error("Tarif de la prestation invalide.");
      }

      const currentBalance = Number(userData.balance || 0);
      if (currentBalance < authoritativePrice) {
        throw new Error("Solde insuffisant pour cette opération.");
      }

      transaction.update(userRef, { balance: currentBalance - authoritativePrice });
      transaction.set(
        doc(db, 'applications', appId),
        sanitizeFirestoreData({
          ...application,
          id: appId,
          price: authoritativePrice
        })
      );

      // Enregistrement atomique du débit financier
      const txRef = doc(collection(db, 'transactions'));
      transaction.set(txRef, {
        id: txRef.id,
        agencyId: application.agencyId,
        agencyName: application.agencyName || userData.agencyName || '',
        amount: authoritativePrice,
        type: 'debit',
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
        description: `Paiement pour visa ${application.visaType || 'Service'} (${application.travelerName || ''})`.slice(0, 480)
      });

      // Notification Administrateur
      const notifRef = doc(collection(db, 'notifications'));
      transaction.set(notifRef, {
        id: notifRef.id,
        agencyId: 'admin',
        title: 'Nouvelle demande de Visa',
        message: `${application.agencyName || userData.agencyName || 'Une agence'} a soumis une demande pour ${application.travelerName || 'un client'}.`.slice(0, 580),
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
    catalogService.invalidateCache();
    set({
      authReady: true,
      authUserUid: null,
      authRole: null,
      currentAgency: null,
      agencyBalance: 0,
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
      studyApplications: [],
      catalogLoading: false,
      catalogLoaded: false
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
