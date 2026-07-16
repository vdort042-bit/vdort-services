import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Building2, Eye, EyeOff, ChevronLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import ParticleBackground from '../../components/ui/ParticleBackground';
import api from '../../services/api';

export default function ClientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const [fpStep, setFpStep] = useState('login');
  const [fpEmail, setFpEmail] = useState('');
  const [fpToken, setFpToken] = useState('');
  const [fpNewPw, setFpNewPw] = useState('');
  const [fpConfirmPw, setFpConfirmPw] = useState('');
  const [showFpPw, setShowFpPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== 'client') {
        await logout();
        setError('Access denied. This portal is for client users only.');
        return;
      }
      navigate('/client', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotEmail = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const res = await api.auth.forgotPassword(fpEmail);
      setSuccess(res.message);
      setFpStep('forgot-sent');
    } catch (err) {
      setError(err.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotReset = async (e) => {
    e.preventDefault();
    if (fpNewPw !== fpConfirmPw) { setError('Passwords do not match'); return; }
    setError(''); setLoading(true);
    try {
      await api.auth.resetPassword(fpToken, fpNewPw);
      setFpStep('forgot-done');
    } catch (err) {
      setError(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  const backToLogin = () => {
    setFpStep('login'); setError(''); setSuccess('');
    setFpEmail(''); setFpToken(''); setFpNewPw(''); setFpConfirmPw('');
  };

  const inputClass = 'w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-surface-300/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm transition-all duration-200';

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center relative overflow-hidden py-8 px-4">
      <ParticleBackground />
      <div className="absolute inset-0 bg-navy-950/60" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Branding */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center shadow-lg shadow-brand-500/40">
              <span className="text-white font-heading font-bold text-2xl">V</span>
            </div>
            <div className="text-left">
              <span className="text-white font-heading font-bold text-2xl tracking-tight block">VDORT</span>
              <span className="text-surface-300 text-xs tracking-widest uppercase">Services Pvt. Ltd.</span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          {fpStep === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.3 }}
              className="glass-dark rounded-3xl p-8 md:p-10 border border-white/10 shadow-elevated">
              <Link to="/" className="inline-flex items-center gap-1.5 text-surface-300/70 hover:text-white text-xs font-medium mb-6 transition-colors group">
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to Website
              </Link>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-brand-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h1 className="font-heading font-bold text-2xl text-white mb-1">Client Portal</h1>
                <p className="text-surface-300 text-sm">Manage your hiring pipeline & candidates</p>
              </div>
              {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</motion.div>}
              <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                <input type="text" name="fake-u" style={{ display: 'none' }} readOnly />
                <input type="password" name="fake-p" style={{ display: 'none' }} readOnly />
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                  <input type="email" placeholder="client@vdort.com" value={email} autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                  <input type={showPw ? 'text' : 'password'} placeholder="Password" value={password} autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)} required className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-300 hover:text-white transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={() => { setFpStep('forgot-email'); setError(''); }}
                    className="text-brand-400 hover:text-brand-300 text-xs font-medium transition-colors">
                    Forgot password?
                  </button>
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full mt-1" iconRight={ArrowRight} disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In to Client Portal'}
                </Button>
              </form>
              {import.meta.env.DEV && <p className="text-surface-300/50 text-xs text-center mt-6">Dev: client@vdort.com / client123</p>}
            </motion.div>
          )}

          {fpStep === 'forgot-email' && (
            <motion.div key="forgot-email" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}
              className="glass-dark rounded-3xl p-8 md:p-10 border border-white/10 shadow-elevated">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h1 className="font-heading font-bold text-2xl text-white mb-1">Forgot Password</h1>
                <p className="text-surface-300 text-sm">Enter your client email to reset</p>
              </div>
              {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</motion.div>}
              {success && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">{success}</motion.div>}
              <form onSubmit={handleForgotEmail} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                  <input type="email" placeholder="client@vdort.com" value={fpEmail}
                    onChange={(e) => setFpEmail(e.target.value)} required className={inputClass} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                  {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</> : <><ArrowRight className="w-4 h-4" /> Send Reset Link</>}
                </button>
              </form>
              <button onClick={backToLogin}
                className="w-full mt-4 py-3 rounded-xl border border-white/15 text-white font-medium hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm">
                <ChevronLeft className="w-4 h-4" /> Back to Login
              </button>
            </motion.div>
          )}

          {fpStep === 'forgot-sent' && (
            <motion.div key="forgot-sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
              className="glass-dark rounded-3xl p-8 md:p-10 border border-white/10 shadow-elevated text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="font-heading font-bold text-2xl text-white mb-2">Check Your Email</h1>
              <p className="text-surface-300 text-sm mb-2">{success}</p>
              <p className="text-surface-300/70 text-xs mb-8">Your password has been sent to <strong className="text-white">{fpEmail}</strong>. Check spam folder too.</p>
              <button onClick={backToLogin}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-accent-400 text-white font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <ArrowRight className="w-4 h-4" /> Back to Login
              </button>
            </motion.div>
          )}

          {fpStep === 'forgot-reset' && (
            <motion.div key="forgot-reset" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}
              className="glass-dark rounded-3xl p-8 md:p-10 border border-white/10 shadow-elevated">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <KeyRound className="w-8 h-8 text-white" />
                </div>
                <h1 className="font-heading font-bold text-2xl text-white mb-1">Set New Password</h1>
                <p className="text-surface-300 text-sm">Choose a strong new password</p>
              </div>
              {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</motion.div>}
              <form onSubmit={handleForgotReset} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                  <input type={showFpPw ? 'text' : 'password'} placeholder="New password" value={fpNewPw}
                    onChange={(e) => setFpNewPw(e.target.value)} required minLength={6} className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowFpPw(!showFpPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-300 hover:text-white transition-colors">
                    {showFpPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                  <input type={showFpPw ? 'text' : 'password'} placeholder="Confirm new password" value={fpConfirmPw}
                    onChange={(e) => setFpConfirmPw(e.target.value)} required minLength={6} className={inputClass} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                  {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Resetting...</> : <><KeyRound className="w-4 h-4" /> Reset Password</>}
                </button>
              </form>
            </motion.div>
          )}

          {fpStep === 'forgot-done' && (
            <motion.div key="forgot-done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
              className="glass-dark rounded-3xl p-8 md:p-10 border border-white/10 shadow-elevated text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-heading font-bold text-2xl text-white mb-2">Password Reset!</h1>
              <p className="text-surface-300 text-sm mb-8">Your password has been updated successfully. You can now sign in with your new password.</p>
              <button onClick={backToLogin}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-accent-400 text-white font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <ArrowRight className="w-4 h-4" /> Back to Login
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <Link to="/" className="text-surface-300 hover:text-white transition-colors">← Back to Website</Link>
          <span className="hidden sm:block text-white/20">·</span>
          <Link to="/admin/login" className="text-surface-300/60 hover:text-surface-300 transition-colors text-xs">Admin Portal</Link>
          <span className="hidden sm:block text-white/20">·</span>
          <Link to="/login" className="text-surface-300/60 hover:text-surface-300 transition-colors text-xs">Candidate Login</Link>
        </div>
      </motion.div>
    </div>
  );
}
