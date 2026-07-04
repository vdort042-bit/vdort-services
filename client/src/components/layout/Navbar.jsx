import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, LogIn } from 'lucide-react';
import { NAV_LINKS } from '../../utils/constants';
import Button from '../ui/Button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-dark shadow-elevated py-3'
          : 'bg-transparent py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:shadow-brand-500/50 transition-shadow duration-300">
            <span className="text-white font-heading font-bold text-xl">V</span>
          </div>
          <div>
            <span className="text-white font-heading font-bold text-xl tracking-tight">
              VDORT
            </span>
            <span className="hidden sm:block text-[10px] text-surface-300 tracking-[0.15em] uppercase -mt-0.5">
              Services
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'text-brand-400 bg-brand-500/10'
                    : 'text-surface-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right CTAs */}
        <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
          <Link to="/login">
            <Button variant="ghost" size="sm" icon={LogIn}>
              Login
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="primary" size="sm" iconRight={ArrowRight}>
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
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
            className="lg:hidden absolute top-full left-0 right-0 glass-dark border-t border-white/10 shadow-elevated"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <NavLink
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-brand-400 bg-brand-500/10'
                          : 'text-surface-300 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
                <Link to="/login" className="block">
                  <Button variant="secondary" size="md" icon={LogIn} className="w-full justify-center">
                    Candidate Login
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="primary" size="md" iconRight={ArrowRight} className="w-full justify-center">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
