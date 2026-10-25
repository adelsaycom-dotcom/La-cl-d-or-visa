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
    if (!trip) {
      throw new Error("Ce voyage organisé n'est plus disponible.");
    }
    if (trip.availableSeats < resData.numberOfPeople) {
      throw new Error(`Nombre de places insuffisant : seulement ${trip.availableSeats} place(s) disponible(s).`);
    }

    const resId = `RES-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const totalPrice = (trip.price || 0) * (resData.numberOfPeople || 1);
    
    const newReservation: TripReservation = {
      ...resData,
      id: resId,
      createdAt: new Date().toISOString(),
      status: 'pending',
      totalPrice: totalPrice,
      paidAmount: 0
    };

    const sanitized = sanitizeFirestoreData(newReservation);
    await setDoc(doc(db, 'tripReservations', resId), sanitized);

    // Mise à jour immédiate du store local
    set((state) => ({
      tripReservations: [newReservation, ...state.tripReservations.filter(r => r.id !== resId)],
      organizedTrips: state.organizedTrips.map(t => 
        t.id === resData.tripId 
          ? { ...t, availableSeats: Math.max(0, t.availableSeats - resData.numberOfPeople) }
          : t
      )
    }));

    // Décompter les places disponibles dans Firestore
    try {
      const updatedSeats = Math.max(0, trip.availableSeats - resData.numberOfPeople);
      await updateDoc(doc(db, 'organizedTrips', resData.tripId), {
        availableSeats: updatedSeats
      });
    } catch (seatErr) {
      console.warn("Avertissement mise à jour places disponibles:", seatErr);
    }

    // Notification pour l'administrateur
    try {
      const notifAdminRef = doc(collection(db, 'notifications'));
      await setDoc(notifAdminRef, {
        id: notifAdminRef.id,
        agencyId: 'admin',
        title: 'Nouvelle réservation Voyage Organisé',
        message: `${resData.agencyName || 'Une agence'} a réservé ${resData.numberOfPeople} place(s) pour « ${trip.title} » (Client: ${resData.clientName}).`,
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/admin/trips'
      });

      // Notification pour l'agence
      const notifAgencyRef = doc(collection(db, 'notifications'));
      await setDoc(notifAgencyRef, {
        id: notifAgencyRef.id,
        agencyId: resData.agencyId,
        title: 'Réservation Enregistrée avec Succès',
        message: `Votre réservation pour « ${trip.title} » (${resData.numberOfPeople} personne(s)) est enregistrée sous la référence ${resId}.`,
        type: 'success',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/agency/trips'
      });
    } catch (notifErr) {
      console.warn("Avertissement notification voyage:", notifErr);
    }

    return newReservation;
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
    const newProg: StudyProgram = {
      ...programData,
      id: progId,
      createdAt: new Date().toISOString()
    } as StudyProgram;
    const sanitized = sanitizeFirestoreData(newProg);
    await setDoc(doc(db, 'studyPrograms', progId), sanitized);
    set(state => ({
      studyPrograms: [newProg, ...state.studyPrograms.filter(p => p.id !== progId)]
    }));
  },

  updateStudyProgram: async (id, programData) => {
    const sanitized = sanitizeFirestoreData(programData);
    await updateDoc(doc(db, 'studyPrograms', id), sanitized);
    set(state => ({
      studyPrograms: state.studyPrograms.map(p => p.id === id ? { ...p, ...programData } : p)
    }));
  },

  deleteStudyProgram: async (id) => {
    await deleteDoc(doc(db, 'studyPrograms', id));
    set(state => ({
      studyPrograms: state.studyPrograms.filter(p => p.id !== id)
    }));
  },

  addStudyApplication: async (application) => {
    const appId = (application as any).id || `ETUD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const price = application.price || 0;

    const newStudyApp: StudyApplication = {
      ...application,
      id: appId,
      price: price,
      paidAmount: 0,
      paymentStatus: 'unpaid',
      submissionDate: new Date().toISOString(),
      status: "Pending",
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
    await setDoc(doc(db, 'studyApplications', appId), sanitized);

    // Mise à jour immédiate du store local
    set((state) => ({
      studyApplications: [newStudyApp, ...state.studyApplications.filter(a => a.id !== appId)]
    }));

    // Inscription conjointe dans applications pour la vue globale centrale
    try {
      const mainAppRef = doc(db, 'applications', appId);
      await setDoc(mainAppRef, sanitizeFirestoreData({
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
        attachments: (application as any).attachments || [],
        customFormData: {
          programId: application.programId,
          programTitle: application.programTitle,
          university: application.university,
          country: application.country,
          city: application.city,
          email: application.email,
          phone: application.phone,
          documents: application.documents || {}
        },
        timeline: newStudyApp.timeline
      }));
    } catch (mainErr) {
      console.warn("Avertissement synchronisation globale:", mainErr);
    }

    // Notification pour l'administrateur
    try {
      const notifRef = doc(collection(db, 'notifications'));
      await setDoc(notifRef, {
        id: notifRef.id,
        agencyId: 'admin',
        title: 'Nouveau dossier Visa Études',
        message: `${application.agencyName || 'Une agence'} a soumis un dossier d'études pour ${application.studentName} (${application.university || ''} - ${application.country || ''}).`,
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/admin/study'
      });

      // Notification de confirmation pour l'agence
      const notifAgencyRef = doc(collection(db, 'notifications'));
      await setDoc(notifAgencyRef, {
        id: notifAgencyRef.id,
        agencyId: application.agencyId,
        title: 'Dossier Études Enregistré',
        message: `Votre dossier pour ${application.studentName} (${application.university || ''}) est bien enregistré sous la référence ${appId}.`,
        type: 'success',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/agency/study'
      });
    } catch (notifErr) {
      console.warn("Avertissement notification:", notifErr);
    }
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
