import { stats } from '../../data/stats';
import AnimatedCounter from '../ui/AnimatedCounter';
import ScrollReveal from '../ui/ScrollReveal';

export default function StatsSection() {
  return (
    <section className="relative py-24 lg:py-32 gradient-bg overflow-hidden">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 group-hover:border-brand-500/30 group-hover:bg-brand-500/10 transition-all duration-300">
                  <stat.icon className="w-7 h-7 text-brand-400" />
                </div>
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  duration={2500}
                />
                <p className="text-surface-300/60 text-xs mt-3">{stat.description}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
