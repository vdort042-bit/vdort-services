import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { testimonials } from '../store/firestoreStore.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public: testimonials (optionally featured only)
router.get('/', async (req, res) => {
  const featured = req.query.featured === 'true';
  const list = await testimonials.list(featured);
  res.json({ success: true, data: list });
});

// Admin: create
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  const testimonial = {
    id: `tst_${uuid().slice(0, 8)}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  await testimonials.create(testimonial);
  res.status(201).json({ success: true, data: testimonial });
});

// Admin: update
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  const existing = await testimonials.get(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Testimonial not found' });
  const updated = await testimonials.update(req.params.id, { ...req.body, id: existing.id });
  res.json({ success: true, data: updated });
});

// Admin: delete
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  await testimonials.delete(req.params.id);
  res.json({ success: true, message: 'Testimonial deleted' });
});

export default router;
