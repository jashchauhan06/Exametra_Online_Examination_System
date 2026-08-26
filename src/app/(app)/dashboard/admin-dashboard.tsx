'use client';

import React from 'react';
import Link from 'next/link';
import type { User } from '@/types';
import { ChevronRight } from 'lucide-react';
import { MetricStrip, MetricItem } from '@/components/ui/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchPlatformStats } from '@/lib/data/supabase-service';
import { CreateUserModal } from '@/components/admin/CreateUserModal';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export function AdminDashboard({ user }: { user: User }) {
  const [stats, setStats] = React.useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalExams: 0,
    examsCompleted: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const { addToast } = useToast();

  React.useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchPlatformStats();
        setStats(data);
      } catch (err) {
        console.error('Error loading admin stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const managementLinks = [
    { label: 'Student Directory', href: '/students', desc: `${stats.totalStudents} registered students` },
    { label: 'Faculty Management', href: '/faculty-manage', desc: `${stats.totalFaculty} active faculty members` },
    { label: 'Examination Schedule', href: '/exams', desc: `${stats.totalExams} total exams created` },
    { label: 'System Analytics', href: '/analytics', desc: `${stats.examsCompleted} completed evaluations` },
  ];

  return (
    <div className="max-w-[860px] mx-auto animate-page-enter">
      {/* ── Header ── */}
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight" style={{ color: '#111' }}>
            System Administrator
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: '#999' }}>
            Portal metrics, user directory, and examination management.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#111] text-white text-[13px] font-medium rounded-lg hover:bg-black/80 transition-colors"
        >
          <UserPlus size={16} />
          Create User
        </button>
      </div>

      {loading ? (
        <div className="space-y-12 w-full animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-[1px] bg-[#E5E5E5] overflow-hidden rounded-xl border border-[#E5E5E5]">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white p-6 h-[110px]">
                <Skeleton className="h-3 w-24 mb-4" />
                <Skeleton className="h-8 w-12 mb-2" />
                <Skeleton className="h-3 w-28" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white border border-[#F4F4F5] p-5 rounded-xl flex justify-between h-[80px]">
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* ── Platform Metrics ── */}
          <div className="mb-12">
            <MetricStrip cols={4}>
              <MetricItem
                label="Registered Students"
                value={stats.totalStudents}
                caption="Active enrolments"
                accent="#3B82F6"
              />
              <MetricItem
                label="Faculty Members"
                value={stats.totalFaculty}
                caption="Verified instructors"
                accent="#0D9373"
              />
              <MetricItem
                label="Total Examinations"
                value={stats.totalExams}
                caption="Created on platform"
                accent="#F59E0B"
              />
              <MetricItem
                label="Exams Evaluated"
                value={stats.examsCompleted}
                caption="Successfully submitted"
                accent="#10B981"
              />
            </MetricStrip>
          </div>

          <hr className="border-t border-black mb-12" />

          {/* ── Management Modules ── */}
          <section>
            <h2 className="text-[15px] font-semibold tracking-tight mb-6" style={{ color: '#111' }}>
              Administrative Modules
            </h2>
            <div className="flex flex-col gap-3">
              {managementLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex items-center justify-between p-5 transition-all stagger-${(i % 4) + 1} animate-fade-up rounded-lg`}
                  style={{
                    background: '#FAFAFA',
                    border: '1px solid rgba(0,0,0,0.03)',
                    borderLeft: '4px solid #0D9373'
                  }}
                >
                  <div>
                    <div className="text-[15px] font-semibold" style={{ color: '#111' }}>
                      {link.label}
                    </div>
                    <div className="text-[13px] mt-1" style={{ color: '#777' }}>
                      {link.desc}
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full transition-transform duration-200 group-hover:translate-x-1" style={{ background: '#111', color: '#FFF' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      <CreateUserModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(newUser) => {
          setShowCreateModal(false);
          addToast(`User ${newUser.name} created successfully!`, 'success');
          // Optionally refresh stats here, though not strictly required
        }}
      />
    </div>
  );
}

