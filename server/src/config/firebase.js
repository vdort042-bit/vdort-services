import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let db = null;

export function initFirebase() {
  if (getApps().length > 0) {
    db = getFirestore();
    return getApps()[0];
  }

  const projectId  = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    throw new Error(
      'Firebase credentials missing in .env\n' +
      'Required: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL'
    );
  }

  const app = initializeApp({
    credential: cert({ projectId, privateKey, clientEmail }),
  });

  db = getFirestore(app);
  return app;
}

export function getDb() {
  if (!db) db = getFirestore();
  return db;
}
