import { supabase } from '../supabase';
import type { Exam, Result, Assignment, AssignmentSubmission } from '@/types';
import { getDynamicExamStatus } from '../utils/exam-status';

/**
 * Fetches upcoming exams for a student.
 */
export async function fetchStudentUpcomingExams(studentId: string): Promise<Exam[]> {
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .neq('status', 'draft')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching upcoming exams:', error);
    return [];
  }
  return (data || [])
    .map(e => ({ ...e, status: getDynamicExamStatus(e as Exam) }))
    .filter(e => e.status === 'upcoming' || e.status === 'live');
}

/**
 * Fetches completed exams for a student.
 */
export async function fetchStudentCompletedExams(studentId: string): Promise<Exam[]> {
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .neq('status', 'draft')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching completed exams:', error);
    return [];
  }
  return (data || [])
    .map(e => ({ ...e, status: getDynamicExamStatus(e as Exam) }))
    .filter(e => e.status === 'completed');
}

/**
 * Fetches exam results for a student.
 */
export async function fetchStudentResults(studentId: string): Promise<Result[]> {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('student_id', studentId);

  if (error) {
    console.error('Error fetching student results:', error);
    return [];
  }
  return data || [];
}

/**
 * Fetches dashboard data for a faculty member.
 */
export async function fetchFacultyDashboardData(facultyId: string) {
  // 1. Fetch exams created by this faculty
  const { data: exams, error: examsError } = await supabase
    .from('exams')
    .select('*')
    .eq('faculty_id', facultyId)
    .order('date', { ascending: false });

  // 2. Fetch total student count
  const { count: studentCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'student');

  // Map to dynamic status
  const dynamicExams = (exams || []).map(e => ({ ...e, status: getDynamicExamStatus(e as Exam) }));
  const activeExams = dynamicExams.filter(e => e.status === 'live').length;
  const upcomingExams = dynamicExams.filter(e => e.status === 'upcoming').length;

  // 3. For completed exams, fetch analytics (results)
  // In a real system, you'd aggregate this in SQL, but for now we'll fetch results for these exams
  const completedExamIds = dynamicExams.filter(e => e.status === 'completed').map(e => e.id);
  
  let analyticsData: Record<string, { averageScore: number, passRate: number, totalAttempts: number }> = {};
  
  if (completedExamIds.length > 0) {
    const { data: allResults } = await supabase
      .from('results')
      .select('exam_id, percentage, status')
      .in('exam_id', completedExamIds);
      
    if (allResults) {
      completedExamIds.forEach(eid => {
        const resultsForExam = allResults.filter(r => r.exam_id === eid);
        if (resultsForExam.length === 0) {
          analyticsData[eid] = { averageScore: 0, passRate: 0, totalAttempts: 0 };
          return;
        }
        const avg = Math.round(resultsForExam.reduce((a, b) => a + Number(b.percentage), 0) / resultsForExam.length);
        const passed = resultsForExam.filter(r => r.status === 'passed').length;
        const pr = Math.round((passed / resultsForExam.length) * 100);
        analyticsData[eid] = { averageScore: avg, passRate: pr, totalAttempts: resultsForExam.length };
      });
    }
  }

  return {
    exams: exams || [],
    studentCount: studentCount || 0,
    analytics: analyticsData
  };
}

/**
 * Fetches high-level platform statistics for the admin dashboard.
 */
export async function fetchPlatformStats() {
  const { count: totalStudents } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student');
  const { count: totalFaculty } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'faculty');
  const { count: totalExams } = await supabase.from('exams').select('*', { count: 'exact', head: true });
  const { count: examsCompleted } = await supabase.from('results').select('*', { count: 'exact', head: true });

  return {
    totalStudents: totalStudents || 0,
    totalFaculty: totalFaculty || 0,
    totalExams: totalExams || 0,
    examsCompleted: examsCompleted || 0,
  };
}

/**
 * Fetches all exams, optionally filtered by faculty.
 */
export async function fetchExams(facultyId?: string) {
  let query = supabase.from('exams').select('*').order('date', { ascending: false });
  if (facultyId) {
    query = query.eq('faculty_id', facultyId);
  }
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching exams:', error);
    return [];
  }
  return (data || []).map(e => ({ ...e, status: getDynamicExamStatus(e as Exam) }));
}

/**
 * Fetches all questions, optionally filtered by faculty.
 */
export async function fetchQuestions(facultyId?: string) {
  let query = supabase.from('questions').select('*').order('created_at', { ascending: false });
  if (facultyId) {
    query = query.eq('created_by', facultyId);
  }
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
  return data || [];
}

/**
 * Fetches all subjects.
 */
export async function fetchSubjects() {
  const { data, error } = await supabase.from('subjects').select('*');
  if (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
  return data || [];
}

// ============================================================
// Assignment Service Functions
// ============================================================

/**
 * Fetches assignments. Faculty sees their own, others see all active.
 */
export async function fetchAssignments(facultyId?: string): Promise<Assignment[]> {
  let query = supabase.from('assignments').select('*').order('created_at', { ascending: false });
  if (facultyId) {
    query = query.eq('faculty_id', facultyId);
  } else {
    query = query.eq('status', 'active');
  }
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching assignments:', error);
    return [];
  }
  return (data || []) as Assignment[];
}

/**
 * Fetches a single assignment by ID.
 */
export async function fetchAssignmentById(id: string): Promise<Assignment | null> {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    console.error('Error fetching assignment:', error);
    return null;
  }
  return data as Assignment;
}

/**
 * Creates a new assignment.
 */
export async function createAssignment(assignment: Omit<Assignment, 'id' | 'created_at' | 'updated_at'>): Promise<Assignment | null> {
  const { data, error } = await supabase
    .from('assignments')
    .insert(assignment)
    .select()
    .single();
  if (error) {
    console.error('Error creating assignment:', error);
    return null;
  }
  return data as Assignment;
}

/**
 * Updates an existing assignment.
 */
export async function updateAssignment(id: string, updates: Partial<Assignment>): Promise<Assignment | null> {
  const { data, error } = await supabase
    .from('assignments')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error('Error updating assignment:', error);
    return null;
  }
  return data as Assignment;
}

/**
 * Deletes an assignment.
 */
export async function deleteAssignment(id: string): Promise<boolean> {
  const { error } = await supabase.from('assignments').delete().eq('id', id);
  if (error) {
    console.error('Error deleting assignment:', error);
    return false;
  }
  return true;
}

/**
 * Fetches all submissions for an assignment (faculty view).
 */
export async function fetchSubmissionsForAssignment(assignmentId: string): Promise<AssignmentSubmission[]> {
  const { data, error } = await supabase
    .from('assignment_submissions')
    .select('*')
    .eq('assignment_id', assignmentId)
    .order('submitted_at', { ascending: false });
  if (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }

  // Enrich with student names
  const submissions = (data || []) as AssignmentSubmission[];
  if (submissions.length > 0) {
    const studentIds = [...new Set(submissions.map(s => s.student_id))];
    const { data: students } = await supabase
      .from('users')
      .select('id, name, email')
      .in('id', studentIds);
    
    if (students) {
      const studentMap = new Map(students.map(s => [s.id, s]));
      submissions.forEach(sub => {
        const student = studentMap.get(sub.student_id);
        if (student) {
          sub.student_name = student.name;
          sub.student_email = student.email;
        }
      });
    }
  }

  return submissions;
}

/**
 * Fetches a student's submission for a specific assignment.
 */
export async function fetchStudentSubmission(assignmentId: string, studentId: string): Promise<AssignmentSubmission | null> {
  const { data, error } = await supabase
    .from('assignment_submissions')
    .select('*')
    .eq('assignment_id', assignmentId)
    .eq('student_id', studentId)
    .single();
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error fetching student submission:', error);
    return null;
  }
  return (data as AssignmentSubmission) || null;
}

/**
 * Creates or updates a submission (upsert on assignment_id + student_id).
 */
export async function upsertSubmission(submission: {
  assignment_id: string;
  student_id: string;
  submission_type: string;
  text_content?: string;
  file_url?: string;
  file_name?: string;
  max_marks?: number;
  status?: string;
}): Promise<AssignmentSubmission | null> {
  const { data, error } = await supabase
    .from('assignment_submissions')
    .upsert(
      {
        ...submission,
        status: submission.status || 'pending',
        submitted_at: new Date().toISOString(),
      },
      { onConflict: 'assignment_id,student_id' }
    )
    .select()
    .single();
  if (error) {
    console.error('Error upserting submission:', error);
    return null;
  }
  return data as AssignmentSubmission;
}

/**
 * Updates a submission with AI evaluation results.
 */
export async function updateSubmissionEvaluation(
  submissionId: string,
  score: number,
  feedback: string
): Promise<boolean> {
  const { error } = await supabase
    .from('assignment_submissions')
    .update({
      score,
      feedback,
      status: 'evaluated',
      evaluated_at: new Date().toISOString(),
    })
    .eq('id', submissionId);
  if (error) {
    console.error('Error updating submission evaluation:', error);
    return false;
  }
  return true;
}

/**
 * Updates submission status (e.g., to 'evaluating' or 'error').
 */
export async function updateSubmissionStatus(
  submissionId: string,
  status: string
): Promise<boolean> {
  const { error } = await supabase
    .from('assignment_submissions')
    .update({ status })
    .eq('id', submissionId);
  if (error) {
    console.error('Error updating submission status:', error);
    return false;
  }
  return true;
}

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 */
export async function uploadAssignmentFile(
  file: File,
  assignmentId: string,
  studentId: string
): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const path = `${assignmentId}/${studentId}/${Date.now()}.${ext}`;
  
  const { error } = await supabase.storage
    .from('assignments')
    .upload(path, file, { upsert: true });
  
  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }
  
  const { data: urlData } = supabase.storage
    .from('assignments')
    .getPublicUrl(path);
  
  return urlData.publicUrl;
}
