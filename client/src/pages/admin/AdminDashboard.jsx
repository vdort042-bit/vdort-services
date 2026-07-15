import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/dashboard/StatCard';
import Loader from '../../components/ui/Loader';
import MonthlyResumeChart from '../../components/admin/MonthlyResumeChart';
import RegisteredCandidatesModal from '../../components/admin/RegisteredCandidatesModal';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCandidates, setShowCandidates] = useState(false);

  useEffect(() => {
    api.analytics.overview()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-heading font-bold text-xl sm:text-2xl text-navy-900 mb-2">Dashboard</h2>
        <p className="text-slate-500">Welcome back! Here's your latest data overview.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-5">
        <StatCard icon={FileText} label="Resume Submissions" value={stats?.totalApplications} color="brand" change={8} onClick={() => navigate('/admin/applications')} />
        <StatCard icon={Users} label="Registered Candidates" value={stats?.totalStudents} color="accent" onClick={() => setShowCandidates(true)} />
      </div>

      <MonthlyResumeChart />

      <RegisteredCandidatesModal open={showCandidates} onClose={() => setShowCandidates(false)} />
    </div>
  );
}
