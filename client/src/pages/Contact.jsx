import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MapPin, Phone, Mail, Clock, CheckCircle, MessageSquare, ChevronDown } from 'lucide-react';
import { COMPANY } from '../utils/constants';
import api from '../services/api';
import SectionHeading from '../components/ui/SectionHeading';
import ScrollReveal from '../components/ui/ScrollReveal';
import Button from '../components/ui/Button';
import ParticleBackground from '../components/ui/ParticleBackground';

const faqs = [
  {
    q: 'What industries do you specialize in?',
    a: 'We specialize in AI, Data Engineering, Cloud Computing, Cybersecurity, SAP, ERP, Healthcare IT, DevOps, and Software Development. Our recruiters have deep domain expertise in each vertical.',
  },
  {
    q: 'How quickly can you fill a position?',
    a: 'Our average time-to-fill is 15 business days, with initial candidate profiles presented within 48-72 hours. For urgent requirements, we offer accelerated search programs.',
  },
  {
    q: 'Do you offer RPO services?',
    a: 'Yes, we offer comprehensive RPO solutions that embed dedicated recruitment teams within your organization. Our RPO clients see an average 40% reduction in hiring costs.',
  },
  {
    q: 'What is your replacement guarantee?',
    a: 'We offer a 90-day replacement guarantee for all permanent placements. If a candidate leaves within 90 days, we will find a replacement at no additional cost.',
  },
  {
    q: 'How does your AI recruitment technology work?',
    a: 'Our proprietary AI platform uses NLP for resume parsing, ML for candidate matching, and predictive analytics for hiring insights. It processes 100K+ resumes monthly with 95%+ match accuracy.',
  },
  {
    q: 'Do you work with international clients?',
    a: 'Yes, we serve clients across 25+ countries with offices in India and the US. We handle cross-border compliance, visa processing, and global talent mobility.',
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.contacts.submit({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        subject: form.service || 'General Inquiry',
        message: form.message,
        type: 'client',
      });
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', company: '', service: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center gradient-hero overflow-hidden">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-transparent to-navy-950/80" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.h1
            className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Let's <span className="gradient-text">Connect</span>
          </motion.h1>
          <motion.p
            className="text-lg text-surface-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Have a hiring challenge? Looking for career guidance? We're here to help.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Contact Form + Info */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <ScrollReveal direction="left" className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-elevated border border-surface-100 p-8 md:p-10">
                <h2 className="font-heading font-bold text-2xl text-navy-900 mb-2">Send Us a Message</h2>
                <p className="text-slate-500 mb-8">Fill out the form and our team will respond within 24 hours.</p>

                {submitted ? (
                  <motion.div className="flex flex-col items-center py-16 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="font-heading font-bold text-2xl text-navy-900 mb-2">Message Sent!</h3>
                    <p className="text-slate-500">Our team will get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-navy-900 mb-2">Full Name *</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} required
                          className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm" placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-900 mb-2">Work Email *</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} required
                          className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm" placeholder="john@company.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-navy-900 mb-2">Phone</label>
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm" placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-900 mb-2">Company</label>
                        <input type="text" name="company" value={form.company} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm" placeholder="Your Company"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-2">Service Interest</label>
                      <select name="service" value={form.service} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm cursor-pointer"
                      >
                        <option value="">Select a service</option>
                        <option value="it-staffing">IT Staffing</option>
                        <option value="contract-staffing">Contract Staffing</option>
                        <option value="permanent-staffing">Permanent Staffing</option>
                        <option value="executive-hiring">Executive Hiring</option>
                        <option value="rpo">RPO Solutions</option>
                        <option value="talent-acquisition">Talent Acquisition</option>
                        <option value="ai-recruitment">AI Recruitment</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-2">Message *</label>
                      <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm resize-none" placeholder="Tell us about your hiring needs..."
                      />
                    </div>
                    <Button type="submit" variant="primary" size="lg" icon={Send} className="w-full sm:w-auto" disabled={loading}>
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* Info */}
            <ScrollReveal direction="right" className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-card border border-surface-200 overflow-hidden">
                <iframe
                  src={COMPANY.mapEmbedUrl}
                  className="w-full h-56"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="VDORT Office Location"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-card border border-surface-200 p-6 space-y-5">
                <h3 className="font-heading font-bold text-lg text-navy-900">Our Offices</h3>
                {[
                  { label: 'India HQ', address: COMPANY.address },
                  { label: 'US Office', address: COMPANY.addressUS },
                ].map((office) => (
                  <div key={office.label} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-brand-500" />
                    </div>
                    <div>
                      <p className="font-medium text-navy-900 text-sm">{office.label}</p>
                      <p className="text-slate-500 text-sm mt-0.5">{office.address}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-brand-500" />
                  </div>
                  <a href={`mailto:${COMPANY.email}`} className="text-brand-500 text-sm hover:underline font-medium">{COMPANY.email}</a>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-brand-500" />
                  </div>
                  <div>
                    <a href={`tel:${COMPANY.phone}`} className="text-brand-500 text-sm hover:underline font-medium block">{COMPANY.phone}</a>
                    <a href={`tel:${COMPANY.phoneAlt}`} className="text-slate-500 text-sm hover:underline block">{COMPANY.phoneAlt}</a>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-brand-500" />
                  </div>
                  <div>
                    <p className="text-navy-900 text-sm font-medium">Mon - Fri</p>
                    <p className="text-slate-500 text-sm">9:00 AM - 6:00 PM IST</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-surface-50">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            overline="FAQ"
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about our services."
          />

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-card">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer hover:bg-surface-50 transition-colors"
                  >
                    <span className="font-heading font-semibold text-navy-900 pr-4">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-slate-600 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
