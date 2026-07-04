import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { candidateServices } from '../../data/services';
import SectionHeading from '../ui/SectionHeading';
import ScrollReveal from '../ui/ScrollReveal';
import Button from '../ui/Button';

export default function CandidateServices() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Content */}
          <ScrollReveal direction="left">
            <div>
              <span className="inline-block font-semibold text-sm tracking-[0.2em] uppercase mb-5 bg-gradient-to-r from-brand-500 to-accent-400 bg-clip-text text-transparent">
                For Candidates
              </span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-navy-900 leading-tight mb-6">
                Accelerate Your Career Growth
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-10">
                We don't just find you a job — we build your career. Our comprehensive candidate services ensure you stand out and land the opportunities you deserve.
              </p>

              <div className="space-y-5 mb-12">
                {candidateServices.map((service, i) => (
                  <motion.div
                    key={service.title}
                    className="flex gap-4 p-5 rounded-xl hover:bg-surface-50 transition-colors duration-300 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                  >
                    <CheckCircle className="w-6 h-6 text-brand-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-heading font-semibold text-navy-900 group-hover:text-brand-600 transition-colors text-base">
                        {service.title}
                      </h4>
                      <p className="text-slate-500 text-sm mt-1.5">
                        {service.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
                <Link to="/careers" className="flex-1">
                  <Button variant="primary" size="lg" iconRight={ArrowRight} className="w-full">
                    Explore Career Opportunities
                  </Button>
                </Link>
                <Link to="/careers#register" className="flex-1">
                  <Button variant="outline" size="lg" icon={Upload} className="w-full">
                    Upload Resume
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Illustration */}
          <ScrollReveal direction="right">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-accent-400/10 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-8 border border-navy-700 overflow-hidden">
                {/* Mock Dashboard */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="text-surface-300 text-xs ml-2">career-dashboard.vdort.com</span>
                  </div>

                  {/* Profile Strength */}
                  <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white text-sm font-medium">Profile Strength</span>
                      <span className="text-brand-400 font-bold text-sm">92%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-brand-500 to-accent-400 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: '92%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Match Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Matches', value: '24' },
                      { label: 'Applied', value: '8' },
                      { label: 'Interviews', value: '3' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                        <p className="text-white font-heading font-bold text-xl">{stat.value}</p>
                        <p className="text-surface-300 text-xs mt-2">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Matches */}
                  <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                    <p className="text-white text-sm font-medium mb-4">Top Matches</p>
                    {['Senior React Developer — $160K', 'Cloud Architect — $200K', 'ML Engineer — $180K'].map((match, i) => (
                      <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                        <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                        <span className="text-surface-300 text-sm">{match}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
