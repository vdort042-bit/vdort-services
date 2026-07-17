import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart, ArrowRight } from 'lucide-react';
import { COMPANY } from '../../utils/constants';

const LinkedinIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Careers', path: '/careers' },
  { label: 'Contact', path: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-5">
              <img src="/logo.png" alt="VDORT Services" className="h-12 w-auto object-contain brightness-200" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              {COMPANY.expansion}. Your trusted IT staffing partner for US placements.
            </p>
            <div className="flex gap-3">
              <a
                href={COMPANY.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-500/30 hover:border-brand-500/40 transition-all"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-slate-400 hover:text-brand-400 transition-colors text-sm group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <span className="text-slate-400 text-sm leading-relaxed">
                  {COMPANY.addressLines.map((line, i) => (
                    <span key={line}>
                      {line}
                      {i < COMPANY.addressLines.length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a href={`mailto:${COMPANY.email}`} className="text-slate-400 hover:text-brand-400 transition-colors text-sm">
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <a href={`tel:${COMPANY.phoneRaw}`} className="text-slate-400 hover:text-brand-400 transition-colors text-sm">
                  {COMPANY.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal strip */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 mb-3">
            {[
              `CIN: ${COMPANY.cin}`,
              `GSTIN: ${COMPANY.gstin}`,
              `Registered in ${COMPANY.registeredAddress}`,
            ].map((t) => (
              <span key={t} className="text-slate-500 text-xs">{t}</span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-500 text-xs">
              © {new Date().getFullYear()} {COMPANY.fullName}. All rights reserved.
            </p>
            <p className="text-slate-600 text-xs flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-400 fill-red-400 mx-0.5" /> by VDORT Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
