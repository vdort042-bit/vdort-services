import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export default function StudentProfile() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    setSaving(true);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      // Also update in students collection
      try {
        await updateDoc(doc(db, 'students', user.uid), {
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          phone: formData.phone,
        });
      } catch {
        // students doc might not exist
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-white border border-surface-200 text-navy-900 placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-sm';

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-heading font-bold text-2xl text-navy-900 mb-1">My Profile</h2>
        <p className="text-slate-500">Update your personal information</p>
      </motion.div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Profile updated successfully!
        </motion.div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSave}
        className="bg-white rounded-2xl border border-surface-200 shadow-card p-6 space-y-4"
      >
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Middle Name</label>
            <input
              name="middleName"
              type="text"
              value={formData.middleName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Last Name</label>
            <input
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              name="email"
              type="email"
              value={formData.email}
              disabled
              className={`${inputClass} pl-9 bg-surface-50 text-slate-400 cursor-not-allowed`}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </motion.form>
    </div>
  );
}
