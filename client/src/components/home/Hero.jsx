import { motion } from 'framer-motion';
import { ArrowRight, Play, Briefcase, Globe, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import ParticleBackground from '../ui/ParticleBackground';
import WorldMap from '../ui/WorldMap';

const floatingStats = [
  { icon: Briefcase, value: '500+', label: 'Global Clients', delay: 0.6 },
  { icon: Users, value: '50K+', label: 'Placements', delay: 0.8 },
  { icon: Globe, value: 'US Only', label: 'Market', delay: 1.0 },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
      <ParticleBackground />

      {/* World Map Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <WorldMap className="w-full max-w-6xl" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-transparent to-navy-950/80" />

      {/* Decorative Blurs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-surface-300 text-sm font-medium">AI-Powered Recruitment Platform</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="block">Connecting</span>
            <span className="block gradient-text">Talent</span>
            <span className="block">to Opportunity</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-surface-300 leading-relaxed max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            VDORT Services leverages AI-powered recruitment, global expertise, and deep industry knowledge to deliver exceptional talent solutions for enterprises worldwide.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4 sm:gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link to="/services">
              <Button variant="primary" size="lg" iconRight={ArrowRight}>
                Explore Services
              </Button>
            </Link>
            <Link to="/careers">
              <Button variant="secondary" size="lg" icon={Play}>
                Find Careers
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Floating Stats Cards */}
        <div className="mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 max-w-2xl mx-auto">
          {floatingStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass rounded-2xl p-6 flex items-center gap-4 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: stat.delay }}
              whileHover={{ y: -4, borderColor: 'rgba(59, 130, 246, 0.3)' }}
            >
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center shrink-0">
                <stat.icon className="w-6 h-6 text-brand-400" />
              </div>
              <div>
                <p className="text-white font-heading font-bold text-2xl">{stat.value}</p>
                <p className="text-surface-300 text-xs font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
