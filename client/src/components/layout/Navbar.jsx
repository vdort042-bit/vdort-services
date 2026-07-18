import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, LogIn } from 'lucide-react';
import { NAV_LINKS, COMPANY } from '../../utils/constants';
import Logo from '../ui/Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : 'shadow-sm border-b border-gray-100'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Brand text */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <Logo className="h-10 sm:h-12 w-auto max-w-[180px] sm:max-w-[220px] object-contain" />
        </Link>

        {/* Tablet+ Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/60'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Tablet+ CTAs */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0">
          <a
            href={`tel:${COMPANY.phoneRaw}`}
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
          >
            <Phone className="w-4 h-4 text-brand-500" />
            <span className="hidden xl:inline">{COMPANY.phone}</span>
            <span className="xl:hidden">Call Us</span>
          </a>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-600 transition-colors shadow-sm shadow-brand-500/20 min-h-[38px]"
          >
            <LogIn className="w-4 h-4" /> Login
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <NavLink
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        isActive
                          ? 'text-brand-600 bg-brand-50'
                          : 'text-slate-700 hover:text-brand-600 hover:bg-brand-50/60'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
                <a
                  href={`tel:${COMPANY.phoneRaw}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-gray-50 transition-colors"
                >
                  <Phone className="w-4 h-4 text-brand-500" />
                  Call Us Now
                </a>
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 transition-colors"
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
