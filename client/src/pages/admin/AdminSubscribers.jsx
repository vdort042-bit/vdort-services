import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/ui/Loader';

export default function AdminSubscribers() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.subscribers.list().then((res) => setSubs(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    await api.subscribers.delete(id);
    setSubs((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-navy-900">Newsletter Subscribers</h2>
        <p className="text-slate-500 text-sm">{subs.length} subscribers</p>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-50 border-b border-surface-200">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-navy-900">Email</th>
              <th className="text-left px-6 py-4 font-semibold text-navy-900">Subscribed</th>
              <th className="text-right px-6 py-4 font-semibold text-navy-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {subs.map((s) => (
              <tr key={s.id} className="hover:bg-surface-50">
                <td className="px-6 py-4 text-navy-900">{s.email}</td>
                <td className="px-6 py-4 text-slate-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(s.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
