import re

content = open('src/store/useAppStore.ts').read()

# Fix OrganizedTrip
trip_new = """export interface OrganizedTrip {
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
}"""
content = re.sub(r'export interface OrganizedTrip \{.*?\n\}', trip_new, content, flags=re.DOTALL)

# Fix VisaType
visa_new = """export interface VisaType {
  id: string;
  name: string;
  price: number;
  processingTime: string;
  description: string;
  requiredDocuments: string[];
  conditions: string[];
  customFormFields?: any[];
}"""
content = re.sub(r'export interface VisaType \{.*?\n\}', visa_new, content, flags=re.DOTALL)

# Fix SupportTicket
ticket_new = """export interface SupportTicket {
  id: string;
  agencyId: string;
  agencyName: string;
  agency?: string;
  isUrgent?: boolean;
  subject: string;
  category: string;
  priority: "Faible" | "Moyenne" | "Haute" | "Critique" | string;
  status: "Ouvert" | "En cours" | "Résolu" | string;
  messages: { sender: string; text: string; date: string }[];
  createdAt: string;
}"""
content = re.sub(r'export interface SupportTicket \{.*?\n\}', ticket_new, content, flags=re.DOTALL)

# Fix ServiceType
content = content.replace('export type ServiceType = "Evisa" | "Invitation" | "Rendez-vous" | "Dossier";', 'export type ServiceType = "Evisa" | "Invitation" | "Rendez-vous" | "Dossier" | "Residence" | "Permis" | "Assurance" | "Etude";')

open('src/store/useAppStore.ts', 'w').write(content)
