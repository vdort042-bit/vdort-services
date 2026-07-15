import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, GraduationCap, Trash2, Search,
  Mail, Calendar, CheckCircle, XCircle, AlertTriangle,
} from 'lucide-react';
import api from '../../services/api';

function fmt(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminUsers() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const sRes = await api.users.listStudents();
      setStudents(sRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.uid);
    try {
      await api.users.deleteStudent(deleteTarget.uid);
      setStudents((s) => s.filter((x) => x.uid !== deleteTarget.uid));
      showToast('Candidate account deleted');
    } catch (err) {
      showToast(err.message);
    } finally {
      setActionLoading(null);
      setDeleteTarget(null);
    }
  };

  const handleToggle = async (student) => {
    setActionLoading(student.uid);
    try {
      await api.users.setStudentStatus(student.uid, !student.disabled);
      setStudents((s) =>
        s.map((x) => x.uid === student.uid ? { ...x, disabled: !x.disabled } : x)
      );
      showToast(`Account ${student.disabled ? 'enabled' : 'disabled'}`);
    } catch (err) {
      showToast(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = students.filter((s) =>
    s.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h2 className="font-heading font-bold text-2xl text-navy-900">Candidates</h2>
          <p className="text-surface-500 text-sm mt-0.5">
            {students.length} registered candidate{students.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="sm:ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidates..."
              className="pl-9 pr-4 py-2 rounded-xl border border-surface-300 focus:outline-none focus:border-brand-500 text-sm w-full sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-surface-200 animate-pulse h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-surface-400">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No candidates registered yet</p>
          <p className="text-xs mt-1">Candidates who sign up will appear here</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-card"
        >
          {filtered.map((student, i) => (
            <div
              key={student.uid}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-surface-50 transition-colors ${
                i < filtered.length - 1 ? 'border-b border-surface-100' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-brand-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                {student.photoURL
                  ? <img src={student.photoURL} alt="" className="w-full h-full object-cover" />
                  : (student.displayName?.[0]?.toUpperCase() || student.email?.[0]?.toUpperCase() || 'S')
                }
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-navy-900 text-sm truncate">
                    {student.displayName !== 'No Name' ? student.displayName : student.email}
                  </p>
                  {student.emailVerified && (
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" title="Email verified" />
                  )}
                  {student.disabled && (
                    <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">Disabled</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-surface-400 mt-0.5">
                  <span className="flex items-center gap-1 break-all">
                    <Mail className="w-3 h-3 shrink-0" />
                    {student.email}
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {fmt(student.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => handleToggle(student)}
                  disabled={actionLoading === student.uid}
                  title={student.disabled ? 'Enable account' : 'Disable account'}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    student.disabled
                      ? 'text-green-500 hover:bg-green-50'
                      : 'text-amber-500 hover:bg-amber-50'
                  }`}
                >
                  {student.disabled ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setDeleteTarget(student)}
                  className="p-2 rounded-lg text-surface-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-heading font-bold text-navy-900 text-center mb-1">Delete Account?</h3>
              <p className="text-surface-500 text-sm text-center mb-6">
                <strong className="text-navy-700">{deleteTarget.displayName || deleteTarget.email}</strong>
                {' '}will lose all access permanently.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-surface-300 text-navy-700 text-sm font-medium hover:bg-surface-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={!!actionLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60 cursor-pointer transition-colors"
                >
                  {actionLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-navy-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
