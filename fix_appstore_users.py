import re

content = open('src/store/useAppStore.ts').read()

if 'export interface Agency {' not in content:
    agency_interface = """export interface Agency {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  balance: number;
  applicationsCount: number;
  role: string;
}
"""
    content = agency_interface + content
    
    # Add to AppState
    content = content.replace('countries: Country[];', 'countries: Country[];\n  agencies: Agency[];\n  updateAgencyStatus: (id: string, status: string) => void;')
    
    # Add to default state and actions
    content = content.replace('countries: [],', 'agencies: [],\n  updateAgencyStatus: async (id, status) => { await updateDoc(doc(db, "users", id), { status }); },\n  countries: [],')
    
    open('src/store/useAppStore.ts', 'w').write(content)
