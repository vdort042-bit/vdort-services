/**
 * Create a JWT admin account in Firestore (works with /admin/login).
 *
 * Usage:
 *   node scripts/create-admin.mjs "Admin Name" "admin2@vdort.com" "yourpassword"
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { initFirebase, getDb } from '../src/config/firebase.js';

const [name, email, password] = process.argv.slice(2);

if (!name || !email || !password) {
  console.error('Usage: node scripts/create-admin.mjs "Admin Name" "email@vdort.com" "password"');
  process.exit(1);
}

if (password.length < 6) {
  console.error('Password must be at least 6 characters');
  process.exit(1);
}

await initFirebase();
const db = getDb();
const normalizedEmail = email.toLowerCase().trim();

const existing = await db.collection('users').where('email', '==', normalizedEmail).limit(1).get();
if (!existing.empty) {
  console.error(`Email already exists: ${normalizedEmail} (doc: ${existing.docs[0].id})`);
  process.exit(1);
}

const admin = {
  id: `usr_admin_${uuid().slice(0, 8)}`,
  name: name.trim(),
  email: normalizedEmail,
  password: bcrypt.hashSync(password, 10),
  passwordPlain: password,
  role: 'admin',
  company: 'VDORT Services Pvt. Ltd.',
  createdAt: new Date().toISOString(),
};

await db.collection('users').doc(admin.id).set(admin);

console.log('Admin created successfully!');
console.log(`  ID:    ${admin.id}`);
console.log(`  Email: ${admin.email}`);
console.log(`  Login: https://www.vdort.us/admin/login`);
