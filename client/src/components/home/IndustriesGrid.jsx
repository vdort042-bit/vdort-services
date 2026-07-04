import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { industries } from '../../data/industries';
import SectionHeading from '../ui/SectionHeading';
import ScrollReveal from '../ui/ScrollReveal';

export default function IndustriesGrid() {
  return (
    <section className="section-padding gradient-bg relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-400/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          overline="Industries"
          title="Specialized Industry Expertise"
          subtitle="Deep domain knowledge across the most in-demand technology verticals."
          light
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, i) => (
            <ScrollReveal key={industry.id} delay={i * 0.06}>
              <motion.div
                className="group relative p-6 rounded-2xl glass border border-white/10 hover:border-brand-500/30 transition-all duration-500 cursor-pointer"
                whileHover={{ y: -6 }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${industry.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <industry.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-brand-300 transition-colors">
                  {industry.title}
                </h3>
                <p className="text-surface-300 text-sm leading-relaxed mb-4">
                  {industry.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {industry.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-surface-300 text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                  {industry.technologies.length > 3 && (
                    <span className="px-2 py-0.5 rounded-md text-brand-400 text-xs font-medium">
                      +{industry.technologies.length - 3}
                    </span>
                  )}
                </div>

                <Link
                  to={`/industries#${industry.id}`}
                  className="inline-flex items-center gap-1.5 text-brand-400 font-medium text-sm mt-5 opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
