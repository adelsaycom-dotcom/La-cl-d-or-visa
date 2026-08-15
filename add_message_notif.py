import re

with open('src/store/useAppStore.ts', 'r') as f:
    content = f.read()

old_update_ticket = r"""  updateSupportTicket: async \(id, updates\) => {
    await updateDoc\(doc\(db, 'supportTickets', id\), updates\);
  \},"""

new_update_ticket = """  updateSupportTicket: async (id, updates) => {
    await updateDoc(doc(db, 'supportTickets', id), updates);
    
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
  },"""
content = re.sub(old_update_ticket, new_update_ticket, content)

with open('src/store/useAppStore.ts', 'w') as f:
    f.write(content)
