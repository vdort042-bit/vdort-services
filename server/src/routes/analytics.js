import { Router } from 'express';
import { jobs, applications, contacts, subscribers, testimonials, users } from '../store/firestoreStore.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { getYearMonth } from '../utils/dateHelper.js';

const router = Router();

router.get('/overview', authenticate, authorize('admin'), async (req, res) => {
  const [
    totalJobs, activeJobs, totalApplications, newApplications,
    totalContacts, newContacts, totalSubscribers, totalClients, totalTestimonials,
    totalStudents,
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
    users.countByRole('student'),
  ]);

  res.json({
    success: true,
    data: {
      totalJobs, activeJobs,
      totalApplications, newApplications,
      totalContacts, newContacts,
      totalSubscribers, totalClients, totalTestimonials,
      totalStudents,
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

const STATUS_LIST = ['new', 'reviewing', 'shortlisted', 'interviewed', 'hired', 'rejected'];

router.get('/monthly', authenticate, authorize('admin'), async (req, res) => {
  try {
    const year = parseInt(req.query.year, 10) || new Date().getFullYear();
    const month = parseInt(req.query.month, 10) || new Date().getMonth() + 1;

    const allApps = await applications.list({});
    const filtered = allApps.filter((app) => {
      const ym = getYearMonth(app.createdAt);
      return ym && ym.year === year && ym.month === month;
    });

    const byStatus = Object.fromEntries(STATUS_LIST.map((s) => [s, 0]));
    filtered.forEach((app) => {
      const s = app.status || 'new';
      if (byStatus[s] !== undefined) byStatus[s]++;
      else byStatus.new++;
    });

    res.json({
      success: true,
      data: {
        year,
        month,
        total: filtered.length,
        byStatus,
        availableMonths: [...new Set(
          allApps
            .map((a) => getYearMonth(a.createdAt))
            .filter(Boolean)
            .map((ym) => `${ym.year}-${ym.month}`)
        )].sort().reverse(),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
