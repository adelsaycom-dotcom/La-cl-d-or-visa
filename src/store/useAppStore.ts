export interface Agency {
  id: string;
  name?: string;
  agencyName?: string;
  email: string;
  phone: string;
  status: string;
  balance: number;
  applicationsCount: number;
  role: string;
}
import { create } from "zustand";
import { collection, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

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
  createdAt: string;
  passengerNames?: string[];
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
  status: "Pending" | "Processing" | "Approved" | "Rejected";
  submissionDate: string;
  price: number;
  extraData?: Record<string, string>;
  customFormData?: Record<string, any>;
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
  agencies: Agency[];
  updateAgencyStatus: (id: string, status: string) => void;
  applications: Application[];
  organizedTrips: OrganizedTrip[];
  tripReservations: TripReservation[];

  addOrganizedTrip: (trip: Omit<OrganizedTrip, 'id' | 'createdAt' | 'availableSeats'>) => void;
  updateOrganizedTrip: (id: string, trip: Partial<OrganizedTrip>) => void;
  deleteOrganizedTrip: (id: string) => void;

  addTripReservation: (reservation: Omit<TripReservation, 'id' | 'createdAt' | 'status' | 'totalPrice'>) => void;
  updateTripReservationStatus: (id: string, status: TripReservation['status']) => void;

  addCountry: (country: Country) => void;
  updateCountry: (id: string, data: Partial<Country>) => void;
  removeCountry: (id: string) => void;
  
  addVisaType: (countryId: string, visaType: VisaType) => void;
  updateVisaType: (countryId: string, visaId: string, data: Partial<VisaType>) => void;
  removeVisaType: (countryId: string, visaId: string) => void;

  addApplication: (application: Application) => void;
  updateApplicationStatus: (id: string, status: Application["status"]) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  clearData: () => void;
}

export const useAppStore = create<AppState>()((set, get) => ({
  agencyBalance: 0,
  setAgencyBalance: (balance) => {
    // In a real app, you'd update this in Firestore via a Cloud Function or Admin rule
    set({ agencyBalance: balance });
  },

  
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

  agencies: [],
  updateAgencyStatus: async (id, status) => { await updateDoc(doc(db, "users", id), { status }); },
  countries: [],
  applications: [],
  organizedTrips: [],
  tripReservations: [],

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
      totalPrice: trip.price * resData.numberOfPeople
    });

    // Deduct seats
    await updateDoc(doc(db, 'organizedTrips', resData.tripId), {
      availableSeats: trip.availableSeats - resData.numberOfPeople
    });
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
    await setDoc(doc(db, 'applications', appId), {
      ...application,
      id: appId
    });
  },

  updateApplicationStatus: async (id, status) => {
    await updateDoc(doc(db, 'applications', id), { status });
  },

  updateApplication: async (id, updates) => {
    await updateDoc(doc(db, 'applications', id), updates);
  },
  clearData: () => {
    set({ agencies: [], supportTickets: [], transactions: [], rechargeRequests: [], countries: [], applications: [], organizedTrips: [], tripReservations: [] });
  }
}));

// Add support tickets, transactions, and recharge requests to the store
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
  status: "Ouvert" | "En cours" | "Résolu" | string;
  messages: { sender: string; text: string; date: string }[];
  createdAt: string;
}

export interface Transaction {
  id: string;
  agencyId: string;
  type: string;
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
  status: string;
  date: string;
  createdAt: string;
}

// NOTE: We should update AppState interface, but since we are redefining the store, let's just use Zustand's set method directly for now, or we can just append to the store.
