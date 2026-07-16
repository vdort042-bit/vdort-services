import { getDb } from '../config/firebase.js';
import { toMillis } from '../utils/dateHelper.js';
import {
  seedUsers, seedJobs, seedApplications,
  seedContacts, seedSubscribers, seedTestimonials,
} from './seedData.js';

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const toDoc  = (snap) => snap.exists ? { id: snap.id, ...snap.data() } : null;
const toDocs = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));

// ─── SEED (runs once on startup if collection is empty) ───────────────────────
export async function seedIfEmpty() {
  if (process.env.NODE_ENV === 'production') return;

  const db = getDb();
  const seeds = [
    { col: 'users',        data: seedUsers        },
    { col: 'jobs',         data: seedJobs         },
    { col: 'applications', data: seedApplications },
    { col: 'contacts',     data: seedContacts     },
    { col: 'subscribers',  data: seedSubscribers  },
    { col: 'testimonials', data: seedTestimonials },
  ];

  for (const { col, data } of seeds) {
    const snap = await db.collection(col).limit(1).get();
    if (snap.empty) {
      console.log(`  📦 Seeding ${col}...`);
      const batch = db.batch();
      for (const item of data) {
        batch.set(db.collection(col).doc(item.id), item);
      }
      await batch.commit();
    }
  }
}

// ─── RESET TOKENS (transient — no need to persist) ───────────────────────────
const _resetTokens = new Map();
export const tokens = {
  set:    (t, d) => _resetTokens.set(t, d),
  get:    (t)    => _resetTokens.get(t),
  delete: (t)    => _resetTokens.delete(t),
};

// ─── USERS ───────────────────────────────────────────────────────────────────
export const users = {
  findByEmail: async (email) => {
    const snap = await getDb().collection('users')
      .where('email', '==', email.toLowerCase()).limit(1).get();
    return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
  },

  findById: async (id) => {
    const doc = await getDb().collection('users').doc(id).get();
    return toDoc(doc);
  },

  update: async (id, data) => {
    await getDb().collection('users').doc(id).update(data);
    return toDoc(await getDb().collection('users').doc(id).get());
  },

  countByRole: async (role) => {
    const snap = await getDb().collection('users').where('role', '==', role).get();
    return snap.size;
  },
};

// ─── JOBS ─────────────────────────────────────────────────────────────────────
const sortByPosted = (docs) => docs.sort((a, b) => new Date(b.posted) - new Date(a.posted));

export const jobs = {
  list: async ({ search, type, industry, status } = {}) => {
    // Avoid composite index by filtering in memory after a simple where
    let snap;
    if (status === 'all') {
      snap = await getDb().collection('jobs').get();
    } else {
      snap = await getDb().collection('jobs').where('status', '==', status || 'active').get();
    }
    let docs = sortByPosted(toDocs(snap));

    if (search) {
      const q = search.toLowerCase();
      docs = docs.filter((j) =>
        j.title?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        j.skills?.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (type)     docs = docs.filter((j) => j.type === type);
    if (industry) docs = docs.filter((j) => j.industry === industry);
    return docs;
  },

  listAll: async (clientId) => {
    // Avoid composite index by filtering clientId in memory
    const snap = await getDb().collection('jobs').get();
    const docs = sortByPosted(toDocs(snap));
    return clientId ? docs.filter((j) => j.clientId === clientId) : docs;
  },

  get: async (id) => toDoc(await getDb().collection('jobs').doc(id).get()),

  create: async (data) => {
    await getDb().collection('jobs').doc(data.id).set(data);
    return data;
  },

  update: async (id, data) => {
    await getDb().collection('jobs').doc(id).update(data);
    return toDoc(await getDb().collection('jobs').doc(id).get());
  },

  delete: async (id) => {
    await getDb().collection('jobs').doc(id).delete();
    return true;
  },

  incrementApplications: async (jobId) => {
    const ref = getDb().collection('jobs').doc(jobId);
    const doc = await ref.get();
    if (doc.exists) {
      await ref.update({ applicationsCount: (doc.data().applicationsCount || 0) + 1 });
    }
  },

  count:       async () => (await getDb().collection('jobs').get()).size,
  countActive: async () => (await getDb().collection('jobs').where('status', '==', 'active').get()).size,

  recent: async (limit = 5) =>
    toDocs(await getDb().collection('jobs').orderBy('posted', 'desc').limit(limit).get()),
};

// ─── APPLICATIONS ─────────────────────────────────────────────────────────────
export const applications = {
  create: async (data) => {
    await getDb().collection('applications').doc(data.id).set(data);
    return data;
  },

  list: async ({ status, jobId, jobIds } = {}) => {
    const snap = await getDb().collection('applications').get();
    let docs = toDocs(snap).sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
    if (status)  docs = docs.filter((a) => a.status === status);
    if (jobId)   docs = docs.filter((a) => a.jobId === jobId);
    if (jobIds)  docs = docs.filter((a) => jobIds.includes(a.jobId));
    return docs;
  },

  get: async (id) => toDoc(await getDb().collection('applications').doc(id).get()),

  updateStatus: async (id, status) => {
    await getDb().collection('applications').doc(id).update({ status });
    return toDoc(await getDb().collection('applications').doc(id).get());
  },

  updateResumeUrl: async (id, resumeUrl) => {
    await getDb().collection('applications').doc(id).update({ resumeUrl });
    return toDoc(await getDb().collection('applications').doc(id).get());
  },

  delete: async (id) => {
    await getDb().collection('applications').doc(id).delete();
    return true;
  },

  listExpired: async () => {
    const now = new Date().toISOString();
    const snap = await getDb().collection('applications').get();
    return toDocs(snap).filter((a) => a.expiresAt && a.expiresAt <= now);
  },

  listForUser: async (userId, email) => {
    const snap = await getDb().collection('applications').get();
    const emailLower = (email || '').toLowerCase();
    return toDocs(snap)
      .filter((a) =>
        (userId && a.userId === userId) ||
        (emailLower && (a.email || '').toLowerCase() === emailLower)
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  count:    async () => (await getDb().collection('applications').get()).size,
  countNew: async () => (await getDb().collection('applications').where('status', '==', 'new').get()).size,

  recent: async (limit = 5) => {
    const docs = await applications.list({});
    return docs.slice(0, limit);
  },
};

// ─── CONTACTS ─────────────────────────────────────────────────────────────────
export const contacts = {
  create: async (data) => {
    await getDb().collection('contacts').doc(data.id).set(data);
    return data;
  },

  list: async ({ status, type } = {}) => {
    const snap = await getDb().collection('contacts').orderBy('createdAt', 'desc').get();
    let docs = toDocs(snap);
    if (status) docs = docs.filter((c) => c.status === status);
    if (type)   docs = docs.filter((c) => c.type === type);
    return docs;
  },

  get: async (id) => toDoc(await getDb().collection('contacts').doc(id).get()),

  updateStatus: async (id, status) => {
    await getDb().collection('contacts').doc(id).update({ status });
    return toDoc(await getDb().collection('contacts').doc(id).get());
  },

  delete: async (id) => {
    await getDb().collection('contacts').doc(id).delete();
    return true;
  },

  count:    async () => (await getDb().collection('contacts').get()).size,
  countNew: async () => (await getDb().collection('contacts').where('status', '==', 'new').get()).size,

  recent: async (limit = 5) =>
    toDocs(await getDb().collection('contacts').orderBy('createdAt', 'desc').limit(limit).get()),
};

// ─── SUBSCRIBERS ──────────────────────────────────────────────────────────────
export const subscribers = {
  findByEmail: async (email) => {
    const snap = await getDb().collection('subscribers')
      .where('email', '==', email.toLowerCase()).limit(1).get();
    return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
  },

  create: async (data) => {
    await getDb().collection('subscribers').doc(data.id).set(data);
    return data;
  },

  list:   async () => toDocs(await getDb().collection('subscribers').orderBy('createdAt', 'desc').get()),
  delete: async (id) => { await getDb().collection('subscribers').doc(id).delete(); return true; },
  count:  async () => (await getDb().collection('subscribers').get()).size,
};

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
export const testimonials = {
  list: async (featured) => {
    const snap = await getDb().collection('testimonials').get();
    let docs = toDocs(snap).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (featured) docs = docs.filter((t) => t.featured === true);
    return docs;
  },

  create: async (data) => {
    await getDb().collection('testimonials').doc(data.id).set(data);
    return data;
  },

  get: async (id) => toDoc(await getDb().collection('testimonials').doc(id).get()),

  update: async (id, data) => {
    await getDb().collection('testimonials').doc(id).update(data);
    return toDoc(await getDb().collection('testimonials').doc(id).get());
  },

  delete: async (id) => {
    await getDb().collection('testimonials').doc(id).delete();
    return true;
  },

  count: async () => (await getDb().collection('testimonials').get()).size,
};

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const notifications = {
  create: async (data) => {
    await getDb().collection('notifications').doc(data.id).set(data);
    return data;
  },

  deleteByApplication: async (applicationId) => {
    const snap = await getDb().collection('notifications')
      .where('applicationId', '==', applicationId).get();
    const batch = getDb().batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    if (!snap.empty) await batch.commit();
  },

  get: async (id) => toDoc(await getDb().collection('notifications').doc(id).get()),

  listForUser: async (userId, email) => {
    const snap = await getDb().collection('notifications').get();
    const emailLower = (email || '').toLowerCase();
    return toDocs(snap)
      .filter((n) =>
        (userId && n.userId === userId) ||
        (emailLower && (n.email || '').toLowerCase() === emailLower)
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  markRead: async (id) => {
    await getDb().collection('notifications').doc(id).update({ read: true });
  },

  markAllRead: async (userId, email) => {
    const snap = await getDb().collection('notifications').get();
    const emailLower = (email || '').toLowerCase();
    const unread = toDocs(snap).filter((n) =>
      !n.read && (
        (userId && n.userId === userId) ||
        (emailLower && (n.email || '').toLowerCase() === emailLower)
      )
    );
    if (!unread.length) return;
    const batch = getDb().batch();
    unread.forEach((n) => batch.update(getDb().collection('notifications').doc(n.id), { read: true }));
    await batch.commit();
  },
};
