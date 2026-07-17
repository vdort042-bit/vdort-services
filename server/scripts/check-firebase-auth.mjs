import 'dotenv/config';
import { initFirebase } from '../src/config/firebase.js';
import { getAuth } from 'firebase-admin/auth';

const email = process.argv[2] || 'pankajpatyal@vdortservices.com';

await initFirebase();

try {
  const user = await getAuth().getUserByEmail(email.toLowerCase());
  console.log('Firebase Auth user found:');
  console.log(`  UID:   ${user.uid}`);
  console.log(`  Email: ${user.email}`);
  console.log(`  Match Firestore doc gwx5m9qTXtWydrdEA9GAmWt3PJ03: ${user.uid === 'gwx5m9qTXtWydrdEA9GAmWt3PJ03' ? 'YES' : 'NO — doc ID mismatch!'}`);
} catch (err) {
  console.error(`Firebase Auth: NO user for ${email}`);
  console.error('Firebase Console → Authentication → Add user with this email + password');
}
