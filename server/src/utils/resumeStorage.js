import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { getStorage } from 'firebase-admin/storage';
import { initFirebase } from '../config/firebase.js';

const MIME_BY_EXT = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

function getBucket() {
  initFirebase();
  const bucketName =
    process.env.FIREBASE_STORAGE_BUCKET ||
    `${process.env.FIREBASE_PROJECT_ID}.appspot.com`;
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

/** Upload to Firebase Storage; fall back to local /uploads path in dev if upload fails. */
export async function persistResume(localPath, originalName) {
  try {
    const url = await uploadResumeToStorage(localPath, originalName);
    try { fs.unlinkSync(localPath); } catch { /* keep local copy if delete fails */ }
    return url;
  } catch (err) {
    console.warn('Firebase Storage upload failed, using local path:', err.message);
    return `/uploads/${path.basename(localPath)}`;
  }
}
