import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { initFirebase, getFirebaseConfig } from './config/firebase.js';
import { getStorage } from 'firebase-admin/storage';
import { seedIfEmpty } from './store/firestoreStore.js';

import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import contactRoutes from './routes/contacts.js';
import subscriberRoutes from './routes/subscribers.js';
import testimonialRoutes from './routes/testimonials.js';
import analyticsRoutes from './routes/analytics.js';
import userRoutes from './routes/users.js';
import notificationRoutes from './routes/notifications.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { startCleanupScheduler } from './utils/cleanupExpiredResumes.js';
import { verifyEmailConnection } from './utils/emailService.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const extraOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
const clientOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([
  ...defaultOrigins,
  ...clientOrigins,
  ...extraOrigins,
  'https://vdort.us',
  'https://www.vdort.us',
  'https://vdort-services.vercel.app',
])];

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (/^https:\/\/[\w-]+\.vercel\.app$/.test(origin)) return true;
  if (/^https:\/\/(www\.)?vdort\.us$/.test(origin)) return true;
  return false;
}

app.use(cors({
  origin(origin, callback) {
    callback(null, isAllowedOrigin(origin));
  },
  credentials: true,
  exposedHeaders: ['Content-Disposition'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', async (_req, res) => {
  const { storageBucket } = getFirebaseConfig();
  let storage = { ok: false, bucket: storageBucket || null, message: 'Not checked' };

  try {
    initFirebase();
    if (storageBucket) {
      await getStorage().bucket(storageBucket).getMetadata();
      storage = { ok: true, bucket: storageBucket, message: 'Firebase Storage reachable' };
    } else {
      storage.message = 'FIREBASE_STORAGE_BUCKET not set';
    }
  } catch (err) {
    storage.message = err.message;
  }

  res.json({
    success: true,
    message: 'VDORT API is running',
    timestamp: new Date().toISOString(),
    storage,
  });
});

app.use('/api/auth',         authRoutes);
app.use('/api/jobs',         jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/contacts',     contactRoutes);
app.use('/api/subscribers',  subscriberRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/analytics',    analyticsRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    console.log('\n🔥 Connecting to Firebase Firestore...');
    initFirebase();
    console.log('✅ Firebase connected!');

    if (process.env.NODE_ENV === 'production') {
      const missing = ['FIREBASE_PRIVATE_KEY', 'FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_STORAGE_BUCKET']
        .filter((k) => !process.env[k]);
      if (missing.length) {
        console.warn(`⚠️  Missing env for resume uploads: ${missing.join(', ')}`);
      } else {
        try {
          const bucketName = process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`;
          await getStorage().bucket(bucketName).getMetadata();
          console.log(`📦 Firebase Storage bucket OK: ${bucketName}`);
        } catch (storageErr) {
          console.warn(`⚠️  Firebase Storage check failed: ${storageErr.message}`);
        }
      }
    }

    console.log('📦 Checking seed data...');
    await seedIfEmpty();
    console.log('✅ Seed data ready!');

    startCleanupScheduler();

    const emailStatus = await verifyEmailConnection();
    if (emailStatus.ok) {
      console.log(`📧 Email: ${emailStatus.message}`);
    } else {
      console.warn(`📧 Email NOT ready: ${emailStatus.message}`);
      console.warn('   → Add Gmail App Password to SMTP_PASS in server/.env');
      console.warn('   → Generate at: https://myaccount.google.com/apppasswords');
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 VDORT API Server running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔐 Dev Credentials:`);
        console.log(`   Admin:  admin@vdort.com / admin123`);
        console.log(`   Client: client@vdort.com / client123\n`);
      }
    });
  } catch (err) {
    console.error('\n❌ Server failed to start:', err.message);
    console.error('\n👉 Make sure these are set in server/.env:');
    console.error('   FIREBASE_PROJECT_ID=your-project-id');
    console.error('   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com');
    console.error('   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"\n');
    process.exit(1);
  }
}

start();
