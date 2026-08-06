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
    // Insert before export interface VisaType
    c = c.replace(/export interface VisaType/, interfaces + '\nexport interface VisaType');
  }

  if (!c.includes('addOrganizedTrip: (tripData)')) {
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
        if (status === 'cancelled' && reservation.status !== 'cancelled') {
           seatAdjustment = reservation.numberOfPeople;
        } else if (reservation.status === 'cancelled' && status !== 'cancelled') {
           seatAdjustment = -reservation.numberOfPeople;
        }

        return {
          tripReservations: state.tripReservations.map(r => r.id === id ? { ...r, status } : r),
          organizedTrips: seatAdjustment !== 0 ? state.organizedTrips.map(t => 
            t.id === reservation.tripId ? { ...t, availableSeats: t.availableSeats + seatAdjustment } : t
          ) : state.organizedTrips
        };
      }),
`;
    // Insert before addCountry:
    c = c.replace(/addCountry: \(country\) =>/, actions + '      addCountry: (country) =>');
  }

  fs.writeFileSync('src/store/useAppStore.ts', c);
}

updateStore();
console.log('done');
