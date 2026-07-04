import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { subscribers } from '../store/firestoreStore.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public: subscribe
router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const exists = await subscribers.findByEmail(email);
  if (exists) {
    return res.json({ success: true, message: 'Already subscribed' });
  }

  const subscriber = {
    id: `sub_${uuid().slice(0, 8)}`,
    email: email.toLowerCase(),
    createdAt: new Date().toISOString(),
  };

  await subscribers.create(subscriber);
  res.status(201).json({ success: true, message: 'Subscribed successfully' });
});

// Admin: list subscribers
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  const list = await subscribers.list();
  res.json({ success: true, data: list });
});

// Admin: delete subscriber
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  await subscribers.delete(req.params.id);
  res.json({ success: true, message: 'Subscriber removed' });
});

export default router;
