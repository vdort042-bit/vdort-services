import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { industries } from '../data/industries';
import SectionHeading from '../components/ui/SectionHeading';
import ScrollReveal from '../components/ui/ScrollReveal';
import Button from '../components/ui/Button';
import ParticleBackground from '../components/ui/ParticleBackground';

export default function Industries() {
  const [selected, setSelected] = useState(null);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const industry = industries.find(ind => ind.id === id);
      if (industry) setSelected(industry);
    }
  }, [hash]);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center gradient-hero overflow-hidden">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-transparent to-navy-950/80" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.h1
            className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Industry <span className="gradient-text">Expertise</span>
          </motion.h1>
          <motion.p
            className="text-lg text-surface-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Deep domain knowledge across the most in-demand technology verticals, powering your hiring with precision.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Industries Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, i) => (
              <ScrollReveal key={industry.id} delay={i * 0.06}>
                <motion.div
                  id={industry.id}
                  className="group relative p-8 rounded-2xl bg-white border border-surface-200 shadow-card hover:shadow-card-hover transition-all duration-500 cursor-pointer gradient-card-border h-full"
                  whileHover={{ y: -6 }}
                  onClick={() => setSelected(industry)}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${industry.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <industry.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-navy-900 mb-3">{industry.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-5">{industry.description}</p>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-navy-900 uppercase tracking-wider mb-2">Key Roles</p>
                      <div className="flex flex-wrap gap-1.5">
                        {industry.roles.slice(0, 3).map(role => (
                          <span key={role} className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-600 text-xs font-medium border border-brand-100">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-navy-900 uppercase tracking-wider mb-2">Technologies</p>
                      <div className="flex flex-wrap gap-1.5">
                        {industry.technologies.map(tech => (
                          <span key={tech} className="px-2 py-0.5 rounded-md bg-surface-100 text-slate-600 text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-elevated p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selected.color} flex items-center justify-center shadow-lg`}>
                    <selected.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-2xl text-navy-900">{selected.title}</h2>
                    <p className="text-slate-500 text-sm">{selected.description}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-surface-100 rounded-lg transition-colors cursor-pointer">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-heading font-semibold text-navy-900 mb-3">Key Roles We Fill</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.roles.map(role => (
                      <span key={role} className="px-3 py-1.5 rounded-lg bg-brand-50 text-brand-600 text-sm font-medium border border-brand-100">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-heading font-semibold text-navy-900 mb-3">Technology Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.technologies.map(tech => (
                      <span key={tech} className="px-3 py-1.5 rounded-lg bg-surface-100 text-slate-700 text-sm border border-surface-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Link to="/contact" onClick={() => setSelected(null)}>
                    <Button variant="primary" iconRight={ArrowRight}>Hire Talent</Button>
                  </Link>
                  <Link to="/careers" onClick={() => setSelected(null)}>
                    <Button variant="outline">View Jobs</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="section-padding gradient-bg relative text-center overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <ScrollReveal>
          <div className="relative max-w-3xl mx-auto">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-6">
              Need Specialists in Your Industry?
            </h2>
            <p className="text-surface-300 text-lg mb-10">
              Our industry-specialized recruiters understand the nuances of your domain and deliver candidates who make an immediate impact.
            </p>
            <Link to="/contact">
              <Button variant="primary" size="lg" iconRight={ArrowRight}>Talk to an Expert</Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
