import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Briefcase, User, FileText, LogOut, Menu, X,
  ChevronRight, GraduationCap, MoreVertical,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', path: '/student', icon: LayoutDashboard, end: true },
  { label: 'Browse Jobs', path: '/student/jobs', icon: Briefcase },
  { label: 'My Applications', path: '/student/applications', icon: FileText },
  { label: 'My Profile', path: '/student/profile', icon: User },
];

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ─── SIDEBAR ─── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            {/* Sidebar Panel */}
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 bg-navy-950 shadow-2xl"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-5 border-b border-white/10 flex items-center justify-between">
                  <Link to="/" className="flex items-center gap-3 group" onClick={() => setSidebarOpen(false)}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-heading font-bold text-base">Student Portal</span>
                      <span className="block text-[10px] text-green-400 uppercase tracking-widest">VDORT</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-white/70" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1.5">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-green-500/15 text-green-400 border border-green-500/20 shadow-sm'
                            : 'text-surface-300 hover:text-white hover:bg-white/5'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </NavLink>
                  ))}
                </nav>

                {/* User Info + Logout */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex items-center gap-3 px-3 py-3 mb-3 bg-white/5 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-green-500/20">
                      {user?.firstName?.[0] || user?.name?.[0] || 'S'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
                      <p className="text-surface-400 text-xs truncate">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── MAIN AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 lg:px-8 h-16 flex items-center gap-4 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <MoreVertical className="w-5 h-5 text-slate-600" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center lg:hidden">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-heading font-semibold text-base lg:text-lg text-navy-900">
              Student Dashboard
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link to="/" className="text-sm text-green-600 hover:text-green-700 font-medium hidden sm:block">
              View Website →
            </Link>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {user?.firstName?.[0] || 'S'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
