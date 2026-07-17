import 'dotenv/config';
import { initFirebase, getDb } from '../src/config/firebase.js';

await initFirebase();
const db = getDb();

const snap = await db.collection('users').get();
console.log(`Total users: ${snap.size}\n`);

for (const doc of snap.docs) {
  const u = doc.data();
  console.log(`ID: ${doc.id}`);
  console.log(`  email: ${u.email || '-'}`);
  console.log(`  role:  ${u.role || '-'}`);
  console.log(`  password: ${u.password ? (u.password.startsWith('$2') ? 'bcrypt' : 'plain') : 'MISSING'}`);
  console.log('');
}
