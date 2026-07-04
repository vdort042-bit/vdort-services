import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, FileText, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.uid) return;
      try {
        const appsRef = collection(db, 'applications');
        const q = query(appsRef, where('userId', '==', user.uid));
        const snapshot = await getDocs(q);

        let pending = 0, accepted = 0, rejected = 0;
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (['hired', 'shortlisted'].includes(data.status)) accepted++;
          else if (data.status === 'rejected') rejected++;
          else pending++;
        });

        setStats({
          totalApplications: snapshot.size,
          pending,
          accepted,
          rejected,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, [user]);

  const statCards = [
    { icon: FileText, label: 'Total Applications', value: stats.totalApplications, color: 'from-blue-500 to-cyan-500' },
    { icon: Clock, label: 'Pending', value: stats.pending, color: 'from-amber-500 to-orange-500' },
    { icon: CheckCircle, label: 'Accepted', value: stats.accepted, color: 'from-green-500 to-emerald-500' },
    { icon: Briefcase, label: 'Rejected', value: stats.rejected, color: 'from-red-500 to-pink-500' },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-heading font-bold text-2xl text-navy-900 mb-1">
          Welcome, {user?.firstName || user?.name?.split(' ')[0] || 'Student'} 👋
        </h2>
        <p className="text-slate-500">Track your job applications and find new opportunities</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-surface-200 shadow-card p-6"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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
