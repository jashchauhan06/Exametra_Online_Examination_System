'use client';

import React from 'react';
import AuthContainer from '@/components/auth/AuthContainer';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/components/ui/toast';

export default function LoginPage() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AuthContainer />
      </ToastProvider>
    </AuthProvider>
  );
}
