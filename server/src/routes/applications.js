import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import path from 'path';
import fs from 'fs';
import { applications, jobs, notifications } from '../store/firestoreStore.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { authenticateFirebase } from '../middleware/firebaseAuth.js';
import { uploadResume, uploadDir } from '../middleware/upload.js';
import { computeATSScore } from '../utils/atsScorer.js';
import { sendResumeNotification } from '../utils/emailService.js';
import { getExpiresAt } from '../utils/cleanupExpiredResumes.js';
import { createStatusNotification } from '../utils/notificationHelper.js';
import { persistResume, deleteResumeFile } from '../utils/resumeStorage.js';

const router = Router();

const MIME_BY_EXT = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

function sanitizeDownloadName(name) {
  return (name || 'Candidate').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_') || 'Candidate';
}

/** Email + Firebase upload after response — keeps submit fast for users */
async function finalizeResumeSubmission(application, resumePath, originalFileName) {
  if (!resumePath || !fs.existsSync(resumePath)) return;

  try {
    await sendResumeNotification(application, resumePath, originalFileName);
  } catch (emailErr) {
    console.warn('Resume email failed:', emailErr.message);
  }

  try {
    if (fs.existsSync(resumePath)) {
      const resumeUrl = await persistResume(resumePath, originalFileName);
      await applications.updateResumeUrl(application.id, resumeUrl);
    }
  } catch (uploadErr) {
    console.warn('Resume storage upload failed:', uploadErr.message);
  }
}

function getResumeExtension(resumeUrl, filePath) {
  if (filePath) return path.extname(filePath).toLowerCase() || '.pdf';
  try {
    const ext = path.extname(new URL(resumeUrl).pathname).toLowerCase();
    return ext || '.pdf';
  } catch {
    return '.pdf';
  }
}

// Admin/Client: download resume as attachment (PDF when uploaded as PDF)
router.get('/:id/resume/download', authenticate, authorize('admin', 'client'), async (req, res) => {
  try {
    const app = await applications.get(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    if (!app.resumeUrl) return res.status(404).json({ success: false, message: 'No resume attached' });

    if (req.user.role === 'client') {
      const job = app.jobId ? await jobs.get(app.jobId) : null;
      if (!job || job.clientId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    const baseName = `${sanitizeDownloadName(app.name)}_Resume`;

    if (app.resumeUrl.startsWith('http')) {
      const remoteRes = await fetch(app.resumeUrl);
      if (!remoteRes.ok) {
        return res.status(404).json({ success: false, message: 'Resume file not found' });
      }
      const ext = getResumeExtension(app.resumeUrl);
      const buffer = Buffer.from(await remoteRes.arrayBuffer());
      res.setHeader('Content-Type', MIME_BY_EXT[ext] || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${baseName}${ext}"`);
      return res.send(buffer);
    }

    const filename = path.basename(app.resumeUrl);
    const filePath = path.join(uploadDir, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Resume file not found on server' });
    }

    const ext = getResumeExtension(app.resumeUrl, filePath);
    res.setHeader('Content-Type', MIME_BY_EXT[ext] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${baseName}${ext}"`);
    return res.sendFile(filePath);
  } catch (err) {
    console.error('Resume download error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to download resume' });
  }
});

// Public: submit application (multer error handler wraps upload)
router.post('/', (req, res, next) => {
  uploadResume.single('resume')(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
}, async (req, res) => {
  try {
    const { jobId, name, email, phone, experience, skills, message, userId } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const job = jobId ? await jobs.get(jobId) : null;
    const resumePath = req.file ? path.join(uploadDir, req.file.filename) : null;
    let resumeUrl = null;
    const createdAt = new Date().toISOString();

    const partial = { name, email, phone, experience, skills, message, resumeUrl: null };

    // Compute ATS score from form data + job requirements
    let atsResult = { score: 0, label: 'Needs Review', breakdown: {}, matchedSkills: [], totalSkills: 0 };
    try {
      atsResult = computeATSScore(job, partial);
    } catch (atsErr) {
      console.warn('ATS scoring skipped:', atsErr.message);
    }

    const application = {
      id: `app_${uuid().slice(0, 8)}`,
      jobId: jobId || null,
      jobTitle: job?.title || 'Resume Submission',
      clientId: job?.clientId || null,
      userId: userId || null,
      name,
      email: email.toLowerCase().trim(),
      phone: phone || '',
      experience: experience || '',
      skills: skills || '',
      message: message || '',
      resumeUrl,
      status: 'new',
      atsScore: atsResult.score,
      atsLabel: atsResult.label,
      atsBreakdown: atsResult.breakdown,
      matchedSkills: atsResult.matchedSkills,
      totalSkills: atsResult.totalSkills,
      createdAt,
      expiresAt: getExpiresAt(),
    };

    await applications.create(application);

    if (job) {
      jobs.incrementApplications(jobId).catch(() => {});
    }

    res.status(201).json({
      success: true,
      data: application,
      ats: atsResult,
      message: 'Application submitted successfully',
    });

    if (req.file && resumePath) {
      finalizeResumeSubmission(application, resumePath, req.file.originalname);
    }
  } catch (err) {
    console.error('Application submit error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to submit application' });
  }
});

// Admin: all applications
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status, jobId } = req.query;
    const list = await applications.list({ status, jobId });
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Client: applications for their jobs
router.get('/client', authenticate, authorize('client'), async (req, res) => {
  try {
    const clientJobs = await jobs.listAll(req.user.id);
    const jobIds = clientJobs.map((j) => j.id);
    const list = jobIds.length ? await applications.list({ jobIds }) : [];
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Student: own resume submissions (for notifications)
router.get('/mine', authenticateFirebase, async (req, res) => {
  try {
    const { uid, email } = req.firebaseUser;
    const list = await applications.listForUser(uid, email);
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update application status (admin or client)
router.patch('/:id/status', authenticate, authorize('admin', 'client'), async (req, res) => {
  try {
    const { status } = req.body;
    const existing = await applications.get(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Application not found' });

    const updated = await applications.updateStatus(req.params.id, status);

    if (status && status !== existing.status) {
      try {
        await createStatusNotification(notifications, updated, status);
      } catch (notifErr) {
        console.warn('Notification create failed:', notifErr.message);
      }
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete application
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const app = await applications.get(req.params.id);
    if (app?.resumeUrl) await deleteResumeFile(app.resumeUrl);
    await notifications.deleteByApplication(req.params.id);
    await applications.delete(req.params.id);
    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
