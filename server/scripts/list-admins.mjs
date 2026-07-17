import 'dotenv/config';
import { initFirebase, getDb } from '../src/config/firebase.js';

await initFirebase();
const db = getDb();

const snap = await db.collection('users').where('role', '==', 'admin').get();

if (snap.empty) {
  console.log('No admin users found in Firestore.');
  process.exit(0);
}

console.log(`Found ${snap.size} admin(s):\n`);
for (const doc of snap.docs) {
  const u = doc.data();
  const hasPassword = !!u.password;
  const isBcrypt = typeof u.password === 'string' && u.password.startsWith('$2');
  console.log(`Doc ID:   ${doc.id}`);
  console.log(`Email:    ${u.email || '(missing)'}`);
  console.log(`Name:     ${u.name || u.firstName || '(missing)'}`);
  console.log(`Password: ${hasPassword ? (isBcrypt ? 'bcrypt (OK)' : 'plain text (OK after fix)') : 'MISSING — login will fail'}`);
  console.log('---');
}
