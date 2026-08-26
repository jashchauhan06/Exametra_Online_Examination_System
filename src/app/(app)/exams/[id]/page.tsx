'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/toast';
import { StatusBadge } from '@/components/ui/status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ArrowLeft, Calendar, Clock, FileText, User, Award, Target, CheckCircle2, RotateCcw, Shield, AlertTriangle, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getDynamicExamStatus } from '@/lib/utils/exam-status';

export default function ExamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [acknowledged, setAcknowledged] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [exam, setExam] = useState<any>(null);
  const [subject, setSubject] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(null);
  const [existingAttempt, setExistingAttempt] = useState<any>(null);
  const [allAttempts, setAllAttempts] = useState<any[]>([]);
  const [attemptStudents, setAttemptStudents] = useState<Record<string, any>>({});
  const [attemptResults, setAttemptResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [resettingStudent, setResettingStudent] = useState<string | null>(null);
  const [timeUntilStart, setTimeUntilStart] = useState<number | null>(null);

  React.useEffect(() => {
    if (!exam || exam.status !== 'upcoming') return;
    const examDate = new Date(exam.date + 'T' + (exam.start_time || '00:00'));
    
    const updateTime = () => {
      const now = new Date();
      const diff = Math.floor((examDate.getTime() - now.getTime()) / 1000);
      if (diff <= 0) {
        setTimeUntilStart(0);
        setExam((prev: any) => ({ ...prev, status: 'live' }));
      } else {
        setTimeUntilStart(diff);
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [exam?.date, exam?.start_time, exam?.status]);

  const formatCountdown = (seconds: number) => {
    if (seconds <= 0) return '00:00:00';
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (d > 0) return `${d}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m`;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  React.useEffect(() => {
    async function loadExam() {
      setLoading(true);
      const examId = params.id as string;
      const { data: examData } = await supabase.from('exams').select('*').eq('id', examId).single();
      
      if (examData) {
        examData.status = getDynamicExamStatus(examData);
        setExam(examData);
        const { data: subData } = await supabase.from('subjects').select('*').eq('id', examData.subject_id).single();
        setSubject(subData);
        
        if (examData.faculty_id) {
          const { data: facData } = await supabase.from('users').select('*').eq('id', examData.faculty_id).single();
          setFaculty(facData);
        }

        if (user?.role === 'student') {
          const { data: attData } = await supabase.from('exam_attempts')
            .select('*')
            .eq('exam_id', examId)
            .eq('student_id', user.id)
            .order('started_at', { ascending: false })
            .limit(1)
            .single();
            
          setExistingAttempt(attData);
        }

        // Faculty/admin: load all student attempts for this exam
        if (user?.role === 'faculty' || user?.role === 'admin') {
          const { data: attData } = await supabase.from('exam_attempts')
            .select('*')
            .eq('exam_id', examId)
            .order('started_at', { ascending: false });
          
          setAllAttempts(attData || []);

          // Load student profiles for the attempts
          if (attData && attData.length > 0) {
            const studentIds = [...new Set(attData.map(a => a.student_id))];
            const { data: students } = await supabase.from('users').select('*').in('id', studentIds);
            const studentMap: Record<string, any> = {};
            (students || []).forEach(s => { studentMap[s.id] = s; });
            setAttemptStudents(studentMap);

            // Load results for these attempts
            const attemptIds = attData.map(a => a.id);
            const { data: results } = await supabase.from('results').select('*').in('attempt_id', attemptIds);
            const resultMap: Record<string, any> = {};
            (results || []).forEach(r => { resultMap[r.attempt_id] = r; });
            setAttemptResults(resultMap);
          }
        }
      }
      setLoading(false);
    }
    if (user) loadExam();
  }, [params.id, user]);

  const handleAllowRetake = async (studentId: string) => {
    if (!confirm('Allow this student to resume/retake the exam? Their attempt will be reset to in-progress so they can continue from where they left off.')) return;
    
    setResettingStudent(studentId);
    const examId = params.id as string;

    // Delete only the result (grade) — keep the attempt record
    const studentAttempts = allAttempts.filter(a => a.student_id === studentId);
    for (const att of studentAttempts) {
      await supabase.from('results').delete().eq('attempt_id', att.id);
    }
    
    // Reset the attempt status back to 'in-progress' so student can continue
    await supabase.from('exam_attempts').update({
      status: 'in-progress',
      submitted_at: null,
      is_violation: false,
      violation_reason: null,
    })
      .eq('exam_id', examId)
      .eq('student_id', studentId);

    // Update local state
    setAllAttempts(prev => prev.map(a => 
      a.student_id === studentId 
        ? { ...a, status: 'in-progress', submitted_at: null, is_violation: false, violation_reason: null }
        : a
    ));
    setAttemptResults(prev => {
      const next = { ...prev };
      studentAttempts.forEach(att => { delete next[att.id]; });
      return next;
    });
    setResettingStudent(null);
    addToast('Student can now retake the exam.', 'success');
  };

  const handleDeleteExam = async () => {
    if (!exam) return;
    const { error } = await supabase.from('exams').delete().eq('id', exam.id);
    if (error) {
      addToast('Failed to delete exam.', 'error');
    } else {
      addToast('Exam deleted successfully.', 'success');
      router.replace('/exams');
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
        <Skeleton className="h-4 w-24 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-20 rounded-full mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="flex items-center gap-3 p-3 bg-surface rounded-md border border-border">
              <Skeleton className="w-8 h-8 rounded-md" />
              <div>
                <Skeleton className="h-3 w-16 mb-1.5" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="max-w-3xl">
        <p className="text-sm text-text-secondary">Exam not found.</p>
        <Link href="/exams" className="text-sm text-primary hover:text-primary-hover mt-2 inline-block">← Back to Exams</Link>
      </div>
    );
  }

  const examDate = new Date(exam.date + 'T' + (exam.start_time || '00:00'));
  const isStudent = user?.role === 'student';
  const isFacultyOrAdmin = user?.role === 'faculty' || user?.role === 'admin';
  const canStart = isStudent && exam.status === 'live' && (!existingAttempt || existingAttempt.status === 'in-progress');

  const details = [
    { icon: FileText, label: 'Subject', value: `${subject?.name || '—'} (${subject?.code || '—'})` },
    { icon: User, label: 'Faculty', value: faculty?.name || '—' },
    { icon: Calendar, label: 'Date & Time', value: examDate.toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }) },
    { icon: Clock, label: 'Duration', value: `${exam.duration} minutes` },
    { icon: FileText, label: 'Total Questions', value: exam.total_questions },
    { icon: Award, label: 'Maximum Marks', value: exam.total_marks },
    { icon: Target, label: 'Passing Marks', value: exam.passing_marks },
    { icon: CheckCircle2, label: 'Attempts Allowed', value: exam.attempts_allowed },
  ];

  return (
    <>
      <div className="max-w-3xl mx-auto animate-page-enter">
      {/* Back */}
      <Link href="/exams" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text mb-4">
        <ArrowLeft size={16} /> Back to Exams
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-text">{exam.title}</h1>
          <p className="text-sm text-text-secondary mt-1">{exam.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge variant={exam.status} />
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-error/20 bg-error/5 text-error hover:bg-error/10 transition-colors text-xs font-medium"
            >
              <Trash2 size={14} /> Delete Exam
            </button>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="bg-surface border border-border rounded-lg mb-6">
        <div className="grid grid-cols-2 divide-x divide-border">
          {details.map((d, i) => {
            const Icon = d.icon;
            return (
              <div key={i} className={`px-5 py-3.5 ${i >= 2 ? 'border-t border-border' : ''}`}>
                <div className="flex items-center gap-2 text-xs text-text-secondary mb-0.5">
                  <Icon size={14} />
                  {d.label}
                </div>
                <div className="text-sm font-medium text-text">{String(d.value)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <section className="mb-6">
        <h2 className="text-base font-semibold text-text mb-3">Instructions</h2>
        <div className="bg-surface border border-border rounded-lg px-5 py-4">
          <ul className="space-y-2">
            {(exam.instructions || []).map((inst: string, i: number) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                <span className="text-text-muted mt-0.5">•</span>
                {inst}
              </li>
            ))}
            {exam.settings?.enableNegativeMarking && (
              <li className="flex items-start gap-2.5 text-sm text-text-secondary font-medium">
                <span className="text-error mt-0.5">•</span>
                Negative marking applies ({exam.settings.negativeMarkPercentage}% deducted for incorrect answers).
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* Start Exam (student only) */}
      {isStudent && (
        <div className="bg-surface border border-border rounded-lg px-5 py-4">
          {existingAttempt && existingAttempt.status !== 'in-progress' ? (
            <p className="text-sm text-text-secondary">You have already attempted this exam.</p>
          ) : (
            <>
              <label className="flex items-start gap-2.5 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={e => setAcknowledged(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-border text-primary accent-primary"
                  disabled={!canStart && exam.status !== 'upcoming'}
                />
                <span className="text-sm text-text">
                  I have read and understood the examination instructions.
                </span>
              </label>

              {exam.status === 'upcoming' && timeUntilStart !== null && timeUntilStart > 0 ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-primary/5 border border-primary/20 rounded-md p-4 mb-4">
                  <div className="text-sm font-medium text-primary flex items-center gap-2">
                    <Clock size={16} /> Exam starts in:
                  </div>
                  <div className="text-2xl font-bold font-mono tracking-tight text-primary">
                    {formatCountdown(timeUntilStart)}
                  </div>
                </div>
              ) : null}

              <button
                onClick={async () => {
                  try {
                    if (!document.fullscreenElement) {
                      await document.documentElement.requestFullscreen();
                    }
                  } catch (e) {
                    console.error('Fullscreen request failed', e);
                  }
                  router.push(`/exams/${exam.id}/take`);
                }}
                disabled={!acknowledged || !canStart}
                className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {existingAttempt?.status === 'in-progress' ? 'Resume Examination' : 'Start Examination'}
              </button>
            </>
          )}
        </div>
      )}

      {/* ── Student Attempts (Faculty/Admin only) ── */}
      {isFacultyOrAdmin && (
        <section className="mt-8">
          <h2 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
            <Shield size={18} />
            Student Attempts
            <span className="text-xs font-normal text-text-muted ml-1">({allAttempts.length} total)</span>
          </h2>

          {allAttempts.length === 0 ? (
            <div className="bg-surface border border-border rounded-lg py-10 text-center">
              <p className="text-sm text-text-secondary">No students have attempted this exam yet.</p>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[1.5fr_0.8fr_0.6fr_0.6fr_0.8fr] gap-2 px-5 py-3 border-b border-border text-xs font-medium text-text-secondary uppercase tracking-wide"
                style={{ background: '#F9F9FA' }}
              >
                <span>Student</span>
                <span>Status</span>
                <span>Score</span>
                <span>Violation</span>
                <span className="text-right">Action</span>
              </div>

              {/* Group by student — show latest attempt per student */}
              {(() => {
                const studentIds = [...new Set(allAttempts.map(a => a.student_id))];
                return studentIds.map(sId => {
                  const latestAttempt = allAttempts.find(a => a.student_id === sId)!;
                  const student = attemptStudents[sId];
                  const result = attemptResults[latestAttempt.id];
                  const isResetting = resettingStudent === sId;

                  return (
                    <div
                      key={sId}
                      className="grid grid-cols-[1.5fr_0.8fr_0.6fr_0.6fr_0.8fr] gap-2 px-5 py-3.5 items-center border-b border-border last:border-b-0 hover:bg-[#FAFAFA] transition-colors"
                    >
                      {/* Student */}
                      <div>
                        <div className="text-sm font-medium text-text">{student?.name || 'Unknown'}</div>
                        <div className="text-xs text-text-muted">{student?.student_id || student?.email || ''}</div>
                      </div>

                      {/* Status */}
                      <div>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          latestAttempt.status === 'submitted' ? 'bg-green-50 text-green-700' :
                          latestAttempt.status === 'in-progress' ? 'bg-blue-50 text-blue-700' :
                          latestAttempt.status === 'timed-out' ? 'bg-amber-50 text-amber-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {latestAttempt.status}
                        </span>
                      </div>

                      {/* Score */}
                      <div className="text-sm text-text">
                        {result ? (
                          <span className={result.status === 'passed' ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                            {result.obtained_marks}/{result.total_marks}
                          </span>
                        ) : (
                          <span className="text-text-muted">—</span>
                        )}
                      </div>

                      {/* Violation */}
                      <div>
                        {latestAttempt.is_violation ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600" title={latestAttempt.violation_reason || ''}>
                            <AlertTriangle size={12} /> Yes
                          </span>
                        ) : (
                          <span className="text-xs text-text-muted">No</span>
                        )}
                      </div>

                      {/* Action */}
                      <div className="text-right">
                        <button
                          onClick={() => handleAllowRetake(sId)}
                          disabled={isResetting}
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border transition-colors
                            text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/40
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RotateCcw size={12} className={isResetting ? 'animate-spin' : ''} />
                          {isResetting ? 'Resetting...' : 'Allow Retake'}
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </section>
      )}
      </div>
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Exam?"
        message={`Are you sure you want to delete "${exam.title}"? This will also delete all associated questions, attempts, and results. This action cannot be undone.`}
        confirmText="Delete Exam"
        variant="danger"
        onConfirm={handleDeleteExam}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </>
  );
}
