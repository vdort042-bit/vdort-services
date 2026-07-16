import { useEffect, useState } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';

const empty = { name: '', role: '', company: '', type: 'client', rating: 5, text: '', featured: true };

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);

  const load = () => {
    api.testimonials.list().then((res) => setItems(res.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await api.testimonials.create(form);
    setModal(false);
    setForm(empty);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete testimonial?')) return;
    await api.testimonials.delete(id);
    load();
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-navy-900">Testimonials</h2>
          <p className="text-slate-500 text-sm">{items.length} testimonials</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setModal(true)} className="w-full sm:w-auto">Add</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {items.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl border border-surface-200 p-6 shadow-card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-heading font-semibold text-navy-900">{t.name}</h3>
                <p className="text-sm text-slate-500">{t.role}, {t.company}</p>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4 line-clamp-3">"{t.text}"</p>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-0.5 rounded-full ${t.type === 'client' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                {t.type}
              </span>
              <button onClick={() => handleDelete(t.id)} className="text-red-500 text-sm hover:underline cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-navy-950/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-elevated"
              initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
              <div className="flex justify-between mb-4">
                <h3 className="font-heading font-bold text-lg">Add Testimonial</h3>
                <button onClick={() => setModal(false)} className="cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-3">
                {['name', 'role', 'company'].map((f) => (
                  <input key={f} placeholder={f} required value={form[f]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm outline-none focus:border-brand-500"
                  />
                ))}
                <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm">
                  <option value="client">Client</option>
                  <option value="candidate">Candidate</option>
                </select>
                <textarea placeholder="Testimonial text" required rows={3} value={form.text}
                  onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm resize-none outline-none focus:border-brand-500"
                />
                <Button type="submit" variant="primary" className="w-full">Save</Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
