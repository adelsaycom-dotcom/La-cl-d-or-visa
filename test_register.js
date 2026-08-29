import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("firebase-applet-config.json", "utf8"));

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  const email = "testagency" + Date.now() + "@test.com";
  console.log("Registering", email);
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, "password123");
    console.log("Auth success. UID:", userCred.user.uid);
    try {
      await setDoc(doc(db, 'users', userCred.user.uid), {
        role: 'agency',
        status: 'PENDING',
        agencyName: "Test",
        rcNumber: "123",
        nifNumber: "456",
        managerLastName: "Test",
        managerFirstName: "Test",
        contactName: "Test Test",
        email: email,
        phone: "123456",
        balance: 0,
        createdAt: new Date().toISOString()
      });
      console.log("Firestore write success!");
    } catch(e) {
      console.error("Firestore write failed:", e.code, e.message);
    }
  } catch(e) {
    console.error("Auth failed:", e.code, e.message);
  }
  process.exit(0);
}

run();
