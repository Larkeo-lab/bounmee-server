import * as admin from "firebase-admin";

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (firebaseAdminConfig.projectId && firebaseAdminConfig.clientEmail && firebaseAdminConfig.privateKey) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig as any),
  });
  console.log("Firebase Admin Initialized");
} else {
  console.warn("Firebase Admin NOT initialized. Missing environment variables.");
}

export default admin;
