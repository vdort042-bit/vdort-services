import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Briefcase, GraduationCap, Trash2, Search,
  Mail, Building2, Calendar, Shield, CheckCircle, XCircle,
  Eye, EyeOff, AlertTriangle, X, ChevronDown,
} from 'lucide-react';
import api from '../../services/api';

const tabs = [
  { id: 'clients',  label: 'Client Accounts', icon: Briefcase },
  { id: 'students', label: 'Candidates / Students', icon: GraduationCap },
];

function fmt(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Create Client Modal ────────────────────────────────────────────────────────
function CreateClientModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.users.createClient(form);
      onCreated(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-brand-500" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-navy-900">Create Client Account</h2>
              <p className="text-xs text-surface-500">New portal access for a hiring company</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-100 cursor-pointer">
            <X className="w-5 h-5 text-surface-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {[
            { key: 'name', label: 'Full Name', placeholder: 'Sarah Mitchell', type: 'text' },
            { key: 'company', label: 'Company Name', placeholder: 'TechCorp Global Inc.', type: 'text' },
            { key: 'email', label: 'Email Address', placeholder: 'sarah@techcorp.com', type: 'email' },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-navy-700 mb-1">{label}</label>
              <input
                type={type}
                required
                value={form[key]}
                onChange={set(key)}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-300 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-navy-900 text-sm"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                required
                minLength={6}
                value={form.password}
                onChange={set('password')}
                placeholder="Min. 6 characters"
                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-surface-300 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-navy-900 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-navy-700 cursor-pointer"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-surface-300 text-navy-700 text-sm font-medium hover:bg-surface-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 disabled:opacity-60 cursor-pointer transition-colors"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState('clients');
  const [clients, setClients] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [cRes, sRes] = await Promise.all([
        api.users.listClients(),
        api.users.listStudents(),
      ]);
      setClients(cRes.data || []);
      setStudents(sRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.id || deleteTarget.uid);
    try {
      if (deleteTarget.role === 'client') {
        await api.users.deleteClient(deleteTarget.id);
        setClients((c) => c.filter((x) => x.id !== deleteTarget.id));
        showToast('Client account deleted');
      } else {
        await api.users.deleteStudent(deleteTarget.uid);
        setStudents((s) => s.filter((x) => x.uid !== deleteTarget.uid));
        showToast('Student account deleted');
      }
    } catch (err) {
      showToast(err.message);
    } finally {
      setActionLoading(null);
      setDeleteTarget(null);
    }
  };

  const handleToggleStudent = async (student) => {
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

  const filteredClients = clients.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredStudents = students.filter((s) =>
    s.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h2 className="font-heading font-bold text-2xl text-navy-900">User Management</h2>
          <p className="text-surface-500 text-sm mt-0.5">
            Manage client portals and view registered candidates
          </p>
        </div>
        <div className="sm:ml-auto flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-9 pr-4 py-2 rounded-xl border border-surface-300 focus:outline-none focus:border-brand-500 text-sm w-52"
            />
          </div>
          {activeTab === 'clients' && (
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 cursor-pointer transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              New Client
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-100 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearch(''); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-surface-500 hover:text-navy-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              activeTab === tab.id ? 'bg-brand-500/10 text-brand-600' : 'bg-surface-200 text-surface-400'
            }`}>
              {tab.id === 'clients' ? clients.length : students.length}
            </span>
          </button>
        ))}
      </div>

      {/* Admin Badge */}
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <Shield className="w-5 h-5 text-amber-500 flex-shrink-0" />
        <div>
          <p className="text-amber-800 text-sm font-semibold">Single Admin Account</p>
          <p className="text-amber-600 text-xs">
            The admin account is unique and managed by the developer only.
            Only client accounts can be created from here.
          </p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-surface-200 animate-pulse">
              <div className="h-4 bg-surface-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-surface-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-surface-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* ── Clients Tab ── */}
          {activeTab === 'clients' && (
            <motion.div
              key="clients"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredClients.length === 0 && (
                <div className="col-span-full text-center py-16 text-surface-400">
                  <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No client accounts found</p>
                  <button
                    onClick={() => setShowCreate(true)}
                    className="mt-3 text-brand-500 text-sm font-semibold hover:underline cursor-pointer"
                  >
                    Create first client →
                  </button>
                </div>
              )}
              {filteredClients.map((client) => (
                <motion.div
                  key={client.id}
                  layout
                  className="bg-white rounded-2xl border border-surface-200 p-5 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center text-white font-bold text-lg">
                      {client.name?.[0]?.toUpperCase() || 'C'}
                    </div>
                    <button
                      onClick={() => setDeleteTarget({ ...client, role: 'client' })}
                      className="p-2 rounded-lg text-surface-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-heading font-semibold text-navy-900 mb-0.5">{client.name}</h3>

                  <div className="space-y-1.5 mt-3">
                    <div className="flex items-center gap-2 text-surface-500 text-xs">
                      <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{client.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-surface-500 text-xs">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-surface-500 text-xs">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Joined {fmt(client.createdAt)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-surface-100">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Active Client
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ── Students Tab ── */}
          {activeTab === 'students' && (
            <motion.div
              key="students"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {filteredStudents.length === 0 && (
                <div className="text-center py-16 text-surface-400">
                  <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No candidates registered yet</p>
                  <p className="text-xs mt-1">Students who sign up via the Candidate Login will appear here</p>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
                {filteredStudents.map((student, i) => (
                  <div
                    key={student.uid}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-surface-50 transition-colors ${
                      i < filteredStudents.length - 1 ? 'border-b border-surface-100' : ''
                    }`}
                  >
                    {/* Avatar */}
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
                      <p className="text-surface-400 text-xs truncate">{student.email}</p>
                    </div>

                    <div className="hidden md:block text-xs text-surface-400 text-right flex-shrink-0">
                      <p>Joined {fmt(student.createdAt)}</p>
                      {student.lastLoginAt && <p className="text-surface-300">Last login {fmt(student.lastLoginAt)}</p>}
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleToggleStudent(student)}
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
                        onClick={() => setDeleteTarget({ ...student, role: 'student' })}
                        className="p-2 rounded-lg text-surface-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Create Client Modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateClientModal
            onClose={() => setShowCreate(false)}
            onCreated={(newClient) => {
              setClients((c) => [newClient, ...c]);
              setShowCreate(false);
              showToast('Client account created successfully!');
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
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
                <strong className="text-navy-700">{deleteTarget.name || deleteTarget.displayName || deleteTarget.email}</strong>
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
                  onClick={handleDeleteClient}
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
