// ============================================================
// Auto Evaluation Engine
// ============================================================
import type { Exam, ExamAttempt, Question, Result, QuestionResult } from '@/types';

interface EvaluationInput {
  attempt: ExamAttempt;
  exam: Exam;
  questions: Question[];
}

export function evaluateExam({ attempt, exam, questions }: EvaluationInput): Omit<Result, 'id'> {
  const questionMap = new Map(questions.map(q => [q.id, q]));
  const answerMap = new Map(attempt.answers.map(a => [a.questionId, a.selectedOptionIds]));

  let obtainedMarks = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  const questionResults: QuestionResult[] = [];

  for (const questionId of exam.questionIds) {
    const question = questionMap.get(questionId);
    if (!question) continue;

    const studentAnswerIds = answerMap.get(questionId) || [];
    const correctOptionIds = question.options
      .filter(o => o.isCorrect)
      .map(o => o.id)
      .sort();

    const sortedStudentIds = [...studentAnswerIds].sort();

    // Check if student answered
    if (studentAnswerIds.length === 0) {
      unansweredCount++;
      questionResults.push({
        questionId,
        studentAnswer: [],
        correctAnswer: correctOptionIds,
        isCorrect: false,
        marksAwarded: 0,
        marksDeducted: 0,
      });
      continue;
    }

    // Compare answers
    const isCorrect =
      sortedStudentIds.length === correctOptionIds.length &&
      sortedStudentIds.every((id, i) => id === correctOptionIds[i]);

    let marksAwarded = 0;
    let marksDeducted = 0;

    if (isCorrect) {
      correctCount++;
      marksAwarded = question.marks;
    } else {
      incorrectCount++;
      if (exam.settings.enableNegativeMarking) {
        marksDeducted = (question.marks * exam.settings.negativeMarkPercentage) / 100;
      }
    }

    obtainedMarks += marksAwarded - marksDeducted;

    questionResults.push({
      questionId,
      studentAnswer: studentAnswerIds,
      correctAnswer: correctOptionIds,
      isCorrect,
      marksAwarded,
      marksDeducted,
    });
  }

  // Ensure marks don't go below 0
  obtainedMarks = Math.max(0, obtainedMarks);

  const percentage = exam.totalMarks > 0
    ? Math.round((obtainedMarks / exam.totalMarks) * 100)
    : 0;

  const status = obtainedMarks >= exam.passingMarks ? 'passed' : 'failed';

  return {
    attemptId: attempt.id,
    examId: exam.id,
    studentId: attempt.studentId,
    totalMarks: exam.totalMarks,
    obtainedMarks: Math.round(obtainedMarks * 100) / 100,
    percentage,
    status,
    correctCount,
    incorrectCount,
    unansweredCount,
    timeSpent: attempt.timeSpent,
    questionResults,
    evaluatedAt: new Date().toISOString(),
  };
}

export function formatTimeSpent(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs.toString().padStart(2, '0')}s`;
}

export function formatTimerDisplay(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
