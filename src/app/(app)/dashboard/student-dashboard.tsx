'use client';

import React from 'react';
import Link from 'next/link';
import type { User } from '@/types';
import { MetricStrip, MetricItem } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import {
  fetchStudentUpcomingExams, fetchStudentCompletedExams, fetchStudentResults, fetchSubjects
} from '@/lib/data/supabase-service';
import { Skeleton } from '@/components/ui/skeleton';
import type { Exam, Result } from '@/types';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function StudentDashboard({ user }: { user: User }) {
  const [upcoming, setUpcoming] = React.useState<Exam[]>([]);
  const [completed, setCompleted] = React.useState<Exam[]>([]);
  const [studentResults, setStudentResults] = React.useState<Result[]>([]);
  const [subjects, setSubjects] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const up = await fetchStudentUpcomingExams(user.id);
        const comp = await fetchStudentCompletedExams(user.id);
        const res = await fetchStudentResults(user.id);
        const subs = await fetchSubjects();
        setUpcoming(up);
        setCompleted(comp);
        setStudentResults(res);
        setSubjects(subs);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user.id]);

  const passedCount = studentResults.filter(r => r.status === 'passed').length;
  const avgScore = studentResults.length > 0
    ? Math.round(studentResults.reduce((a, r) => a + Number(r.percentage), 0) / studentResults.length)
    : 0;

  const chartData = studentResults.map((r, i) => ({
    name: `Exam ${i + 1}`,
    score: r.percentage,
  }));

  let displayData = [...chartData];
  if (displayData.length === 1) {
    displayData = [
      { name: '', score: displayData[0].score },
      displayData[0],
      { name: ' ', score: displayData[0].score }
    ];
  }

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="max-w-[860px] mx-auto animate-page-enter">
      {/* ── Greeting ── */}
      <div className="mb-10">
        <h1 className="text-[24px] font-semibold tracking-tight" style={{ color: '#111' }}>
          {getGreeting()}, {user.name.split(' ')[0]}
        </h1>
        <p className="text-[13px] mt-0.5" style={{ color: '#999' }}>
          {today}
        </p>
      </div>

      {loading ? (
        <div className="space-y-12 w-full animate-fade-in">
          {/* Skeleton Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-[1px] bg-[#E5E5E5] overflow-hidden rounded-xl border border-[#E5E5E5]">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white p-6 h-[110px]">
                <Skeleton className="h-3 w-20 mb-4" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-5 w-48 mb-6" />
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-[#F4F4F5] p-5 rounded-xl h-[120px]">
                  <Skeleton className="h-5 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded" />
                    <Skeleton className="h-6 w-24 rounded" />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <Skeleton className="h-5 w-48 mb-6" />
              <div className="bg-white border border-[#F4F4F5] p-6 rounded-xl h-[300px] flex flex-col justify-end">
                <div className="flex items-end justify-between gap-4 h-full">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="w-12 rounded-t-sm" style={{ height: `${Math.random() * 60 + 30}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ── Metrics ── */}
      <div className="mb-12">
        <MetricStrip>
          <MetricItem
            label="Upcoming"
            value={upcoming.length}
            caption="Scheduled in next 14 days"
            accent="#3B82F6"
          />
          <MetricItem
            label="Completed"
            value={completed.length}
            caption="Total exams submitted"
            accent="#10B981"
          />
          <MetricItem
            label="Average Score"
            value={`${avgScore}%`}
            change={avgScore >= 75 ? '+2.4%' : '-1.2%'}
            trend={avgScore >= 75 ? 'up' : 'down'}
            caption="Versus previous term"
            accent="#F59E0B"
          />
          <MetricItem
            label="Passed"
            value={`${passedCount}/${studentResults.length}`}
            caption="Overall success rate"
            accent="#10B981"
          />
        </MetricStrip>
      </div>

      <hr className="border-t border-black mb-12" />

      {/* ── Upcoming Exams ── */}
      <section className="mb-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-[16px] font-semibold tracking-tight" style={{ color: '#111' }}>Upcoming Examinations</h2>
          <Link href="/exams" className="text-[13px] font-medium transition-colors" style={{ color: '#0D9373' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#0B7D63'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#0D9373'; }}
          >
            View All Exams →
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <EmptyState
            title="No upcoming examinations"
            description="You don't have any exams scheduled in the upcoming period."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {upcoming.map((exam, i) => {
              const subject = subjects.find(s => s.id === (exam as any).subject_id || s.id === exam.subjectId);
              const examDate = new Date(exam.date + 'T' + ((exam as any).start_time || exam.startTime || '00:00'));
              return (
                <div
                  key={exam.id}
                  className={`group flex flex-col sm:flex-row sm:items-center justify-between p-5 stagger-${(i % 5) + 1} animate-fade-up rounded-lg transition-all`}
                  style={{
                    background: '#FAFAFA',
                    border: '1px solid rgba(0,0,0,0.03)',
                    borderLeft: `4px solid ${exam.status === 'completed' ? '#10B981' :
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
                    </div>
                    <div className="text-[13px]" style={{ color: '#777' }}>
                      {exam.totalQuestions} questions · {exam.totalMarks} marks · {exam.duration} mins
                    </div>
                  </div>

                  <div className="flex items-center gap-6 sm:gap-8 flex-shrink-0">
                    <div className="text-left sm:text-right">
                      <div className="text-[14px] font-semibold" style={{ color: '#111' }}>
                        {examDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-[13px]" style={{ color: '#777' }}>
                        {examDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </div>
                    </div>

                    <Link
                      href={`/exams/${exam.id}`}
                      className="flex items-center justify-center w-10 h-10 rounded-full transition-transform duration-200 group-hover:translate-x-1"
                      style={{ background: '#111', color: '#FFF' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
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

      {/* ── Two Column: Chart + Recent Results ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Performance Chart */}
        {chartData.length > 0 && (
          <section>
            <h2 className="text-[15px] font-semibold tracking-tight mb-6" style={{ color: '#111' }}>Score Progression</h2>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9373" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#0D9373" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.04)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#bbb' }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: '#bbb' }}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
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
                    formatter={(value: any) => [`${value}%`, 'Score']}
                    cursor={{ stroke: 'rgba(13,147,115,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#0D9373"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                    activeDot={{ r: 4, fill: '#0D9373', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Recent Results */}
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-[15px] font-semibold tracking-tight" style={{ color: '#111' }}>Recent Results</h2>
            <Link href="/results" className="text-[12px] font-medium transition-colors" style={{ color: '#0D9373' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#0B7D63'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#0D9373'; }}
            >
              View all →
            </Link>
          </div>

          {studentResults.length === 0 ? (
            <div className="py-8 text-center">
              <div className="text-[13px]" style={{ color: '#999' }}>No results evaluated yet.</div>
            </div>
          ) : (
            <div>
              {studentResults.slice(0, 4).map((result, i) => {
                const exam = completed.find(e => e.id === (result as any).exam_id || e.id === result.examId) ||
                  upcoming.find(e => e.id === (result as any).exam_id || e.id === result.examId);
                return (
                  <div
                    key={result.id}
                    className={`flex items-center justify-between py-3.5 stagger-${(i % 4) + 1} animate-fade-up`}
                    style={{ borderBottom: i < Math.min(studentResults.length, 4) - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium truncate pr-4" style={{ color: '#111' }}>{exam?.title || 'Examination'}</div>
                      <div className="text-[12px] mt-0.5" style={{ color: '#bbb' }}>
                        {new Date((result as any).evaluated_at || result.evaluatedAt || new Date()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <div className="font-semibold text-[14px] tabular-nums" style={{ color: result.percentage >= 75 ? '#0D9373' : '#111' }}>
                          {result.percentage}%
                        </div>
                        <div className="text-[11px] tabular-nums" style={{ color: '#bbb' }}>{(result as any).obtained_marks ?? result.obtainedMarks}/{(result as any).total_marks ?? result.totalMarks}</div>
                      </div>
                      <StatusBadge variant={result.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
      </>
      )}
    </div>
  );
}
