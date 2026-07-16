import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';
import { getStorage } from 'firebase-admin/storage';
import { initFirebase, getFirebaseConfig } from '../config/firebase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../uploads');

const MIME_BY_EXT = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

function getBucket() {
  initFirebase();
  const { storageBucket, projectId } = getFirebaseConfig();
  const bucketName = storageBucket || `${projectId}.appspot.com`;
  return getStorage().bucket(bucketName);
}

function buildFirebaseDownloadUrl(bucketName, dest, token) {
  const encoded = encodeURIComponent(dest);
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encoded}?alt=media&token=${token}`;
}

export async function uploadResumeToStorage(localPath, originalName) {
  const ext = path.extname(originalName).toLowerCase() || '.pdf';
  const dest = `resumes/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const bucket = getBucket();
  const downloadToken = uuid();

  await bucket.upload(localPath, {
    destination: dest,
    metadata: {
      contentType: MIME_BY_EXT[ext] || 'application/octet-stream',
      metadata: { firebaseStorageDownloadTokens: downloadToken },
    },
  });

  return buildFirebaseDownloadUrl(bucket.name, dest, downloadToken);
}

/** Upload to Firebase Storage; fall back to local /uploads only in development. */
export async function persistResume(localPath, originalName) {
  try {
    const url = await uploadResumeToStorage(localPath, originalName);
    try { fs.unlinkSync(localPath); } catch { /* keep local copy if delete fails */ }
    return url;
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Firebase Storage upload failed: ${err.message}`);
    }
    console.warn('Firebase Storage upload failed, using local path:', err.message);
    return `/uploads/${path.basename(localPath)}`;
  }
}

function parseFirebaseObjectPath(resumeUrl) {
  try {
    const url = new URL(resumeUrl);
    if (!url.hostname.includes('firebasestorage.googleapis.com')) return null;
    const match = url.pathname.match(/\/o\/(.+)$/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

/** Remove resume file from Firebase Storage or local /uploads folder. */
export async function deleteResumeFile(resumeUrl) {
  if (!resumeUrl) return;

  if (resumeUrl.startsWith('http')) {
    const objectPath = parseFirebaseObjectPath(resumeUrl);
    if (!objectPath) return;
    try {
      const bucket = getBucket();
      await bucket.file(objectPath).delete();
    } catch (err) {
      if (err.code !== 404) {
        console.warn('Firebase Storage delete failed:', err.message);
      }
    }
    return;
  }

  const filename = path.basename(resumeUrl);
  const filePath = path.join(uploadDir, filename);
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.warn('Local resume delete failed:', err.message);
  }
}
