import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, Clock, DollarSign, Upload, ArrowRight, X, ChevronDown, UserPlus } from 'lucide-react';
import api from '../services/api';
import ScrollReveal from '../components/ui/ScrollReveal';
import Button from '../components/ui/Button';
import ParticleBackground from '../components/ui/ParticleBackground';
import Loader from '../components/ui/Loader';
import ResumeUploadForm from '../components/careers/ResumeUploadForm';

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [showApplication, setShowApplication] = useState(null);

  useEffect(() => {
    api.jobs.list()
      .then((res) => setJobs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = !search ||
        job.title?.toLowerCase().includes(search.toLowerCase()) ||
        job.skills?.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
        job.location?.toLowerCase().includes(search.toLowerCase());
      const matchesType = !typeFilter || job.type === typeFilter;
      const matchesIndustry = !industryFilter || job.industry === industryFilter;
      return matchesSearch && matchesType && matchesIndustry;
    });
  }, [jobs, search, typeFilter, industryFilter]);

  const uniqueTypes = [...new Set(jobs.map(j => j.type))];
  const uniqueIndustries = [...new Set(jobs.map(j => j.industry))];

  if (loading) return <Loader fullScreen />;

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center gradient-hero overflow-hidden">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-transparent to-navy-950/80" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.h1
            className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Shape Your <span className="gradient-text">Future</span>
          </motion.h1>
          <motion.p
            className="text-lg text-surface-300 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Discover exceptional career opportunities at leading companies worldwide. Your dream role is just a click away.
          </motion.p>

          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-elevated overflow-hidden">
              <div className="flex-1 flex items-center gap-3 px-5">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by role, skill, or location..."
                  className="w-full py-4 outline-none text-navy-900 placeholder:text-slate-400"
                />
              </div>
              <button className="px-8 py-4 sm:py-0 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold hover:from-brand-500 hover:to-brand-400 transition-all cursor-pointer min-h-[52px]">
                Search
              </button>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-50 to-transparent" />
      </section>

      {/* Candidate Registration & Resume Upload — unified hire section */}
      <section id="register" className="section-padding bg-white -mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-8 md:p-12 border border-navy-700 relative overflow-hidden shadow-elevated">
              <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-400/10 rounded-full blur-3xl" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-brand-400" />
                  </div>
                  <span className="text-brand-400 text-sm font-semibold uppercase tracking-widest">Join VDORT Talent Network</span>
                </div>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-white mb-3">
                  Upload Your Resume & Get Hired
                </h2>
                <p className="text-surface-300 mb-8 max-w-xl">
                  Register as a candidate in one step. Upload your resume and our AI will match you with top companies worldwide — even if you don't see your dream role listed below.
                </p>

                <ResumeUploadForm />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="section-padding bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-3xl text-navy-900 mb-3">Current Openings</h2>
            <p className="text-slate-500">Browse open positions and apply directly with your resume</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-surface-200 bg-white text-sm font-medium text-navy-900 cursor-pointer focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
              >
                <option value="">All Types</option>
                {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-surface-200 bg-white text-sm font-medium text-navy-900 cursor-pointer focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
              >
                <option value="">All Industries</option>
                {uniqueIndustries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {(typeFilter || industryFilter || search) && (
              <button
                onClick={() => { setTypeFilter(''); setIndustryFilter(''); setSearch(''); }}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-brand-500 hover:bg-brand-50 transition-colors cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Clear Filters
              </button>
            )}

            <span className="ml-auto text-sm text-slate-500 self-center">
              {filteredJobs.length} position{filteredJobs.length !== 1 && 's'} found
            </span>
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-white rounded-2xl border border-surface-200 p-6 md:p-8 shadow-card hover:shadow-card-hover hover:border-brand-200 transition-all duration-300 group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-heading font-bold shrink-0">
                          {job.title[0]}
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-lg text-navy-900 group-hover:text-brand-600 transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-slate-500 text-sm">{job.company}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mb-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{job.type}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.experience}</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{job.salary}</span>
                      </div>

                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex flex-wrap gap-1.5">
                        {(job.skills || []).map(skill => (
                          <span key={skill} className="px-2.5 py-1 rounded-lg bg-brand-50 text-brand-600 text-xs font-medium border border-brand-100">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-3 shrink-0">
                      <Button variant="primary" size="sm" iconRight={ArrowRight} onClick={() => setShowApplication(job)}>
                        Apply with Resume
                      </Button>
                      <span className="text-xs text-slate-400 text-center">{job.posted}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredJobs.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-heading font-bold text-xl text-navy-900 mb-2">No positions found</h3>
                <p className="text-slate-500 mb-6">Try adjusting your search or upload your resume above.</p>
                <a href="#register">
                  <Button variant="primary" icon={Upload}>Upload Resume</Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {showApplication && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowApplication(null)}
          >
            <motion.div
              className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-elevated p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-heading font-bold text-xl text-navy-900">Apply for Position</h2>
                  <p className="text-brand-500 font-medium text-sm">{showApplication.title}</p>
                </div>
                <button onClick={() => setShowApplication(null)} className="p-2 hover:bg-surface-100 rounded-lg transition-colors cursor-pointer">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <ResumeUploadForm
                job={showApplication}
                compact
                onSuccess={() => setTimeout(() => setShowApplication(null), 3500)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
