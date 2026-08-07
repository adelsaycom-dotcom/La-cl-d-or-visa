import { create } from "zustand";
import { persist } from "zustand/middleware";



export interface CustomFormField {
  id: string;
  label: string;
  type: 'text' | 'file' | 'number';
  required: boolean;
}
export interface OrganizedTrip {
  customFormFields?: CustomFormField[];
  id: string;
  title: string;
  destination: string;
  description: string;
  photoUrl: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  status: 'active' | 'draft' | 'completed';
}

export interface TripReservation {
  customFormData?: Record<string, string>;
  id: string;
  tripId: string;
  agencyId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  numberOfPeople: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  notes?: string;
}

export interface VisaType {
  customFormFields?: CustomFormField[];
  id: string;
  name: string;
  price: number;
  processingTime: string;
  description: string;
  requiredDocuments?: string[];
  conditions?: string[];
}

export interface Country {
  id: string;
  name: string;
  flag: string;
  active: boolean;
  visaTypes: VisaType[];
}

export type ServiceType =
  | "Evisa"
  | "Residence"
  | "Permis"
  | "Assurance"
  | "Etude"
  | "Invitation"
  | "Rendez-vous"
  | "Dossier";

export interface Application {
  customFormData?: Record<string, string>;
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
}

export interface AppState {
  agencyBalance: number;
  setAgencyBalance: (balance: number) => void;
  countries: Country[];
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
  updateVisaType: (
    countryId: string,
    visaId: string,
    data: Partial<VisaType>,
  ) => void;
  removeVisaType: (countryId: string, visaId: string) => void;
  addApplication: (application: Application) => void;
  updateApplicationStatus: (id: string, status: Application["status"]) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      agencyBalance: 4500,
      setAgencyBalance: (balance) => set({ agencyBalance: balance }),
      countries: [
        {
          id: "1",
          name: "United Arab Emirates",
          flag: "🇦🇪",
          active: true,
          visaTypes: [
            {
              id: "v1",
              name: "Tourist Visa 30 Days",
              price: 90,
              processingTime: "24-48 hours",
              description: "Single entry 30 days tourist visa.",
              requiredDocuments: [
                "Copie du passeport (pages d'informations)",
                "Photo d'identité (fond blanc)",
                "Réservation d'hôtel ou lettre d'hébergement",
              ],
              conditions: [
                "Le passeport doit être valide au moins 6 mois",
                "Le demandeur ne doit pas avoir fait l'objet d'une interdiction de territoire",
              ],
            },
            {
              id: "v2",
              name: "Tourist Visa 60 Days",
              price: 150,
              processingTime: "24-48 hours",
              description: "Single entry 60 days tourist visa.",
              requiredDocuments: [
                "Copie du passeport (pages d'informations)",
                "Photo d'identité (fond blanc)",
              ],
              conditions: ["Le passeport doit être valide au moins 6 mois"],
            },
          ],
        },
        {
          id: "2",
          name: "Turkey",
          flag: "🇹🇷",
          active: true,
          visaTypes: [
            {
              id: "v3",
              name: "eVisa Single Entry",
              price: 60,
              processingTime: "24 hours",
              description: "Standard tourist eVisa for eligible nationalities.",
              requiredDocuments: ["Copie du passeport"],
              conditions: ["Avoir un visa Schengen, US, UK ou Irelande valide"],
            },
          ],
        },
      ],
      
  organizedTrips: [],
  tripReservations: [],
  applications: [
        {
          id: "APP-001",
          agencyId: "a1",
          agencyName: "Wanderlust Tours",
          serviceType: "Evisa",
          country: "United Arab Emirates",
          visaType: "Tourist Visa 30 Days",
          travelerName: "John Doe",
          passportNumber: "A12345678",
          status: "Pending",
          submissionDate: new Date().toISOString().split("T")[0],
          price: 90,
        },
      ],
      
      addOrganizedTrip: (tripData) => set((state) => ({
        organizedTrips: [
          ...(state.organizedTrips || []),
          {
            ...tripData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            availableSeats: tripData.totalSeats,
          }
        ]
      })),
      updateOrganizedTrip: (id, tripData) => set((state) => ({
        organizedTrips: (state.organizedTrips || []).map(t => t.id === id ? { ...t, ...tripData } : t)
      })),
      deleteOrganizedTrip: (id) => set((state) => ({
        organizedTrips: (state.organizedTrips || []).filter(t => t.id !== id)
      })),
      addTripReservation: (resData) => set((state) => {
        const trip = (state.organizedTrips || []).find(t => t.id === resData.tripId);
        if (!trip || trip.availableSeats < resData.numberOfPeople) return state; // Invalid reservation
        
        return {
          tripReservations: [
            ...(state.tripReservations || []),
            {
              ...resData,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: new Date().toISOString(),
              status: 'pending',
              totalPrice: trip.price * resData.numberOfPeople
            }
          ],
          // Deduct seats
          organizedTrips: (state.organizedTrips || []).map(t => 
            t.id === resData.tripId ? { ...t, availableSeats: t.availableSeats - resData.numberOfPeople } : t
          )
        };
      }),
      updateTripReservationStatus: (id, status) => set((state) => {
        const reservation = (state.tripReservations || []).find(r => r.id === id);
        if (!reservation) return state;
        
        let seatAdjustment = 0;
        if (status === 'cancelled' && reservation.status !== 'cancelled') {
           seatAdjustment = reservation.numberOfPeople;
        } else if (reservation.status === 'cancelled' && status !== 'cancelled') {
           seatAdjustment = -reservation.numberOfPeople;
        }

        return {
          tripReservations: (state.tripReservations || []).map(r => r.id === id ? { ...r, status } : r),
          organizedTrips: seatAdjustment !== 0 ? (state.organizedTrips || []).map(t => 
            t.id === reservation.tripId ? { ...t, availableSeats: t.availableSeats + seatAdjustment } : t
          ) : state.organizedTrips
        };
      }),
      addCountry: (country) =>
        set((state) => ({ countries: [...state.countries, country] })),
      updateCountry: (id, data) =>
        set((state) => ({
          countries: state.countries.map((c) =>
            c.id === id ? { ...c, ...data } : c,
          ),
        })),
      removeCountry: (id) =>
        set((state) => ({
          countries: state.countries.filter((c) => c.id !== id),
        })),
      addVisaType: (countryId, visaType) =>
        set((state) => ({
          countries: state.countries.map((c) =>
            c.id === countryId
              ? { ...c, visaTypes: [...c.visaTypes, visaType] }
              : c,
          ),
        })),
      updateVisaType: (countryId, visaId, data) =>
        set((state) => ({
          countries: state.countries.map((c) =>
            c.id === countryId
              ? {
                  ...c,
                  visaTypes: c.visaTypes.map((v) =>
                    v.id === visaId ? { ...v, ...data } : v,
                  ),
                }
              : c,
          ),
        })),
      removeVisaType: (countryId, visaId) =>
        set((state) => ({
          countries: state.countries.map((c) =>
            c.id === countryId
              ? {
                  ...c,
                  visaTypes: c.visaTypes.filter((v) => v.id !== visaId),
                }
              : c,
          ),
        })),
      addApplication: (application) =>
        set((state) => ({
          applications: [application, ...state.applications],
        })),
      updateApplicationStatus: (id, status) =>
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id ? { ...a, status } : a,
          ),
        })),
      updateApplication: (id, updates) =>
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id ? { ...a, ...updates } : a,
          ),
        })),
    }),
    {
      name: "visahub-storage",
    },
  ),
);
