import { Router } from 'express';
import { jobs, applications, contacts, subscribers, testimonials, users } from '../store/firestoreStore.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/overview', authenticate, authorize('admin'), async (req, res) => {
  const [
    totalJobs, activeJobs, totalApplications, newApplications,
    totalContacts, newContacts, totalSubscribers, totalClients, totalTestimonials,
  ] = await Promise.all([
    jobs.count(),
    jobs.countActive(),
    applications.count(),
    applications.countNew(),
    contacts.count(),
    contacts.countNew(),
    subscribers.count(),
    users.countByRole('client'),
    testimonials.count(),
  ]);

  res.json({
    success: true,
    data: {
      totalJobs, activeJobs,
      totalApplications, newApplications,
      totalContacts, newContacts,
      totalSubscribers, totalClients, totalTestimonials,
      placements: 5247,
      countries: 25,
      recruiters: 200,
    },
  });
});

router.get('/client', authenticate, authorize('client'), async (req, res) => {
  const clientJobs = await jobs.listAll(req.user.id);
  const jobIds = clientJobs.map((j) => j.id);
  const clientApps = await applications.list({ jobIds });

  res.json({
    success: true,
    data: {
      totalJobs: clientJobs.length,
      activeJobs: clientJobs.filter((j) => j.status === 'active').length,
      totalApplications: clientApps.length,
      newApplications: clientApps.filter((a) => a.status === 'new').length,
      filledPositions: clientJobs.filter((j) => j.status === 'filled').length,
    },
  });
});

router.get('/recent', authenticate, authorize('admin'), async (req, res) => {
  const [recentApps, recentJobs, recentContacts] = await Promise.all([
    applications.recent(5),
    jobs.recent(5),
    contacts.recent(5),
  ]);

  res.json({
    success: true,
    data: { applications: recentApps, jobs: recentJobs, contacts: recentContacts },
  });
});

router.get('/chart', authenticate, authorize('admin'), (_req, res) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  res.json({
    success: true,
    data: {
      placements:   months.map((m, i) => ({ month: m, value: 120 + i * 35 + Math.floor(Math.random() * 20) })),
      applications: months.map((m, i) => ({ month: m, value: 80  + i * 25 + Math.floor(Math.random() * 15) })),
    },
  });
});

export default router;
