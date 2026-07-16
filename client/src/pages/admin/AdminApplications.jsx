import { useEffect, useState } from 'react';
import { Download, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/ui/Loader';
import { getApiOrigin } from '../../config/apiConfig';
import { downloadResume } from '../../utils/downloadResume';
import { getResumeViewUrl, getResumeDownloadLabel } from '../../utils/resumeUrl';

const statuses = ['new', 'reviewing', 'shortlisted', 'interviewed', 'hired', 'rejected'];

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

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

  const handleDownload = async (app) => {
    setDownloadingId(app.id);
    try {
      await downloadResume(app.id);
    } catch (err) {
      alert(err.message || 'Download failed');
    } finally {
      setDownloadingId(null);
    }
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
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-surface-200 text-sm outline-none focus:border-brand-500">
          <option value="">All Statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl border border-surface-200 p-4 sm:p-6 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold shrink-0">
                  {app.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                    <h3 className="font-heading font-semibold text-navy-900 break-words">{app.name}</h3>
                  </div>
                  <p className="text-sm text-brand-500">{app.jobTitle}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-slate-500">
                    <span className="break-all">{app.email}</span>
                    {app.phone && <span>{app.phone}</span>}
                    {app.experience && <span>{app.experience} experience</span>}
                    {app.skills && <span>{app.skills}</span>}
                  </div>
                  {app.message && <p className="text-sm text-slate-600 mt-2 line-clamp-2">{app.message}</p>}
                  {app.resumeUrl && (
                    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-3 mt-3">
                      <a
                        href={getResumeViewUrl(app.resumeUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-600 font-medium min-h-[44px]"
                      >
                        <ExternalLink className="w-4 h-4" /> View Resume
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDownload(app)}
                        disabled={downloadingId === app.id}
                        className="inline-flex items-center gap-1.5 text-sm text-navy-900 hover:text-brand-600 font-medium disabled:opacity-50 cursor-pointer min-h-[44px]"
                      >
                        <Download className="w-4 h-4" />
                        {downloadingId === app.id ? 'Downloading...' : getResumeDownloadLabel(app.resumeUrl)}
                      </button>
                    </div>
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
          ))}
        {filtered.length === 0 && (
          <p className="text-center text-slate-500 py-12">No applications found.</p>
        )}
      </div>
    </div>
  );
}
