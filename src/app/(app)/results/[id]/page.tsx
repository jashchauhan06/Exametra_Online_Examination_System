'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, CheckCircle2, XCircle, MinusCircle, Clock, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { supabase } from '@/lib/supabase';

export default function ResultDetailPage() {
  const params = useParams();
  const [result, setResult] = React.useState<any>(null);
  const [exam, setExam] = React.useState<any>(null);
  const [subject, setSubject] = React.useState<any>(null);
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadResultData() {
      setLoading(true);
      const resultId = params.id as string;
      
      const { data: resultData } = await supabase.from('results').select('*').eq('id', resultId).single();
      
      if (resultData) {
        setResult(resultData);
        
        // Fetch Exam
        const { data: examData } = await supabase.from('exams').select('*').eq('id', resultData.exam_id).single();
        if (examData) {
          setExam(examData);
          const { data: subjectData } = await supabase.from('subjects').select('*').eq('id', examData.subject_id).single();
          setSubject(subjectData);
        }
        
        // Fetch Questions
        if (resultData.question_results && resultData.question_results.length > 0) {
          const qIds = resultData.question_results.map((qr: any) => qr.questionId);
          const { data: questionsData } = await supabase.from('questions').select('*').in('id', qIds);
          setQuestions(questionsData || []);
        }
      }
      setLoading(false);
    }
    loadResultData();
  }, [params.id]);

  if (loading) {
    return <div className="max-w-3xl text-center py-20 text-gray-500">Loading result...</div>;
  }

  if (!result) {
    return (
      <div className="max-w-3xl">
        <p className="text-sm text-text-secondary">Result not found.</p>
        <Link href="/results" className="text-sm text-primary mt-2 inline-block">← Back to Results</Link>
      </div>
    );
  }

  const mins = Math.floor(result.time_spent / 60);
  const secs = result.time_spent % 60;

  // Performance bar
  const totalQ = result.correct_count + result.incorrect_count + result.unanswered_count;
  const correctPct = totalQ > 0 ? (result.correct_count / totalQ) * 100 : 0;
  const incorrectPct = totalQ > 0 ? (result.incorrect_count / totalQ) * 100 : 0;
  const unansweredPct = totalQ > 0 ? (result.unanswered_count / totalQ) * 100 : 0;

  return (
    <div className="max-w-3xl">
      <Link href="/results" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text mb-4">
        <ArrowLeft size={16} /> Back to Results
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text">Examination Result</h1>
        <p className="text-sm text-text-secondary mt-1">
          {exam?.title} • {subject?.code}
        </p>
      </div>

      {/* Score */}
      <div className={`bg-surface border rounded-lg p-6 mb-6 text-center ${result.isViolation ? 'border-error/40 bg-error/5' : 'border-border'}`}>
        
        {result.is_violation && (
          <div className="flex items-center justify-center gap-2 mb-4 bg-error/10 text-error px-4 py-2 rounded-md inline-flex mx-auto border border-error/20 font-medium text-sm">
            <AlertTriangle size={16} />
            SECURITY VIOLATION: Navigated Out ({result.violation_reason || 'Test environment exited'})
          </div>
        )}

        <div className="text-4xl font-bold text-text mb-1">
          {result.obtained_marks} / {result.total_marks}
        </div>
        <div className="text-xl text-text-secondary mb-3">{result.percentage}%</div>
        <div className="flex justify-center gap-3">
          <StatusBadge
            variant={result.status}
          />
          {result.is_violation && (
            <span className="px-2.5 py-1 text-xs font-semibold bg-[#FECACA] text-[#991B1B] rounded-full border border-[#FCA5A5] flex items-center">
              Force Submitted
            </span>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-surface border border-border rounded-lg px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <CheckCircle2 size={14} className="text-success" />
            <span className="text-xs text-text-secondary">Correct</span>
          </div>
          <div className="text-lg font-semibold text-text">{result.correct_count}</div>
        </div>
        <div className="bg-surface border border-border rounded-lg px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <XCircle size={14} className="text-error" />
            <span className="text-xs text-text-secondary">Incorrect</span>
          </div>
          <div className="text-lg font-semibold text-text">{result.incorrect_count}</div>
        </div>
        <div className="bg-surface border border-border rounded-lg px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <MinusCircle size={14} className="text-text-muted" />
            <span className="text-xs text-text-secondary">Unanswered</span>
          </div>
          <div className="text-lg font-semibold text-text">{result.unanswered_count}</div>
        </div>
        <div className="bg-surface border border-border rounded-lg px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Clock size={14} className="text-text-muted" />
            <span className="text-xs text-text-secondary">Time Taken</span>
          </div>
          <div className="text-lg font-semibold text-text">{mins}m {secs.toString().padStart(2, '0')}s</div>
        </div>
      </div>

      {/* Performance Bar */}
      <section className="mb-6">
        <h2 className="text-base font-semibold text-text mb-3">Performance</h2>
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex h-6 rounded-md overflow-hidden bg-bg">
            {correctPct > 0 && (
              <div style={{ width: `${correctPct}%` }} className="bg-success flex items-center justify-center text-[10px] text-white font-medium">
                {result.correct_count}
              </div>
            )}
            {incorrectPct > 0 && (
              <div style={{ width: `${incorrectPct}%` }} className="bg-error flex items-center justify-center text-[10px] text-white font-medium">
                {result.incorrect_count}
              </div>
            )}
            {unansweredPct > 0 && (
              <div style={{ width: `${unansweredPct}%` }} className="bg-border-strong flex items-center justify-center text-[10px] text-text-secondary font-medium">
                {result.unanswered_count}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2.5 text-xs text-text-secondary">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-success" /> Correct</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-error" /> Incorrect</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-border-strong" /> Unanswered</span>
          </div>
        </div>
      </section>

      {/* Question Review */}
      {result.question_results && result.question_results.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-semibold text-text mb-3">Question Review</h2>
          <div className="space-y-3">
            {result.question_results.map((qr: any, i: number) => {
              const question = questions.find(q => q.id === qr.questionId);
              if (!question) return null;

              const studentOptions = qr.studentAnswer.map((aid: string) => question.options.find((o: any) => o.id === aid)?.text).filter(Boolean);
              const correctOptions = qr.correctAnswer.map((aid: string) => question.options.find((o: any) => o.id === aid)?.text).filter(Boolean);

              return (
                <div
                  key={qr.questionId}
                  className={`bg-surface border rounded-lg px-5 py-4 ${
                    qr.isCorrect ? 'border-[#BBF7D0]' : qr.studentAnswer.length === 0 ? 'border-border' : 'border-[#FECACA]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-text-secondary">Question {i + 1}</span>
                    <span className={`text-xs font-medium ${
                      qr.isCorrect ? 'text-success' : qr.studentAnswer.length === 0 ? 'text-text-muted' : 'text-error'
                    }`}>
                      {qr.marksAwarded > 0 ? `+${qr.marksAwarded}` : qr.marksDeducted > 0 ? `-${qr.marksDeducted}` : '0'} marks
                    </span>
                  </div>
                  <p className="text-sm text-text mb-3">{question.text}</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-text-muted">Your answer</span>
                      <div className={`mt-0.5 font-medium ${
                        qr.isCorrect ? 'text-success' : qr.studentAnswer.length === 0 ? 'text-text-muted' : 'text-error'
                      }`}>
                        {studentOptions.length > 0 ? studentOptions.join(', ') : 'Not answered'}
                      </div>
                    </div>
                    <div>
                      <span className="text-text-muted">Correct answer</span>
                      <div className="mt-0.5 font-medium text-success">
                        {correctOptions.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-border text-sm font-medium text-text rounded-md hover:bg-sidebar-hover transition-colors"
        >
          <Download size={16} /> Download Result
        </button>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
