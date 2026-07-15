import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ResumeUploadForm from '../../components/careers/ResumeUploadForm';

export default function StudentDashboard() {
  const { user } = useAuth();

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
    || user?.name
    || '';

  return (
    <div className="max-w-2xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-2xl text-navy-900">
              Submit Your Resume
            </h2>
            <p className="text-slate-500 text-sm">
              Welcome, {user?.firstName || name.split(' ')[0] || 'Candidate'}
            </p>
          </div>
        </div>

        <p className="text-slate-500 text-sm mb-8">
          Fill in your details and upload your resume. Our team will review and contact you within 24 hours.
        </p>

        <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-4 sm:p-6 md:p-8">
          <ResumeUploadForm
            compact
            userId={user?.uid}
            initialData={{
              name,
              email: user?.email || '',
              phone: user?.phone || '',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
