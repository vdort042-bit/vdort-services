import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, ArrowRight, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import Button from '../ui/Button';

const ACCEPTED = '.pdf,.doc,.docx';
const MAX_SIZE_MB = 5;

export default function ResumeUploadForm({ job = null, onSuccess, compact = false }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', experience: '', skills: '', message: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext)) {
      setError('Only PDF, DOC, and DOCX files are allowed');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File size must be under ${MAX_SIZE_MB}MB`);
      return;
    }
    setError('');
    setResumeFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setError('Please upload your resume');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      if (job?.id) formData.append('jobId', job.id);
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('experience', form.experience);
      formData.append('message', [form.skills && `Skills: ${form.skills}`, form.message].filter(Boolean).join('\n'));
      formData.append('resume', resumeFile);

      await api.applications.submit(formData);
      setSubmitted(true);
      onSuccess?.();
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: '', email: '', phone: '', experience: '', skills: '', message: '' });
        setResumeFile(null);
      }, 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div className="text-center py-10" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="font-heading font-bold text-lg text-navy-900 mb-2">Resume Submitted Successfully!</h3>
        <p className="text-slate-500 text-sm">Our team will review your profile and match you with the best opportunities.</p>
      </motion.div>
    );
  }

  const inputClass = compact
    ? 'w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm'
    : 'w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-surface-300/50 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {job && (
        <p className={`text-sm font-medium ${compact ? 'text-brand-500' : 'text-brand-300'}`}>
          Applying for: {job.title}
        </p>
      )}

      <div className={`grid ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
        <input type="text" placeholder="Full Name *" required value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className={inputClass}
        />
        <input type="email" placeholder="Email Address *" required value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className={inputClass}
        />
        <input type="tel" placeholder="Phone Number" value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className={inputClass}
        />
        <input type="text" placeholder="Years of Experience *" required value={form.experience}
          onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
          className={inputClass}
        />
      </div>

      <input type="text" placeholder="Key Skills (e.g. React, Python, AWS)" value={form.skills}
        onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
        className={inputClass}
      />

      <textarea placeholder="Cover Letter / Additional Message" rows={3} value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        className={`${inputClass} resize-none`}
      />

      {/* Resume Upload */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
          dragOver
            ? 'border-brand-400 bg-brand-500/10'
            : compact
              ? 'border-surface-200 hover:border-brand-400 bg-surface-50'
              : 'border-white/20 hover:border-brand-400 bg-white/5'
        }`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input ref={fileRef} type="file" accept={ACCEPTED} className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {resumeFile ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className={`w-8 h-8 ${compact ? 'text-brand-500' : 'text-brand-400'}`} />
            <div className="text-left">
              <p className={`font-medium text-sm ${compact ? 'text-navy-900' : 'text-white'}`}>{resumeFile.name}</p>
              <p className={`text-xs ${compact ? 'text-slate-500' : 'text-surface-300'}`}>
                {(resumeFile.size / 1024).toFixed(0)} KB — Click to change
              </p>
            </div>
            <button type="button" onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload className={`w-10 h-10 mx-auto mb-3 ${compact ? 'text-slate-400' : 'text-brand-400'}`} />
            <p className={`font-medium text-sm mb-1 ${compact ? 'text-navy-900' : 'text-white'}`}>
              Upload Your Resume *
            </p>
            <p className={`text-xs ${compact ? 'text-slate-500' : 'text-surface-300'}`}>
              Drag & drop or click to browse — PDF, DOC, DOCX (max {MAX_SIZE_MB}MB)
            </p>
          </>
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <Button type="submit" variant="primary" size="lg" className="w-full" iconRight={ArrowRight} disabled={submitting}>
        {submitting ? 'Uploading...' : job ? 'Submit Application' : 'Upload Resume & Register'}
      </Button>
    </form>
  );
}
