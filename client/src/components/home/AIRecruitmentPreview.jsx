import { motion } from 'framer-motion';
import { ArrowRight, Bot, FileSearch, Target, Workflow, BarChart3, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import ScrollReveal from '../ui/ScrollReveal';
import Button from '../ui/Button';

const features = [
  { icon: Bot, title: 'AI Candidate Sourcing', description: 'Intelligent bots scan millions of profiles to find the perfect match for your requirements.' },
  { icon: FileSearch, title: 'Smart Resume Screening', description: 'NLP-powered resume parsing ranks candidates by relevance, skills, and cultural fit.' },
  { icon: Target, title: 'Precision Matching', description: 'Machine learning algorithms match candidates to roles with 95%+ accuracy scores.' },
  { icon: Workflow, title: 'Process Automation', description: 'Automate scheduling, follow-ups, and candidate communications with AI workflows.' },
  { icon: BarChart3, title: 'Hiring Analytics', description: 'Real-time dashboards with predictive analytics for data-driven hiring decisions.' },
  { icon: Sparkles, title: 'Intelligent Workflows', description: 'End-to-end recruitment automation from sourcing to onboarding.' },
];

export default function AIRecruitmentPreview() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Dashboard Mockup */}
          <ScrollReveal direction="left">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-accent-400/10 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-6 border border-navy-700 overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-surface-300 text-xs ml-2">ai-recruitment.vdort.com</span>
                </div>

                {/* AI Dashboard Mockup */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Candidates Sourced', value: '2,847', change: '+23%' },
                    { label: 'Matches Found', value: '456', change: '+18%' },
                    { label: 'Interviews Set', value: '89', change: '+31%' },
                    { label: 'Offers Made', value: '34', change: '+12%' },
                  ].map((metric) => (
                    <div key={metric.label} className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <p className="text-surface-300 text-xs mb-1">{metric.label}</p>
                      <div className="flex items-end gap-2">
                        <span className="text-white font-heading font-bold text-lg">{metric.value}</span>
                        <span className="text-green-400 text-xs font-medium">{metric.change}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart mockup */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white text-sm font-medium mb-3">AI Matching Performance</p>
                  <div className="flex items-end gap-1 h-24">
                    {[40, 55, 45, 65, 70, 60, 80, 75, 85, 90, 82, 95].map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-brand-500 to-accent-400 rounded-t-sm"
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-surface-300 text-[10px]">Jan</span>
                    <span className="text-surface-300 text-[10px]">Dec</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Content */}
          <ScrollReveal direction="right">
            <div>
              <span className="inline-block font-semibold text-sm tracking-[0.2em] uppercase mb-4 bg-gradient-to-r from-brand-500 to-accent-400 bg-clip-text text-transparent">
                AI Recruitment
              </span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy-900 leading-tight mb-6">
                The Future of Hiring is <span className="gradient-text">Intelligent</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Our AI recruitment platform combines machine learning, natural language processing, and predictive analytics to transform every stage of the hiring lifecycle.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    className="flex gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <feature.icon className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-navy-900 text-sm">{feature.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link to="/ai-recruitment">
                <Button variant="primary" size="lg" iconRight={ArrowRight}>
                  Explore AI Solutions
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
