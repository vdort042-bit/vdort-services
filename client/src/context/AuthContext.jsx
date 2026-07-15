import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import api from '../services/api';

// Exchange Firebase ID token for backend JWT (needed for admin/client API calls)
async function exchangeFirebaseForJwt(firebaseUser) {
  try {
    const idToken = await firebaseUser.getIdToken();
    const res = await api.auth.firebaseExchange(idToken);
    localStorage.setItem('vdort_token', res.data.token);
    return res.data.user;
  } catch {
    return null;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          const data = snap.exists() ? snap.data() : {};
          const role = data.role || 'student';
          const name = [data.firstName, data.lastName].filter(Boolean).join(' ') || firebaseUser.displayName || firebaseUser.email;

          // Admin/Client with Firebase Auth → exchange for JWT so backend APIs work
          if (role === 'admin' || role === 'client') {
            const jwtUser = await exchangeFirebaseForJwt(firebaseUser);
            if (jwtUser) {
              setUser({ ...jwtUser, uid: firebaseUser.uid, authType: 'firebase-jwt' });
              setLoading(false);
              return;
            }
          }

          // Student — Firebase auth only (clear stale admin JWT)
          localStorage.removeItem('vdort_token');
          setUser({
            uid: firebaseUser.uid,
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            phone: data.phone || '',
            role,
            company: data.company || '',
            authType: 'firebase',
          });
        } catch (err) {
          console.error('Firestore user fetch error:', err);
          localStorage.removeItem('vdort_token');
          setUser({
            uid: firebaseUser.uid,
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email,
            firstName: '',
            lastName: '',
            phone: '',
            role: 'student',
            authType: 'firebase',
          });
        }
      } else {
        // No Firebase user — check JWT (for admin@vdort.com / client@vdort.com)
        const token = localStorage.getItem('vdort_token');
        if (token) {
          try {
            const res = await api.auth.me();
            const raw = res.data;
            setUser({ ...raw, uid: raw.uid || raw.id, id: raw.id || raw.uid, authType: 'jwt' });
          } catch {
            localStorage.removeItem('vdort_token');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // JWT login (for admin/client portals via /admin/login, /client/login)
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await api.auth.login(email, password);
      localStorage.setItem('vdort_token', res.data.token);
      const rawUser = res.data.user;
      const u = { ...rawUser, uid: rawUser.uid || rawUser.id, id: rawUser.id || rawUser.uid, authType: 'jwt' };
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  }, []);

  // Universal logout
  const logout = useCallback(async () => {
    localStorage.removeItem('vdort_token');
    if (auth.currentUser) {
      await signOut(auth);
    }
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isClient, isStudent }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
