import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { COMPANY } from '../../utils/constants';
import api from '../../services/api';
import SectionHeading from '../ui/SectionHeading';
import ScrollReveal from '../ui/ScrollReveal';
import Button from '../ui/Button';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <section id="contact" className="section-padding bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          overline="Get In Touch"
          title="Let's Build Your Dream Team"
          subtitle="Ready to transform your hiring? Reach out to our team and we'll craft a tailored recruitment solution."
        />

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <ScrollReveal direction="left" className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-card border border-surface-200 p-8 md:p-10">
              {submitted ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-16 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
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
                      <input
                        type="text" name="name" value={form.name} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-2">Work Email *</label>
                      <input
                        type="email" name="email" value={form.email} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-2">Phone</label>
                      <input
                        type="tel" name="phone" value={form.phone} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-2">Company</label>
                      <input
                        type="text" name="company" value={form.company} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm"
                        placeholder="Your Company"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-900 mb-2">Service Interest</label>
                    <select
                      name="service" value={form.service} onChange={handleChange}
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
                    <textarea
                      name="message" value={form.message} onChange={handleChange} required rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm resize-none"
                      placeholder="Tell us about your hiring needs..."
                    />
                  </div>
                  <Button type="submit" variant="primary" size="lg" icon={Send} className="w-full sm:w-auto" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Inquiry'}
                  </Button>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </form>
              )}
            </div>
          </ScrollReveal>

          {/* Info */}
          <ScrollReveal direction="right" className="lg:col-span-2 space-y-6">
            {/* Map */}
            <div className="bg-white rounded-2xl shadow-card border border-surface-200 overflow-hidden">
              <iframe
                src={COMPANY.mapEmbedUrl}
                className="w-full h-48"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="VDORT Office Location"
              />
            </div>

            {/* Office Info */}
            <div className="bg-white rounded-2xl shadow-card border border-surface-200 p-6 space-y-5">
              <h3 className="font-heading font-bold text-lg text-navy-900">Office Information</h3>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <p className="font-medium text-navy-900 text-sm">India Office</p>
                  <p className="text-slate-500 text-sm mt-0.5">{COMPANY.address}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <p className="font-medium text-navy-900 text-sm">US Office</p>
                  <p className="text-slate-500 text-sm mt-0.5">{COMPANY.addressUS}</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <p className="font-medium text-navy-900 text-sm">Email</p>
                  <a href={`mailto:${COMPANY.email}`} className="text-brand-500 text-sm hover:underline">{COMPANY.email}</a>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <p className="font-medium text-navy-900 text-sm">Phone</p>
                  <a href={`tel:${COMPANY.phone}`} className="text-brand-500 text-sm hover:underline">{COMPANY.phone}</a>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <p className="font-medium text-navy-900 text-sm">Business Hours</p>
                  <p className="text-slate-500 text-sm">Mon - Fri: 9:00 AM - 6:00 PM IST</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
