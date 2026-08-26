'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPlus, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const [department, setDepartment] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      // Reset state
      setName('');
      setEmail('');
      setPassword('');
      setRole('student');
      setDepartment('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password || !role) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : ''
        },
        body: JSON.stringify({ name, email, password, role, department })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user');
      }
      
      onSuccess(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div 
        className="bg-surface rounded-lg border border-border shadow-xl w-full max-w-md mx-auto flex flex-col max-h-[90vh]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.95)',
          transition: 'opacity 0.15s ease, transform 0.15s ease',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2 text-text font-semibold">
            <UserPlus size={18} className="text-primary" />
            <h3>Create New User</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-black/5 text-text-secondary transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-error/10 border border-error/20 text-error rounded-md text-sm flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form id="create-user-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Full Name *</label>
              <input 
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-bg border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="e.g. John Doe"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Email Address *</label>
              <input 
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-bg border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="e.g. john@example.com"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Password *</label>
              <input 
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-bg border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Minimum 6 characters"
                minLength={6}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Role *</label>
                <select 
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Department</label>
                <input 
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Computer Science"
                />
              </div>
            </div>
          </form>
        </div>
        
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-bg rounded-b-lg flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-md hover:bg-black/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-user-form"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
