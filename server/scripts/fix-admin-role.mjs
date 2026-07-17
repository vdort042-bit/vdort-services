import 'dotenv/config';
import { initFirebase, getDb } from '../src/config/firebase.js';

const email = process.argv[2] || 'pankajpatyal@vdortservices.com';

await initFirebase();
const db = getDb();

const snap = await db.collection('users').where('email', '==', email.toLowerCase()).limit(1).get();
if (snap.empty) {
  console.error(`No user found for: ${email}`);
  process.exit(1);
}

const doc = snap.docs[0];
const data = doc.data();
console.log('Before:', { id: doc.id, email: data.email, role: data.role });

await doc.ref.update({ role: 'admin' });

console.log('After:  { role: "admin" }');
console.log('Done — ab Firebase password se /admin/login par login karein.');
