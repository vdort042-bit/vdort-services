import { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import api from '../../services/api';

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700',
  reviewing: 'bg-amber-100 text-amber-700',
  shortlisted: 'bg-green-100 text-green-700',
  interviewed: 'bg-purple-100 text-purple-700',
  hired: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

const STATUS_MESSAGES = {
  reviewing: 'Your application is being reviewed by our team.',
  shortlisted: 'Your resume is shortlisted.',
  interviewed: 'You have been selected for an interview.',
  hired: 'Congratulations! You have been hired.',
  rejected: 'Your application was not selected at this time.',
};

function getTitle(status) {
  if (status === 'shortlisted') return 'Your resume is shortlisted';
  if (status === 'hired') return 'You have been hired';
  if (status === 'rejected') return 'Application not selected';
  if (status === 'interviewed') return 'Interview scheduled';
  if (status === 'reviewing') return 'Under review';
  return `Status: ${status}`;
}

function formatTime(value) {
  if (!value) return '';
  let d;
  if (typeof value === 'string') d = new Date(value);
  else if (value?._seconds) d = new Date(value._seconds * 1000);
  else if (value?.seconds) d = new Date(value.seconds * 1000);
  else d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

function appsToNotifications(apps) {
  return apps
    .filter((a) => a.status && a.status !== 'new')
    .map((a) => ({
      id: `status_${a.id}`,
      applicationId: a.id,
      status: a.status,
      title: getTitle(a.status),
      message: STATUS_MESSAGES[a.status] || `Your application status is now: ${a.status}`,
      read: false,
      createdAt: a.createdAt,
    }))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

export default function StudentNotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const panelRef = useRef(null);

  const fetchNotifications = async () => {
    if (!auth.currentUser) return;
    try {
      const res = await api.applications.mine();
      setNotifications(appsToNotifications(res.data || []));
    } catch (err) {
      console.error('Notifications fetch error:', err);
      try {
        const res = await api.notifications.list();
        setNotifications(res.data || []);
      } catch {
        setNotifications([]);
      }
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setReady(!!firebaseUser);
      if (firebaseUser) fetchNotifications();
      else setNotifications([]);
    });
    const interval = setInterval(() => {
      if (auth.currentUser) fetchNotifications();
    }, 15000);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setLoading(true);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setLoading(false);
  };

  const handleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next && ready) fetchNotifications();
  };

  const handleClickNotif = (notif) => {
    if (!notif.read) markRead(notif.id);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={handleOpen}
        className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-navy-900 text-sm">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    disabled={loading}
                    className="text-xs text-brand-600 hover:text-brand-700 font-medium cursor-pointer disabled:opacity-50"
                  >
                    Mark all read
                  </button>
                )}
                <button type="button" onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-slate-200 cursor-pointer">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  No notifications yet
                  <p className="text-xs mt-2 text-slate-400">Status updates will appear here</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <button
                    key={notif.id}
                    type="button"
                    onClick={() => handleClickNotif(notif)}
                    className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${
                      !notif.read ? 'bg-brand-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold capitalize shrink-0 ${
                        STATUS_COLORS[notif.status] || 'bg-slate-100 text-slate-600'
                      }`}>
                        {notif.status}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notif.read ? 'font-semibold text-navy-900' : 'text-slate-700'}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{formatTime(notif.createdAt)}</p>
                      </div>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-2" />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
