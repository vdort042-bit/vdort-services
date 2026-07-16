import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let db = null;

export function normalizePrivateKey(raw) {
  if (!raw) return raw;
  let key = raw.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, '\n');
}

export function getFirebaseConfig() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const storageBucket =
    process.env.FIREBASE_STORAGE_BUCKET ||
    (projectId ? `${projectId}.firebasestorage.app` : undefined);

  return { projectId, privateKey, clientEmail, storageBucket };
}

export function initFirebase() {
  if (getApps().length > 0) {
    db = getFirestore();
    return getApps()[0];
  }

  const { projectId, privateKey, clientEmail, storageBucket } = getFirebaseConfig();

  if (!projectId || !privateKey || !clientEmail) {
    throw new Error(
      'Firebase credentials missing in .env\n' +
      'Required: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL'
    );
  }

  const app = initializeApp({
    credential: cert({ projectId, privateKey, clientEmail }),
    storageBucket,
  });

  db = getFirestore(app);
  return app;
}

export function getDb() {
  if (!db) db = getFirestore();
  return db;
}
