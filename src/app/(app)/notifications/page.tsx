'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Bell, Calendar, FileText, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { NotificationType, Notification as AppNotification } from '@/types';

const typeIcons: Record<NotificationType, typeof Bell> = {
  'exam-scheduled': Calendar,
  'exam-starting-soon': AlertCircle,
  'result-published': CheckCircle2,
  'exam-updated': FileText,
  'exam-cancelled': XCircle,
  'system': Bell,
  'exam-violation': AlertCircle,
};

const typeColors: Record<NotificationType, { iconColor: string; bg: string }> = {
  'exam-scheduled': { iconColor: '#6366F1', bg: '#EEF2FF' },
  'exam-starting-soon': { iconColor: '#F59E0B', bg: '#FFFBEB' },
  'result-published': { iconColor: '#10B981', bg: '#ECFDF5' },
  'exam-updated': { iconColor: '#6366F1', bg: '#EEF2FF' },
  'exam-cancelled': { iconColor: '#EF4444', bg: '#FEF2F2' },
  'system': { iconColor: '#71717A', bg: '#F4F4F5' },
  'exam-violation': { iconColor: '#EF4444', bg: '#FEF2F2' },
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  React.useEffect(() => {
    if (!user) return;
    
    const loadNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (data) {
        const mapped = data.map(n => ({
          ...n,
          userId: n.user_id,
          isRead: n.is_read,
          createdAt: n.created_at,
        })) as AppNotification[];
        setNotifications(mapped);
      }
    };

    loadNotifications();
    
    const channel = supabase
      .channel('notifications_page_channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, () => {
        loadNotifications();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    await fetch('/api/notifications/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    await fetch('/api/notifications/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true, userId: user.id }),
    });
  };

  return (
    <div className="max-w-3xl space-y-8 animate-page-enter">
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up'}
        actions={
          unreadCount > 0 ? (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 text-[13px] font-medium bg-white rounded-md transition-all hover:bg-[#F4F4F5]"
              style={{ border: '1px solid rgba(0,0,0,0.06)', color: '#18181B' }}
            >
              Mark all as read
            </button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You will receive alerts about upcoming examinations, schedule updates, and result releases here."
        />
      ) : (
        <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#E4E4E7] before:to-transparent">
          {notifications.map((notification, i) => {
            const Icon = typeIcons[notification.type] || Bell;
            const styleConfig = typeColors[notification.type] || typeColors.system;
            const timeAgo = getTimeAgo(notification.createdAt);

            return (
              <div
                key={notification.id}
                className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4 stagger-${(i % 10) + 1} animate-fade-up`}
              >
                {/* Icon Marker */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#FAFAFA] bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"
                  style={{ color: styleConfig.iconColor }}
                >
                  <Icon size={16} />
                </div>
                
                {/* Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl transition-all duration-200"
                  style={{ 
                    background: !notification.isRead ? 'rgba(99, 102, 241, 0.04)' : '#FFFFFF',
                    border: !notification.isRead ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(0,0,0,0.06)',
                    boxShadow: !notification.isRead ? '0 4px 20px rgba(99,102,241,0.05)' : 'none',
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[13px] font-semibold ${!notification.isRead ? 'text-[#6366F1]' : 'text-[#18181B]'}`}>
                      {notification.title}
                    </span>
                    <span className="text-[11px] font-medium" style={{ color: '#A1A1AA' }}>
                      {timeAgo}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#52525B] leading-relaxed mb-3">
                    {notification.message}
                  </p>
                  
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkRead(notification.id)}
                      className="text-[12px] font-medium transition-colors"
                      style={{ color: '#6366F1' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#818CF8'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#6366F1'; }}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}
