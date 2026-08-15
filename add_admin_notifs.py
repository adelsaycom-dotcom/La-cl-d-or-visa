import re

with open('src/store/useAppStore.ts', 'r') as f:
    content = f.read()

# 1. addSupportTicket
old_add_ticket = r"""  addSupportTicket: async \(ticket\) => {
    const id = doc\(collection\(db, 'supportTickets'\)\)\.id;
    await setDoc\(doc\(db, 'supportTickets', id\), \{ \.\.\.ticket, id, createdAt: new Date\(\)\.toISOString\(\) \}\);
  \},"""

new_add_ticket = """  addSupportTicket: async (ticket) => {
    const id = doc(collection(db, 'supportTickets')).id;
    await setDoc(doc(db, 'supportTickets', id), { ...ticket, id, createdAt: new Date().toISOString() });
    
    // Notify admin
    const notifId = doc(collection(db, 'notifications')).id;
    await setDoc(doc(db, 'notifications', notifId), {
      id: notifId,
      agencyId: 'admin',
      title: 'Nouveau Ticket Support',
      message: `${ticket.agencyName} a ouvert un ticket: "${ticket.subject}"`,
      type: 'warning',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/admin/support'
    });
  },"""
content = re.sub(old_add_ticket, new_add_ticket, content)

# 2. updateSupportTicket (when a new message is added, we can check if it's from agency. Usually updates don't easily tell what changed, but let's see where updateSupportTicket is called)
# Let's check how updateSupportTicket is used first. I'll just skip it for a moment and check components/agency/AgencySupport.tsx
