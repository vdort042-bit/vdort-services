import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { applications, notifications } from '../store/firestoreStore.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../uploads');

const HOURS_48_MS = 48 * 60 * 60 * 1000;

export async function cleanupExpiredResumes() {
  try {
    const expired = await applications.listExpired();
    if (!expired.length) return;

    for (const app of expired) {
      if (app.resumeUrl) {
        const filename = path.basename(app.resumeUrl);
        const filePath = path.join(uploadDir, filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      await applications.delete(app.id);
      try { await notifications.deleteByApplication(app.id); } catch (_) {}
      console.log(`🗑️  Deleted expired application: ${app.id} (${app.name})`);
    }
  } catch (err) {
    console.error('Cleanup error:', err.message);
  }
}

export function startCleanupScheduler() {
  // Run immediately on startup, then every hour
  cleanupExpiredResumes();
  setInterval(cleanupExpiredResumes, 60 * 60 * 1000);
}

export function getExpiresAt() {
  return new Date(Date.now() + HOURS_48_MS).toISOString();
}
