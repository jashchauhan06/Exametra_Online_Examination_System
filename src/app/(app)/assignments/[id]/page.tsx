'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  fetchAssignmentById,
  fetchSubmissionsForAssignment,
  fetchStudentSubmission,
  fetchSubjects,
  deleteAssignment,
  updateAssignment,
} from '@/lib/data/supabase-service';
import type { Assignment, AssignmentSubmission } from '@/types';
import { SubmissionForm } from '@/components/assignments/submission-form';
import { EvaluationResult } from '@/components/assignments/evaluation-result';
import { ArrowLeft, Calendar, Clock, FileText, Trash2, Users, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';

export default function AssignmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [studentSubmission, setStudentSubmission] = useState<AssignmentSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user || !id) return;
    async function loadData() {
      setLoading(true);
      try {
        const [a, subs] = await Promise.all([
          fetchAssignmentById(id as string),
          fetchSubjects(),
        ]);
        setAssignment(a);
        setSubjects(subs);

        if (a) {
          if (user!.role === 'faculty' || user!.role === 'admin') {
            const allSubs = await fetchSubmissionsForAssignment(a.id);
            setSubmissions(allSubs);
          }
          if (user!.role === 'student') {
            const mySub = await fetchStudentSubmission(a.id, user!.id);
            setStudentSubmission(mySub);
          }
        }
      } catch (err) {
        console.error('Error loading assignment:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user, id]);

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? `${subject.name} (${subject.code})` : 'Unknown Subject';
  };

  const handleDelete = async () => {
    if (!assignment) return;
    if (!confirm('Are you sure you want to delete this assignment? All submissions will be lost.')) return;
    setDeleting(true);
    const success = await deleteAssignment(assignment.id);
    if (success) {
      router.push('/assignments');
    } else {
      alert('Failed to delete assignment.');
      setDeleting(false);
    }
  };

  const handleCloseAssignment = async () => {
    if (!assignment) return;
    const updated = await updateAssignment(assignment.id, { status: 'closed' });
    if (updated) setAssignment(updated);
  };

  const handleReopenAssignment = async () => {
    if (!assignment) return;
    const updated = await updateAssignment(assignment.id, { status: 'active' });
    if (updated) setAssignment(updated);
  };

  if (loading) {
    return (
      <div className="max-w-5xl space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="max-w-5xl">
        <div className="rounded-2xl p-12 text-center" style={{ background: '#FAFAFA', border: '1px solid #E4E4E7' }}>
          <p className="text-sm text-[#71717A]">Assignment not found.</p>
          <Link href="/assignments" className="text-sm font-medium text-[#8B5CF6] mt-2 inline-block hover:underline">
            ← Back to Assignments
          </Link>
        </div>
      </div>
    );
  }

  const isDeadlinePassed = new Date(assignment.deadline) < new Date();
  const evaluatedCount = submissions.filter(s => s.status === 'evaluated').length;
  const pendingCount = submissions.filter(s => s.status === 'pending' || s.status === 'evaluating').length;
  const errorCount = submissions.filter(s => s.status === 'error').length;
  const avgScore = submissions.filter(s => s.score != null).length > 0
    ? Math.round(submissions.filter(s => s.score != null).reduce((a, b) => a + (b.score || 0), 0) / submissions.filter(s => s.score != null).length * 10) / 10
    : null;

  return (
    <div className="max-w-5xl animate-page-enter space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href="/assignments"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            style={{ background: '#F4F4F5' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#E4E4E7'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#F4F4F5'; }}
          >
            <ArrowLeft size={16} className="text-[#71717A]" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#18181B] tracking-tight">{assignment.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-[#8B5CF6] font-medium">{getSubjectName(assignment.subject_id)}</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                assignment.status === 'active' ? 'text-[#10B981]' : assignment.status === 'closed' ? 'text-[#EF4444]' : 'text-[#71717A]'
              }`} style={{
                background: assignment.status === 'active' ? 'rgba(16, 185, 129, 0.08)' : assignment.status === 'closed' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(113, 113, 122, 0.08)'
              }}>
                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {(user?.role === 'faculty' || user?.role === 'admin') && (
          <div className="flex items-center gap-2">
            {assignment.status === 'active' && (
              <button onClick={handleCloseAssignment}
                className="px-3 py-2 rounded-lg text-xs font-medium text-[#71717A] transition-colors"
                style={{ background: '#F4F4F5' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#E4E4E7'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#F4F4F5'; }}
              >
                Close Assignment
              </button>
            )}
            {assignment.status === 'closed' && (
              <button onClick={handleReopenAssignment}
                className="px-3 py-2 rounded-lg text-xs font-medium text-[#10B981] transition-colors"
                style={{ background: 'rgba(16, 185, 129, 0.08)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)'; }}
              >
                Reopen Assignment
              </button>
            )}
            <button onClick={handleDelete} disabled={deleting}
              className="px-3 py-2 rounded-lg text-xs font-medium text-[#EF4444] transition-colors"
              style={{ background: 'rgba(239, 68, 68, 0.06)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)'; }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Assignment Info */}
      <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #E4E4E7' }}>
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2">Description</h3>
            <p className="text-[13px] leading-relaxed text-[#3F3F46] whitespace-pre-wrap">{assignment.description}</p>
          </div>

          <div className="h-[1px]" style={{ background: '#F4F4F5' }} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.08)' }}>
                <Calendar size={14} className="text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-[10px] text-[#A1A1AA] font-medium">Deadline</p>
                <p className="text-xs font-semibold text-[#18181B]">
                  {new Date(assignment.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.08)' }}>
                <Clock size={14} className="text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-[10px] text-[#A1A1AA] font-medium">Time</p>
                <p className="text-xs font-semibold text-[#18181B]">
                  {new Date(assignment.deadline).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.08)' }}>
                <FileText size={14} className="text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-[10px] text-[#A1A1AA] font-medium">Max Marks</p>
                <p className="text-xs font-semibold text-[#18181B]">{assignment.max_marks}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.08)' }}>
                <FileText size={14} className="text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-[10px] text-[#A1A1AA] font-medium">Formats</p>
                <p className="text-xs font-semibold text-[#18181B] capitalize">
                  {(assignment.accepted_types || []).join(', ')}
                </p>
              </div>
            </div>
          </div>

          {assignment.attachment_url && (
            <>
              <div className="h-[1px]" style={{ background: '#F4F4F5' }} />
              <div>
                <h3 className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2">Attachment</h3>
                {assignment.attachment_type === 'image' ? (
                  <a href={assignment.attachment_url} target="_blank" rel="noreferrer" className="block w-max">
                    <img src={assignment.attachment_url} alt="Assignment Attachment" className="max-h-64 rounded-xl border border-[#E4E4E7] shadow-sm hover:opacity-90 transition-opacity" />
                  </a>
                ) : (
                  <a 
                    href={assignment.attachment_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] hover:bg-[#F4F4F5] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.08)' }}>
                      <FileText size={16} className="text-[#8B5CF6]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#18181B]">View PDF Document</p>
                      <p className="text-[10px] text-[#71717A]">Click to open in a new tab</p>
                    </div>
                  </a>
                )}
              </div>
            </>
          )}

          {assignment.rubric && (
            <>
              <div className="h-[1px]" style={{ background: '#F4F4F5' }} />
              <div>
                <h3 className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2">Grading Rubric</h3>
                <div className="text-[13px] leading-relaxed text-[#3F3F46] whitespace-pre-wrap rounded-xl p-4"
                  style={{ background: '#FAFAFA', border: '1px solid #F4F4F5' }}>
                  {assignment.rubric}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Student View: Submission Form */}
      {user?.role === 'student' && (
        <div>
          <h2 className="text-sm font-bold text-[#18181B] mb-4">Your Submission</h2>
          <SubmissionForm
            assignment={assignment}
            existingSubmission={studentSubmission}
            onSubmissionUpdate={(sub) => setStudentSubmission(sub)}
          />
        </div>
      )}

      {/* Faculty View: Submissions Table */}
      {(user?.role === 'faculty' || user?.role === 'admin') && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#18181B]">Student Submissions</h2>
            <div className="flex items-center gap-3">
              {avgScore !== null && (
                <span className="text-[11px] font-medium text-[#71717A]">
                  Avg Score: <span className="text-[#8B5CF6] font-bold">{avgScore}/{assignment.max_marks}</span>
                </span>
              )}
              <span className="flex items-center gap-1 text-[11px] font-medium text-[#10B981]">
                <CheckCircle size={12} /> {evaluatedCount} evaluated
              </span>
              {pendingCount > 0 && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-[#F59E0B]">
                  <AlertCircle size={12} /> {pendingCount} pending
                </span>
              )}
              {errorCount > 0 && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-[#EF4444]">
                  <XCircle size={12} /> {errorCount} failed
                </span>
              )}
            </div>
          </div>

          {submissions.length === 0 ? (
            <div className="rounded-2xl p-12 text-center" style={{ background: '#FAFAFA', border: '1px solid #E4E4E7' }}>
              <Users size={32} className="text-[#D4D4D8] mx-auto mb-3" />
              <p className="text-sm text-[#71717A]">No submissions yet</p>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E4E4E7' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #F4F4F5' }}>
                    <th className="text-left text-[11px] font-semibold text-[#71717A] uppercase tracking-wider px-5 py-3">Student</th>
                    <th className="text-left text-[11px] font-semibold text-[#71717A] uppercase tracking-wider px-5 py-3">Type</th>
                    <th className="text-left text-[11px] font-semibold text-[#71717A] uppercase tracking-wider px-5 py-3">Score</th>
                    <th className="text-left text-[11px] font-semibold text-[#71717A] uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-left text-[11px] font-semibold text-[#71717A] uppercase tracking-wider px-5 py-3">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => {
                    const statusColors: Record<string, { color: string; bg: string }> = {
                      evaluated: { color: '#10B981', bg: 'rgba(16, 185, 129, 0.08)' },
                      evaluating: { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)' },
                      pending: { color: '#71717A', bg: 'rgba(113, 113, 122, 0.08)' },
                      error: { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.08)' },
                    };
                    const sc = statusColors[sub.status] || statusColors.pending;
                    const scorePercent = sub.score != null && sub.max_marks ? Math.round((sub.score / sub.max_marks) * 100) : null;

                    return (
                      <tr key={sub.id} style={{ borderBottom: '1px solid #FAFAFA' }}
                        className="hover:bg-[#FAFAFA] transition-colors">
                        <td className="px-5 py-3.5">
                          <div>
                            <p className="text-[13px] font-medium text-[#18181B]">{sub.student_name || 'Unknown'}</p>
                            <p className="text-[11px] text-[#A1A1AA]">{sub.student_email || ''}</p>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs font-medium text-[#71717A] capitalize px-2 py-1 rounded-md" 
                            style={{ background: '#F4F4F5' }}>
                            {sub.submission_type}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {sub.score != null ? (
                            <div>
                              <span className="text-sm font-bold text-[#18181B]">{sub.score}</span>
                              <span className="text-xs text-[#A1A1AA]">/{sub.max_marks}</span>
                              {scorePercent !== null && (
                                <span className="ml-2 text-[11px] font-medium" style={{
                                  color: scorePercent >= 60 ? '#10B981' : scorePercent >= 40 ? '#F59E0B' : '#EF4444'
                                }}>
                                  ({scorePercent}%)
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-[#A1A1AA]">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-[11px] font-semibold px-2 py-1 rounded-md capitalize"
                            style={{ background: sc.bg, color: sc.color }}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs text-[#71717A]">
                            {new Date(sub.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Expanded feedback view for each evaluated submission */}
          {submissions.filter(s => s.status === 'evaluated' && s.feedback).length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">Detailed Feedback</h3>
              {submissions.filter(s => s.status === 'evaluated' && s.feedback).map(sub => (
                <div key={sub.id} className="rounded-xl p-4" style={{ background: '#FAFAFA', border: '1px solid #F4F4F5' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#18181B]">{sub.student_name}</span>
                    <span className="text-xs font-bold" style={{
                      color: (sub.score || 0) / (sub.max_marks || 1) >= 0.6 ? '#10B981' : '#F59E0B'
                    }}>
                      {sub.score}/{sub.max_marks}
                    </span>
                  </div>
                  <div className="text-[12px] text-[#3F3F46] leading-relaxed prose prose-sm max-w-none">
                    <ReactMarkdown>{sub.feedback || ''}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
