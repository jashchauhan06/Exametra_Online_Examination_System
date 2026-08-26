'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { BarChart3, Filter } from 'lucide-react';
import {
  fetchStudentResults, fetchExams
} from '@/lib/data/supabase-service';
import { supabase } from '@/lib/supabase';
import { MetricStrip, MetricItem } from '@/components/ui/stat-card';

export default function ResultsPage() {
  const { user } = useAuth();

  if (!user) return null;
  if (user.role === 'student') return <StudentResults userId={user.id} />;
  return <FacultyResults userId={user.id} userRole={user.role} />;
}

function StudentResults({ userId }: { userId: string }) {
  const [results, setResults] = React.useState<any[]>([]);
  const [examsMap, setExamsMap] = React.useState<Record<string, any>>({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await fetchStudentResults(userId);
      setResults(res);
      
      const uniqueExamIds = [...new Set(res.map((r: any) => r.exam_id || r.examId))];
      if (uniqueExamIds.length > 0) {
        const { data: examsData } = await supabase.from('exams').select('*').in('id', uniqueExamIds);
        if (examsData) {
          const map: Record<string, any> = {};
          examsData.forEach(e => map[e.id] = e);
          setExamsMap(map);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [userId]);

  return (
    <div className="max-w-6xl space-y-8 animate-page-enter">
      <PageHeader
        title="Examination Results"
        subtitle="Individual scorecard, evaluated marks, and performance outcomes."
      />

      {loading ? (
        <div className="py-20 text-center"><i className="fa-solid fa-circle-notch fa-spin text-2xl text-blue-500"></i></div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No results found"
          description="Your examination evaluations will be listed here upon release."
        />
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Examination</th>
                <th>Evaluated Date</th>
                <th>Obtained Marks</th>
                <th>Percentage</th>
                <th>Outcome</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, i) => {
                const exam = examsMap[result.exam_id];
                return (
                  <tr key={result.id} className={`stagger-${(i % 10) + 1} animate-fade-up`}>
                    <td className="font-medium text-[#18181B]">{exam?.title || 'Examination'}</td>
                    <td>
                      <div className="text-[13px] text-[#18181B] font-medium">
                        {new Date((result as any).evaluated_at || result.evaluatedAt || new Date()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="font-mono text-[13px] font-medium text-[#18181B]">{(result as any).obtained_marks ?? result.obtainedMarks} / {(result as any).total_marks ?? result.totalMarks}</td>
                    <td className="font-mono text-[13px] font-semibold text-[#18181B]">{result.percentage}%</td>
                    <td><StatusBadge variant={result.status} /></td>
                    <td className="text-right">
                      <Link
                        href={`/results/${result.id}`}
                        className="inline-flex items-center justify-center px-3 py-1.5 rounded-md text-[12px] font-medium transition-all"
                        style={{ background: '#FAFAFA', border: '1px solid rgba(0,0,0,0.06)', color: '#18181B' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#F4F4F5'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#FAFAFA'; }}
                      >
                        View Report
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FacultyResults({ userId, userRole }: { userId: string; userRole: string }) {
  const [selectedExam, setSelectedExam] = React.useState('');
  const [exams, setExams] = React.useState<any[]>([]);
  const [allStudents, setAllStudents] = React.useState<any[]>([]);
  const [examResults, setExamResults] = React.useState<any[]>([]);
  const [analytics, setAnalytics] = React.useState<any>(null);
  const [loadingExams, setLoadingExams] = React.useState(true);
  const [loadingResults, setLoadingResults] = React.useState(false);

  React.useEffect(() => {
    async function loadExams() {
      setLoadingExams(true);
      const data = await fetchExams(userRole === 'admin' ? undefined : userId);
      setExams(data);
      
      const { data: students } = await supabase.from('users').select('*').eq('role', 'student');
      setAllStudents(students || []);
      setLoadingExams(false);
    }
    loadExams();
  }, [userId, userRole]);

  React.useEffect(() => {
    async function loadResults() {
      if (!selectedExam) {
        setExamResults([]);
        setAnalytics(null);
        return;
      }
      setLoadingResults(true);
      const { data: resData } = await supabase.from('results').select('*').eq('exam_id', selectedExam);
      const res = resData || [];
      setExamResults(res);
      
      if (res.length > 0) {
        const scores = res.map(r => Number(r.percentage));
        const passed = res.filter(r => r.status === 'passed').length;
        setAnalytics({
          totalAttempts: res.length,
          averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
          highestScore: Math.max(...scores),
          lowestScore: Math.min(...scores),
          passRate: Math.round((passed / res.length) * 100)
        });
      } else {
        setAnalytics(null);
      }
      setLoadingResults(false);
    }
    loadResults();
  }, [selectedExam]);

  const completedExams = exams.filter(e => e.status === 'completed');

  return (
    <div className="max-w-6xl space-y-8 animate-page-enter">
      <PageHeader
        title="Result Evaluations"
        subtitle="Review student scorecard submissions and cohort analytics."
      />

      {/* ── Exam Selector ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-white rounded-xl"
        style={{ border: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#F4F4F5' }}>
            <BarChart3 size={18} style={{ color: '#52525B' }} />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#18181B] mb-0.5">
              Select Examination
            </label>
            <p className="text-[12px] text-[#71717A]">Choose an exam to view cohort analytics</p>
          </div>
        </div>
        
        <div className="relative w-full sm:w-80 sm:ml-auto">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
          <select
            value={selectedExam}
            onChange={e => setSelectedExam(e.target.value)}
            className="input-enterprise w-full !pl-9 appearance-none bg-no-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23A1A1AA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px',
            }}
          >
            <option value="">-- Choose an examination --</option>
            {completedExams.map(e => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedExam ? (
        <EmptyState
          icon={BarChart3}
          title="No examination selected"
          description="Select an examination from the dropdown menu above to inspect submissions."
        />
      ) : (
        <div className="space-y-8 animate-fade-up">
          {/* ── Summary Metric Strip ── */}
          {analytics && (
            <MetricStrip cols={5}>
              <MetricItem label="Submissions" value={analytics.totalAttempts} caption="Total candidates" accent="#6366F1" />
              <MetricItem label="Average Score" value={`${analytics.averageScore}%`} caption="Cohort mean" accent="#10B981" />
              <MetricItem label="Highest Score" value={`${analytics.highestScore}%`} caption="Top score" accent="#F59E0B" />
              <MetricItem label="Lowest Score" value={`${analytics.lowestScore}%`} caption="Lowest score" accent="#EF4444" />
              <MetricItem label="Passing Ratio" value={`${analytics.passRate}%`} caption="Cleared threshold" accent="#8B5CF6" />
            </MetricStrip>
          )}

          {/* ── Results Table ── */}
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Obtained Marks</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Time Taken</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {examResults.map((result, i) => {
                  const student = allStudents.find(s => s.id === (result as any).student_id || s.id === result.studentId);
                  const timeSpent = (result as any).time_spent ?? result.timeSpent ?? 0;
                  const mins = Math.floor(timeSpent / 60);
                  const secs = timeSpent % 60;
                  return (
                    <tr key={result.id} className={`stagger-${(i % 10) + 1} animate-fade-up`}>
                      <td className="font-medium text-[#18181B]">{student?.name || 'Candidate'}</td>
                      <td>
                        <div className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium"
                          style={{ background: '#F4F4F5', color: '#52525B' }}
                        >
                          {student?.student_id || '—'}
                        </div>
                      </td>
                      <td className="font-mono text-[13px] font-medium text-[#18181B]">{(result as any).obtained_marks ?? result.obtainedMarks}/{(result as any).total_marks ?? result.totalMarks}</td>
                      <td className="font-mono text-[13px] font-semibold text-[#18181B]">{result.percentage}%</td>
                      <td><StatusBadge variant={result.status} /></td>
                      <td className="text-[13px] text-[#52525B]">{mins}m {secs.toString().padStart(2, '0')}s</td>
                      <td className="text-right">
                        <Link
                          href={`/results/${result.id}`}
                          className="inline-flex items-center justify-center px-3 py-1.5 rounded-md text-[12px] font-medium transition-all"
                          style={{ background: '#FAFAFA', border: '1px solid rgba(0,0,0,0.06)', color: '#18181B' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#F4F4F5'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#FAFAFA'; }}
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
