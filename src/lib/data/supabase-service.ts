import { supabase } from '../supabase';
import type { Exam, Result } from '@/types';

/**
 * Fetches upcoming exams for a student.
 */
export async function fetchStudentUpcomingExams(studentId: string): Promise<Exam[]> {
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('status', 'upcoming')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching upcoming exams:', error);
    return [];
  }
  return data || [];
}

/**
 * Fetches completed exams for a student.
 */
export async function fetchStudentCompletedExams(studentId: string): Promise<Exam[]> {
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('status', 'completed')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching completed exams:', error);
    return [];
  }
  return data || [];
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

  // 3. For completed exams, fetch analytics (results)
  // In a real system, you'd aggregate this in SQL, but for now we'll fetch results for these exams
  const completedExamIds = (exams || []).filter(e => e.status === 'completed').map(e => e.id);
  
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
  return data || [];
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
