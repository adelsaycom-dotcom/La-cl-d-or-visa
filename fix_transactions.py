import re

with open('src/store/useAppStore.ts', 'r') as f:
    content = f.read()

# Make sure runTransaction is imported
if 'runTransaction' not in content:
    content = content.replace("import { db, auth } from '../firebase';", "import { db, auth } from '../firebase';\nimport { runTransaction } from 'firebase/firestore';")

# Replace addApplication
add_app_old = r"""  addApplication: async \(application\) => {
    const appId = application\.id \|\| doc\(collection\(db, 'applications'\)\)\.id;
    await setDoc\(doc\(db, 'applications', appId\), {
      \.\.\.application,
      id: appId
    }\);
  },"""

add_app_new = """  addApplication: async (application) => {
    const appId = application.id || doc(collection(db, 'applications')).id;
    const userRef = doc(db, 'users', application.agencyId);
    
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error("Agence introuvable");
      }
      
      const currentBalance = userDoc.data().balance || 0;
      const price = application.price || 0;
      
      if (currentBalance < price) {
        throw new Error("Solde insuffisant pour cette opération.");
      }
      
      transaction.update(userRef, { balance: currentBalance - price });
      transaction.set(doc(db, 'applications', appId), {
        ...application,
        id: appId
      });
      
      // Also create a transaction record
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
    });
  },"""

content = re.sub(add_app_old, add_app_new, content)

# Replace addTripReservation
add_trip_old = r"""  addTripReservation: async \(reservation\) => {
    const resId = reservation\.id \|\| doc\(collection\(db, 'tripReservations'\)\)\.id;
    await setDoc\(doc\(db, 'tripReservations', resId\), {
      \.\.\.reservation,
      id: resId
    }\);
  },"""

add_trip_new = """  addTripReservation: async (reservation) => {
    const resId = reservation.id || doc(collection(db, 'tripReservations')).id;
    const userRef = doc(db, 'users', reservation.agencyId);
    
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error("Agence introuvable");
      }
      
      // Get the trip to find out the price
      const tripRef = doc(db, 'organizedTrips', reservation.tripId);
      const tripDoc = await transaction.get(tripRef);
      if (!tripDoc.exists()) {
        throw new Error("Voyage introuvable");
      }
      
      const tripPrice = tripDoc.data().price || 0;
      const totalPrice = tripPrice * reservation.numberOfPeople;
      const currentBalance = userDoc.data().balance || 0;
      
      if (currentBalance < totalPrice) {
        throw new Error(`Solde insuffisant. Requis: ${totalPrice} DZD, Actuel: ${currentBalance} DZD`);
      }
      
      transaction.update(userRef, { balance: currentBalance - totalPrice });
      transaction.set(doc(db, 'tripReservations', resId), {
        ...reservation,
        status: 'pending',
        id: resId
      });
      
      // Also create a transaction record
      const txRef = doc(collection(db, 'transactions'));
      transaction.set(txRef, {
        id: txRef.id,
        agencyId: reservation.agencyId,
        agencyName: reservation.agencyName || '',
        amount: totalPrice,
        type: 'debit',
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
        description: `Paiement réservation voyage ${tripDoc.data().title} (${reservation.numberOfPeople} pers.)`
      });
    });
  },"""

content = re.sub(add_trip_old, add_trip_new, content)

with open('src/store/useAppStore.ts', 'w') as f:
    f.write(content)
