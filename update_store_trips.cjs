const fs = require('fs');

function updateStore() {
  let c = fs.readFileSync('src/store/useAppStore.ts', 'utf8');
  
  if (!c.includes('export interface OrganizedTrip')) {
    const interfaces = `
export interface OrganizedTrip {
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
`;
    c = c.replace(/export interface User/, interfaces + '\nexport interface User');
    
    const stateTypes = `
  organizedTrips: OrganizedTrip[];
  tripReservations: TripReservation[];
  addOrganizedTrip: (trip: Omit<OrganizedTrip, 'id' | 'createdAt' | 'availableSeats'>) => void;
  updateOrganizedTrip: (id: string, trip: Partial<OrganizedTrip>) => void;
  deleteOrganizedTrip: (id: string) => void;
  addTripReservation: (reservation: Omit<TripReservation, 'id' | 'createdAt' | 'status' | 'totalPrice'>) => void;
  updateTripReservationStatus: (id: string, status: TripReservation['status']) => void;
`;
    c = c.replace(/applications: Application\[\];/, 'applications: Application[];' + stateTypes);
    
    const defaultState = `
  organizedTrips: [],
  tripReservations: [],
`;
    c = c.replace(/applications: \[/, defaultState + '  applications: [');
    
    const actions = `
      addOrganizedTrip: (tripData) => set((state) => ({
        organizedTrips: [
          ...state.organizedTrips,
          {
            ...tripData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            availableSeats: tripData.totalSeats,
          }
        ]
      })),
      updateOrganizedTrip: (id, tripData) => set((state) => ({
        organizedTrips: state.organizedTrips.map(t => t.id === id ? { ...t, ...tripData } : t)
      })),
      deleteOrganizedTrip: (id) => set((state) => ({
        organizedTrips: state.organizedTrips.filter(t => t.id !== id)
      })),
      addTripReservation: (resData) => set((state) => {
        const trip = state.organizedTrips.find(t => t.id === resData.tripId);
        if (!trip || trip.availableSeats < resData.numberOfPeople) return state; // Invalid reservation
        
        return {
          tripReservations: [
            ...state.tripReservations,
            {
              ...resData,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: new Date().toISOString(),
              status: 'pending',
              totalPrice: trip.price * resData.numberOfPeople
            }
          ],
          // Deduct seats
          organizedTrips: state.organizedTrips.map(t => 
            t.id === resData.tripId ? { ...t, availableSeats: t.availableSeats - resData.numberOfPeople } : t
          )
        };
      }),
      updateTripReservationStatus: (id, status) => set((state) => {
        const reservation = state.tripReservations.find(r => r.id === id);
        if (!reservation) return state;
        
        let seatAdjustment = 0;
        // If it was cancelled but now is pending/confirmed, deduct seats.
        // But let's assume simple cancellation restores seats.
        if (status === 'cancelled' && reservation.status !== 'cancelled') {
           seatAdjustment = reservation.numberOfPeople; // refund seats
        } else if (reservation.status === 'cancelled' && status !== 'cancelled') {
           seatAdjustment = -reservation.numberOfPeople; // deduct seats again
        }

        return {
          tripReservations: state.tripReservations.map(r => r.id === id ? { ...r, status } : r),
          organizedTrips: seatAdjustment !== 0 ? state.organizedTrips.map(t => 
            t.id === reservation.tripId ? { ...t, availableSeats: t.availableSeats + seatAdjustment } : t
          ) : state.organizedTrips
        };
      }),
`;
    c = c.replace(/addApplication: \(appData\) => set\(\(state\) => \(\{/, actions + '      addApplication: (appData) => set((state) => ({');
    
    fs.writeFileSync('src/store/useAppStore.ts', c);
  }
}

updateStore();
console.log('done');
