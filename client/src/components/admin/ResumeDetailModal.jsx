import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, Mail, Phone, Briefcase, MessageSquare, TrendingUp } from 'lucide-react';
import { getATSBadgeColor, getATSLabel } from '../../utils/atsScore';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const statusColors = {
  new: 'bg-blue-50 text-blue-600',
  reviewing: 'bg-amber-50 text-amber-600',
  shortlisted: 'bg-green-50 text-green-600',
  interviewed: 'bg-purple-50 text-purple-600',
  hired: 'bg-emerald-50 text-emerald-600',
  rejected: 'bg-red-50 text-red-600',
};

export default function ResumeDetailModal({ app, onClose, onStatusChange, statuses }) {
  if (!app) return null;

  const atsScore = app.atsScore ?? 0;
  const badgeColor = getATSBadgeColor(atsScore);
  const atsLabel = app.atsLabel || getATSLabel(atsScore);
  const resumeHref = app.resumeUrl
    ? (app.resumeUrl.startsWith('http') ? app.resumeUrl : `${API_BASE}${app.resumeUrl}`)
    : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
        >
          <div className="sticky top-0 bg-white border-b border-surface-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold">
                {app.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <h2 className="font-heading font-bold text-navy-900">{app.name}</h2>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColors[app.status] || 'bg-slate-100 text-slate-600'}`}>
                  {app.status}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-100 cursor-pointer">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${badgeColor}`}>
              <TrendingUp className="w-4 h-4" />
              ATS Score: {atsScore}% — {atsLabel}
            </div>

            <div className="grid gap-3">
              {[
                { icon: Mail, label: 'Email', value: app.email },
                { icon: Phone, label: 'Phone', value: app.phone },
                { icon: Briefcase, label: 'Experience', value: app.experience },
                { icon: Briefcase, label: 'Skills', value: app.skills },
              ].map(({ icon: Icon, label, value }) => value ? (
                <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-surface-50">
                  <Icon className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">{label}</p>
                    <p className="text-sm text-navy-900">{value}</p>
                  </div>
                </div>
              ) : null)}
            </div>

            {app.message && (
              <div className="p-3 rounded-xl bg-surface-50">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-4 h-4 text-brand-500" />
                  <p className="text-xs text-slate-500 font-medium">Message</p>
                </div>
                <p className="text-sm text-navy-900 whitespace-pre-wrap">{app.message}</p>
              </div>
            )}

            {resumeHref && (
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors"
              >
                <FileText className="w-5 h-5" />
                View / Download Resume
                <Download className="w-4 h-4" />
              </a>
            )}

            {onStatusChange && statuses && (
              <div>
                <label className="text-xs text-slate-500 font-medium mb-1.5 block">Update Status</label>
                <select
                  value={app.status}
                  onChange={(e) => onStatusChange(app.id, e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm outline-none focus:border-brand-500"
                >
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            <p className="text-xs text-slate-400 text-center">
              Submitted {app.createdAt ? new Date(app.createdAt).toLocaleString('en-IN') : '—'}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
