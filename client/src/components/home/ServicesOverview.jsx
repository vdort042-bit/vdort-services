import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { services } from '../../data/services';
import SectionHeading from '../ui/SectionHeading';
import ScrollReveal from '../ui/ScrollReveal';

export default function ServicesOverview() {
  return (
    <section className="section-padding bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          overline="Our Services"
          title="Enterprise Staffing Solutions"
          subtitle="From IT staffing to end-to-end RPO, we offer comprehensive recruitment solutions tailored to your business needs."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, i) => (
            <ScrollReveal key={service.id} delay={i * 0.08}>
              <motion.div
                className="group relative p-8 lg:p-10 rounded-2xl bg-white border border-surface-200 shadow-card hover:shadow-card-hover transition-all duration-500 gradient-card-border h-full flex flex-col"
                whileHover={{ y: -6 }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mb-6 shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 group-hover:scale-110 transition-all duration-300">
                  <service.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-heading font-bold text-xl lg:text-2xl text-navy-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-slate-500 leading-relaxed mb-8 flex-1 text-base">
                  {service.shortDesc}
                </p>

                {/* Link */}
                <Link
                  to={`/services#${service.id}`}
                  className="inline-flex items-center gap-2 text-brand-500 font-semibold text-sm group/link hover:gap-3 transition-all duration-300"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
