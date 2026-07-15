import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText,
  LogOut, Menu, X, ChevronRight, BarChart3, UserCog,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard',   path: '/admin',              icon: LayoutDashboard, end: true },
  { label: 'Resumes',     path: '/admin/applications', icon: FileText },
  { label: 'Candidates',  path: '/admin/users',        icon: UserCog },
];

const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/applications': 'Resume Submissions',
  '/admin/users': 'Candidates',
  '/admin/jobs': 'Job Management',
  '/admin/contacts': 'Contact Inquiries',
  '/admin/subscribers': 'Subscribers',
  '/admin/testimonials': 'Testimonials',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || 'Admin Panel';

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-navy-950 border-r border-navy-800 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-navy-800 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">V</span>
              </div>
              <div>
                <span className="text-white font-heading font-bold text-lg">VDORT</span>
                <span className="block text-[10px] text-brand-400 uppercase tracking-widest">Admin Panel</span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-surface-300 hover:text-white hover:bg-white/10 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px] ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                      : 'text-surface-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-navy-800">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-sm">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                <p className="text-surface-300 text-xs truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-navy-950/60 z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-surface-200 px-3 sm:px-4 lg:px-8 py-3 sm:py-4 flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 min-w-[44px] min-h-[44px] rounded-xl hover:bg-surface-100 cursor-pointer flex items-center justify-center shrink-0" aria-label="Open menu">
            <Menu className="w-5 h-5 text-navy-900" />
          </button>
          <div className="flex items-center gap-2 text-navy-900 min-w-0 flex-1">
            <BarChart3 className="w-5 h-5 text-brand-500 shrink-0" />
            <h1 className="font-heading font-semibold text-base sm:text-lg truncate">{pageTitle}</h1>
          </div>
          <Link to="/" className="hidden sm:inline text-sm text-brand-500 hover:text-brand-600 font-medium shrink-0 whitespace-nowrap">
            View Website →
          </Link>
        </header>

        <main className="flex-1 p-3 sm:p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
