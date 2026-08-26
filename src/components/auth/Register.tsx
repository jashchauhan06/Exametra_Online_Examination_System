import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react').then(mod => mod.Lottie), { ssr: false });
import successAnimation from './login-success.json';

export default function Register() {
  const [signUpName, setSignUpName] = useState('');
  const [signUpDepartment, setSignUpDepartment] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpRole, setSignUpRole] = useState('Student');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (signUpPassword !== signUpConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    if (signUpPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    // Simulate registration request
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // Switch back to login (the parent container handles this via toggle, but we can't easily trigger it from here without passing props.
        // For now, we can just reload the page or navigate to /login)
        window.location.href = '/login';
      }, 2200); // Standardized time for the success animation to play
    }, 1500);

    // Handled in setTimeout above
  };

  return (
    <div className="form-box sign-up-box relative">
      {/* Success Overlay */}
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
          <p className="text-lg font-extrabold text-gray-900 mt-2">Registration Complete</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Please log in to continue</p>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Student Registration</h2>
        <p className="text-gray-400 text-sm font-medium mt-1">Create your examination account</p>
      </div>

      {authError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
          {authError}
        </div>
      )}

      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="input-group">
            <span className="tag">Full Name</span>
            <input 
              type="text" 
              placeholder="John Doe"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <span className="tag">Department</span>
            <input 
              type="text" 
              placeholder="Computer Science"
              value={signUpDepartment}
              onChange={(e) => setSignUpDepartment(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="input-group">
          <span className="tag">Work Email</span>
          <input 
            type="email" 
            placeholder="john@company.com"
            value={signUpEmail}
            onChange={(e) => setSignUpEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group relative">
          <span className="tag">Role</span>
          <div className="relative">
            <button
              type="button"
              className="w-full bg-[#f8faff] border-[1.5px] border-[#edf2f7] px-[18px] py-[14px] rounded-[16px] text-sm font-medium text-left flex items-center justify-between transition-all focus:border-[#3b82f6] focus:bg-white focus:ring-4 focus:ring-blue-500/8 cursor-pointer select-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="text-gray-700">{signUpRole}</span>
              <i className={`fa-solid fa-chevron-down text-[10px] text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute left-0 right-0 mt-2 bg-white border border-[#edf2f7] rounded-[16px] shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                  {['Student', 'Faculty', 'Admin'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`w-full px-[18px] py-[12px] text-sm font-medium text-left transition-colors flex items-center justify-between cursor-pointer ${
                        signUpRole === option 
                          ? 'bg-blue-50 text-[#3b82f6]' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSignUpRole(option);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span>{option}</span>
                      {signUpRole === option && (
                        <i className="fa-solid fa-check text-xs"></i>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="input-group">
            <span className="tag">Password</span>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
              </button>
            </div>
          </div>
          <div className="input-group">
            <span className="tag">Confirm Password</span>
            <div className="relative">
              <input 
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={signUpConfirmPassword}
                onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
              </button>
            </div>
          </div>
        </div>
        <button type="submit" className="btn-black flex items-center justify-center space-x-2" disabled={isLoading}>
          {isLoading ? (
            <>
              <i className="fa-solid fa-circle-notch fa-spin"></i>
              <span>Signing up...</span>
            </>
          ) : (
            <span>Sign Up</span>
          )}
        </button>
      </form>
    </div>
  );
}
