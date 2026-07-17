import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getAuth } from 'firebase-admin/auth';
import { users, tokens } from '../store/firestoreStore.js';
import { getDb } from '../config/firebase.js';
import { authenticate } from '../middleware/auth.js';

import { sendForgotPasswordEmail } from '../utils/emailService.js';

const router = Router();

const SEED_PASSWORDS = {
  'admin@vdort.com': 'admin123',
  'client@vdort.com': 'client123',
  'james@techcorp.com': 'client123',
};

function verifyPassword(plain, stored) {
  if (!stored) return false;
  if (typeof stored === 'string' && stored.startsWith('$2')) {
    return bcrypt.compareSync(plain, stored);
  }
  return plain === stored;
}

/** Resolve admin/client profile by Firebase UID or email (custom doc ids like usr_admin_002). */
async function resolvePortalProfile(uid, email) {
  const uidSnap = await getDb().collection('users').doc(uid).get();
  if (uidSnap.exists) {
    const data = uidSnap.data();
    const role = (data.role || 'student').toLowerCase();
    if (role === 'admin' || role === 'client') {
      return { id: uid, ...data, role };
    }
  }

  const byEmail = await users.findByEmail(email);
  if (byEmail) {
    const role = (byEmail.role || 'student').toLowerCase();
    if (role === 'admin' || role === 'client') {
      return { ...byEmail, role };
    }
  }

  return null;
}

function profileDisplayName(profile, fallbackEmail) {
  return profile.name
    || [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(' ')
    || fallbackEmail;
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  const user = await users.findByEmail(email);
  if (!user || !verifyPassword(password, user.password)) {
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
    const decoded = await getAuth().verifyIdToken(idToken);
    const uid = decoded.uid;
    const email = decoded.email || '';

    const profile = await resolvePortalProfile(uid, email);
    if (!profile) {
      return res.status(403).json({
        success: false,
        message: 'Admin/client profile not found. Firestore users collection mein role: admin set karein.',
      });
    }

    const { role } = profile;
    const name = profileDisplayName(profile, email);

    const token = jwt.sign(
      { id: profile.id, email, role, name, company: profile.company || '' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: { id: profile.id, name, email, role, company: profile.company || '' },
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
    return res.json({ success: true, message: 'If this email is registered, your password has been sent to your inbox.' });
  }

  let passwordPlain = user.passwordPlain || SEED_PASSWORDS[user.email.toLowerCase()];
  if (passwordPlain && !user.passwordPlain) {
    await users.update(user.id, { passwordPlain });
  }

  if (!passwordPlain) {
    return res.status(400).json({
      success: false,
      message: 'Password recovery is not available for this account. Please contact support.',
    });
  }

  try {
    await sendForgotPasswordEmail(user, passwordPlain);
  } catch (err) {
    console.warn('Forgot password email failed:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Could not send email. Check server SMTP settings.',
    });
  }

  res.json({
    success: true,
    message: 'Your password has been sent to your email inbox. Please check spam folder too.',
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

  await users.update(user.id, { password: bcrypt.hashSync(newPassword, 10), passwordPlain: newPassword });
  tokens.delete(token);

  res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
});

export default router;
