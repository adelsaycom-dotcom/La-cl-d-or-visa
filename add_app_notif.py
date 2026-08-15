import re

with open('src/store/useAppStore.ts', 'r') as f:
    content = f.read()

old_app = r"""      // Also create a transaction record
      const txRef = doc\(collection\(db, 'transactions'\)\);
      transaction\.set\(txRef, \{
        id: txRef\.id,
        agencyId: application\.agencyId,
        agencyName: application\.agencyName \|\| '',
        amount: price,
        type: 'debit',
        status: 'completed',
        date: new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\],
        description: `Paiement pour visa \$\{application\.visaType \|\| 'Service'\} \(\$\{application\.travelerName \|\| ''\}\)`
      \}\);
    \}\);
  \},"""

new_app = """      // Also create a transaction record
      const txRef = doc(collection(db, 'transactions'));
      transaction.set(txRef, {
        id: txRef.id,
        agencyId: application.agencyId,
        agencyName: application.agencyName || '',
        amount: price,
        type: 'debit',
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
        description: `Paiement pour visa ${application.visaType || 'Service'} (${application.travelerName || ''})`
      });
      
      // Notify Admin
      const notifRef = doc(collection(db, 'notifications'));
      transaction.set(notifRef, {
        id: notifRef.id,
        agencyId: 'admin',
        title: 'Nouvelle demande de Visa',
        message: `${application.agencyName || 'Une agence'} a soumis une demande pour ${application.travelerName || 'un client'}.`,
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/admin/applications'
      });
    });
  },"""

content = re.sub(old_app, new_app, content)

with open('src/store/useAppStore.ts', 'w') as f:
    f.write(content)
