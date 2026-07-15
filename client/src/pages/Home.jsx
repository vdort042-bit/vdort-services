import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle, Users, Briefcase, Globe,
  FileText, Megaphone, MessageSquare, BookOpen, Rocket, BadgeCheck,
  ChevronDown, ChevronUp, Sparkles, TrendingUp, Award, Clock
} from 'lucide-react';
import { useState } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import TestimonialCarousel from '../components/ui/TestimonialCarousel';
import { testimonials } from '../data/testimonials';

/* ─── Data ─────────────────────────────── */

const stats = [
  { value: '2,400+', label: 'Placements Done', icon: TrendingUp, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50' },
  { value: '98%', label: 'Satisfaction Rate', icon: Award, color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50' },
  { value: '11 Days', label: 'Avg. Placement', icon: Clock, color: 'from-orange-500 to-amber-500', bg: 'bg-orange-50' },
  { value: '25+', label: 'Countries Served', icon: Globe, color: 'from-brand-500 to-cyan-500', bg: 'bg-blue-50' },
];

const services = [
  { icon: FileText, title: 'Resume Optimization', desc: 'ATS-friendly resumes crafted by experts to get noticed by top recruiters.', grad: 'from-blue-500 to-cyan-500', light: 'bg-blue-50 text-blue-600' },
  { icon: Sparkles, title: 'LinkedIn Branding', desc: 'Powerful profile that attracts hiring managers and showcases your potential.', grad: 'from-violet-500 to-purple-600', light: 'bg-violet-50 text-violet-600' },
  { icon: MessageSquare, title: 'Interview Coaching', desc: 'Mock interviews, behavioral prep, and technical coaching for confidence.', grad: 'from-emerald-500 to-teal-500', light: 'bg-emerald-50 text-emerald-600' },
  { icon: Megaphone, title: 'Career Marketing', desc: 'Your profile marketed across LinkedIn, Dice, Monster, Indeed & more.', grad: 'from-orange-500 to-amber-500', light: 'bg-orange-50 text-orange-600' },
  { icon: BookOpen, title: 'Technical Training', desc: 'Domain-specific training to close skill gaps before your interviews.', grad: 'from-pink-500 to-rose-500', light: 'bg-pink-50 text-pink-600' },
  { icon: Rocket, title: 'Job Placement', desc: 'Direct connections with hiring managers at top companies across US & India.', grad: 'from-brand-500 to-indigo-600', light: 'bg-brand-50 text-brand-600' },
];

const process = [
  { num: '01', emoji: '📄', title: 'Submit Resume', desc: 'Upload your resume in less than 2 minutes.' },
  { num: '02', emoji: '🤝', title: 'Free Counselling', desc: 'We review your profile & schedule a consultation.' },
  { num: '03', emoji: '✍️', title: 'Resume Building', desc: 'ATS-optimized resume for your target roles.' },
  { num: '04', emoji: '💡', title: 'Technical Training', desc: 'Preparation sessions to make you interview-ready.' },
  { num: '05', emoji: '📣', title: 'Profile Marketing', desc: 'We actively market you to relevant recruiters.' },
  { num: '06', emoji: '🎯', title: 'Interview Prep', desc: 'Mock interviews and company-specific coaching.' },
  { num: '07', emoji: '🎉', title: 'Offer & Onboarding', desc: 'Guidance through offer, negotiation & joining.' },
  { num: '08', emoji: '⭐', title: 'Post-Placement', desc: 'Ongoing support & career advice after joining.' },
];

const candidates = [
  { emoji: '🎓', title: 'Recent Graduates', desc: 'Break into IT with your first dream placement in US or India.', grad: 'from-violet-500 to-purple-600' },
  { emoji: '🚀', title: 'Career Seekers', desc: 'Upgrade to better roles and higher packages.', grad: 'from-orange-500 to-pink-500' },
  { emoji: '🔄', title: 'Career Changers', desc: 'Switch domains with our tailored bridge programs.', grad: 'from-emerald-500 to-cyan-500' },
];

const faqs = [
  { q: 'What is VDORT Services?', a: 'VDORT is your personalized IT staffing partner. We help candidates land their dream IT jobs through resume optimization, technical training, profile marketing, and direct placement services.' },
  { q: 'What makes VDORT different from other agencies?', a: 'We provide end-to-end career support — from resume building to post-placement guidance. Our personalized approach and deep recruiter network ensure you get the right opportunity, not just any job.' },
  { q: 'How do I get started?', a: 'Simply login and submit your resume through our Careers page. Our team will reach out within 24 hours to schedule a free consultation and discuss your goals.' },
  { q: 'Are there any upfront costs?', a: 'We offer a free initial consultation. Our service packages are transparent and explained upfront so you can make an informed decision.' },
  { q: 'How quickly can I get placed?', a: 'Our average placement time is 11 days, though it varies based on your profile. We work as fast as possible to connect you with the right opportunity.' },
  { q: 'Do you work with freshers too?', a: 'Absolutely. We work with recent graduates, experienced professionals, and career changers. We have programs designed for every stage of your career.' },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${open ? 'border-brand-300 shadow-md shadow-brand-500/10' : 'border-gray-200 bg-white'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left cursor-pointer"
      >
        <span className={`font-semibold text-sm sm:text-base transition-colors ${open ? 'text-brand-600' : 'text-navy-900'}`}>{q}</span>
        <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${open ? 'bg-brand-500 text-white rotate-180' : 'bg-gray-100 text-slate-400'}`}>
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-5 pb-5"
        >
          <p className="text-slate-500 text-sm leading-relaxed">{a}</p>
        </motion.div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-brand-500 to-violet-600" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* Left — Text */}
            <div>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full border border-white/30 mb-6"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-xs sm:text-sm font-semibold">#1 IT Staffing Partner — India &amp; US</span>
              </motion.div>

              <motion.h1
                className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-white mb-5 leading-tight"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              >
                We Help You<br />
                Find Your<br />
                <span className="text-yellow-300 drop-shadow-lg">Dream IT Job ✨</span>
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg text-indigo-100 mb-8 max-w-md"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              >
                Personalized career support — resume building, interview coaching, and direct job placement across US &amp; India.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-2 mb-8"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              >
                {['✅ Free Consultation', '🚫 No Upfront Cost', '⚡ 24hr Response', '🏆 2,400+ Placed'].map((t) => (
                  <span key={t} className="text-xs text-white/90 bg-white/15 border border-white/20 rounded-full px-3 py-1.5 font-medium">
                    {t}
                  </span>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-brand-600 rounded-xl font-bold hover:bg-yellow-50 transition-all shadow-xl shadow-black/20 text-sm sm:text-base"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>

            {/* Right — Logo */}
            <motion.div
              className="flex items-center justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25, duration: 0.6, ease: 'easeOut' }}
            >
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-3xl bg-white/10 blur-2xl scale-110" />
                <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <img
                    src="/logo.png"
                    alt="VDORT Services"
                    className="w-64 sm:w-80 h-auto object-contain drop-shadow-2xl"
                  />
                </div>
                {/* Floating badge 1 */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-2"
                  animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                >
                  <span className="text-xl">🏆</span>
                  <div>
                    <p className="text-xs font-bold text-navy-900">2,400+</p>
                    <p className="text-xs text-slate-500">Hired</p>
                  </div>
                </motion.div>
                {/* Floating badge 2 */}
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-2"
                  animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                >
                  <span className="text-xl">⭐</span>
                  <div>
                    <p className="text-xs font-bold text-navy-900">98%</p>
                    <p className="text-xs text-slate-500">Satisfaction</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>

        <div className="h-14 bg-gradient-to-b from-transparent to-gray-50" />
      </section>

      {/* ── Stats ── */}
      <section className="bg-gray-50 pb-16 pt-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 0.08}>
                <div className={`${s.bg} rounded-2xl p-5 text-center border border-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-3 shadow-md`}>
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-heading font-bold text-navy-900">{s.value}</p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{s.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4">Our Services</span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-navy-900 mb-3">
              Everything You Need to<br className="hidden sm:block" /> Land Your Dream Job
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">End-to-end career support — from your first resume to your first day at work.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-default"
                >
                  {/* Hover gradient bg */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.grad} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.grad} flex items-center justify-center mb-4 shadow-lg`}>
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-navy-900 mb-2 text-base">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services" className="inline-flex items-center gap-2 text-brand-600 font-semibold text-sm hover:text-brand-700 transition-colors group">
              View All Services <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-brand-600 to-violet-600" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-white/30">Our Proven Process</span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-3">
              Your Path to the Dream Job
            </h2>
            <p className="text-indigo-200 max-w-xl mx-auto">8 steps proven to work for 2,400+ IT professionals.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {process.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 0.06}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:bg-white/20 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{step.emoji}</span>
                    <span className="text-white/50 font-bold text-xs">{step.num}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-white text-sm mb-2">{step.title}</h3>
                  <p className="text-xs text-indigo-200 leading-relaxed">{step.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <span className="inline-block px-3 py-1 bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4">Who Are We?</span>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-navy-900 mb-5 leading-tight">
                Your Trusted<br />IT Career Partner 🤝
              </h2>
              <p className="text-slate-500 leading-relaxed mb-4">
                VDORT Services is a dedicated team of experts helping individuals navigate the competitive job market and secure significant career opportunities.
              </p>
              <p className="text-slate-500 leading-relaxed mb-7">
                Whether you're a fresh graduate, a professional seeking better roles, or someone changing careers — we provide unmatched support at every step.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 transition-colors text-sm group">
                Learn More About Us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Users, title: 'Personalized Approach', desc: 'Tailored to your unique skills and career goals.', color: 'bg-violet-50 text-violet-600', border: 'border-violet-100' },
                  { icon: BadgeCheck, title: 'Expert Network', desc: 'Deep recruiter connections in IT hiring.', color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
                  { icon: Briefcase, title: 'We Do the Work', desc: 'Job search handled — you focus on prep.', color: 'bg-orange-50 text-orange-600', border: 'border-orange-100' },
                  { icon: Globe, title: 'US & India', desc: 'Opportunities in both markets.', color: 'bg-brand-50 text-brand-600', border: 'border-brand-100' },
                ].map((item) => (
                  <div key={item.title} className={`rounded-2xl border ${item.border} p-5 hover:shadow-md transition-all`}>
                    <div className={`w-10 h-10 rounded-xl ${item.color} bg-opacity-50 flex items-center justify-center mb-3`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading font-bold text-navy-900 text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Who Can Apply ── */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4">Who Can Apply</span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-navy-900 mb-3">VDORT is For Everyone in IT</h2>
            <p className="text-slate-500 max-w-xl mx-auto">No matter where you are in your career — we've got a path for you.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {candidates.map((c, i) => (
              <ScrollReveal key={c.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className={`bg-gradient-to-br ${c.grad} p-6 text-center`}>
                    <div className="text-5xl mb-4 drop-shadow-lg">{c.emoji}</div>
                    <h3 className="font-heading font-bold text-white text-lg mb-2">{c.title}</h3>
                    <p className="text-sm text-white/80 leading-relaxed">{c.desc}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4">⭐ Success Stories</span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-navy-900">
              Hear from Our Candidates
            </h2>
          </div>
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4">FAQ</span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-navy-900">Got Questions? We Have Answers.</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-brand-500 to-indigo-600" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-5xl mb-6">🚀</div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-4">
            Ready to Start Your IT Career Journey?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
            Join thousands of professionals who trusted VDORT Services to land their dream IT job.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 rounded-xl font-bold hover:bg-yellow-50 transition-all shadow-xl shadow-black/20 min-h-[52px]"
          >
            Get Started — Login <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
