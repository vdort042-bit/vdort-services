import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { contacts } from '../store/firestoreStore.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public: submit contact form
router.post('/', async (req, res) => {
  const { name, email, phone, company, subject, message, type } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
  }

  const contact = {
    id: `con_${uuid().slice(0, 8)}`,
    name,
    email,
    phone: phone || '',
    company: company || '',
    subject: subject || 'General Inquiry',
    message,
    type: type || 'general',
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  await contacts.create(contact);
  res.status(201).json({ success: true, data: contact, message: 'Message sent successfully' });
});

// Admin: all contacts
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  const { status, type } = req.query;
  const list = await contacts.list({ status, type });
  res.json({ success: true, data: list });
});

// Update contact status
router.patch('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  const updated = await contacts.updateStatus(req.params.id, req.body.status);
  if (!updated) return res.status(404).json({ success: false, message: 'Contact not found' });
  res.json({ success: true, data: updated });
});

// Delete contact
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  await contacts.delete(req.params.id);
  res.json({ success: true, message: 'Contact deleted' });
});

export default router;
