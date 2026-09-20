// ============================================================
// Exametra — Type Definitions
// ============================================================

export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string; // hashed in production
  name: string;
  role: UserRole;
  avatar?: string;
  department: string;
  createdAt: string;
  isActive: boolean;
}

export interface Student extends User {
  role: 'student';
  studentId: string;
  semester: number;
  enrolledSubjects: string[];
}

export interface Faculty extends User {
  role: 'faculty';
  facultyId: string;
  subjects: string[];
  designation: string;
}

export interface Admin extends User {
  role: 'admin';
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: number;
  facultyId: string;
}

export type QuestionType = 'mcq' | 'true-false' | 'multi-select' | 'coding' | 'subjective';
export type Difficulty = 'easy' | 'medium' | 'hard';

export type CodingLanguage = 'c' | 'cpp' | 'python' | 'javascript' | 'java' | 'sql';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface TestCase {
  id: string;
  input: string;
  expected_output: string;
  is_hidden: boolean;
  points: number;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: QuestionOption[];
  marks: number;
  difficulty: Difficulty;
  topic: string;
  subjectId: string;
  createdBy: string;
  explanation?: string;
  usedInExams: string[];
  // Coding question fields
  coding_languages?: CodingLanguage[];
  starter_code?: Record<string, string>;
  test_cases?: TestCase[];
  time_limit_ms?: number;
  memory_limit_kb?: number;
  // Subjective question fields
  rubric?: string;
  expected_answer?: string;
}

export interface CodingSubmission {
  questionId: string;
  language: CodingLanguage;
  code: string;
  results?: TestCaseResult[];
  totalPassed?: number;
  totalCases?: number;
}

export interface TestCaseResult {
  testCaseId: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  time_ms?: number;
  memory_kb?: number;
  error?: string;
  status: 'passed' | 'failed' | 'error' | 'tle' | 'mle';
}

export type ExamStatus = 'draft' | 'upcoming' | 'live' | 'completed' | 'cancelled' | 'missed';

export interface Exam {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  facultyId: string;
  date: string;
  startTime: string;
  duration: number; // minutes
  totalMarks: number;
  passingMarks: number;
  totalQuestions: number;
  attemptsAllowed: number;
  status: ExamStatus;
  instructions: string[];
  settings: ExamSettings;
  questionIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExamSettings {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResultImmediately: boolean;
  allowAnswerReview: boolean;
  enableNegativeMarking: boolean;
  autoSubmitOnTimeEnd: boolean;
  negativeMarkPercentage: number; // e.g., 25 means 25% of question marks
}

export type AttemptStatus = 'in-progress' | 'submitted' | 'evaluated' | 'timed-out';

export interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  startedAt: string;
  submittedAt?: string;
  status: AttemptStatus;
  answers: StudentAnswer[];
  tabSwitchCount: number;
  timeSpent: number; // seconds
  isViolation?: boolean;
  violationReason?: string;
}

export interface StudentAnswer {
  questionId: string;
  selectedOptionIds: string[];
  textAnswer?: string; // For subjective/essay questions
  isMarkedForReview: boolean;
  answeredAt?: string;
  timeTaken: number; // seconds spent on this question
}

export type ResultStatus = 'passed' | 'failed';

export interface Result {
  id: string;
  attemptId: string;
  examId: string;
  studentId: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  status: ResultStatus;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  timeSpent: number; // seconds
  questionResults: QuestionResult[];
  evaluatedAt: string;
  isViolation?: boolean;
  violationReason?: string;
}

export interface QuestionResult {
  questionId: string;
  studentAnswer: string[];
  correctAnswer: string[];
  isCorrect: boolean;
  marksAwarded: number;
  marksDeducted: number;
  codingResult?: any;
  feedback?: string; // AI generated feedback for subjective questions
}

export type NotificationType =
  | 'exam-scheduled'
  | 'exam-starting-soon'
  | 'result-published'
  | 'exam-updated'
  | 'exam-cancelled'
  | 'system'
  | 'exam-violation';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  ip?: string;
}

// ============================================================
// Assignment Types
// ============================================================

export type AssignmentStatus = 'draft' | 'active' | 'closed';
export type SubmissionStatus = 'pending' | 'evaluating' | 'evaluated' | 'error';
export type SubmissionType = 'text' | 'pdf' | 'image';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject_id: string;
  faculty_id: string;
  deadline: string;
  max_marks: number;
  rubric?: string;
  accepted_types: SubmissionType[];
  status: AssignmentStatus;
  created_at: string;
  updated_at: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  submission_type: SubmissionType;
  text_content?: string;
  file_url?: string;
  file_name?: string;
  score?: number;
  max_marks?: number;
  feedback?: string;
  status: SubmissionStatus;
  submitted_at: string;
  evaluated_at?: string;
  // Joined fields (optional, for display)
  student_name?: string;
  student_email?: string;
}

// UI State types
export interface ExamTakingState {
  currentQuestionIndex: number;
  answers: Map<string, string[]>;
  markedForReview: Set<string>;
  visitedQuestions: Set<string>;
  timeRemaining: number;
  lastSaved: string | null;
}

export type QuestionNavStatus = 'answered' | 'not-answered' | 'marked' | 'not-visited';
