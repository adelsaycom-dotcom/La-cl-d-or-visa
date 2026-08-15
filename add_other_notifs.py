import re

with open('src/store/useAppStore.ts', 'r') as f:
    content = f.read()

# 3. addRechargeRequest
old_recharge = r"""  addRechargeRequest: async \(req\) => {
    const id = doc\(collection\(db, 'rechargeRequests'\)\)\.id;
    await setDoc\(doc\(db, 'rechargeRequests', id\), \{ \.\.\.req, id, createdAt: new Date\(\)\.toISOString\(\) \}\);
  \},"""

new_recharge = """  addRechargeRequest: async (req) => {
    const id = doc(collection(db, 'rechargeRequests')).id;
    await setDoc(doc(db, 'rechargeRequests', id), { ...req, id, createdAt: new Date().toISOString() });
    
    // Notify admin
    const notifId = doc(collection(db, 'notifications')).id;
    await setDoc(doc(db, 'notifications', notifId), {
      id: notifId,
      agencyId: 'admin',
      title: 'Demande de Recharge',
      message: `${req.agencyName} a demandé une recharge de ${req.amount} DA.`,
      type: 'info',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/admin/finances'
    });
  },"""
content = re.sub(old_recharge, new_recharge, content)

# 4. addApplication
old_app = r"""  addApplication: async \(application\) => {
    // This is a transaction, we should add the notification here as well.
    // Let's just find addApplication and replace its body."""

# Let's inspect addApplication first
