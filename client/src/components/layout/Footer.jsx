import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, ArrowRight, Heart, Send, Globe,
} from 'lucide-react';

// Inline social brand icons (Lucide doesn't export brand icons)
const LinkedinIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);
const TwitterIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const FacebookIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const InstagramIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
import { COMPANY, NAV_LINKS } from '../../utils/constants';
import api from '../../services/api';
import { useState } from 'react';

const footerLinks = {
  company: [
    { label: 'About Us', path: '/about' },
    { label: 'Our Team', path: '/about#team' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', path: '/contact' },
  ],
  services: [
    { label: 'IT Staffing', path: '/services#it-staffing' },
    { label: 'Contract Staffing', path: '/services#contract-staffing' },
    { label: 'Executive Hiring', path: '/services#executive-hiring' },
    { label: 'RPO Solutions', path: '/services#rpo' },
    { label: 'AI Recruitment', path: '/ai-recruitment' },
  ],
  resources: [
    { label: 'Industries', path: '/industries' },
    { label: 'Client Portal', path: '/client/login' },
    { label: 'Admin Portal', path: '/admin/login' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms & Conditions', path: '/terms-conditions' },
  ],
};

const socialLinks = [
  { icon: LinkedinIcon, href: COMPANY.linkedin, label: 'LinkedIn' },
  { icon: TwitterIcon, href: COMPANY.twitter, label: 'Twitter' },
  { icon: FacebookIcon, href: COMPANY.facebook, label: 'Facebook' },
  { icon: InstagramIcon, href: COMPANY.instagram, label: 'Instagram' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await api.subscribers.subscribe(email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    } catch {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative gradient-bg overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-400/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="py-12 border-b border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-heading font-bold text-2xl mb-2">
                Stay Ahead in Talent
              </h3>
              <p className="text-surface-300 text-sm">
                Get the latest insights on AI recruitment, industry trends, and career opportunities.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full md:w-auto gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 sm:w-72 px-5 py-3 bg-white/5 border border-white/10 rounded-t-xl sm:rounded-t-xl sm:rounded-tr-none sm:rounded-l-xl sm:rounded-bl-xl text-white placeholder:text-surface-300 focus:outline-none focus:border-brand-500 transition-colors text-sm min-h-[44px]"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-b-xl sm:rounded-b-none sm:rounded-r-xl hover:from-brand-500 hover:to-brand-400 transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm cursor-pointer min-h-[44px]"
              >
                {subscribed ? '✓ Subscribed' : <><Send className="w-4 h-4" /> Subscribe</>}
              </button>
            </form>
          </div>
        </div>

        {/* Main footer */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center">
                <span className="text-white font-heading font-bold text-xl">V</span>
              </div>
              <span className="text-white font-heading font-bold text-xl">VDORT</span>
            </Link>
            <p className="text-surface-300 text-sm leading-relaxed mb-6">
              {COMPANY.expansion}. Leveraging AI and technology to transform how organizations find and hire top talent globally.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-surface-300 hover:text-white hover:bg-brand-500/20 hover:border-brand-500/30 transition-all duration-300"
                  whileHover={{ y: -2 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-surface-300 hover:text-brand-400 transition-colors text-sm flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-6">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-surface-300 hover:text-brand-400 transition-colors text-sm flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-400 mt-1 shrink-0" />
                <span className="text-surface-300 text-sm leading-relaxed">{COMPANY.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a href={`mailto:${COMPANY.email}`} className="text-surface-300 hover:text-brand-400 transition-colors text-sm">
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <a href={`tel:${COMPANY.phone}`} className="text-surface-300 hover:text-brand-400 transition-colors text-sm">
                  {COMPANY.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Company Registration Trust Bar */}
        <div className="py-4 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
            <span className="text-surface-300/50 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500/60 inline-block" />
              Incorporated under Companies Act 2013
            </span>
            <span className="text-surface-300/50 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500/60 inline-block" />
              CIN: {COMPANY.cin}
            </span>
            <span className="text-surface-300/50 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500/60 inline-block" />
              GSTIN: {COMPANY.gstin}
            </span>
            <span className="text-surface-300/50 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500/60 inline-block" />
              Registered in {COMPANY.registeredAddress}
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-surface-300/60 text-xs">
            © {new Date().getFullYear()} {COMPANY.fullName} All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="text-surface-300/60 hover:text-surface-300 text-xs transition-colors">Privacy Policy</Link>
            <Link to="/terms-conditions" className="text-surface-300/60 hover:text-surface-300 text-xs transition-colors">Terms & Conditions</Link>
          </div>
          <p className="text-surface-300/40 text-xs flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> by VDORT
          </p>
        </div>
      </div>
    </footer>
  );
}
