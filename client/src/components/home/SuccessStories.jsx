import { motion } from 'framer-motion';
import { TrendingUp, Clock, MapPin, Star, ArrowRight, Award } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import ScrollReveal from '../ui/ScrollReveal';

const stories = [
  {
    id: 1,
    name: 'Rajesh Krishnan',
    role: 'Cloud Solutions Architect',
    placedAt: 'Fortune 100 Tech Company',
    location: 'Bengaluru → Seattle, USA',
    timeToPlace: '11 days',
    salaryJump: '+68%',
    beforeRole: 'IT Support Engineer',
    afterRole: 'Cloud Architect',
    avatar: 'RK',
    color: 'from-blue-500 to-cyan-500',
    quote: 'VDORT didn\'t just find me a job — they transformed my career trajectory. The resume rewrite and interview coaching were exceptional.',
    skills: ['AWS', 'Kubernetes', 'Terraform'],
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Senior Data Scientist',
    placedAt: 'Global AI Startup (Series C)',
    location: 'Hyderabad → Remote/US',
    timeToPlace: '8 days',
    salaryJump: '+82%',
    beforeRole: 'Data Analyst',
    afterRole: 'Senior Data Scientist',
    avatar: 'PS',
    color: 'from-violet-500 to-purple-500',
    quote: 'They optimized my LinkedIn profile and within a week I had 12 recruiter messages. VDORT knows exactly how to position your profile for global opportunities.',
    skills: ['Python', 'ML/AI', 'LLMs'],
  },
  {
    id: 3,
    name: 'Ananya Patel',
    role: 'Lead DevOps Engineer',
    placedAt: 'Top 5 E-commerce Platform',
    location: 'Pune → Bengaluru',
    timeToPlace: '14 days',
    salaryJump: '+55%',
    beforeRole: 'Junior DevOps',
    afterRole: 'Lead DevOps Engineer',
    avatar: 'AP',
    color: 'from-emerald-500 to-teal-500',
    quote: 'The mock interview sessions prepared me for every question. I walked into my final round with full confidence and got an offer on the spot.',
    skills: ['Docker', 'CI/CD', 'Azure'],
  },
  {
    id: 4,
    name: 'Arjun Mehta',
    role: 'Cybersecurity Consultant',
    placedAt: 'BFSI Enterprise Client',
    location: 'Mumbai, India',
    timeToPlace: '9 days',
    salaryJump: '+71%',
    beforeRole: 'Network Admin',
    afterRole: 'Security Consultant',
    avatar: 'AM',
    color: 'from-orange-500 to-red-500',
    quote: 'VDORT\'s domain expertise in cybersecurity hiring is unmatched. They matched me to a niche role I would never have found on my own.',
    skills: ['SIEM', 'Pentesting', 'ISO 27001'],
  },
];

const stats = [
  { label: 'Avg. Time-to-Place', value: '11 Days', icon: Clock },
  { label: 'Avg. Salary Increase', value: '68%', icon: TrendingUp },
  { label: 'Candidate Satisfaction', value: '98%', icon: Star },
  { label: 'Global Placements', value: '2,400+', icon: Award },
];

export default function SuccessStories() {
  return (
    <section className="section-padding bg-gradient-to-b from-surface-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          overline="Success Stories"
          title="Careers Transformed"
          subtitle="Real candidates. Real results. See how VDORT changed their professional journeys."
        />

        {/* Stats bar */}
        <ScrollReveal>
          <div className="mt-12 mb-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-surface-200 shadow-card p-5 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-5 h-5 text-brand-500" />
                </div>
                <p className="text-2xl font-heading font-bold text-navy-900">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Story cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {stories.map((story, i) => (
            <ScrollReveal key={story.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-surface-200 shadow-card hover:shadow-card-hover transition-all overflow-hidden"
              >
                {/* Color top bar */}
                <div className={`h-1.5 bg-gradient-to-r ${story.color}`} />

                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${story.color} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                      {story.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-navy-900">{story.name}</h3>
                      <p className="text-brand-600 text-sm font-medium">{story.role}</p>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{story.location}</span>
                      </div>
                    </div>
                    {/* Placed at badge */}
                    <div className="shrink-0 text-right">
                      <span className="inline-block text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-medium">
                        Placed ✓
                      </span>
                      <p className="text-xs text-slate-500 mt-1 max-w-[140px] text-right leading-tight truncate">{story.placedAt}</p>
                    </div>
                  </div>

                  {/* Career journey */}
                  <div className="flex items-center gap-2 mb-5 bg-surface-50 rounded-xl p-3">
                    <div className="flex-1 text-center">
                      <p className="text-xs text-slate-400 mb-0.5">Before</p>
                      <p className="text-xs font-semibold text-navy-700">{story.beforeRole}</p>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 px-2">
                      <ArrowRight className="w-4 h-4 text-brand-500" />
                      <span className="text-xs font-bold text-green-600">{story.salaryJump}</span>
                      <span className="text-[10px] text-slate-400">salary</span>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="text-xs text-slate-400 mb-0.5">After</p>
                      <p className="text-xs font-semibold text-brand-600">{story.afterRole}</p>
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-slate-600 text-sm leading-relaxed mb-5 italic border-l-2 border-brand-200 pl-3">
                    "{story.quote}"
                  </blockquote>

                  {/* Footer — skills + time */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {story.skills.map((s) => (
                        <span key={s} className="text-xs bg-brand-50 text-brand-600 border border-brand-100 px-2 py-0.5 rounded-md font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0 ml-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{story.timeToPlace}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal>
          <div className="mt-12 text-center bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 rounded-2xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-brand-500 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-400 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">Your Story Starts Here</p>
              <h3 className="font-heading font-bold text-2xl md:text-3xl text-white mb-4">
                Ready to Transform Your Career?
              </h3>
              <p className="text-surface-300 mb-6 max-w-lg mx-auto">
                Join 2,400+ professionals who trusted VDORT to land their dream role faster.
              </p>
              <a
                href="/careers"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-semibold hover:from-brand-400 hover:to-brand-500 transition-all shadow-lg hover:shadow-brand-500/30"
              >
                Browse Open Positions <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
