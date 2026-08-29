import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

// To use Firebase Admin, we normally need a service account.
// Since we don't have it, let's just create a script that uses the client SDK to login with a known bad email to see if it exists.
