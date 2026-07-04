import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, ArrowRight, User, Phone, Users,
  Eye, EyeOff, UserPlus, LogIn, ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ParticleBackground from '../components/ui/ParticleBackground';
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
      else if (user.role === 'client') navigate('/client', { replace: true });
      else if (user.role === 'student') navigate('/student', { replace: true });
      else navigate('/', { replace: true });
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
      const uid = userCredential.user.uid;

      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;

        if (role === 'admin') navigate('/admin');
        else if (role === 'client') navigate('/client');
        else if (role === 'student') navigate('/student');
        else navigate('/');
      } else {
        navigate('/student');
      }
    } catch (err) {
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        setError('Invalid email or password');
      } else {
        setError(err.message || 'Login failed');
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

    if (!selectedRole) {
      setError('Please select your role — Candidate');
      return;
    }
    // Client accounts are created by admin only
    if (selectedRole === 'client') {
      setError('Client accounts are created by the admin. Please contact VDORT to register as a client.');
      return;
    }

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
        role: selectedRole,
        createdAt: serverTimestamp(),
      };

      // Store in 'users' collection
      await setDoc(doc(db, 'users', uid), userData);

      // Also store in role-specific collection (clients / students)
      const roleCollection = selectedRole === 'client' ? 'clients' : 'students';
      await setDoc(doc(db, roleCollection, uid), userData);

      setSuccess('Account created successfully! You can now sign in.');
      // Reset form and switch to login
      resetSignUpForm();
      setTimeout(() => {
        setIsSignUp(false);
        setSuccess('');
      }, 2000);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters');
      } else {
        setError(err.message || 'Registration failed');
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
    'w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-surface-300/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm transition-all duration-200';

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center relative overflow-hidden py-8 px-4">
      <ParticleBackground />
      <div className="absolute inset-0 bg-navy-950/60" />

      <motion.div
        className="relative z-10 w-full max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* VDORT Branding Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center shadow-lg shadow-brand-500/40 group-hover:shadow-brand-500/60 transition-shadow">
              <span className="text-white font-heading font-bold text-2xl">V</span>
            </div>
            <div className="text-left">
              <span className="text-white font-heading font-bold text-2xl tracking-tight block">VDORT</span>
              <span className="text-surface-300 text-xs tracking-widest uppercase">Services Pvt. Ltd.</span>
            </div>
          </Link>
        </div>
        <AnimatePresence mode="wait">
          {isForgot ? (
            /* ═══════════════════ FORGOT PASSWORD FORM ═══════════════════ */
            <motion.div
              key="forgot-form"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="glass-dark rounded-3xl p-8 md:p-10 border border-white/10 shadow-elevated"
            >
              {/* Back to website */}
              <Link to="/" className="inline-flex items-center gap-1.5 text-surface-300/70 hover:text-white text-xs font-medium mb-6 transition-colors group">
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
              className="glass-dark rounded-3xl p-8 md:p-10 border border-white/10 shadow-elevated"
            >
              {/* Back to website */}
              <Link to="/" className="inline-flex items-center gap-1.5 text-surface-300/70 hover:text-white text-xs font-medium mb-6 transition-colors group">
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to Website
              </Link>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
                <h1 className="font-heading font-bold text-3xl text-white mb-2">
                  Welcome Back
                </h1>
                <p className="text-surface-300 text-sm">
                  Sign in to your VDORT account
                </p>
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
                {/* hidden inputs to trick browser autofill */}
                <input type="text" name="fake-user" style={{ display: 'none' }} readOnly />
                <input type="password" name="fake-pass" style={{ display: 'none' }} readOnly />
                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
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

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
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

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={switchToForgot}
                    className="text-brand-400 hover:text-brand-300 text-xs font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
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
              className="glass-dark rounded-3xl p-8 md:p-10 border border-white/10 shadow-elevated"
            >
              {/* Back to website */}
              <Link to="/" className="inline-flex items-center gap-1.5 text-surface-300/70 hover:text-white text-xs font-medium mb-6 transition-colors group">
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to Website
              </Link>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h1 className="font-heading font-bold text-3xl text-white mb-2">
                  Create Account
                </h1>
                <p className="text-surface-300 text-sm">
                  Join VDORT today
                </p>
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
                <div className="grid grid-cols-3 gap-3">
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
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

                {/* Role Selection */}
                <div>
                  <p className="text-surface-300 text-xs font-medium mb-2 ml-1">Select your role</p>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Client */}
                    <button
                      type="button"
                      onClick={() => setSelectedRole('client')}
                      className={`relative p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                        selectedRole === 'client'
                          ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                          : 'border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        selectedRole === 'client' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-white/10'
                      }`}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                        </svg>
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-white font-semibold text-sm">Client</p>
                        <p className="text-surface-300 text-xs">Hire talent</p>
                      </div>
                      {selectedRole === 'client' && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </button>

                    {/* Student */}
                    <button
                      type="button"
                      onClick={() => setSelectedRole('student')}
                      className={`relative p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                        selectedRole === 'student'
                          ? 'border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                          : 'border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        selectedRole === 'student' ? 'bg-gradient-to-br from-green-500 to-emerald-500' : 'bg-white/10'
                      }`}>
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-white font-semibold text-sm">Candidate</p>
                        <p className="text-surface-300 text-xs">Find jobs</p>
                      </div>
                      {selectedRole === 'student' && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </button>
                  </div>
                </div>

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

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-4 flex items-center justify-center gap-4 text-xs"
        >
          <Link to="/admin/login" className="text-surface-300/50 hover:text-surface-300 transition-colors">
            Admin Portal
          </Link>
          <span className="text-white/15">·</span>
          <Link to="/client/login" className="text-surface-300/50 hover:text-surface-300 transition-colors">
            Client Portal
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
