import { useEffect, useState } from 'react';
import api from '../../services/api';
import Loader from '../../components/ui/Loader';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.contacts.list().then((res) => setContacts(res.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.contacts.updateStatus(id, status);
    load();
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-navy-900">Contact Inquiries</h2>
        <p className="text-slate-500 text-sm">{contacts.length} total inquiries</p>
      </div>

      <div className="space-y-4">
        {contacts.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-surface-200 p-6 shadow-card">
            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-heading font-semibold text-navy-900">{c.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    c.type === 'client' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                  }`}>{c.type}</span>
                </div>
                <p className="text-sm font-medium text-brand-500 mb-1">{c.subject}</p>
                <p className="text-sm text-slate-600 mb-3">{c.message}</p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                  <span>{c.email}</span>
                  {c.phone && <span>{c.phone}</span>}
                  {c.company && <span>{c.company}</span>}
                </div>
              </div>
              <select value={c.status} onChange={(e) => updateStatus(c.id, e.target.value)}
                className="px-3 py-2 rounded-xl border border-surface-200 text-sm outline-none shrink-0">
                <option value="new">new</option>
                <option value="contacted">contacted</option>
                <option value="resolved">resolved</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
