'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Notification as AppNotification } from '@/types';

const pathLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/exams': 'Examinations',
  '/exams/create': 'Create Exam',
  '/results': 'Results & Analytics',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
  '/students': 'Students',
  '/faculty-manage': 'Faculty',
  '/question-bank': 'Question Bank',
  '/analytics': 'Insights',
};

export function Header() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    if (!user) return;

    const loadUnread = async () => {
      const { data, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      
      setUnreadCount(count || 0);
    };

    loadUnread();
    
    // Set up realtime subscription for notifications
    const channel = supabase
      .channel('notifications_header_channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, () => {
        loadUnread();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (!user) return null;

  const currentPage = pathLabels[pathname] || pathname.split('/').pop()?.replace(/-/g, ' ') || '';

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-[56px] flex items-center justify-between px-8 sticky top-0 z-30"
      style={{
        background: 'rgba(250, 250, 250, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Left — Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-normal" style={{ color: '#999' }}>
          {user.department || 'Portal'}
        </span>
        <span style={{ color: '#ddd' }}>/</span>
        <span className="text-[13px] font-medium" style={{ color: '#111' }}>
          {currentPage}
        </span>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2 relative z-[100]">


        {/* Notification Bell */}
        <Link
          href="/notifications"
          className="relative p-2 rounded-full hover:bg-black/5 transition-colors duration-150"
        >
          <Bell size={18} style={{ color: '#666' }} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-1 text-[9px] font-bold rounded-full flex items-center justify-center"
              style={{ background: '#DC2626', color: '#FFFFFF' }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

