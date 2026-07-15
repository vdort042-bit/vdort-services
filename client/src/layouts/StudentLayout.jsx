import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StudentNotificationBell from '../components/student/StudentNotificationBell';

export default function StudentLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-3 sm:px-4 lg:px-8 min-h-16 py-2 flex items-center gap-2 sm:gap-4 shadow-sm">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-semibold text-navy-900 hidden sm:block text-sm">VDORT</span>
        </Link>

        <h1 className="font-heading font-semibold text-sm sm:text-base text-navy-900 truncate min-w-0 flex-1">
          <span className="sm:hidden">Resume</span>
          <span className="hidden sm:inline">Resume Submission</span>
        </h1>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 shrink-0">
          <StudentNotificationBell />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 min-h-[44px] rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-3 sm:p-4 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
