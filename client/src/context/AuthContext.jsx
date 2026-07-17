import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
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
          const jwtUser = await exchangeFirebaseForJwt(firebaseUser);
          if (jwtUser?.role === 'admin' || jwtUser?.role === 'client') {
            setUser({ ...jwtUser, uid: firebaseUser.uid, authType: 'firebase-jwt' });
            setLoading(false);
            return;
          }

          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          const data = snap.exists() ? snap.data() : {};
          const role = (data.role || 'student').toLowerCase();
          const name = [data.firstName, data.lastName].filter(Boolean).join(' ') || firebaseUser.displayName || firebaseUser.email;

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

  // Admin/client login — JWT first, then Firebase Auth fallback for console-created admins
  const login = useCallback(async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (auth.currentUser) {
      await signOut(auth);
    }

    try {
      const res = await api.auth.login(normalizedEmail, password);
      localStorage.setItem('vdort_token', res.data.token);
      const rawUser = res.data.user;
      const u = { ...rawUser, uid: rawUser.uid || rawUser.id, id: rawUser.id || rawUser.uid, authType: 'jwt' };
      setUser(u);
      return u;
    } catch {
      // JWT failed — try Firebase Auth (admins created in Firebase Console)
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const jwtUser = await exchangeFirebaseForJwt(cred.user);
      if (!jwtUser || (jwtUser.role !== 'admin' && jwtUser.role !== 'client')) {
        await signOut(auth);
        throw new Error('Admin account setup incomplete. Firestore users mein email + role: admin check karein.');
      }

      const u = { ...jwtUser, uid: cred.user.uid, authType: 'firebase-jwt' };
      setUser(u);
      return u;
    } catch (err) {
      if (auth.currentUser) await signOut(auth);
      localStorage.removeItem('vdort_token');

      const code = err?.code || '';
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential' ||
        code === 'auth/invalid-email'
      ) {
        throw new Error('Invalid email or password');
      }
      throw new Error(err.message || 'Invalid credentials');
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
