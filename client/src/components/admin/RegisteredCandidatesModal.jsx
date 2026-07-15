import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users } from 'lucide-react';
import api from '../../services/api';

export default function RegisteredCandidatesModal({ open, onClose }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError('');
    api.users.listStudents()
      .then((res) => setStudents(res.data || []))
      .catch((err) => setError(err.message || 'Failed to load candidates'))
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-cyan-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-navy-900">Registered Candidates</h3>
                  <p className="text-xs text-slate-500">{students.length} total</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-surface-100 text-slate-400 hover:text-navy-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-auto flex-1">
              {loading ? (
                <div className="p-8 text-center text-slate-400 text-sm">Loading candidates...</div>
              ) : error ? (
                <div className="p-8 text-center text-red-500 text-sm">{error}</div>
              ) : students.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">No registered candidates yet</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-surface-50 sticky top-0">
                    <tr>
                      <th className="text-left px-6 py-3 font-semibold text-navy-900">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    {students.map((s) => (
                      <tr key={s.uid} className="hover:bg-surface-50 transition-colors">
                        <td className="px-6 py-3.5 text-slate-600">{s.email || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
