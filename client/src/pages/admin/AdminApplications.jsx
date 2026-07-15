import { useEffect, useState } from 'react';
import { FileText, Download, TrendingUp } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/ui/Loader';
import { getATSBadgeColor, getATSLabel } from '../../utils/atsScore';

const statuses = ['new', 'reviewing', 'shortlisted', 'interviewed', 'hired', 'rejected'];

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => {
    api.applications.list().then((res) => setApps(res.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.applications.updateStatus(id, status);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return;
    await api.applications.delete(id);
    load();
  };

  const filtered = filter ? apps.filter((a) => a.status === filter) : apps;

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-navy-900">Resume Submissions</h2>
          <p className="text-slate-500 text-sm">{apps.length} total resume{apps.length !== 1 ? 's' : ''} submitted</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-surface-200 text-sm outline-none focus:border-brand-500">
          <option value="">All Statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((app) => {
          const atsScore = app.atsScore ?? 0;
          const badgeColor = getATSBadgeColor(atsScore);
          const atsLabel = app.atsLabel || getATSLabel(atsScore);

          return (
            <div key={app.id} className="bg-white rounded-2xl border border-surface-200 p-4 sm:p-6 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold shrink-0">
                  {app.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                    <h3 className="font-heading font-semibold text-navy-900 break-words">{app.name}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 ${badgeColor}`}>
                      <TrendingUp className="w-3.5 h-3.5" />
                      {atsScore}%
                    </span>
                  </div>
                  <p className="text-sm text-brand-500">{app.jobTitle}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{atsLabel}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-slate-500">
                    <span className="break-all">{app.email}</span>
                    {app.phone && <span>{app.phone}</span>}
                    {app.experience && <span>{app.experience} experience</span>}
                    {app.skills && <span>{app.skills}</span>}
                  </div>
                  {app.message && <p className="text-sm text-slate-600 mt-2 line-clamp-2">{app.message}</p>}
                  {app.resumeUrl && (
                    <a
                      href={app.resumeUrl.startsWith('http') ? app.resumeUrl : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${app.resumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-sm text-brand-500 hover:text-brand-600 font-medium"
                    >
                      <FileText className="w-4 h-4" /> View Resume <Download className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
                  <select value={app.status} onChange={(e) => updateStatus(app.id, e.target.value)}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-surface-200 text-sm outline-none focus:border-brand-500">
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => handleDelete(app.id)} className="text-red-500 text-sm hover:underline cursor-pointer">Delete</button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-slate-500 py-12">No applications found.</p>
        )}
      </div>
    </div>
  );
}
