import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { jobs } from '../store/firestoreStore.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

function formatJob(job) {
  if (!job) return null;
  // Support both `posted` (seeded/API jobs) and `createdAt` (Firebase-created jobs)
  const rawDate = job.posted || (job.createdAt?.toDate ? job.createdAt.toDate().toISOString() : job.createdAt);
  const posted = rawDate ? new Date(rawDate) : null;
  let postedLabel = 'Recently';
  if (posted && !isNaN(posted)) {
    const days = Math.floor((Date.now() - posted) / (1000 * 60 * 60 * 24));
    postedLabel = days === 0 ? 'Today' : days === 1 ? '1 day ago' : `${days} days ago`;
  }
  return { ...job, posted: postedLabel, postedAt: rawDate };
}

// Public: list active jobs
router.get('/', async (req, res) => {
  const { search, type, industry, status } = req.query;
  const list = await jobs.list({ search, type, industry, status });
  res.json({ success: true, data: list.map(formatJob) });
});

// Public: single job
router.get('/:id', async (req, res) => {
  const job = await jobs.get(req.params.id);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  res.json({ success: true, data: formatJob(job) });
});

// Admin/Client: all jobs
router.get('/manage/all', authenticate, authorize('admin', 'client'), async (req, res) => {
  const clientId = req.user.role === 'client' ? req.user.id : null;
  const list = await jobs.listAll(clientId);
  res.json({ success: true, data: list.map(formatJob) });
});

// Create job
router.post('/', authenticate, authorize('admin', 'client'), async (req, res) => {
  const job = {
    id: `job_${uuid().slice(0, 8)}`,
    ...req.body,
    clientId: req.user.role === 'client' ? req.user.id : req.body.clientId || null,
    status: req.body.status || 'active',
    applicationsCount: 0,
    posted: new Date().toISOString(),
  };
  const created = await jobs.create(job);
  res.status(201).json({ success: true, data: formatJob(created) });
});

// Update job
router.put('/:id', authenticate, authorize('admin', 'client'), async (req, res) => {
  const job = await jobs.get(req.params.id);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

  if (req.user.role === 'client' && job.clientId !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  const updated = await jobs.update(req.params.id, { ...req.body, id: job.id });
  res.json({ success: true, data: formatJob(updated) });
});

// Delete job
router.delete('/:id', authenticate, authorize('admin', 'client'), async (req, res) => {
  const job = await jobs.get(req.params.id);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

  if (req.user.role === 'client' && job.clientId !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  await jobs.delete(req.params.id);
  res.json({ success: true, message: 'Job deleted' });
});

export default router;
