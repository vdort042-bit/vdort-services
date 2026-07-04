import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Users, TrendingUp, Download, Search, Mail,
  Phone, Clock, ChevronDown, Star, CheckCircle, XCircle,
  AlertCircle, Eye, Filter,
} from 'lucide-react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../context/AuthContext';

// ── ATS Badge ─────────────────────────────────────────────────────────────────
function ATSBadge({ score }) {
  if (score === undefined || score === null) return null;
  const cfg =
    score >= 80 ? { bg: 'bg-green-100', text: 'text-green-700', label: 'Excellent' } :
    score >= 60 ? { bg: 'bg-blue-100',  text: 'text-blue-700',  label: 'Good' } :
    score >= 40 ? { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Fair' } :
                  { bg: 'bg-red-100',   text: 'text-red-700',   label: 'Low' };

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${cfg.bg}`}>
      <TrendingUp className={`w-3.5 h-3.5 ${cfg.text}`} />
      <span className={`text-xs font-bold ${cfg.text}`}>{score}%</span>
      <span className={`text-xs ${cfg.text} opacity-70`}>{cfg.label}</span>
    </div>
  );
}

function ATSProgressBar({ score }) {
  if (score === undefined || score === null) return null;
  const color =
    score >= 80 ? 'from-green-400 to-emerald-500' :
    score >= 60 ? 'from-blue-400 to-cyan-500' :
    score >= 40 ? 'from-amber-400 to-orange-500' :
                  'from-red-400 to-rose-500';
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-surface-400">ATS Score</span>
        <span className="font-semibold text-navy-700">{score}/100</span>
      </div>
      <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9 }}
        />
      </div>
    </div>
  );
}

// ── Breakdown Panel ───────────────────────────────────────────────────────────
function ATSBreakdown({ app }) {
  const b = app.atsBreakdown;
  if (!b) return null;
  return (
    <div className="mt-4 bg-surface-50 rounded-xl p-4 space-y-3">
      <p className="text-xs font-semibold text-navy-700 uppercase tracking-wide">ATS Breakdown</p>
      {[
        { label: 'Skills Match', key: 'skills' },
        { label: 'Job Description', key: 'description' },
        { label: 'Experience', key: 'experience' },
        { label: 'Completeness', key: 'completeness' },
      ].map(({ label, key }) => {
        const item = b[key];
        if (!item) return null;
        const pct = Math.round((item.score / item.max) * 100);
        return (
          <div key={key}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-surface-600">{label}</span>
              <span className="font-medium text-navy-700">{item.score}/{item.max}</span>
            </div>
            <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
              <div className="h-full bg-brand-400 rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}

      {app.matchedSkills?.length > 0 && (
        <div>
          <p className="text-xs text-surface-400 mb-1.5">Skills found in resume:</p>
          <div className="flex flex-wrap gap-1.5">
            {app.matchedSkills.map((s) => (
              <span key={s} className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-2.5 h-2.5" />{s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const STATUS_COLORS = {
  new:         'bg-blue-50 text-blue-600',
  reviewing:   'bg-purple-50 text-purple-600',
  shortlisted: 'bg-green-50 text-green-600',
  interviewed: 'bg-amber-50 text-amber-600',
  hired:       'bg-emerald-50 text-emerald-700',
  rejected:    'bg-red-50 text-red-600',
};

const STATUSES = ['new', 'reviewing', 'shortlisted', 'interviewed', 'hired', 'rejected'];

export default function ClientCandidates() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [atsFilter, setAtsFilter] = useState('');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      const clientId = user?.uid || user?.id;
      if (!clientId) return;
      try {
        const q = query(collection(db, 'applications'), where('clientId', '==', clientId));
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Sort by createdAt desc
        list.sort((a, b) => {
          const aT = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const bT = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return bT - aT;
        });
        setApps(list);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [user]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await updateDoc(doc(db, 'applications', id), { status });
      setApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = apps
    .filter((a) => !statusFilter || a.status === statusFilter)
    .filter((a) => {
      if (!atsFilter) return true;
      const s = a.atsScore ?? 0;
      if (atsFilter === 'excellent') return s >= 80;
      if (atsFilter === 'good')      return s >= 60 && s < 80;
      if (atsFilter === 'fair')      return s >= 40 && s < 60;
      if (atsFilter === 'low')       return s < 40;
      return true;
    })
    .filter((a) =>
      !search ||
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.jobTitle?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (b.atsScore ?? 0) - (a.atsScore ?? 0)); // Sort by ATS score desc

  // resumeUrl is now a Firebase Storage download URL (full https URL)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-[3px] border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading font-bold text-2xl text-navy-900">Candidates</h2>
        <p className="text-surface-500 text-sm mt-0.5">
          {apps.length} applications · Sorted by ATS score
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-200 text-sm outline-none focus:border-brand-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-surface-200 text-sm outline-none focus:border-brand-500 bg-white"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select
          value={atsFilter}
          onChange={(e) => setAtsFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-surface-200 text-sm outline-none focus:border-brand-500 bg-white"
        >
          <option value="">All ATS Scores</option>
          <option value="excellent">Excellent (80%+)</option>
          <option value="good">Good (60-79%)</option>
          <option value="fair">Fair (40-59%)</option>
          <option value="low">Low (&lt;40%)</option>
        </select>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-surface-200">
            <Users className="w-12 h-12 text-surface-300 mx-auto mb-3" />
            <p className="text-surface-500 font-medium">No candidates found</p>
            <p className="text-surface-400 text-sm mt-1">Applications will appear here when students apply to your jobs</p>
          </div>
        ) : filtered.map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl border border-surface-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {app.name?.[0]?.toUpperCase() || '?'}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name + ATS */}
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-heading font-semibold text-navy-900">{app.name || 'Unknown'}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[app.status] || 'bg-surface-100 text-surface-600'}`}>
                      {app.status || 'new'}
                    </span>
                    {app.atsScore !== undefined && <ATSBadge score={app.atsScore} />}
                  </div>

                  <p className="text-sm text-brand-500 font-medium mb-2">Applied for: {app.jobTitle || '—'}</p>

                  {/* Contact info */}
                  <div className="flex flex-wrap gap-4 text-xs text-surface-500">
                    {app.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{app.email}</span>}
                    {app.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{app.phone}</span>}
                    {app.experience && <span className="flex items-center gap-1"><Star className="w-3 h-3" />{app.experience} yrs exp</span>}
                    {app.createdAt && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{(app.createdAt?.toDate?.() || new Date(app.createdAt)).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>}
                  </div>

                  {/* ATS Progress Bar */}
                  {app.atsScore !== undefined && <ATSProgressBar score={app.atsScore} />}

                  {/* Cover letter preview */}
                  {app.message && (
                    <p className="text-sm text-surface-600 bg-surface-50 rounded-xl p-3 mt-3 line-clamp-2">{app.message}</p>
                  )}

                  {/* Action bar */}
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-600 font-medium bg-brand-50 px-3 py-2.5 rounded-lg transition-colors min-h-[44px]"
                      >
                        <FileText className="w-4 h-4" /> View Resume <Download className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <select
                      value={app.status}
                      disabled={updating === app.id}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className="px-3 py-2.5 rounded-lg border border-surface-200 text-xs outline-none focus:border-brand-500 bg-white cursor-pointer min-h-[44px]"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>

                    {app.atsBreakdown && (
                      <button
                        onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                        className="flex items-center gap-1 text-xs text-surface-500 hover:text-navy-700 cursor-pointer transition-colors ml-auto"
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        {expanded === app.id ? 'Hide' : 'View'} ATS Details
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded === app.id ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable ATS Breakdown */}
              <AnimatePresence>
                {expanded === app.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <ATSBreakdown app={app} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
