import { motion } from 'framer-motion';
import { ArrowRight, Bot, FileSearch, Target, Workflow, BarChart3, Sparkles, Brain, Cpu, Zap, ShieldCheck, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../components/ui/SectionHeading';
import ScrollReveal from '../components/ui/ScrollReveal';
import Button from '../components/ui/Button';
import ParticleBackground from '../components/ui/ParticleBackground';

const aiFeatures = [
  {
    icon: Bot,
    title: 'AI Candidate Sourcing',
    description: 'Our intelligent bots continuously scan professional networks, job boards, and databases to identify ideal candidates before they even start looking. Multi-channel sourcing across 50+ platforms.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: FileSearch,
    title: 'Smart Resume Screening',
    description: 'NLP-powered parsing extracts skills, experience, and context from resumes with 98% accuracy. Automated scoring ranks every applicant by relevance and potential.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Target,
    title: 'Precision Matching',
    description: 'Deep learning algorithms analyze hundreds of data points to match candidates to roles with 95%+ accuracy, considering skills, culture fit, growth potential, and compensation alignment.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Workflow,
    title: 'Process Automation',
    description: 'Automate scheduling, follow-ups, assessments, and candidate communications. Our workflow engine handles repetitive tasks so recruiters focus on relationship building.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: BarChart3,
    title: 'Hiring Analytics',
    description: 'Real-time dashboards with predictive analytics. Track time-to-hire, source effectiveness, diversity metrics, and forecast future hiring needs with ML-powered insights.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Sparkles,
    title: 'Intelligent Workflows',
    description: 'End-to-end recruitment automation from job posting to onboarding. Custom-built workflows adapt to your unique hiring process and continuously optimize for speed and quality.',
    gradient: 'from-brand-500 to-brand-600',
  },
];

const benefits = [
  { icon: Clock, value: '60%', label: 'Faster Hiring', description: 'Reduce time-to-hire dramatically' },
  { icon: TrendingUp, value: '95%', label: 'Match Accuracy', description: 'AI-powered candidate matching' },
  { icon: Zap, value: '3x', label: 'Productivity', description: 'Recruiter efficiency gains' },
  { icon: ShieldCheck, value: '40%', label: 'Cost Reduction', description: 'Lower cost-per-hire' },
];

export default function AIRecruitment() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[65vh] flex items-center gradient-hero overflow-hidden">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-transparent to-navy-950/80" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Brain className="w-4 h-4 text-brand-400" />
                <span className="text-surface-300 text-sm font-medium">Powered by AI</span>
              </motion.div>
              <motion.h1
                className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-[1.1]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                The Future of <span className="gradient-text">Intelligent</span> Recruitment
              </motion.h1>
              <motion.p
                className="text-lg text-surface-300 mb-8 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Our AI recruitment platform combines machine learning, NLP, and predictive analytics to revolutionize every stage of the hiring lifecycle.
              </motion.p>
              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link to="/contact">
                  <Button variant="primary" size="lg" iconRight={ArrowRight}>Request Demo</Button>
                </Link>
              </motion.div>
            </div>

            {/* AI Dashboard */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="bg-gradient-to-br from-navy-800/90 to-navy-900/90 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-elevated">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-surface-300 text-xs ml-2">VDORT AI Engine v3.2</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {benefits.map((b) => (
                    <div key={b.label} className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <b.icon className="w-4 h-4 text-brand-400 mb-1" />
                      <p className="text-white font-heading font-bold text-xl">{b.value}</p>
                      <p className="text-surface-300 text-xs">{b.label}</p>
                    </div>
                  ))}
                </div>

                {/* Animated chart */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-sm font-medium">AI Match Quality</span>
                    <span className="text-green-400 text-xs">↑ 12%</span>
                  </div>
                  <div className="flex items-end gap-1 h-20">
                    {[35, 42, 55, 48, 62, 58, 72, 68, 78, 82, 88, 95].map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-sm"
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* AI Features */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            overline="AI Capabilities"
            title="Intelligent Recruitment at Scale"
            subtitle="Six powerful AI modules that work together to transform your entire hiring ecosystem."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiFeatures.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 0.08}>
                <motion.div
                  className="group p-8 rounded-2xl bg-white border border-surface-200 shadow-card hover:shadow-card-hover transition-all duration-500 gradient-card-border h-full"
                  whileHover={{ y: -6 }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-navy-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-surface-50">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            overline="How It Works"
            title="AI Recruitment Workflow"
            subtitle="A seamless, intelligent pipeline that transforms how you hire."
          />

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 via-accent-400 to-brand-500 -translate-y-1/2" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { step: '01', title: 'Define', desc: 'AI-powered job requirement analysis' },
                { step: '02', title: 'Source', desc: 'Multi-channel intelligent sourcing' },
                { step: '03', title: 'Screen', desc: 'NLP resume parsing & scoring' },
                { step: '04', title: 'Match', desc: 'Deep learning candidate matching' },
                { step: '05', title: 'Hire', desc: 'Automated workflows & analytics' },
              ].map((item, i) => (
                <ScrollReveal key={item.step} delay={i * 0.1}>
                  <div className="relative text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/25 relative z-10">
                      <span className="text-white font-heading font-bold text-lg">{item.step}</span>
                    </div>
                    <h4 className="font-heading font-bold text-navy-900 text-lg mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            overline="Results"
            title="Measurable Impact"
            subtitle="Our AI platform delivers quantifiable improvements across every hiring metric."
            light
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <ScrollReveal key={benefit.label} delay={i * 0.1}>
                <div className="text-center p-6 rounded-2xl glass border border-white/10">
                  <benefit.icon className="w-8 h-8 text-brand-400 mx-auto mb-3" />
                  <p className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-2">{benefit.value}</p>
                  <p className="text-white font-semibold mb-1">{benefit.label}</p>
                  <p className="text-surface-300 text-xs">{benefit.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white text-center">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy-900 mb-6">
              Ready to Experience AI-Powered Recruitment?
            </h2>
            <p className="text-slate-500 text-lg mb-10">
              Schedule a demo to see how our AI platform can transform your hiring process.
            </p>
            <Link to="/contact">
              <Button variant="primary" size="lg" iconRight={ArrowRight}>Request a Demo</Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
