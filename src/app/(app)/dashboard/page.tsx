'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import dynamic from 'next/dynamic';

const StudentDashboard = dynamic(() => import('./student-dashboard').then(mod => ({ default: mod.StudentDashboard })), { ssr: false });
const FacultyDashboard = dynamic(() => import('./faculty-dashboard').then(mod => ({ default: mod.FacultyDashboard })), { ssr: false });
const AdminDashboard = dynamic(() => import('./admin-dashboard').then(mod => ({ default: mod.AdminDashboard })), { ssr: false });

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'student':
      return <StudentDashboard user={user} />;
    case 'faculty':
      return <FacultyDashboard user={user} />;
    case 'admin':
      return <AdminDashboard user={user} />;
    default:
      return null;
  }
}
