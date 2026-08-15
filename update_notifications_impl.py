import re

with open('src/store/useAppStore.ts', 'r') as f:
    content = f.read()

# Implementations
mark_read_impl = """  markNotificationAsRead: async (id) => {
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
  agencies: [],"""

content = content.replace("  agencies: [],", mark_read_impl)

if 'writeBatch' not in content:
    content = content.replace("import { collection, doc, setDoc, updateDoc, deleteDoc, runTransaction }", "import { collection, doc, setDoc, updateDoc, deleteDoc, runTransaction, writeBatch, query, where }")

# Update updateRechargeRequestStatus
recharge_old = r"""  updateRechargeRequestStatus: async \(id, status\) => {
    await updateDoc\(doc\(db, 'rechargeRequests', id\), \{ status \}\);
  \},"""

recharge_new = """  updateRechargeRequestStatus: async (id, status) => {
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
  },"""
content = re.sub(recharge_old, recharge_new, content)

# Update updateApplicationStatus
app_old = r"""  updateApplicationStatus: async \(id, status\) => {
    await updateDoc\(doc\(db, 'applications', id\), \{ status \}\);
  \},"""

app_new = """  updateApplicationStatus: async (id, status) => {
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
  },"""
content = re.sub(app_old, app_new, content)

with open('src/store/useAppStore.ts', 'w') as f:
    f.write(content)
