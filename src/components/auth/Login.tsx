import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react').then(mod => mod.Lottie), { ssr: false });
import successAnimation from './login-success.json';
import failAnimation from './login-failed.json';
import { useAuth } from '@/lib/auth-context';

export default function Login() {
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFail, setShowFail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const performLogin = async (emailToUse: string, passwordToUse: string) => {
    setIsLoading(true);
    setAuthError(null);

    const result = await login(emailToUse, passwordToUse);

    setIsLoading(false);

    if (!result.success) {
      setAuthError(result.error || 'Invalid email or password');
      setShowFail(true);
      setTimeout(() => {
        setShowFail(false);
        setSignInPassword('');
      }, 2200);
      return;
    }

    if (rememberMe && emailToUse === signInEmail) {
      localStorage.setItem('exam_remember_email', signInEmail);
    } else if (!rememberMe) {
      localStorage.removeItem('exam_remember_email');
    }

    setShowSuccess(true);

    setTimeout(() => {
      router.push('/dashboard');
    }, 2200);
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setSignInEmail(demoEmail);
    setSignInPassword(demoPass);
    performLogin(demoEmail, demoPass);
  };

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Pre-fill email if user previously checked "Remember me"
  useEffect(() => {
    const savedEmail = localStorage.getItem('exam_remember_email');
    if (savedEmail) {
      setSignInEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(signInEmail, signInPassword);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError(null);
    setForgotMessage(null);

    // Simulate forgot password request
    setTimeout(() => {
      setForgotLoading(false);
      setForgotMessage('If an account exists, a reset link has been sent to your inbox.');
    }, 1000);

    setForgotMessage('If an account exists, a reset link has been sent to your inbox.');
  };

  const openForgot = () => {
    setForgotEmail(signInEmail); // pre-fill with login email if available
    setForgotError(null);
    setForgotMessage(null);
    setShowForgot(true);
  };

  return (
    <div className="form-box sign-in-box relative">
      {showSuccess && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center rounded-[32px] animate-in fade-in duration-300">
          <div className="w-64 h-64 flex items-center justify-center">
            <Lottie
              src={successAnimation}
              loop={false}
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <p className="text-lg font-extrabold text-gray-900 mt-2">Access Granted</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Loading Dashboard...</p>
        </div>
      )}

      {showFail && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center rounded-[32px] animate-in fade-in duration-300">
          <div className="w-64 h-64 flex items-center justify-center">
            <Lottie
              src={failAnimation}
              loop={false}
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <p className="text-lg font-extrabold text-red-600 mt-2">Access Denied</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Invalid Credentials</p>
        </div>
      )}

      {/* ── FORGOT PASSWORD VIEW ── */}
      {showForgot && (
        <div className="absolute inset-0 bg-white z-40 flex flex-col rounded-[32px] p-10 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-10">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                Exam<span className="text-blue-500">etra</span>
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Secure Assessment & Examination Portal
              </p>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
            <p className="text-gray-400 text-sm font-medium mt-1">We'll send a reset link to your email</p>
          </div>

          {forgotError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
              {forgotError}
            </div>
          )}

          {forgotMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm font-medium flex items-center gap-2">
              <i className="fa-solid fa-circle-check"></i>
              {forgotMessage}
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="input-group">
              <span className="tag">University Email</span>
              <input
                type="email"
                placeholder="aarav.sharma@sit.edu.in"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="btn-black flex items-center justify-center space-x-2"
              disabled={forgotLoading}
            >
              {forgotLoading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i>
                  <span>Send Reset Link</span>
                </>
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setShowForgot(false)}
            className="mt-8 text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1.5"
          >
            <i className="fa-solid fa-arrow-left text-[10px]"></i>
            Back to Login
          </button>
        </div>
      )}

      {/* ── MAIN LOGIN VIEW ── */}
      <div className="mb-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Exam<span className="text-blue-500">etra</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Secure Assessment & Examination Portal
          </p>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Portal Login</h2>
        <p className="text-gray-400 text-sm font-medium mt-1">Access your examination dashboard</p>
      </div>

      {authError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
          {authError}
        </div>
      )}

      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="input-group">
          <span className="tag">University Email</span>
          <input
            type="email"
            placeholder="aarav.sharma@sit.edu.in"
            value={signInEmail}
            onChange={(e) => setSignInEmail(e.target.value)}
            required
            tabIndex={1}
          />
        </div>
        <div className="input-group">
          <div className="flex justify-between items-center">
            <span className="tag">Password</span>
            <button
              type="button"
              onClick={openForgot}
              tabIndex={3}
              className="text-[10px] font-bold text-blue-500 hover:text-blue-700 mb-2 transition-colors"
            >
              Forgot?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              required
              tabIndex={2}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-3 pb-2">
          <input
            type="checkbox"
            id="rem"
            className="w-4 h-4 rounded text-blue-500"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            tabIndex={4}
          />
          <label htmlFor="rem" className="text-xs font-semibold text-gray-500 select-none cursor-pointer">
            Remember me
          </label>
        </div>
        <button type="submit" className="btn-black flex items-center justify-center space-x-2" disabled={isLoading} tabIndex={5}>
          {isLoading ? (
            <>
              <i className="fa-solid fa-circle-notch fa-spin"></i>
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Enter Dashboard</span>
          )}
        </button>
      </form>

      {/* Quick Demo Access */}
      <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">One-Click Demo Access</p>
        <div className="flex items-center justify-center gap-2">
          <button 
            type="button" 
            onClick={() => handleQuickLogin('aarav.sharma@sit.edu.in', 'password123')}
            className="px-3 py-1.5 border-[1.5px] border-gray-200 rounded-lg text-xs font-semibold text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors bg-white"
          >
            Student
          </button>
          <button 
            type="button" 
            onClick={() => handleQuickLogin('priya.mehta@sit.edu.in', 'password123')}
            className="px-3 py-1.5 border-[1.5px] border-gray-200 rounded-lg text-xs font-semibold text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors bg-white"
          >
            Faculty
          </button>
          <button 
            type="button" 
            onClick={() => handleQuickLogin('admin@sit.edu.in', 'password123')}
            className="px-3 py-1.5 border-[1.5px] border-gray-200 rounded-lg text-xs font-semibold text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors bg-white"
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
}
