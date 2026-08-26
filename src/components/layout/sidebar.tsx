'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LogOut, ChevronUp, Settings, User as UserIcon } from 'lucide-react';
import PillNav from '@/components/ui/PillNav';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const navItems = React.useMemo(() => {
    if (user.role === 'student') {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Examinations', href: '/exams' },
        { label: 'Results', href: '/results' },
        { label: 'Notifications', href: '/notifications' },
        { label: 'Settings', href: '/settings' },
      ];
    }
    if (user.role === 'faculty') {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Examinations', href: '/exams' },
        { label: 'Create Exam', href: '/exams/create' },
        { label: 'Question Bank', href: '/question-bank' },
        { label: 'Analytics', href: '/analytics' },
        { label: 'Notifications', href: '/notifications' },
        { label: 'Settings', href: '/settings' },
      ];
    }
    return [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Examinations', href: '/exams' },
      { label: 'Results', href: '/results' },
      { label: 'Students', href: '/students' },
      { label: 'Faculty', href: '/faculty-manage' },
      { label: 'Analytics', href: '/analytics' },
      { label: 'Settings', href: '/settings' },
    ];
  }, [user.role]);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] flex flex-col z-40 select-none"
      style={{
        background: '#FFFFFF',
        borderRight: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* ── Brand ── */}
      <div className="h-[60px] px-5 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}
      >
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
            style={{ background: '#8B5CF6' }} // Purple accent
          >
            OE
          </div>
          <div>
            <div className="text-[13px] font-semibold text-[#18181B] leading-tight tracking-tight">
              Online Exam
            </div>
            <div className="text-[11px] leading-tight" style={{ color: '#71717A' }}>
              Assessment Portal
            </div>
          </div>
        </Link>
      </div>

      {/* ── Navigation (Vertical PillNav) ── */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <PillNav
          items={navItems}
          activeHref={pathname}
          baseColor="#000000" // Hover circle color (black)
          pillColor="transparent" // Default background
          hoveredPillTextColor="#FFFFFF"
          pillTextColor="#000000"
          initialLoadAnimation={true}
          direction="vertical"
        />
      </div>

      {/* ── User Footer (Dropup) ── */}
      <div className="p-3 relative" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }} ref={profileRef}>
        
        {/* Dropup Menu */}
        <div 
          className={`absolute bottom-[110%] left-3 right-3 bg-white border border-[#E4E4E7] shadow-lg rounded-xl overflow-hidden transition-all duration-200 origin-bottom ${
            isProfileOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
          }`}
        >
          <div className="p-2 space-y-0.5">
            <Link 
              href="/settings"
              onClick={() => setIsProfileOpen(false)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 text-[13px] font-medium text-[#18181B] rounded-md hover:bg-[#F4F4F5] transition-colors"
            >
              <UserIcon size={15} className="text-[#71717A]" />
              My Profile
            </Link>
            <Link 
              href="/settings"
              onClick={() => setIsProfileOpen(false)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 text-[13px] font-medium text-[#18181B] rounded-md hover:bg-[#F4F4F5] transition-colors"
            >
              <Settings size={15} className="text-[#71717A]" />
              Account Settings
            </Link>
          </div>
          <div className="h-[1px] bg-[#E4E4E7] w-full" />
          <div className="p-2">
            <button
              onClick={() => {
                setIsProfileOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 text-[13px] font-medium text-[#EF4444] rounded-md hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </div>

        {/* Profile Trigger */}
        <div 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center justify-between px-2 py-2 rounded-lg transition-colors duration-150 cursor-pointer"
          style={{ background: isProfileOpen ? '#E4E4E7' : '#F4F4F5' }}
          onMouseEnter={e => { if(!isProfileOpen) e.currentTarget.style.background = '#E4E4E7'; }}
          onMouseLeave={e => { if(!isProfileOpen) e.currentTarget.style.background = '#F4F4F5'; }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0"
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                color: '#6D28D9',
                border: '1px solid rgba(139, 92, 246, 0.2)',
              }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-[#18181B] truncate leading-tight">
                {user.name}
              </div>
              <div className="text-[11px] truncate leading-tight capitalize"
                style={{ color: '#71717A' }}
              >
                {user.role}
              </div>
            </div>
          </div>
          <ChevronUp 
            size={16} 
            className="text-[#71717A] transition-transform duration-200" 
            style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </div>
    </aside>
  );
}
