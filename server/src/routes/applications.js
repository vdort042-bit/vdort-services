import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { applications, jobs } from '../store/firestoreStore.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadResume } from '../middleware/upload.js';
import { computeATSScore } from '../utils/atsScorer.js';

const router = Router();

// Public: submit application (multer error handler wraps upload)
router.post('/', (req, res, next) => {
  uploadResume.single('resume')(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
}, async (req, res) => {
  try {
    const { jobId, name, email, phone, experience, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const job = jobId ? await jobs.get(jobId) : null;
    const resumeUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const partial = { name, email, phone, experience, message, resumeUrl };

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
      jobTitle: job?.title || 'General Application',
      clientId: job?.clientId || null,
      name,
      email,
      phone: phone || '',
      experience: experience || '',
      message: message || '',
      resumeUrl,
      status: 'new',
      atsScore: atsResult.score,
      atsLabel: atsResult.label,
      atsBreakdown: atsResult.breakdown,
      matchedSkills: atsResult.matchedSkills,
      totalSkills: atsResult.totalSkills,
      createdAt: new Date().toISOString(),
    };

    await applications.create(application);

    if (job) {
      try { await jobs.incrementApplications(jobId); } catch (_) { /* non-fatal */ }
    }

    res.status(201).json({
      success: true,
      data: application,
      ats: atsResult,
      message: 'Application submitted successfully',
    });
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

// Update application status (admin or client)
router.patch('/:id/status', authenticate, authorize('admin', 'client'), async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await applications.updateStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete application
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await applications.delete(req.params.id);
    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
