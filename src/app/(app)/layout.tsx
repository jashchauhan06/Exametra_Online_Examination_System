'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { ToastProvider } from '@/components/ui/toast';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

function RouteLoadingBar() {
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(false);
    setComplete(true);
    const timer = setTimeout(() => setComplete(false), 250);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        const url = new URL(link.href);
        if (url.pathname !== pathname) {
          setLoading(true);
          setComplete(false);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  if (!loading && !complete) return null;

  return (
    <div className={`route-loading-bar ${complete ? 'complete' : ''}`} />
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [pageKey, setPageKey] = useState(pathname);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    setPageKey(pathname);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: '#FAFAFA' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-[#E5E5E5] border-t-[#111] animate-spin" />
          <span className="text-xs font-medium" style={{ color: '#999' }}>Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen" style={{ background: '#FAFAFA' }}>
      <RouteLoadingBar />
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-8 overflow-auto">
          <div key={pageKey} className="animate-page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <AuthGuard>{children}</AuthGuard>
      </ToastProvider>
    </AuthProvider>
  );
}
