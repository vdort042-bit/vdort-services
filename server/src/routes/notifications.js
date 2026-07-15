import { Router } from 'express';
import { notifications, applications } from '../store/firestoreStore.js';
import { authenticateFirebase } from '../middleware/firebaseAuth.js';
import { getStatusLabel, getStatusMessage, getStatusTitle } from '../utils/notificationHelper.js';

const router = Router();

// Student: get notifications + application status updates
router.get('/', authenticateFirebase, async (req, res) => {
  try {
    const { uid, email } = req.firebaseUser;
    const list = await notifications.listForUser(uid, email);
    const apps = await applications.listForUser(uid, email);

    // Merge current application statuses (covers missed notifications)
    const seen = new Set(list.map((n) => `${n.applicationId}_${n.status}`));
    for (const app of apps) {
      if (!app.status || app.status === 'new') continue;
      const key = `${app.id}_${app.status}`;
      if (seen.has(key)) continue;
      list.push({
        id: `status_${app.id}`,
        applicationId: app.id,
        status: app.status,
        title: getStatusTitle(app.status),
        message: getStatusMessage(app.status),
        read: false,
        createdAt: app.createdAt || new Date().toISOString(),
        isStatusOnly: true,
      });
      seen.add(key);
    }

    list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Student: mark notification as read
router.patch('/:id/read', authenticateFirebase, async (req, res) => {
  try {
    const { uid, email } = req.firebaseUser;
    const notif = await notifications.get(req.params.id);
    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    if (notif.userId !== uid && (notif.email || '').toLowerCase() !== email) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    await notifications.markRead(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/read-all', authenticateFirebase, async (req, res) => {
  try {
    const { uid, email } = req.firebaseUser;
    await notifications.markAllRead(uid, email);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
