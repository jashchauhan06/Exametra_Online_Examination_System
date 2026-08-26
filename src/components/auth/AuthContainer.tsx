'use client';

import React, { useState } from 'react';
import './Auth.css';
import Login from './Login';
import NeedHelp from './NeedHelp';

export default function AuthContainer() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="auth-page-container">
      {/* Background isolation */}
      <div className="background-layer">
        <div className="floating-node w-32 h-32" style={{ top: '10%', left: '15%' }}></div>
        <div className="floating-node w-48 h-48" style={{ bottom: '10%', right: '10%', animationDelay: '-5s' }}></div>
      </div>

      {/* Auth Wrapper */}
      <div className={`auth-wrapper ${isActive ? 'active' : ''}`} id="authWrapper">
        <Login />
        <NeedHelp />

        {/* Sliding Overlay Panel */}
        <div className="overlay-panel">
          <div className="overlay-content">
            {!isActive ? (
              <>
                <h2 className="text-3xl font-extrabold tracking-tight mb-3">
                  Need Assistance?
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-8">
                  Can't access your account? Haven't received your credentials? 
                  Our support team is here to help you get started.
                </p>
                <button
                  onClick={() => setIsActive(true)}
                  className="overlay-btn"
                >
                  Get Help →
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-extrabold tracking-tight mb-3">
                  Already have access?
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-8">
                  If you already have your credentials, sign in to access 
                  your examination dashboard and start your exams.
                </p>
                <button
                  onClick={() => setIsActive(false)}
                  className="overlay-btn"
                >
                  ← Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
