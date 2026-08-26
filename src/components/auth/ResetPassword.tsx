import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import './Auth.css';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  // Wait for Supabase to process the recovery token from the URL
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsReady(true);
      }
    });

    // Also check if already in a recovery session
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (session) setIsReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setIsLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage('Password updated successfully! Redirecting to login...');
    await supabase.auth.signOut();
    setTimeout(() => router.push('/login'), 2500);
  };

  return (
    <div className="auth-page-container">
      <div className="background-layer">
        <div className="floating-node w-32 h-32" style={{ top: '10%', left: '15%' }}></div>
        <div className="floating-node w-48 h-48" style={{ bottom: '10%', right: '10%', animationDelay: '-5s' }}></div>
      </div>

      <div className="flex items-center justify-center min-h-screen w-full p-4 relative z-10">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 relative">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
              GVT<span className="text-blue-500">FMS</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Govt. Vehicle Tracking & Fleet Mgmt. System
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
            <p className="text-gray-400 text-sm font-medium mt-1">Enter your new password below</p>
          </div>

          {!isReady ? (
            <div className="text-center py-10">
              <i className="fa-solid fa-circle-notch fa-spin text-2xl text-blue-500 mb-4"></i>
              <p className="text-sm text-gray-500 font-medium">Verifying your reset link...</p>
              <p className="text-xs text-gray-400 mt-2">If this takes too long, your link may have expired.</p>
              <button
                onClick={() => router.push('/login')}
                className="mt-6 text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              {message && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm font-medium flex items-center gap-2">
                  <i className="fa-solid fa-circle-check"></i>
                  {message}
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-4">
                <div className="input-group">
                  <span className="tag">New Password</span>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
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

                <div className="input-group">
                  <span className="tag">Confirm New Password</span>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-black flex items-center justify-center space-x-2 w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin"></i>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </form>

              <div className="text-center mt-6">
                <button
                  onClick={() => router.push('/login')}
                  className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors"
                >
                  ← Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
