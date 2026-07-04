import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, Briefcase, Search, X, Upload, CheckCircle,
  FileText, TrendingUp, Star, AlertCircle, ChevronRight,
  DollarSign, Building2, Zap,
} from 'lucide-react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/firebase';
import { useAuth } from '../../context/AuthContext';
import { calculateATSScore, getATSLabel } from '../../utils/atsScore';

// ── ATS Score Visual ──────────────────────────────────────────────────────────
function ATSScoreRing({ score }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Low';
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-navy-900">{score}%</span>
        </div>
      </div>
      <span className="text-sm font-semibold mt-1" style={{ color }}>{label} Match</span>
    </div>
  );
}

function ATSBar({ label, score, max }) {
  const pct = Math.round((score / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-surface-600 font-medium">{label}</span>
        <span className="text-navy-700 font-semibold">{score}/{max}</span>
      </div>
      <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>
    </div>
  );
}

// ── Apply Modal ───────────────────────────────────────────────────────────────
function ApplyModal({ job, onClose, onSuccess }) {
  const { user } = useAuth();
  const [step, setStep] = useState('form'); // 'form' | 'result'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [atsResult, setAtsResult] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    experience: '',
    message: '',
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) {
      setError('Only PDF, DOC, or DOCX files allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB');
      return;
    }
    setError('');
    setResumeFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) { setError('Please upload your resume'); return; }
    setLoading(true);
    setError('');

    try {
      // 1. Try to upload resume to Firebase Storage (with 20s timeout)
      let resumeUrl = null;
      const resumeName = resumeFile.name;
      try {
        const ext = resumeFile.name.split('.').pop();
        const storageRef = ref(storage, `resumes/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`);

        const snapshot = await Promise.race([
          uploadBytes(storageRef, resumeFile),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Upload timeout — saving without resume link')), 20000)),
        ]);
        resumeUrl = await getDownloadURL(snapshot.ref);
      } catch (storageErr) {
        console.warn('Storage upload failed:', storageErr.message);
        // Non-fatal — application still saved, resume URL will be null
      }

      // 2. Compute ATS score client-side (pass job for accurate matching)
      const appData = { ...form, resumeUrl };
      const atsScore = calculateATSScore(appData, job);
      const atsLabel = getATSLabel(atsScore);

      // 3. Save application to Firestore
      const application = {
        jobId: job.id,
        jobTitle: job.title || '',
        company: job.company || 'VDORT',
        clientId: job.clientId || null,
        userId: user?.uid || user?.id || null,
        name: form.name,
        email: form.email,
        phone: form.phone || '',
        experience: form.experience || '',
        message: form.message || '',
        resumeUrl,
        resumeName,
        status: 'new',
        atsScore,
        atsLabel,
        matchedSkills: [],
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'applications'), application);

      setAtsResult({ score: atsScore, label: atsLabel, breakdown: null, matchedSkills: [], resumeUploaded: !!resumeUrl });
      setStep('result');
      onSuccess?.();
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-surface-200 text-navy-900 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20';

  return (
    <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-white w-full sm:rounded-3xl sm:max-w-2xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b border-surface-100 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="font-heading font-bold text-xl text-navy-900 truncate">{job.title}</h2>
            <p className="text-surface-500 text-sm mt-0.5">{job.company || 'VDORT'}</p>
            <div className="flex flex-wrap gap-3 mt-2">
              {job.location && <span className="flex items-center gap-1 text-xs text-surface-500"><MapPin className="w-3 h-3" />{job.location}</span>}
              {job.type && <span className="flex items-center gap-1 text-xs text-surface-500"><Clock className="w-3 h-3" />{job.type}</span>}
              {job.salary && <span className="flex items-center gap-1 text-xs text-green-600 font-medium"><DollarSign className="w-3 h-3" />{job.salary}</span>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-100 text-surface-400 cursor-pointer flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="p-6 space-y-5"
              >
                {/* Required Skills */}
                {job.skills?.length > 0 && (
                  <div className="bg-brand-50 rounded-2xl p-4">
                    <p className="text-xs font-semibold text-brand-700 mb-2 uppercase tracking-wide">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((s) => (
                        <span key={s} className="text-xs bg-white border border-brand-200 text-brand-700 px-2.5 py-1 rounded-full font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                  </div>
                )}

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-navy-700 mb-1.5">Full Name *</label>
                    <input type="text" required value={form.name} onChange={set('name')} placeholder="Your full name" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy-700 mb-1.5">Email *</label>
                    <input type="email" required value={form.email} onChange={set('email')} placeholder="your@email.com" className={inputCls} />
                  </div>
                </div>

                {/* Phone + Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-navy-700 mb-1.5">Phone</label>
                    <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 9999999999" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy-700 mb-1.5">Years of Experience *</label>
                    <input type="number" required min="0" max="50" value={form.experience} onChange={set('experience')} placeholder="e.g. 5" className={inputCls} />
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1.5">Cover Letter / Message</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Tell us why you're a great fit for this role. Mention your relevant skills and experience..."
                    className={`${inputCls} resize-none`}
                  />
                  <p className="text-xs text-surface-400 mt-1">{form.message.length} chars — longer cover letter improves ATS score</p>
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1.5">Resume * <span className="text-surface-400 font-normal">(PDF, DOC, DOCX — max 5MB)</span></label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      dragOver ? 'border-brand-500 bg-brand-50' :
                      resumeFile ? 'border-green-400 bg-green-50' :
                      'border-surface-300 hover:border-brand-400 hover:bg-surface-50'
                    }`}
                  >
                    <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                    {resumeFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-navy-900 text-sm">{resumeFile.name}</p>
                          <p className="text-xs text-surface-400">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-surface-300 mx-auto mb-2" />
                        <p className="text-sm font-medium text-navy-700">Drop your resume here or click to browse</p>
                        <p className="text-xs text-surface-400 mt-1">ATS score will be calculated from your resume</p>
                      </>
                    )}
                  </div>
                </div>

                {/* ATS Info */}
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    Your resume will be <strong>automatically scored against this job</strong> using ATS analysis. Higher score = better match for employer.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-400 text-white font-semibold hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing Resume & Submitting...</>
                  ) : (
                    <><Zap className="w-4 h-4" /> Submit Application with ATS Analysis</>
                  )}
                </button>
              </motion.form>
            ) : (
              /* ── ATS Result Screen ── */
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-9 h-9 text-green-500" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-navy-900 mb-1">Application Submitted!</h3>
                <p className="text-surface-500 text-sm mb-6">
                  {atsResult.resumeUploaded ? 'Your resume has been uploaded and sent to the employer.' : 'Your application has been submitted successfully.'}
                </p>

                {atsResult && (
                  <div className="bg-surface-50 rounded-2xl p-6 text-left space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-heading font-bold text-lg text-navy-900">Your ATS Score</h4>
                        <p className="text-surface-400 text-xs">Based on resume vs job requirements</p>
                      </div>
                      <ATSScoreRing score={atsResult.score} />
                    </div>

                    {/* Score tips */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-navy-700 uppercase tracking-wide">What affects your score</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-surface-600">
                        <div className="bg-white rounded-lg p-2.5 border border-surface-200">📄 Resume uploaded</div>
                        <div className="bg-white rounded-lg p-2.5 border border-surface-200">⭐ {form.experience} yrs experience</div>
                        <div className="bg-white rounded-lg p-2.5 border border-surface-200">✅ Profile complete</div>
                        <div className="bg-white rounded-lg p-2.5 border border-surface-200">💬 Cover letter: {form.message?.length > 50 ? 'Good' : 'Short'}</div>
                      </div>
                    </div>

                    {/* Matched Skills */}
                    {atsResult.matchedSkills?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-navy-700 uppercase tracking-wide mb-2">Skills Found in Resume</p>
                        <div className="flex flex-wrap gap-2">
                          {atsResult.matchedSkills.map((s) => (
                            <span key={s} className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                              <CheckCircle className="w-3 h-3" />{s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {atsResult.score < 60 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="text-amber-700 text-xs font-semibold mb-1">💡 Tips to Improve Your Score</p>
                        <ul className="text-amber-600 text-xs space-y-1 list-disc list-inside">
                          <li>Include the exact skill keywords from the job description in your resume</li>
                          <li>Mention your years of experience clearly (e.g., "5 years of experience")</li>
                          <li>Add a detailed cover letter with relevant skills</li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="mt-6 w-full py-3 rounded-2xl border border-surface-200 text-navy-700 font-medium hover:bg-surface-50 cursor-pointer transition-colors"
                >
                  Back to Jobs
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function StudentJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('appliedJobs') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Fetch directly from Firebase (same source as ClientJobs saves to)
        const q = query(
          collection(db, 'jobs'),
          where('status', '==', 'active')
        );
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Sort by createdAt or posted (client saves createdAt, seeded jobs have posted)
        list.sort((a, b) => {
          const aDate = new Date(a.createdAt?.toDate?.() || a.createdAt || a.posted || 0);
          const bDate = new Date(b.createdAt?.toDate?.() || b.createdAt || b.posted || 0);
          return bDate - aDate;
        });
        setJobs(list);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filtered = jobs.filter(
    (j) =>
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.toLowerCase().includes(search.toLowerCase()) ||
      j.location?.toLowerCase().includes(search.toLowerCase()) ||
      j.skills?.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  const handleApplied = (jobId) => {
    const updated = [...appliedJobs, jobId];
    setAppliedJobs(updated);
    localStorage.setItem('appliedJobs', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-heading font-bold text-2xl text-navy-900 mb-1">Browse Jobs</h2>
        <p className="text-surface-500 text-sm">Apply with your resume — get instant ATS score</p>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
        <input
          type="text"
          placeholder="Search by title, company, skill, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-surface-200 text-navy-900 placeholder:text-surface-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-[3px] border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto" />
          <p className="text-surface-500 mt-3 text-sm">Loading jobs...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-200">
          <Briefcase className="w-12 h-12 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500 font-medium">No jobs found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((job, i) => {
            const applied = appliedJobs.includes(job.id);
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-surface-200 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Company logo placeholder */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/10 to-accent-400/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-brand-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-heading font-semibold text-lg text-navy-900">{job.title}</h3>
                        <p className="text-sm text-surface-500">{job.company || 'VDORT'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                        job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-surface-100 text-surface-500'
                      }`}>
                        {job.status === 'active' ? 'Hiring' : job.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-surface-500">
                      {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>}
                      {job.type && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.type}</span>}
                      {job.experience && <span className="flex items-center gap-1"><Star className="w-3 h-3" />{job.experience}</span>}
                      {job.salary && <span className="flex items-center gap-1 text-green-600 font-medium"><DollarSign className="w-3 h-3" />{job.salary}</span>}
                    </div>

                    {/* Skills */}
                    {job.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.skills.slice(0, 5).map((s) => (
                          <span key={s} className="text-xs bg-surface-100 text-surface-600 px-2.5 py-1 rounded-full">{s}</span>
                        ))}
                        {job.skills.length > 5 && (
                          <span className="text-xs text-surface-400 px-2 py-1">+{job.skills.length - 5} more</span>
                        )}
                      </div>
                    )}

                    {/* Description preview */}
                    {job.description && (
                      <p className="text-sm text-surface-500 mt-3 line-clamp-2">{job.description}</p>
                    )}

                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() => !applied && setSelectedJob(job)}
                        disabled={applied}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                          applied
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : 'bg-gradient-to-r from-brand-500 to-accent-400 text-white hover:shadow-md hover:shadow-brand-500/25'
                        }`}
                      >
                        {applied ? (
                          <><CheckCircle className="w-4 h-4" /> Applied</>
                        ) : (
                          <>Apply Now <ChevronRight className="w-4 h-4" /></>
                        )}
                      </button>
                      {!applied && (
                        <span className="flex items-center gap-1 text-xs text-surface-400">
                          <TrendingUp className="w-3.5 h-3.5 text-brand-400" />
                          Get instant ATS score
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      <AnimatePresence>
        {selectedJob && (
          <ApplyModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onSuccess={() => handleApplied(selectedJob.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

