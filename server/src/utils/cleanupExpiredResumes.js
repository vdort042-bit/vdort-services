import { applications, notifications } from '../store/firestoreStore.js';
import { deleteResumeFile } from './resumeStorage.js';

const HOURS_48_MS = 48 * 60 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;

export async function cleanupExpiredResumes() {
  try {
    const expired = await applications.listExpired();
    if (!expired.length) return;

    for (const app of expired) {
      if (app.resumeUrl) {
        await deleteResumeFile(app.resumeUrl);
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
  if (process.env.DISABLE_RESUME_CLEANUP === 'true') {
    console.log('⏰ Resume auto-delete disabled (DISABLE_RESUME_CLEANUP=true)');
    return;
  }
  console.log('⏰ Resume auto-delete enabled — applications expire after 48 hours');
  cleanupExpiredResumes();
  setInterval(cleanupExpiredResumes, CLEANUP_INTERVAL_MS);
}

export function getExpiresAt() {
  return new Date(Date.now() + HOURS_48_MS).toISOString();
}
