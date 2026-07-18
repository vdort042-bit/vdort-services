import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, ArrowRight, User, Phone,
  Eye, EyeOff, UserPlus, LogIn, ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../firebase/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export default function Login() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else navigate('/student', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign-up fields
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  // ── Handle Login (Firebase Auth) ──
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );

      // Navigate immediately — AuthContext updates in background
      navigate('/student', { replace: true });

      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        navigate('/admin', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/invalid-email'
      ) {
        setError('Invalid email or password. Please check and try again.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please wait a few minutes and try again.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Handle Sign-Up ──
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (signUpPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // All public signups are candidates
    if (!selectedRole) setSelectedRole('student');

    setLoading(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signUpEmail,
        signUpPassword
      );
      const uid = userCredential.user.uid;

      // Prepare user data
      const userData = {
        uid,
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        lastName: lastName.trim(),
        email: signUpEmail.trim(),
        phone: phone.trim(),
        role: 'student',
        createdAt: serverTimestamp(),
      };

      // Store in 'users' collection
      await setDoc(doc(db, 'users', uid), userData);

      const roleCollection = 'students';
      await setDoc(doc(db, roleCollection, uid), userData);

      setSuccess('Account created! Redirecting to resume form...');
      resetSignUpForm();
      setTimeout(() => navigate('/student', { replace: true }), 1000);
    } catch (err) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters');
      } else if (err.code === 'permission-denied' || err.code === 'firestore/permission-denied') {
        setError('Account created but profile save failed. Please login directly.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetSignUpForm = () => {
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setSignUpEmail('');
    setPhone('');
    setSignUpPassword('');
    setConfirmPassword('');
    setSelectedRole('');
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleForgotPassword = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setForgotSent(true);
      setSuccess(forgotEmail);
      startResendCooldown();
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
        // Still show sent screen for security (don't reveal if email exists)
        setForgotSent(true);
        setSuccess(forgotEmail);
        startResendCooldown();
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please wait a few minutes before trying again.');
      } else {
        setError(err.message || 'Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchToSignUp = () => {
    setIsSignUp(true);
    setIsForgot(false);
    setError('');
    setSuccess('');
  };

  const switchToLogin = () => {
    setIsSignUp(false);
    setIsForgot(false);
    setError('');
    setSuccess('');
    setForgotEmail('');
  };

  const switchToForgot = () => {
    setIsForgot(true);
    setIsSignUp(false);
    setError('');
    setSuccess('');
    setForgotSent(false);
    setForgotEmail('');
  };

  // ── Shared input styles ──
  const inputClass =
    'w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm transition-all duration-200';

  const leftContent = isForgot
    ? { heading: 'Reset Your Password', sub: 'Enter your registered email and we\'ll send you a reset link right away.', features: ['Quick & secure reset link', 'Check your spam folder too', 'Contact support if needed'] }
    : isSignUp
    ? { heading: 'Create Your Account', sub: 'Register to submit your resume and connect with VDORT recruitment team.', features: ['Upload resume in one step', 'Quick registration', 'Team contacts you within 24 hours'] }
    : { heading: 'Welcome back.', sub: 'Sign in to submit your resume and connect with VDORT.', features: ['Submit your resume', 'Quick & easy form', 'Team reviews within 24 hours'] };

  return (
    <div className="min-h-screen flex" style={{ background: '#0d1117' }}>

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-10 xl:p-14 relative overflow-hidden" style={{ background: '#161b22' }}>
        {/* subtle grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10">
          {/* Logo */}
          <Link to="/">
            <Logo className="h-20 w-auto max-w-[280px] object-contain mb-10" />
          </Link>

          {/* Dynamic heading */}
          <AnimatePresence mode="wait">
            <motion.div key={isForgot ? 'forgot' : isSignUp ? 'signup' : 'login'}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-heading font-bold text-3xl xl:text-4xl text-white mb-4 leading-tight">
                {leftContent.heading}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
                {leftContent.sub}
              </p>
              <ul className="space-y-4">
                {leftContent.features.map((f, i) => (
                  <li key={f} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-xs text-brand-400 font-bold shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-slate-300 text-sm font-medium">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 overflow-y-auto">

        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link to="/">
            <Logo className="h-14 w-auto max-w-[220px] object-contain" />
          </Link>
        </div>

        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
        <AnimatePresence mode="wait">
          {isForgot ? (
            /* ═══════════════════ FORGOT PASSWORD FORM ═══════════════════ */
            <motion.div
              key="forgot-form"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl p-7 border border-white/8 shadow-2xl"
              style={{ background: '#1c2128' }}
            >
              {/* Back to website */}
              <Link to="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-white text-xs font-medium mb-6 transition-colors group">
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to Website
              </Link>
              {!forgotSent ? (
                /* Step 1: Enter email */
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="font-heading font-bold text-2xl text-white mb-2">Reset Password</h1>
                    <p className="text-surface-300 text-sm">Enter your email to receive a reset link</p>
                  </div>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                      {error}
                    </motion.div>
                  )}
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                      <input type="email" placeholder="Your registered email" value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)} required className={inputClass} />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2">
                      {loading
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                        : <><ArrowRight className="w-4 h-4" /> Send Reset Link</>}
                    </button>
                  </form>
                </>
              ) : (
                /* Step 2: Email sent confirmation */
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="font-heading font-bold text-2xl text-white mb-2">Check Your Email</h1>
                  <p className="text-surface-300 text-sm mb-1">Reset link sent to:</p>
                  <p className="text-brand-400 font-semibold text-sm mb-6">{success}</p>

                  {/* Tips box */}
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-left mb-6 space-y-2">
                    <p className="text-amber-400 font-semibold text-xs uppercase tracking-wide mb-2">⚠️ Email nahi aaya?</p>
                    <p className="text-surface-300 text-xs">• <strong className="text-white">Spam / Junk folder</strong> check karein — Firebase emails wahan jaate hain</p>
                    <p className="text-surface-300 text-xs">• Email sender: <span className="text-brand-400">noreply@vdort-28207.firebaseapp.com</span></p>
                    <p className="text-surface-300 text-xs">• Email aane mein <strong className="text-white">1-2 minute</strong> lag sakte hain</p>
                    <p className="text-surface-300 text-xs">• Gmail use kar rahe ho? <strong className="text-white">Promotions tab</strong> bhi check karein</p>
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                      {error}
                    </motion.div>
                  )}

                  <button onClick={() => handleForgotPassword()} disabled={loading || resendCooldown > 0}
                    className="w-full py-3 rounded-xl border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 disabled:opacity-40 transition-all text-sm font-medium mb-3">
                    {loading ? 'Sending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : '↻ Resend Email'}
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-surface-300/60 text-xs uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <button onClick={switchToLogin}
                className="w-full py-3.5 rounded-xl border border-white/15 text-white font-semibold hover:bg-white/5 hover:border-white/25 transition-all flex items-center justify-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back to Sign In
              </button>
            </motion.div>
          ) : !isSignUp ? (
            /* ═══════════════════ LOGIN FORM ═══════════════════ */
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl p-7 border border-white/8 shadow-2xl"
              style={{ background: '#1c2128' }}
            >
              {/* Back to website */}
              <Link to="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-white text-xs font-medium mb-6 transition-colors group">
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to Website
              </Link>
              {/* Header */}
              <div className="mb-7">
                <h1 className="font-heading font-bold text-2xl text-white mb-1">Sign In</h1>
                <p className="text-slate-400 text-sm">Enter your credentials to access your dashboard</p>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
                <input type="text" name="fake-user" style={{ display: 'none' }} readOnly />
                <input type="password" name="fake-pass" style={{ display: 'none' }} readOnly />
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="Email address"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    autoComplete="off"
                    className={inputClass}
                  />
                </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                    <button type="button" onClick={switchToForgot} className="text-brand-400 hover:text-brand-300 text-xs font-medium transition-colors">
                      Forgot password?
                    </button>
                  </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className={`${inputClass} pr-11`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                </div>

                {/* Sign In Button */}
                <button
                  id="login-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-accent-400 text-white font-semibold hover:shadow-glow disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-surface-300/60 text-xs uppercase tracking-wider">
                  or
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Create Account Link */}
              <button
                id="switch-to-signup"
                onClick={switchToSignUp}
                className="w-full py-3.5 rounded-xl border border-white/15 text-white font-semibold hover:bg-white/5 hover:border-white/25 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Create Account
              </button>
            </motion.div>
          ) : (
            /* ═══════════════════ SIGN UP FORM ═══════════════════ */
            <motion.div
              key="signup-form"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl p-7 border border-white/8 shadow-2xl"
              style={{ background: '#1c2128' }}
            >
              {/* Back to website */}
              <Link to="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-white text-xs font-medium mb-6 transition-colors group">
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to Website
              </Link>
              {/* Header */}
              <div className="mb-7">
                <h1 className="font-heading font-bold text-2xl text-white mb-1">Create Your Account</h1>
                <p className="text-slate-400 text-sm">Start your journey to your dream IT job</p>
              </div>

              {/* Error / Success */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center"
                >
                  {success}
                </motion.div>
              )}

              <form onSubmit={handleSignUp} className="space-y-3.5">
                {/* Name Row: First / Middle / Last */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                    <input
                      id="signup-first-name"
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full pl-9 pr-2 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-surface-300/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <input
                      id="signup-middle-name"
                      type="text"
                      placeholder="Middle Name"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      className="w-full px-3 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-surface-300/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <input
                      id="signup-last-name"
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-3 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-surface-300/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="Email address"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

                {/* Phone */}
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                  <input
                    id="signup-phone"
                    type="tel"
                    placeholder="Phone number (10 digits)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    maxLength={10}
                    className={inputClass}
                  />
                </div>

                {/* Role auto-assigned as candidate — hidden */}
                <input type="hidden" value="student" />

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                    minLength={6}
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-300 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                  <input
                    id="signup-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className={inputClass}
                  />
                </div>

                {/* Create Account Button */}
                <button
                  id="signup-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:shadow-glow disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-1"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-surface-300/60 text-xs uppercase tracking-wider">
                  or
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Back to Login */}
              <button
                id="switch-to-login"
                onClick={switchToLogin}
                className="w-full py-3.5 rounded-xl border border-white/15 text-white font-semibold hover:bg-white/5 hover:border-white/25 transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Sign In
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
