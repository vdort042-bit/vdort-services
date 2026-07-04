import { motion } from 'framer-motion';
import { Target, Eye, Heart, Lightbulb, Globe, Shield, Award } from 'lucide-react';

// Inline LinkedIn icon (Lucide doesn't export brand icons)
const LinkedinIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);
import { team, coreValues, milestones } from '../data/team';
import SectionHeading from '../components/ui/SectionHeading';
import ScrollReveal from '../components/ui/ScrollReveal';
import ParticleBackground from '../components/ui/ParticleBackground';

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center gradient-hero overflow-hidden">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-transparent to-navy-950/80" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.span
            className="inline-block font-semibold text-sm tracking-[0.2em] uppercase mb-4 text-brand-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            About VDORT
          </motion.span>
          <motion.h1
            className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Value-Driven Opportunities,<br />
            <span className="gradient-text">Recruitment & Talent</span>
          </motion.h1>
          <motion.p
            className="text-lg text-surface-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Transforming how the world connects talent to opportunity through innovation, integrity, and intelligence.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Company Story */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div>
                <SectionHeading
                  overline="Our Story"
                  title="Built on a Vision to Transform Hiring"
                  align="left"
                />
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    Founded in 2018 by Vikram Desai, VDORT Services was born from a simple yet powerful observation: the recruitment industry was ripe for a technology revolution. Traditional staffing approaches were slow, imprecise, and failed to serve the rapidly evolving needs of modern enterprises.
                  </p>
                  <p>
                    Starting with a small team of passionate recruiters in Bangalore, we set out to build something different — a recruitment company that combines the warmth of human connection with the precision of artificial intelligence. Today, VDORT serves 500+ clients across 25+ countries with a team of 200+ specialized recruiters.
                  </p>
                  <p>
                    Our proprietary AI platform processes over 100,000 resumes monthly, achieving a 95% candidate-to-role match accuracy that's setting new industry benchmarks. But technology is only half the story — our success is built on relationships, trust, and an unwavering commitment to creating value for every stakeholder.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Timeline Visual */}
            <ScrollReveal direction="right">
              <div className="relative bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-8 border border-navy-700">
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl" />
                <h3 className="font-heading font-bold text-white text-xl mb-6">Our Journey</h3>
                <div className="space-y-1">
                  {milestones.slice(0, 5).map((milestone, i) => (
                    <motion.div
                      key={milestone.year}
                      className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <span className="text-brand-400 font-heading font-bold text-lg shrink-0 w-12">{milestone.year}</span>
                      <div>
                        <p className="text-white font-semibold text-sm">{milestone.title}</p>
                        <p className="text-surface-300 text-xs mt-0.5">{milestone.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal>
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-card border border-surface-200 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mb-6 shadow-lg">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-navy-900 mb-4">Our Vision</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  To be the world's most trusted AI-powered recruitment partner, transforming how organizations discover, engage, and retain exceptional talent across every industry and geography.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-card border border-surface-200 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-400 flex items-center justify-center mb-6 shadow-lg">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-navy-900 mb-4">Our Mission</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  To connect talented professionals with meaningful career opportunities while empowering businesses with innovative, data-driven recruitment solutions that create lasting value for all stakeholders.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            overline="Core Values"
            title="The Principles That Guide Us"
            subtitle="Six foundational values that shape every decision, interaction, and outcome at VDORT."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, i) => {
              const icons = [Heart, Lightbulb, Globe, Shield, Award, Target];
              const gradients = [
                'from-pink-500 to-rose-500', 'from-amber-500 to-orange-500',
                'from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-500',
                'from-violet-500 to-purple-500', 'from-brand-500 to-brand-600',
              ];
              const Icon = icons[i];
              return (
                <ScrollReveal key={value.title} delay={i * 0.08}>
                  <motion.div
                    className="p-8 rounded-2xl bg-white border border-surface-200 shadow-card hover:shadow-card-hover transition-all duration-500 gradient-card-border h-full"
                    whileHover={{ y: -4 }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[i]} flex items-center justify-center mb-5 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-navy-900 mb-2">{value.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{value.description}</p>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Founder Message */}
      <section className="section-padding gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-brand-500/30 text-3xl font-heading font-bold text-white">
              VD
            </div>
            <blockquote className="text-xl md:text-2xl text-white leading-relaxed mb-8 italic font-light">
              "We started VDORT with a belief that technology could make recruitment more human, not less. Our AI doesn't replace the recruiter's intuition — it amplifies it, allowing our team to focus on what truly matters: understanding people, building relationships, and creating opportunities that change lives."
            </blockquote>
            <p className="text-white font-heading font-bold text-lg">Vikram Desai</p>
            <p className="text-brand-300 text-sm">Founder & CEO, VDORT Services</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Leadership Team */}
      <section id="team" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            overline="Leadership"
            title="Meet Our Leaders"
            subtitle="Experienced professionals driving innovation and excellence in global recruitment."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 0.1}>
                <motion.div
                  className="group text-center p-8 rounded-2xl bg-white border border-surface-200 shadow-card hover:shadow-card-hover transition-all duration-500"
                  whileHover={{ y: -4 }}
                >
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-700 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:from-brand-500 group-hover:to-brand-600 transition-all duration-500">
                    <span className="text-2xl font-heading font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-navy-900">{member.name}</h3>
                  <p className="text-brand-500 text-sm font-medium mt-1 mb-4">{member.designation}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{member.bio}</p>
                  <a
                    href={member.linkedin}
                    className="inline-flex items-center gap-2 text-brand-500 text-sm font-medium mt-5 hover:text-brand-600 transition-colors"
                  >
                    <LinkedinIcon className="w-4 h-4" /> LinkedIn
                  </a>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Global Reach Timeline */}
      <section className="section-padding bg-surface-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            overline="Global Reach"
            title="Our Growth Journey"
            subtitle="From a startup in Bangalore to a global recruitment powerhouse."
          />

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-500 via-accent-400 to-brand-500 md:-translate-x-px" />

            {milestones.map((milestone, i) => (
              <ScrollReveal key={milestone.year} delay={i * 0.05}>
                <div className={`relative flex items-center gap-8 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-brand-500 border-4 border-white shadow-lg -translate-x-1/2 z-10" />

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <span className="text-brand-500 font-heading font-bold text-2xl">{milestone.year}</span>
                    <h3 className="font-heading font-bold text-lg text-navy-900 mt-1">{milestone.title}</h3>
                    <p className="text-slate-500 text-sm mt-2">{milestone.description}</p>
                  </div>

                  {/* Spacer for alternating */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

