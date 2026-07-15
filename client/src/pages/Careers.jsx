import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Star, BookOpen, FileText, Megaphone, MessageSquare, Rocket, BadgeCheck, ArrowRight } from 'lucide-react';
import ScrollReveal from '../components/ui/ScrollReveal';
import SectionHeading from '../components/ui/SectionHeading';

const services = [
  {
    icon: FileText,
    title: 'Resume Optimization',
    desc: 'Our experts craft ATS-friendly resumes that get noticed by top recruiters at Fortune 500 companies.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Star,
    title: 'LinkedIn Branding',
    desc: 'We build a powerful LinkedIn profile that attracts recruiters and showcases your true potential.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: MessageSquare,
    title: 'Interview Coaching',
    desc: 'Mock interviews, behavioral prep, and technical coaching to make you walk in with full confidence.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Megaphone,
    title: 'Career Marketing',
    desc: 'We market your profile across 12+ job portals including LinkedIn, Dice, Monster, and Indeed.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: BookOpen,
    title: 'Technical Training',
    desc: 'Domain-specific training programs to sharpen your skills and close knowledge gaps before interviews.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Rocket,
    title: 'Job Placement',
    desc: 'We connect you directly with hiring managers at leading IT companies across the US and India.',
    color: 'from-amber-500 to-yellow-500',
  },
];

const steps = [
  { num: '01', title: 'Submit Your Resume', desc: 'Upload your resume and fill in your profile details. Takes less than 2 minutes.' },
  { num: '02', title: 'Screening & Counselling', desc: 'Our team reviews your profile and schedules a consultation to understand your goals.' },
  { num: '03', title: 'Resume Building', desc: 'We optimize your resume to be ATS-ready and tailored for your target roles.' },
  { num: '04', title: 'Technical Training', desc: 'Domain-specific preparation sessions to ensure you\'re interview-ready.' },
  { num: '05', title: 'Profile Marketing', desc: 'We actively market your profile to relevant recruiters and hiring managers.' },
  { num: '06', title: 'Interview Preparation', desc: 'Mock interviews, Q&A prep, and company-specific coaching before every round.' },
  { num: '07', title: 'Offer & Onboarding', desc: 'We guide you through offer negotiation, documentation, and smooth onboarding.' },
  { num: '08', title: 'Post-Placement Support', desc: 'We stay with you even after joining — verification, guidance, and career advice.' },
];

const candidates = [
  { icon: '🎓', title: 'Recent Graduates', desc: 'Freshers looking to break into IT with their first US/India job.' },
  { icon: '🚀', title: 'Better Opportunity Seekers', desc: 'Professionals looking to upgrade to better roles and higher pay.' },
  { icon: '🔄', title: 'Career Changers', desc: 'Transitioning from one domain to another with our bridge programs.' },
];

const stats = [
  { value: '2,400+', label: 'Placements Done' },
  { value: '98%', label: 'Candidate Satisfaction' },
  { value: '11 Days', label: 'Avg. Time-to-Place' },
  { value: '25+', label: 'Countries Served' },
];

export default function Careers() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-brand-500 to-violet-600" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full border border-white/30 mb-6"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white text-xs sm:text-sm font-semibold">#1 IT Staffing Partner — India &amp; US</span>
          </motion.div>

          <motion.h1
            className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-5 leading-tight"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            Your Dream IT Job<br />
            <span className="text-yellow-300 drop-shadow-lg">Is Waiting For You ✨</span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            Login and submit your resume — our team will match you with the best IT opportunities across the US and India.
          </motion.p>
        </div>

        <div className="h-14 bg-gradient-to-b from-transparent to-gray-50" />
      </section>

      {/* ── Stats ── */}
      <section className="bg-white py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 0.08}>
                <div className="text-center p-5 rounded-2xl bg-surface-50 border border-surface-200">
                  <p className="text-2xl sm:text-3xl font-heading font-bold text-navy-900">{s.value}</p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">{s.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who Can Apply ── */}
      <section className="section-padding bg-surface-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            overline="Who Can Apply"
            title="VDORT is For You If..."
            subtitle="We work with candidates at all stages of their IT career journey."
          />
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {candidates.map((c, i) => (
              <ScrollReveal key={c.title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-6 text-center hover:shadow-card-hover transition-all">
                  <div className="text-4xl mb-4">{c.icon}</div>
                  <h3 className="font-heading font-bold text-navy-900 mb-2">{c.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{c.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="section-padding bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            overline="Our Services"
            title="Everything You Need to Land Your Dream Job"
            subtitle="End-to-end career support from resume to offer letter."
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl border border-surface-200 shadow-card hover:shadow-card-hover transition-all p-6"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-navy-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="section-padding bg-gradient-to-b from-surface-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            overline="Our Process"
            title="Your Path to Your Dream Job"
            subtitle="A proven 8-step process that has helped 2,400+ professionals land top IT roles."
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 0.06}>
                <div className="relative bg-white rounded-2xl border border-surface-200 shadow-card p-5 hover:shadow-card-hover transition-all hover:-translate-y-1 duration-300">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-heading font-bold text-sm mb-4 shadow-lg shadow-brand-500/20">
                    {step.num}
                  </div>
                  <h3 className="font-heading font-semibold text-navy-900 text-sm mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>


      {/* ── Why Choose Us ── */}
      <section className="section-padding bg-surface-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            overline="Why VDORT"
            title="What Sets Us Apart"
            subtitle="We don't just find you a job — we build your career."
          />
          <div className="mt-12 grid sm:grid-cols-2 gap-6">
            {[
              { icon: Users, title: 'Personalized Approach', desc: 'We understand your unique skills and goals, tailoring every step of the process specifically for you.' },
              { icon: BadgeCheck, title: 'Best-in-Class Service', desc: 'Deep recruiter connections and comprehensive understanding of the IT hiring landscape.' },
              { icon: Briefcase, title: 'Increased Efficiency', desc: 'Save time — let us handle the job search while you focus on upskilling and interviews.' },
              { icon: Star, title: 'Stress-Free Experience', desc: 'Our team supports you at every stage so you never have to navigate the job market alone.' },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="flex gap-4 bg-white rounded-2xl border border-surface-200 shadow-card p-6 hover:shadow-card-hover transition-all">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-brand-500" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-navy-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-brand-100 mb-8 max-w-xl mx-auto">
            Join thousands of IT professionals who trusted VDORT to land their next big opportunity.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 rounded-xl font-bold hover:bg-brand-50 transition-all shadow-lg min-h-[52px]"
          >
            Login / Sign Up <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
