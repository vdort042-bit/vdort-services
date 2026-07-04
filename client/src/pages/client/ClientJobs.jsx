import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

const emptyJob = {
  title: '', company: '', location: '', type: 'Full-time',
  experience: '', salary: '', industry: '', skills: '', description: '', status: 'active',
};

export default function ClientJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyJob);

  const load = async () => {
    const clientId = user?.uid || user?.id;
    if (!clientId) return;
    try {
      const jobsRef = collection(db, 'jobs');
      const q = query(jobsRef, where('clientId', '==', clientId));
      const snapshot = await getDocs(q);
      const jobsList = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setJobs(jobsList);
    } catch (err) {
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [user]);

  const openCreate = () => { setForm(emptyJob); setModal('create'); };
  const openEdit = (job) => {
    setForm({
      ...job,
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : (job.skills || ''),
    });
    setModal('edit');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const skills = typeof form.skills === 'string'
      ? form.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : form.skills;

    const data = {
      title: form.title,
      company: form.company || user?.name || 'VDORT',
      location: form.location,
      type: form.type,
      experience: form.experience,
      salary: form.salary,
      industry: form.industry,
      skills,
      description: form.description,
      status: form.status,
      clientId: user.uid || user.id,
      clientEmail: user.email,
      updatedAt: serverTimestamp(),
    };

    try {
      if (modal === 'create') {
        data.createdAt = serverTimestamp();
        await addDoc(collection(db, 'jobs'), data);
      } else {
        const { id, ...updateData } = data;
        await updateDoc(doc(db, 'jobs', form.id), updateData);
      }
      setModal(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return;
    try {
      await deleteDoc(doc(db, 'jobs', id));
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-[3px] border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-2xl text-navy-900">My Job Postings</h2>
          <p className="text-slate-500 text-sm">{jobs.length} positions</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={openCreate}>Post New Job</Button>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-surface-200 p-6 shadow-card hover:shadow-card-hover transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-navy-900 text-lg">{job.title}</h3>
                <p className="text-sm text-slate-500 mb-2">{job.location} · {job.type} · {job.salary}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(job.skills) ? job.skills : []).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-lg bg-brand-50 text-brand-600 text-xs">{s}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${job.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                  {job.status}
                </span>
                <button onClick={() => openEdit(job)} className="p-2 hover:bg-brand-50 rounded-lg text-brand-500 cursor-pointer"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(job.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
        {jobs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-surface-200">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No jobs posted yet</p>
            <p className="text-slate-400 text-sm mt-1">Create your first position to start hiring</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-elevated"
              initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
              <div className="flex justify-between mb-4">
                <h3 className="font-heading font-bold text-lg">{modal === 'create' ? 'Post New Job' : 'Edit Job'}</h3>
                <button onClick={() => setModal(null)} className="cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-3">
                {['title', 'company', 'location', 'type', 'experience', 'salary', 'industry'].map((field) => (
                  <input key={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} required={['title', 'location'].includes(field)}
                    value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm outline-none focus:border-brand-500"
                  />
                ))}
                <input placeholder="Skills (comma separated)" value={form.skills}
                  onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm outline-none focus:border-brand-500"
                />
                <textarea placeholder="Job Description" rows={3} value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm resize-none outline-none focus:border-brand-500"
                />
                <Button type="submit" variant="primary" className="w-full">Save Job</Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
