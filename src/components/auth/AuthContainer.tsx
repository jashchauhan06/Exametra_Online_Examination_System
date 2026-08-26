import React, { useState, useEffect } from 'react';
import './Auth.css';
import Login from './Login';
import Register from './Register';

export default function AuthContainer() {
  const [isActive, setIsActive] = useState(false); // false = login, true = register
  const [showOverlaySignUp, setShowOverlaySignUp] = useState(isActive);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowOverlaySignUp(isActive);
    }, 300);
    return () => clearTimeout(timeout);
  }, [isActive]);

  const toggleMode = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="auth-page-container">
      {/* Background isolation */}
      <div className="background-layer">
        <div className="floating-node w-32 h-32" style={{ top: '10%', left: '15%' }}></div>
        <div className="floating-node w-48 h-48" style={{ bottom: '10%', right: '10%', animationDelay: '-5s' }}></div>
      </div>

      {/* Auth Wrapper */}
      <div className={`auth-wrapper ${isActive ? 'active' : ''}`} id="authWrapper">
        
        {/* Sliding Overlay */}
        <div className="overlay-panel">
          {!showOverlaySignUp ? (
            <div id="overlay-signin">
              <h1 className="text-3xl font-extrabold mb-4">Empower Learning.</h1>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Join thousands of students and faculty on our secure online examination and assessment platform.
              </p>
              <span className="tag text-gray-500">Need an account?</span>
              <button 
                type="button"
                className="border-2 border-white/20 hover:border-white/50 px-8 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer" 
                onClick={toggleMode}
              >
                Create Account
              </button>
            </div>
          ) : (
            <div id="overlay-signup">
              <h1 className="text-3xl font-extrabold mb-4">Welcome Back.</h1>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Access your upcoming exams, past results, and detailed performance analytics instantly.
              </p>
              <span className="tag text-gray-500">Already have an account?</span>
              <button 
                type="button"
                className="border-2 border-white/20 hover:border-white/50 px-8 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer" 
                onClick={toggleMode}
              >
                Sign In Now
              </button>
            </div>
          )}
        </div>

        <Login />
        <Register />
      </div>
    </div>
  );
}
