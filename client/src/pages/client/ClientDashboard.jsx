import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, CheckCircle, Clock, Plus, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const clientId = user?.uid || user?.id;
      if (!clientId) return;
      try {
        // Fetch client's jobs from Firestore
        const jobsRef = collection(db, 'jobs');
        const jobsQuery = query(jobsRef, where('clientId', '==', clientId));
        const jobsSnap = await getDocs(jobsQuery);
        const jobsList = jobsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setJobs(jobsList);

        // Fetch applications for client's jobs
        const appsRef = collection(db, 'applications');
        const appsQuery = query(appsRef, where('clientId', '==', clientId));
        const appsSnap = await getDocs(appsQuery);
        const appsList = appsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCandidates(appsList);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const activeJobs = jobs.filter((j) => j.status === 'active').length;
  const totalCandidates = candidates.length;
  const newApplications = candidates.filter((c) => c.status === 'new' || !c.status).length;
  const filledPositions = jobs.filter((j) => j.status === 'filled').length;

  const statCards = [
    { icon: Briefcase, label: 'Active Jobs', value: activeJobs, color: 'from-blue-500 to-cyan-500' },
    { icon: Users, label: 'Total Candidates', value: totalCandidates, color: 'from-purple-500 to-violet-500' },
    { icon: Clock, label: 'New Applications', value: newApplications, color: 'from-amber-500 to-orange-500' },
    { icon: CheckCircle, label: 'Filled Positions', value: filledPositions, color: 'from-green-500 to-emerald-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-[3px] border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-heading font-bold text-2xl text-navy-900 mb-1">
          Welcome, {user?.firstName || user?.name?.split(' ')[0] || 'Client'} 👋
        </h2>
        <p className="text-slate-500">Manage your hiring pipeline</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-surface-200 shadow-card p-6 hover:shadow-card-hover transition-all"
            whileHover={{ y: -2 }}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-heading font-bold text-navy-900 mb-1">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Jobs List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
            <h3 className="font-heading font-semibold text-navy-900">Your Open Positions</h3>
            <Link to="/client/jobs" className="text-sm text-brand-500 hover:text-brand-600">Manage</Link>
          </div>
          <div className="divide-y divide-surface-100">
            {jobs.slice(0, 5).map((job) => (
              <div key={job.id} className="px-6 py-4 hover:bg-surface-50">
                <p className="font-medium text-navy-900 text-sm">{job.title}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span>{job.location || 'Remote'}</span>
                  <span className={`px-2 py-0.5 rounded-full ${job.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                    {job.status || 'Active'}
                  </span>
                </div>
              </div>
            ))}
            {jobs.length === 0 && (
              <div className="px-6 py-8 text-center">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No jobs posted yet.</p>
                <Link to="/client/jobs" className="text-sm text-brand-500 hover:text-brand-600 mt-1 inline-block">Post your first job →</Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Candidates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
            <h3 className="font-heading font-semibold text-navy-900">Recent Candidates</h3>
            <Link to="/client/candidates" className="text-sm text-brand-500 hover:text-brand-600">View all</Link>
          </div>
          <div className="divide-y divide-surface-100">
            {candidates.slice(0, 5).map((app) => (
              <div key={app.id} className="px-6 py-4 flex items-center gap-4 hover:bg-surface-50">
                <div className="w-9 h-9 rounded-full bg-accent-400/10 flex items-center justify-center text-accent-500 font-bold text-sm">
                  {app.name?.[0] || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-navy-900 text-sm truncate">{app.name || 'Unknown'}</p>
                  <p className="text-xs text-slate-500 truncate">{app.jobTitle || '-'}</p>
                </div>
                <span className="text-xs text-slate-500 capitalize">{app.status || 'New'}</span>
              </div>
            ))}
            {candidates.length === 0 && (
              <div className="px-6 py-8 text-center">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No applications yet.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl border border-surface-200 shadow-card p-6"
      >
        <h3 className="font-heading font-semibold text-navy-900 mb-4">Your Profile</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
            <span className="text-sm text-slate-500">Name:</span>
            <span className="text-sm font-medium text-navy-900">{user?.name || '-'}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
            <span className="text-sm text-slate-500">Email:</span>
            <span className="text-sm font-medium text-navy-900">{user?.email || '-'}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
            <span className="text-sm text-slate-500">Phone:</span>
            <span className="text-sm font-medium text-navy-900">{user?.phone || '-'}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
            <span className="text-sm text-slate-500">Role:</span>
            <span className="text-sm font-medium text-navy-900 capitalize">{user?.role || '-'}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
