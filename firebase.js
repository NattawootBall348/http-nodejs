import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

initializeApp({
  credential: cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const db = getFirestore();
export { db };