'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { fetchAssignments, fetchSubjects, fetchSubmissionsForAssignment } from '@/lib/data/supabase-service';
import type { Assignment } from '@/types';
import { Plus, Clock, FileText, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [submissionCounts, setSubmissionCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function loadData() {
      setLoading(true);
      try {
        const subs = await fetchSubjects();
        setSubjects(subs);

        let data: Assignment[];
        if (user!.role === 'faculty' || user!.role === 'admin') {
          data = await fetchAssignments(user!.role === 'faculty' ? user!.id : undefined);
        } else {
          data = await fetchAssignments();
        }
        setAssignments(data);

        // For faculty and admin, fetch submission counts
        if (user!.role === 'faculty' || user!.role === 'admin') {
          const counts: Record<string, number> = {};
          for (const a of data) {
            const submissions = await fetchSubmissionsForAssignment(a.id);
            counts[a.id] = submissions.length;
          }
          setSubmissionCounts(counts);
        }
      } catch (err) {
        console.error('Error loading assignments:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  const getSubjectCode = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.code : '—';
  };

  const getDeadlineInfo = (deadline: string) => {
    const d = new Date(deadline);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (diff < 0) return { label: 'Deadline passed', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.06)' };
    if (days <= 1) return { label: 'Due today', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.06)' };
    if (days <= 3) return { label: `Due in ${days} days`, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.06)' };
    return { label: `Due in ${days} days`, color: '#10B981', bg: 'rgba(16, 185, 129, 0.06)' };
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string; bg: string }> = {
      active: { label: 'Active', color: '#10B981', bg: 'rgba(16, 185, 129, 0.08)' },
      draft: { label: 'Draft', color: '#71717A', bg: 'rgba(113, 113, 122, 0.08)' },
      closed: { label: 'Closed', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.08)' },
    };
    return map[status] || map.active;
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#18181B] tracking-tight">Assignments</h1>
          <p className="text-xs text-[#71717A] mt-1">
            {user?.role === 'faculty'
              ? 'Create and manage assignments with AI-powered evaluation'
              : 'View and submit assignments for automatic grading'}
          </p>
        </div>
        {(user?.role === 'faculty' || user?.role === 'admin') && (
          <Link
            href="/assignments/create"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
            style={{ background: '#8B5CF6' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#7C3AED'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#8B5CF6'; }}
          >
            <Plus size={16} />
            Create Assignment
          </Link>
        )}
      </div>

      {/* Assignment Cards */}
      {assignments.length === 0 ? (
        <EmptyState 
          title="No Assignments" 
          description={user?.role === 'faculty' ? 'No assignments created yet. Create your first assignment!' : 'No active assignments available.'} 
        />
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment, index) => {
            const deadline = getDeadlineInfo(assignment.deadline);
            const statusBadge = getStatusBadge(assignment.status);
            return (
              <Link
                key={assignment.id}
                href={`/assignments/${assignment.id}`}
                className="block rounded-2xl p-5 transition-all duration-200 group"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E4E4E7',
                  animationDelay: `${index * 50}ms`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#D4D4D8';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E4E4E7';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                        style={{ background: statusBadge.bg, color: statusBadge.color }}>
                        {statusBadge.label}
                      </span>
                      <span className="text-[11px] font-medium text-[#8B5CF6] px-2 py-0.5 rounded-md"
                        style={{ background: 'rgba(139, 92, 246, 0.06)' }}>
                        {getSubjectCode(assignment.subject_id)}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-[#18181B] group-hover:text-[#8B5CF6] transition-colors truncate">
                      {assignment.title}
                    </h3>
                    <p className="text-xs text-[#71717A] mt-1 line-clamp-2">
                      {assignment.description}
                    </p>

                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: '#71717A' }}>
                        <FileText size={12} />
                        {getSubjectName(assignment.subject_id)}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: deadline.color }}>
                        <Clock size={12} />
                        {deadline.label}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#71717A]">
                        Max: {assignment.max_marks} marks
                      </span>
                      {user?.role === 'faculty' && submissionCounts[assignment.id] !== undefined && (
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#71717A]">
                          <Users size={12} />
                          {submissionCounts[assignment.id]} submissions
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2">
                    <div className="text-xs text-[#A1A1AA]">
                      {new Date(assignment.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <svg width="16" height="16" viewBox="0 0 16 16" className="text-[#D4D4D8] group-hover:text-[#8B5CF6] transition-colors">
                      <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
