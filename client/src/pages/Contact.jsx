import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ChevronDown } from 'lucide-react';
import { COMPANY } from '../utils/constants';
import SectionHeading from '../components/ui/SectionHeading';
import ScrollReveal from '../components/ui/ScrollReveal';

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
    a: 'Yes, we serve clients in the United States with expertise in US hiring, compliance, and talent mobility.',
  },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      {/* Hero */}
      <section className="pt-16 bg-gradient-to-br from-brand-600 via-brand-500 to-violet-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <motion.span
            className="inline-block text-xs font-bold uppercase tracking-widest text-white/80 mb-4"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          >
            Get In Touch
          </motion.span>
          <motion.h1
            className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-5 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Let's <span className="text-yellow-300">Connect</span>
          </motion.h1>
          <motion.p
            className="text-brand-100 max-w-2xl mx-auto text-base sm:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Looking for career guidance or have a question? We're here to help you every step of the way.
          </motion.p>
        </div>
        <div className="h-10 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* Contact Info */}
      <section className="section-padding bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="bg-white rounded-2xl shadow-card border border-surface-200 p-6 sm:p-8 space-y-5">
              <h3 className="font-heading font-bold text-xl text-navy-900">Our Office</h3>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <p className="font-medium text-navy-900 text-sm">VDORT Services</p>
                  <p className="text-slate-500 text-sm mt-0.5">
                    {COMPANY.addressLines.map((line, i) => (
                      <span key={line}>
                        {line}
                        {i < COMPANY.addressLines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
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
                <a href={`tel:${COMPANY.phoneRaw}`} className="text-brand-500 text-sm hover:underline font-medium block">{COMPANY.phone}</a>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <p className="text-navy-900 text-sm font-medium">Mon - Fri</p>
                  <p className="text-slate-500 text-sm">9:30 AM - 6:30 PM EST</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-surface-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
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
                    <span className="font-heading font-semibold text-navy-900 pr-4 break-words">{faq.q}</span>
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
