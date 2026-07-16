/**
 * Prints Render env vars from server/.env for dashboard copy-paste.
 * Run: node scripts/print-render-env.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const vars = {
  NODE_ENV: 'production',
  PORT: '10000',
  JWT_SECRET: process.env.JWT_SECRET || 'vdort-prod-jwt-2026-vdort-us-secure',
  CLIENT_URL: 'https://vdort-services.vercel.app,https://vdort.us,https://www.vdort.us',
  ALLOWED_ORIGINS: 'https://vdort-services.vercel.app,https://vdort.us,https://www.vdort.us',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
};

console.log('\n═══ Render Dashboard → Environment (copy each row) ═══\n');
for (const [key, value] of Object.entries(vars)) {
  if (!value) {
    console.log(`# MISSING: ${key}`);
    continue;
  }
  console.log(`${key}=${value}`);
}
console.log('\nSave → Manual Deploy → check https://vdort-services.onrender.com/api/health\n');
