import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { services, candidateServices } from '../data/services';
import SectionHeading from '../components/ui/SectionHeading';
import ScrollReveal from '../components/ui/ScrollReveal';
import Button from '../components/ui/Button';
import ParticleBackground from '../components/ui/ParticleBackground';

export default function Services() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [hash]);

  return (
    <>
      {/* Hero */}
      <section className="pt-16 bg-gradient-to-br from-brand-600 via-brand-500 to-violet-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <motion.span
            className="inline-block text-xs font-bold uppercase tracking-widest text-white/80 mb-4"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          >
            Our Services
          </motion.span>
          <motion.h1
            className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-5 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Career Services <span className="text-yellow-300">For You</span>
          </motion.h1>
          <motion.p
            className="text-brand-100 max-w-2xl mx-auto text-base sm:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            From resume building to job placement — everything you need to land your dream IT job.
          </motion.p>
        </div>
        <div className="h-10 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* Services Detail */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {services.map((service, i) => (
            <ScrollReveal key={service.id}>
              <div
                id={service.id}
                className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
              >
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mb-6 shadow-lg shadow-brand-500/20">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="font-heading font-bold text-2xl sm:text-3xl text-navy-900 mb-4">{service.title}</h2>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">{service.description}</p>

                  <h4 className="font-heading font-semibold text-navy-900 mb-3">Key Benefits</h4>
                  <ul className="space-y-3">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="flex gap-3 items-start">
                        <CheckCircle className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
                        <span className="text-slate-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Process Steps */}
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="bg-surface-50 rounded-2xl p-5 sm:p-8 border border-surface-200">
                    <h4 className="font-heading font-semibold text-navy-900 mb-6">Our Process</h4>
                    <div className="space-y-4">
                      {service.process.map((step, stepIndex) => (
                        <motion.div
                          key={step}
                          className="flex gap-4 items-center p-3 rounded-xl hover:bg-white transition-colors"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: stepIndex * 0.1 }}
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-heading font-bold text-sm shrink-0">
                            {String(stepIndex + 1).padStart(2, '0')}
                          </div>
                          <span className="font-medium text-navy-900">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Candidate Services */}
      <section className="section-padding gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            overline="For Candidates"
            title="Candidate Career Services"
            subtitle="Empower your job search with our professional career development services."
            light
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidateServices.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 0.08}>
                <motion.div
                  className="p-6 rounded-2xl glass border border-white/10 hover:border-brand-500/30 transition-all duration-500 h-full"
                  whileHover={{ y: -4 }}
                >
                  <CheckCircle className="w-8 h-8 text-brand-400 mb-4" />
                  <h3 className="font-heading font-bold text-lg text-white mb-2">{service.title}</h3>
                  <p className="text-surface-300 text-sm leading-relaxed">{service.description}</p>
                </motion.div>
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
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-slate-500 text-lg mb-10">
              Let's discuss how our tailored staffing solutions can help your organization find and retain top talent.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact">
                <Button variant="primary" size="lg" iconRight={ArrowRight}>Contact Us</Button>
              </Link>
              <Link to="/careers">
                <Button variant="outline" size="lg">View Open Positions</Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}

