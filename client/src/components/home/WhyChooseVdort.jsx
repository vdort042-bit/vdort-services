import { motion } from 'framer-motion';
import { Brain, Globe, Zap, UserCheck, Cpu } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import ScrollReveal from '../ui/ScrollReveal';

const reasons = [
  {
    icon: Brain,
    title: 'AI-Powered Recruitment',
    description: 'Our proprietary AI engine screens, matches, and ranks candidates with 95% accuracy, dramatically reducing time-to-hire.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: Globe,
    title: 'Global Talent Network',
    description: 'Access a vetted network of 50,000+ professionals across 25+ countries, spanning every technology domain.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Zap,
    title: 'Faster Placements',
    description: 'Our streamlined process delivers qualified candidates within 48-72 hours — 3x faster than industry average.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: UserCheck,
    title: 'Expert Recruiters',
    description: '200+ specialized recruiters with deep domain expertise ensure you get candidates who truly understand your industry.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Cpu,
    title: 'Technology-Driven Sourcing',
    description: 'We leverage data analytics, automation, and intelligent workflows to optimize every step of the recruitment process.',
    gradient: 'from-pink-500 to-rose-500',
  },
];

export default function WhyChooseVdort() {
  return (
    <section className="section-padding bg-white dot-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          overline="Why VDORT"
          title="Why Leading Enterprises Choose Us"
          subtitle="We combine cutting-edge AI technology with deep industry expertise to deliver recruitment solutions that set new standards."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, i) => (
            <ScrollReveal key={reason.title} delay={i * 0.1}>
              <motion.div
                className="group relative p-8 rounded-2xl bg-white border border-surface-200 shadow-card hover:shadow-card-hover transition-all duration-500 gradient-card-border"
                whileHover={{ y: -6 }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <reason.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading font-bold text-xl text-navy-900 mb-3">
                  {reason.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {reason.description}
                </p>
                {/* Bottom gradient line */}
                <div className={`absolute bottom-0 left-8 right-8 h-0.5 rounded-full bg-gradient-to-r ${reason.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
