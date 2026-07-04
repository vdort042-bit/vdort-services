import { motion } from 'framer-motion';
import { TrendingUp, Clock, Award } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import ScrollReveal from '../ui/ScrollReveal';

const stories = [
  {
    title: 'Fortune 500 Tech Company',
    subtitle: 'Enterprise Cloud Migration Staffing',
    description: 'Delivered 85 cloud specialists within 30 days for a critical AWS migration project, enabling on-time project delivery and $2M in cost savings.',
    metrics: [
      { icon: TrendingUp, value: '85', label: 'Engineers Placed' },
      { icon: Clock, value: '30', label: 'Days Delivery' },
      { icon: Award, value: '$2M', label: 'Cost Savings' },
    ],
    gradient: 'from-blue-600 to-cyan-500',
  },
  {
    title: 'Global Healthcare Network',
    subtitle: 'Healthcare IT Transformation',
    description: 'Built a 40-person Epic implementation team across 15 hospital locations, reducing go-live timeline by 40% and achieving 98% user adoption.',
    metrics: [
      { icon: TrendingUp, value: '40', label: 'Specialists Hired' },
      { icon: Clock, value: '40%', label: 'Faster Go-Live' },
      { icon: Award, value: '98%', label: 'User Adoption' },
    ],
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'AI-First Fintech Startup',
    subtitle: 'Scaling AI/ML Engineering Team',
    description: 'Scaled the AI team from 5 to 35 engineers in 6 months, including 3 Ph.D. researchers, supporting a successful Series C funding round.',
    metrics: [
      { icon: TrendingUp, value: '7x', label: 'Team Growth' },
      { icon: Clock, value: '6', label: 'Months' },
      { icon: Award, value: '$50M', label: 'Series C' },
    ],
    gradient: 'from-violet-500 to-purple-600',
  },
];

export default function SuccessStories() {
  return (
    <section className="section-padding bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          overline="Success Stories"
          title="Driving Business Impact"
          subtitle="Real results for real businesses. See how our recruitment solutions create measurable impact."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {stories.map((story, i) => (
            <ScrollReveal key={story.title} delay={i * 0.15}>
              <motion.div
                className="group relative bg-white rounded-2xl overflow-hidden border border-surface-200 shadow-card hover:shadow-card-hover transition-all duration-500 h-full flex flex-col"
                whileHover={{ y: -6 }}
              >
                {/* Top gradient bar */}
                <div className={`h-2 bg-gradient-to-r ${story.gradient}`} />

                <div className="p-8 lg:p-10 flex-1 flex flex-col">
                  <span className={`inline-block text-xs font-semibold uppercase tracking-wider bg-gradient-to-r ${story.gradient} bg-clip-text text-transparent mb-3`}>
                    {story.subtitle}
                  </span>
                  <h3 className="font-heading font-bold text-xl lg:text-2xl text-navy-900 mb-5">
                    {story.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed mb-8 flex-1 text-base">
                    {story.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 pt-8 border-t border-surface-200">
                    {story.metrics.map((metric) => (
                      <div key={metric.label} className="text-center">
                        <metric.icon className="w-5 h-5 text-brand-500 mx-auto mb-2" />
                        <p className="font-heading font-bold text-navy-900 text-lg">{metric.value}</p>
                        <p className="text-slate-400 text-xs mt-1">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
