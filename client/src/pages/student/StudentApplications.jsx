import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../context/AuthContext';

export default function StudentApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.uid) return;
      try {
        const appsRef = collection(db, 'applications');
        const q = query(appsRef, where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const appsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setApplications(appsList);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user]);

  const getStatusIcon = (status) => {
    if (['hired', 'shortlisted'].includes(status)) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'rejected') return <XCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-amber-500" />;
  };

  const getStatusStyle = (status) => {
    if (['hired', 'shortlisted'].includes(status)) return 'bg-green-50 text-green-600';
    if (status === 'rejected') return 'bg-red-50 text-red-600';
    if (status === 'interviewed') return 'bg-blue-50 text-blue-600';
    return 'bg-amber-50 text-amber-600';
  };

  const getStatusLabel = (status) => {
    const map = { new: 'Applied', reviewing: 'Under Review', shortlisted: 'Shortlisted', interviewed: 'Interviewed', hired: 'Hired', rejected: 'Rejected' };
    return map[status] || status || 'Applied';
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-heading font-bold text-2xl text-navy-900 mb-1">My Applications</h2>
        <p className="text-slate-500">Track the status of your job applications</p>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-[3px] border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 mt-3">Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl border border-surface-200"
        >
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No applications yet</p>
          <p className="text-slate-400 text-sm mt-1">Browse jobs and start applying!</p>
        </motion.div>
      ) : (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-100">
                  <th className="text-left px-6 py-4 font-semibold text-navy-900">Job Title</th>
                  <th className="text-left px-6 py-4 font-semibold text-navy-900">Company</th>
                  <th className="text-left px-6 py-4 font-semibold text-navy-900">Applied Date</th>
                  <th className="text-left px-6 py-4 font-semibold text-navy-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, i) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-surface-100 hover:bg-surface-50"
                  >
                    <td className="px-6 py-4 font-medium text-navy-900">{app.jobTitle || '-'}</td>
                    <td className="px-6 py-4 text-slate-500">{app.company || 'VDORT'}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {app.createdAt?.toDate?.()
                        ? app.createdAt.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                        : app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {getStatusLabel(app.status)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
