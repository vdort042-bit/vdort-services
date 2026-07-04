import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Mail, Bell, Building2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/dashboard/StatCard';
import Loader from '../../components/ui/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.analytics.overview(), api.analytics.recent()])
      .then(([overview, recentData]) => {
        setStats(overview.data);
        setRecent(recentData.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-heading font-bold text-2xl text-navy-900 mb-2">Overview</h2>
        <p className="text-slate-500">Welcome back! Here's what's happening at VDORT.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <StatCard icon={Briefcase} label="Active Jobs" value={stats?.activeJobs} color="brand" change={12} />
        <StatCard icon={Users} label="Total Applications" value={stats?.totalApplications} color="accent" change={8} />
        <StatCard icon={Mail} label="New Contacts" value={stats?.newContacts} color="green" />
        <StatCard icon={Bell} label="Subscribers" value={stats?.totalSubscribers} color="purple" />
        <StatCard icon={Building2} label="Clients" value={stats?.totalClients} color="orange" />
        <StatCard icon={TrendingUp} label="Placements" value={stats?.placements?.toLocaleString()} color="brand" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
            <h3 className="font-heading font-semibold text-navy-900">Recent Applications</h3>
            <Link to="/admin/applications" className="text-sm text-brand-500 hover:text-brand-600">View all</Link>
          </div>
          <div className="divide-y divide-surface-100">
            {recent?.applications?.map((app) => (
              <div key={app.id} className="px-6 py-4 flex items-center gap-4 hover:bg-surface-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-sm">
                  {app.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-navy-900 text-sm truncate">{app.name}</p>
                  <p className="text-xs text-slate-500 truncate">{app.jobTitle}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  app.status === 'new' ? 'bg-blue-50 text-blue-600' :
                  app.status === 'shortlisted' ? 'bg-green-50 text-green-600' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
            <h3 className="font-heading font-semibold text-navy-900">Recent Contacts</h3>
            <Link to="/admin/contacts" className="text-sm text-brand-500 hover:text-brand-600">View all</Link>
          </div>
          <div className="divide-y divide-surface-100">
            {recent?.contacts?.map((contact) => (
              <div key={contact.id} className="px-6 py-4 hover:bg-surface-50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-navy-900 text-sm">{contact.name}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    contact.status === 'new' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {contact.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{contact.subject}</p>
                <p className="text-xs text-slate-400 mt-1">{contact.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-6">
        <h3 className="font-heading font-semibold text-navy-900 mb-6">Monthly Placements Trend</h3>
        <div className="flex items-end gap-3 h-48">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
            const height = 40 + i * 15 + Math.random() * 20;
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-lg"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                />
                <span className="text-xs text-slate-500">{month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
