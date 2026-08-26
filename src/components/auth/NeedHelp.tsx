import React, { useState } from 'react';

export default function NeedHelp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [issueType, setIssueType] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setEmail('');
        setIssueType('');
        setMessage('');
      }, 3000);
    }, 1200);
  };

  return (
    <div className="form-box sign-up-box relative">
      <div className="mb-6">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Exam<span className="text-blue-500">etra</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Support & Assistance
          </p>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Need Help?</h2>
        <p className="text-gray-400 text-sm font-medium mt-1">Contact your administrator for assistance</p>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-8 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <i className="fa-solid fa-check text-green-600 text-2xl"></i>
          </div>
          <p className="text-lg font-bold text-gray-900">Request Submitted</p>
          <p className="text-sm text-gray-400 mt-1 text-center">
            Your help request has been sent to the administrator. You will be contacted via email shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="input-group">
            <span className="tag">Your Name</span>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <span className="tag">Email Address</span>
            <input
              type="email"
              placeholder="your.email@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <span className="tag">Issue Type</span>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              required
            >
              <option value="">Select an issue...</option>
              <option value="login">Can't log in</option>
              <option value="account">Account not created</option>
              <option value="exam">Exam access issue</option>
              <option value="password">Password reset</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="input-group">
            <span className="tag">Describe your issue</span>
            <input
              type="text"
              placeholder="Brief description of the problem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-black flex items-center justify-center space-x-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>Sending...</span>
              </>
            ) : (
              <span>Submit Help Request</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
