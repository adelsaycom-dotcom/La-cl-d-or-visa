import re

content = open('src/store/useAppStore.ts').read()

new_res = """export interface TripReservation {
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
}"""

content = re.sub(r'export interface TripReservation \{.*?\n\}', new_res, content, flags=re.DOTALL)
open('src/store/useAppStore.ts', 'w').write(content)

content_trips = open('components/agency/OrganizedTrips.tsx').read()
content_trips = content_trips.replace('import { useAppStore } from "../../src/store/useAppStore";', 'import { useAppStore } from "../../src/store/useAppStore";\nimport { auth } from "../../src/firebase";')
content_trips = content_trips.replace("agencyId: 'agency_1', // Using mock agency for now, since auth is not fully hooked up", "agencyId: auth.currentUser?.uid || 'agency_1',\nagencyName: auth.currentUser?.email || 'Agency',")
open('components/agency/OrganizedTrips.tsx', 'w').write(content_trips)
