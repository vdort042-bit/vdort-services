import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { initFirebase } from './config/firebase.js';
import { seedIfEmpty } from './store/firestoreStore.js';

import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import contactRoutes from './routes/contacts.js';
import subscriberRoutes from './routes/subscribers.js';
import testimonialRoutes from './routes/testimonials.js';
import analyticsRoutes from './routes/analytics.js';
import userRoutes from './routes/users.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'VDORT API is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth',         authRoutes);
app.use('/api/jobs',         jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/contacts',     contactRoutes);
app.use('/api/subscribers',  subscriberRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/analytics',    analyticsRoutes);
app.use('/api/users',        userRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    console.log('\n🔥 Connecting to Firebase Firestore...');
    initFirebase();
    console.log('✅ Firebase connected!');

    console.log('📦 Checking seed data...');
    await seedIfEmpty();
    console.log('✅ Seed data ready!');

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
