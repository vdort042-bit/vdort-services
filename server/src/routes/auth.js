import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getAuth } from 'firebase-admin/auth';
import { users, tokens } from '../store/firestoreStore.js';
import { getDb } from '../config/firebase.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  const user = await users.findByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name, company: user.company },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    data: {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, company: user.company },
    },
  });
});

router.get('/me', authenticate, async (req, res) => {
  const user = await users.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({
    success: true,
    data: { id: user.id, name: user.name, email: user.email, role: user.role, company: user.company },
  });
});

// Firebase ID token → JWT exchange (for Firebase Auth users with admin/client role)
router.post('/firebase-exchange', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ success: false, message: 'Firebase ID token required' });
  }

  try {
    // Verify the Firebase ID token
    const decoded = await getAuth().verifyIdToken(idToken);
    const uid = decoded.uid;

    // Get user profile from Firestore
    const snap = await getDb().collection('users').doc(uid).get();
    if (!snap.exists) {
      return res.status(404).json({ success: false, message: 'User profile not found in Firestore' });
    }

    const data = snap.data();
    const role = data.role || 'student';

    // Only issue JWT for admin and client roles
    if (role !== 'admin' && role !== 'client') {
      return res.status(403).json({ success: false, message: 'JWT not required for student accounts' });
    }

    const name = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' ') || decoded.name || decoded.email;

    const token = jwt.sign(
      { id: uid, email: decoded.email, role, name, company: data.company || '' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: { id: uid, name, email: decoded.email, role, company: data.company || '' },
      },
    });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired Firebase token' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const user = await users.findByEmail(email);
  if (!user) {
    return res.json({ success: true, message: 'If this email is registered, a reset link has been sent.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  tokens.set(token, { email: user.email, expiry: Date.now() + 15 * 60 * 1000 });

  // In production this token would be emailed; for now store it server-side only
  // NEVER return the token in the response
  res.json({
    success: true,
    message: 'If this email is registered, a reset link has been sent.',
    // For dev convenience only — remove in production
    ...(process.env.NODE_ENV !== 'production' && { devToken: token }),
  });
});

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ success: false, message: 'Token and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const record = tokens.get(token);
  if (!record) {
    return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
  }

  if (Date.now() > record.expiry) {
    tokens.delete(token);
    return res.status(400).json({ success: false, message: 'Reset token has expired. Please request a new one.' });
  }

  const user = await users.findByEmail(record.email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  await users.update(user.id, { password: bcrypt.hashSync(newPassword, 10) });
  tokens.delete(token);

  res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
});

export default router;
