'use client';

import React from 'react';
import Link from 'next/link';
import type { User } from '@/types';
import { Plus, BookOpen } from 'lucide-react';
import { MetricStrip, MetricItem } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchFacultyDashboardData, fetchSubjects } from '@/lib/data/supabase-service';
import type { Exam } from '@/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export function FacultyDashboard({ user }: { user: User }) {
  const [facultyExams, setFacultyExams] = React.useState<Exam[]>([]);
  const [studentCount, setStudentCount] = React.useState(0);
  const [analytics, setAnalytics] = React.useState<Record<string, { averageScore: number, passRate: number, totalAttempts?: number }>>({});
  const [subjects, setSubjects] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchFacultyDashboardData(user.id);
        const subs = await fetchSubjects();
        setFacultyExams(data.exams);
        setStudentCount(data.studentCount);
        setAnalytics(data.analytics);
        setSubjects(subs);
      } catch (err) {
        console.error('Error loading faculty dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user.id]);

  const activeExams = facultyExams.filter(e => e.status === 'live').length;
  const upcomingExams = facultyExams.filter(e => e.status === 'upcoming').length;
  const totalStudents = studentCount;

  const completedExams = facultyExams.filter(e => e.status === 'completed');
  const avgScores = completedExams.map(e => analytics[e.id]?.averageScore || 0);
  const overallAvg = avgScores.length > 0
    ? Math.round(avgScores.reduce((a, b) => a + b, 0) / avgScores.length)
    : 0;

  const chartData = completedExams.map(e => {
    return {
      name: e.title.length > 18 ? e.title.slice(0, 18) + '...' : e.title,
      average: analytics[e.id]?.averageScore || 0,
      passRate: analytics[e.id]?.passRate || 0,
    };
  });

  return (
    <div className="max-w-[860px] mx-auto animate-page-enter">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight" style={{ color: '#111' }}>
            Faculty Dashboard
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: '#999' }}>
            Department of {user.department || 'Computer Science'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/question-bank" className="btn-solid-secondary">
            <BookOpen size={14} /> Question Bank
          </Link>
          <Link href="/exams/create" className="btn-solid-primary">
            <Plus size={14} /> Create Exam
          </Link>
        </div>
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
          <div className="space-y-4">
            <Skeleton className="h-5 w-48 mb-6" />
            {[1, 2].map(i => (
              <div key={i} className="bg-white border border-[#F4F4F5] p-5 rounded-xl h-[80px]">
                <Skeleton className="h-4 w-1/4 mb-3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* ── Metrics ── */}
      <div className="mb-12">
        <MetricStrip cols={4}>
          <MetricItem
            label="Active Assessments"
            value={activeExams}
            caption="Currently live"
            accent="#EF4444"
          />
          <MetricItem
            label="Upcoming Exams"
            value={upcomingExams}
            caption="Scheduled"
            accent="#3B82F6"
          />
          <MetricItem
            label="Enrolled Candidates"
            value={totalStudents}
            caption="Across active courses"
            accent="#0D9373"
          />
          <MetricItem
            label="Class Average"
            value={`${overallAvg}%`}
            change={overallAvg >= 70 ? 'Satisfactory' : 'Review needed'}
            trend={overallAvg >= 70 ? 'up' : 'down'}
            accent="#F59E0B"
          />
        </MetricStrip>
      </div>

      <hr className="border-t border-black mb-12" />

      {/* ── Assigned Examinations ── */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-[15px] font-semibold tracking-tight" style={{ color: '#111' }}>Assigned Examinations</h2>
          <Link href="/exams" className="text-[12px] font-medium transition-colors" style={{ color: '#0D9373' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#0B7D63'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#0D9373'; }}
          >
            View all →
          </Link>
        </div>
        
        {facultyExams.length === 0 ? (
          <EmptyState
            title="No exams assigned"
            description="Create an exam to see it listed here."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {facultyExams.map((exam, i) => {
              const subject = subjects.find(s => s.id === (exam as any).subject_id || s.id === exam.subjectId);
              const examAnalytics = analytics[exam.id];
              return (
                <div
                  key={exam.id}
                  className={`group flex flex-col sm:flex-row sm:items-center justify-between p-5 stagger-${(i % 5) + 1} animate-fade-up rounded-lg transition-all`}
                  style={{ 
                    background: '#FAFAFA',
                    border: '1px solid rgba(0,0,0,0.03)',
                    borderLeft: `4px solid ${
                      exam.status === 'completed' ? '#10B981' :
                      exam.status === 'live' ? '#EF4444' :
                      exam.status === 'upcoming' ? '#3B82F6' :
                      exam.status === 'missed' ? '#F59E0B' : '#71717A'
                    }`
                  }}
                >
                  <div className="min-w-0 flex-1 mb-4 sm:mb-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[15px] font-semibold" style={{ color: '#111' }}>{exam.title}</span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: '#F0F0F0', color: '#555' }}>
                        {subject?.code || '—'}
                      </span>
                      <StatusBadge variant={exam.status} />
                    </div>
                    {examAnalytics && (
                      <div className="text-[13px] flex items-center gap-3" style={{ color: '#777' }}>
                        <span>{examAnalytics.totalAttempts || 0} submissions</span>
                        <span>·</span>
                        <span className="font-mono tabular-nums">{examAnalytics.averageScore}% avg</span>
                        <span>·</span>
                        <span className="font-mono tabular-nums">{examAnalytics.passRate}% pass</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center flex-shrink-0">
                    <Link
                      href={`/exams/${exam.id}`}
                      className="flex items-center justify-center w-10 h-10 rounded-full transition-transform duration-200 group-hover:translate-x-1"
                      style={{ background: '#111', color: '#FFF' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <hr className="border-t border-black mb-12" />

      {/* ── Performance Chart ── */}
      {chartData.length > 0 && (
        <section>
          <h2 className="text-[15px] font-semibold tracking-tight mb-6" style={{ color: '#111' }}>Evaluation Overview</h2>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#bbb' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#bbb' }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '12px',
                    padding: '8px 12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                  itemStyle={{ color: '#fff', fontWeight: 500 }}
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                />
                <Bar dataKey="average" name="Average Score %" radius={[3, 3, 0, 0]} maxBarSize={36}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-avg-${index}`} fill="#111" />
                  ))}
                </Bar>
                <Bar dataKey="passRate" name="Pass Rate %" radius={[3, 3, 0, 0]} maxBarSize={36}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-pass-${index}`} fill="#0D9373" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          </section>
        )}
        </>
      )}
    </div>
  );
}
