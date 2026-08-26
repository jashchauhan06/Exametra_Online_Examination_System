'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { fetchExams } from '@/lib/data/supabase-service';
import { supabase } from '@/lib/supabase';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

import dynamic from 'next/dynamic';

const PIE_COLORS = ['#16A34A', '#DC2626'];

function AnalyticsPageContent() {
  const { user } = useAuth();
  const [selectedExam, setSelectedExam] = useState('');

  const [exams, setExams] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function loadExams() {
      if (!user) return;
      const data = await fetchExams(user.role === 'admin' ? undefined : user.id);
      setExams(data);
      setLoading(false);
    }
    loadExams();
  }, [user]);

  React.useEffect(() => {
    async function loadAnalytics() {
      if (!selectedExam) {
        setAnalytics(null);
        return;
      }
      
      const { data: resData } = await supabase.from('results').select('*').eq('exam_id', selectedExam);
      const res = resData || [];
      
      if (res.length === 0) {
        setAnalytics({
          scoreDistribution: { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 },
          passCount: 0,
          failCount: 0,
          averageScore: 0,
        });
        return;
      }
      
      const dist = { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 };
      let passed = 0;
      let totalScore = 0;
      
      res.forEach(r => {
        const p = Number(r.percentage);
        totalScore += p;
        if (p <= 20) dist['0-20']++;
        else if (p <= 40) dist['21-40']++;
        else if (p <= 60) dist['41-60']++;
        else if (p <= 80) dist['61-80']++;
        else dist['81-100']++;
        
        if (r.status === 'passed') passed++;
      });
      
      setAnalytics({
        scoreDistribution: dist,
        passCount: passed,
        failCount: res.length - passed,
        averageScore: Math.round(totalScore / res.length),
      });
    }
    loadAnalytics();
  }, [selectedExam]);

  const completedExams = exams.filter(e => e.status === 'completed');
  const questionAnalytics: any[] = []; // Omitted for now due to complexity of pulling individual question results

  // Score distribution chart data
  const distributionData = analytics ? [
    { range: '0-20%', count: analytics.scoreDistribution['0-20'] },
    { range: '21-40%', count: analytics.scoreDistribution['21-40'] },
    { range: '41-60%', count: analytics.scoreDistribution['41-60'] },
    { range: '61-80%', count: analytics.scoreDistribution['61-80'] },
    { range: '81-100%', count: analytics.scoreDistribution['81-100'] },
  ] : [];

  // Pass vs Fail pie data
  const passFailData = analytics ? [
    { name: 'Passed', value: analytics.passCount },
    { name: 'Failed', value: analytics.failCount },
  ] : [];

  // Average score by exam (temporarily removed during Supabase migration)
  const avgByExam: any[] = [];

  return (
    <div className="max-w-5xl">
      <PageHeader title="Analytics" subtitle="Performance insights and question analysis." />

      {/* Average Score by Exam - Hidden temporarily during migration */}

      {/* Per-Exam Analysis */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-text mb-3">Exam-Specific Analysis</h2>
        <select value={selectedExam} onChange={e => setSelectedExam(e.target.value)}
          className="h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-text min-w-[280px]">
          <option value="">Select an examination</option>
          {completedExams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
      </div>

      {!selectedExam || !analytics ? (
        <EmptyState icon={BarChart3} title="Select an examination" description="Choose an exam to view detailed analytics." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Score Distribution */}
            <div>
              <h3 className="text-sm font-semibold text-text mb-3">Score Distribution</h3>
              <div className="bg-surface border border-border rounded-lg p-5">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13 }} />
                    <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} name="Students" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pass vs Fail */}
            <div>
              <h3 className="text-sm font-semibold text-text mb-3">Pass vs Fail</h3>
              <div className="bg-surface border border-border rounded-lg p-5 flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={passFailData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {passFailData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Question Analysis */}
          {questionAnalytics.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-text mb-3">Question Analysis</h2>
              <div className="bg-surface border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-bg">
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Question</th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Correct %</th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Incorrect %</th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Skipped %</th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questionAnalytics.map((qa, i) => (
                      <tr key={qa.questionId} className={`border-b border-border last:border-b-0 ${
                        qa.correctPercent < 40 ? 'bg-error-light/30' : ''
                      }`}>
                        <td className="px-4 py-3 text-text max-w-xs truncate">
                          <span className="text-text-muted mr-2">Q{i + 1}.</span>
                          {qa.questionText}
                        </td>
                        <td className="px-4 py-3 text-success font-medium">{qa.correctPercent}%</td>
                        <td className="px-4 py-3 text-error font-medium">{qa.incorrectPercent}%</td>
                        <td className="px-4 py-3 text-text-muted">{qa.skippedPercent}%</td>
                        <td className="px-4 py-3 capitalize text-text-secondary">{qa.difficulty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-text-muted mt-2">Rows highlighted in red indicate questions where less than 40% of students answered correctly.</p>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve({ default: AnalyticsPageContent }), { ssr: false });
