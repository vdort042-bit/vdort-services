import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';
import { getAuth } from 'firebase-admin/auth';
import { getDb } from '../config/firebase.js';
import { users } from '../store/firestoreStore.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// ── Clients (JWT users in Firestore) ────────────────────────────

// List all clients
router.get('/clients', authenticate, authorize('admin'), async (req, res) => {
  const snap = await getDb().collection('users').where('role', '==', 'client').get();
  const clients = snap.docs.map((d) => {
    const { password, ...rest } = d.data();
    return { id: d.id, ...rest };
  });
  res.json({ success: true, data: clients });
});

// Create new client account
router.post('/clients', authenticate, authorize('admin'), async (req, res) => {
  const { name, email, password, company } = req.body;
  if (!name || !email || !password || !company) {
    return res.status(400).json({ success: false, message: 'Name, email, password, and company are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const existing = await users.findByEmail(email);
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const newClient = {
    id: `usr_client_${uuid().slice(0, 8)}`,
    name,
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password, 10),
    role: 'client',
    company,
    createdAt: new Date().toISOString(),
  };

  await getDb().collection('users').doc(newClient.id).set(newClient);
  const { password: _, ...clientData } = newClient;
  res.status(201).json({ success: true, data: clientData, message: 'Client account created successfully' });
});

// Update client details
router.patch('/clients/:id', authenticate, authorize('admin'), async (req, res) => {
  const { name, company } = req.body;
  const doc = await getDb().collection('users').doc(req.params.id).get();
  if (!doc.exists || doc.data().role !== 'client') {
    return res.status(404).json({ success: false, message: 'Client not found' });
  }
  await getDb().collection('users').doc(req.params.id).update({ name, company });
  res.json({ success: true, message: 'Client updated' });
});

// Delete client account
router.delete('/clients/:id', authenticate, authorize('admin'), async (req, res) => {
  const doc = await getDb().collection('users').doc(req.params.id).get();
  if (!doc.exists) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  if (doc.data().role === 'admin') {
    return res.status(403).json({ success: false, message: 'Cannot delete admin account' });
  }
  await getDb().collection('users').doc(req.params.id).delete();
  res.json({ success: true, message: 'Client account deleted' });
});

// ── Students (Firebase Auth users) ──────────────────────────────

// List registered candidates (Firestore profile + Firebase Auth status)
router.get('/students', authenticate, authorize('admin'), async (req, res) => {
  try {
    const snap = await getDb().collection('users').where('role', '==', 'student').get();

    let authMap = {};
    try {
      const result = await getAuth().listUsers(1000);
      result.users.forEach((u) => { authMap[u.uid] = u; });
    } catch {
      // Auth metadata optional
    }

    const students = snap.docs.map((d) => {
      const u = d.data();
      const auth = authMap[d.id];
      const displayName = [u.firstName, u.middleName, u.lastName].filter(Boolean).join(' ')
        || auth?.displayName
        || u.email
        || 'No Name';
      return {
        uid: d.id,
        email: u.email || auth?.email || '',
        displayName,
        phone: u.phone || '',
        photoURL: auth?.photoURL || null,
        emailVerified: auth?.emailVerified || false,
        disabled: auth?.disabled || false,
        createdAt: u.createdAt || auth?.metadata?.creationTime || null,
        lastLoginAt: auth?.metadata?.lastSignInTime || null,
      };
    }).sort((a, b) => {
      const toMs = (v) => {
        if (!v) return 0;
        if (typeof v === 'string') return new Date(v).getTime();
        if (v._seconds) return v._seconds * 1000;
        if (v.seconds) return v.seconds * 1000;
        return 0;
      };
      return toMs(b.createdAt) - toMs(a.createdAt);
    });

    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Disable or enable a student account
router.patch('/students/:uid/status', authenticate, authorize('admin'), async (req, res) => {
  const { disabled } = req.body;
  try {
    await getAuth().updateUser(req.params.uid, { disabled: Boolean(disabled) });
    res.json({ success: true, message: `Account ${disabled ? 'disabled' : 'enabled'} successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete a student account from Firebase Auth
router.delete('/students/:uid', authenticate, authorize('admin'), async (req, res) => {
  try {
    await getAuth().deleteUser(req.params.uid);
    res.json({ success: true, message: 'Student account deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
