import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, MapPin, Briefcase } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';

const emptyJob = {
  title: '', company: '', location: '', type: 'Full-time',
  experience: '', salary: '', industry: '', skills: '', description: '', status: 'active',
};

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyJob);

  const load = () => {
    api.jobs.manage().then((res) => setJobs(res.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyJob); setModal('create'); };
  const openEdit = (job) => {
    setForm({ ...job, skills: Array.isArray(job.skills) ? job.skills.join(', ') : (job.skills || '') });
    setModal('edit');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = { ...form, skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean) };
    try {
      if (modal === 'create') await api.jobs.create(data);
      else await api.jobs.update(form.id, data);
      setModal(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return;
    await api.jobs.delete(id);
    load();
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-2xl text-navy-900">Job Management</h2>
          <p className="text-slate-500 text-sm">{jobs.length} total positions</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={openCreate}>Add Job</Button>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 border-b border-surface-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-navy-900">Position</th>
                <th className="text-left px-6 py-4 font-semibold text-navy-900">Location</th>
                <th className="text-left px-6 py-4 font-semibold text-navy-900">Type</th>
                <th className="text-left px-6 py-4 font-semibold text-navy-900">Applications</th>
                <th className="text-left px-6 py-4 font-semibold text-navy-900">Status</th>
                <th className="text-right px-6 py-4 font-semibold text-navy-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-navy-900">{job.title}</p>
                    <p className="text-xs text-slate-500">{job.company}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{job.location}</td>
                  <td className="px-6 py-4 text-slate-600">{job.type}</td>
                  <td className="px-6 py-4 text-slate-600">{job.applicationsCount}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      job.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-600'
                    }`}>{job.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEdit(job)} className="p-2 hover:bg-brand-50 rounded-lg text-brand-500 cursor-pointer"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(job.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-elevated"
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading font-bold text-lg text-navy-900">{modal === 'create' ? 'Add New Job' : 'Edit Job'}</h3>
                <button onClick={() => setModal(null)} className="p-2 hover:bg-surface-100 rounded-lg cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-3">
                {['title', 'company', 'location', 'type', 'experience', 'salary', 'industry'].map((field) => (
                  <input key={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} required={['title', 'company', 'location'].includes(field)}
                    value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm outline-none focus:border-brand-500"
                  />
                ))}
                <input placeholder="Skills (comma separated)" value={form.skills}
                  onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm outline-none focus:border-brand-500"
                />
                <textarea placeholder="Description" rows={3} value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm outline-none focus:border-brand-500 resize-none"
                />
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm outline-none focus:border-brand-500">
                  <option value="active">Active</option>
                  <option value="filled">Filled</option>
                  <option value="closed">Closed</option>
                </select>
                <Button type="submit" variant="primary" className="w-full">Save Job</Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
