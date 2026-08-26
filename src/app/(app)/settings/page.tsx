'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/ui/page-header';
import { useToast } from '@/components/ui/toast';
import type { Student, Faculty } from '@/types';
import { Shield, Bell, User as UserIcon } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [examReminders, setExamReminders] = useState(true);

  if (!user) return null;

  const isStudent = user.role === 'student';
  const student = user as Student;
  const facultyUser = user as Faculty;

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      return;
    }
    addToast('Password changed successfully.', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSavePreferences = () => {
    addToast('Preferences saved.', 'success');
  };

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="max-w-3xl space-y-10 animate-page-enter">
      <PageHeader
        title="Account Settings"
        subtitle="Manage your profile information, password security, and system notifications."
      />

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        
        {/* ── Left Sidebar Navigation (Desktop) ── */}
        <div className="hidden md:block space-y-1">
          <div className="px-3 py-2 text-[13px] font-medium rounded-md bg-[#F4F4F5] text-[#18181B] flex items-center gap-2 cursor-pointer">
            <UserIcon size={14} /> Profile Information
          </div>
          <div className="px-3 py-2 text-[13px] font-medium rounded-md text-[#71717A] hover:bg-[#FAFAFA] hover:text-[#18181B] flex items-center gap-2 cursor-pointer transition-colors">
            <Shield size={14} /> Security & Password
          </div>
          <div className="px-3 py-2 text-[13px] font-medium rounded-md text-[#71717A] hover:bg-[#FAFAFA] hover:text-[#18181B] flex items-center gap-2 cursor-pointer transition-colors">
            <Bell size={14} /> System Preferences
          </div>
        </div>

        {/* ── Right Content Area ── */}
        <div className="space-y-12">
          
          {/* Profile Section */}
          <section>
            <div className="mb-5 pb-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <h2 className="text-[15px] font-semibold text-[#18181B] flex items-center gap-2">
                <UserIcon size={16} className="md:hidden" /> Profile Information
              </h2>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-bold flex-shrink-0"
                style={{ background: '#6366F1', color: '#FFFFFF' }}
              >
                {initials}
              </div>
              <div>
                <div className="text-[16px] font-bold text-[#18181B]">{user.name}</div>
                <div className="text-[13px] text-[#71717A] capitalize">{user.role} Account</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                {isStudent && (
                  <div>
                    <div className="text-[12px] font-medium text-[#71717A] mb-1">Student Registration ID</div>
                    <div className="text-[14px] font-mono font-medium text-[#18181B]">{student.studentId}</div>
                  </div>
                )}
                {user.role === 'faculty' && (
                  <div>
                    <div className="text-[12px] font-medium text-[#71717A] mb-1">Faculty Employee ID</div>
                    <div className="text-[14px] font-mono font-medium text-[#18181B]">{facultyUser.facultyId}</div>
                  </div>
                )}
                <div>
                  <div className="text-[12px] font-medium text-[#71717A] mb-1">Registered Email</div>
                  <div className="text-[14px] font-medium text-[#18181B]">{user.email}</div>
                </div>
                <div>
                  <div className="text-[12px] font-medium text-[#71717A] mb-1">Department</div>
                  <div className="text-[14px] font-medium text-[#18181B]">{user.department}</div>
                </div>
                {isStudent && (
                  <div>
                    <div className="text-[12px] font-medium text-[#71717A] mb-1">Current Semester</div>
                    <div className="text-[14px] font-medium text-[#18181B]">Semester {student.semester}</div>
                  </div>
                )}
                {user.role === 'faculty' && (
                  <div>
                    <div className="text-[12px] font-medium text-[#71717A] mb-1">Designation</div>
                    <div className="text-[14px] font-medium text-[#18181B]">{facultyUser.designation}</div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section>
            <div className="mb-5 pb-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <h2 className="text-[15px] font-semibold text-[#18181B] flex items-center gap-2">
                <Shield size={16} className="md:hidden" /> Security & Password
              </h2>
            </div>

            <form onSubmit={handleChangePassword} className="bg-white rounded-xl p-6" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-[13px] font-medium text-[#18181B] mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="input-enterprise w-full"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#18181B] mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="input-enterprise w-full"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#18181B] mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="input-enterprise w-full"
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="btn-solid-primary !mt-6">
                  Update Password
                </button>
              </div>
            </form>
          </section>

          {/* Notification Preferences */}
          <section>
            <div className="mb-5 pb-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <h2 className="text-[15px] font-semibold text-[#18181B] flex items-center gap-2">
                <Bell size={16} className="md:hidden" /> System Preferences
              </h2>
            </div>

            <div className="bg-white rounded-xl p-6" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="space-y-6">
                <label className="flex items-start justify-between cursor-pointer group">
                  <div>
                    <div className="text-[14px] font-medium text-[#18181B] mb-0.5 group-hover:text-[#6366F1] transition-colors">
                      Email Notifications
                    </div>
                    <div className="text-[13px] text-[#71717A]">
                      Receive email alerts for exam registrations and schedules
                    </div>
                  </div>
                  <div
                    className={`toggle-switch mt-1 ${emailNotifications ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); setEmailNotifications(!emailNotifications); }}
                  />
                </label>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }} />

                <label className="flex items-start justify-between cursor-pointer group">
                  <div>
                    <div className="text-[14px] font-medium text-[#18181B] mb-0.5 group-hover:text-[#6366F1] transition-colors">
                      Exam Countdown Reminders
                    </div>
                    <div className="text-[13px] text-[#71717A]">
                      Receive reminders 1 hour before scheduled examinations
                    </div>
                  </div>
                  <div
                    className={`toggle-switch mt-1 ${examReminders ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); setExamReminders(!examReminders); }}
                  />
                </label>

                <div className="pt-2">
                  <button onClick={handleSavePreferences} className="btn-solid-secondary">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
