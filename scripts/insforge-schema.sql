-- Enable pgcrypto extension for password hashing and UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PUBLIC USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
    avatar TEXT,
    department TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    student_id TEXT,
    semester INTEGER,
    enrolled_subjects TEXT[],
    faculty_id TEXT,
    designation TEXT,
    teaching_subjects TEXT[]
);

-- 2. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    semester INTEGER NOT NULL,
    faculty_id TEXT
);

-- 3. EXAMS TABLE
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    faculty_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration INTEGER NOT NULL,
    total_marks NUMERIC NOT NULL,
    passing_marks NUMERIC NOT NULL,
    total_questions INTEGER NOT NULL,
    attempts_allowed INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'draft',
    instructions JSONB DEFAULT '[]'::jsonb,
    settings JSONB DEFAULT '{}'::jsonb,
    question_ids JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text TEXT NOT NULL,
    type TEXT NOT NULL,
    options JSONB DEFAULT '[]'::jsonb,
    marks NUMERIC NOT NULL DEFAULT 1,
    difficulty TEXT NOT NULL DEFAULT 'medium',
    topic TEXT NOT NULL DEFAULT '',
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    coding_languages JSONB DEFAULT '[]'::jsonb,
    starter_code JSONB DEFAULT '{}'::jsonb,
    test_cases JSONB DEFAULT '[]'::jsonb,
    time_limit_ms INTEGER DEFAULT 2000,
    memory_limit_kb INTEGER DEFAULT 128000,
    expected_answer TEXT,
    rubric TEXT
);

-- 5. EXAM ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'in-progress',
    answers JSONB DEFAULT '[]'::jsonb,
    tab_switch_count INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    is_violation BOOLEAN DEFAULT FALSE,
    violation_reason TEXT
);

-- 6. RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    total_marks NUMERIC DEFAULT 0,
    obtained_marks NUMERIC DEFAULT 0,
    percentage NUMERIC DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'failed',
    correct_count INTEGER DEFAULT 0,
    incorrect_count INTEGER DEFAULT 0,
    unanswered_count INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    question_results JSONB DEFAULT '[]'::jsonb,
    evaluated_at TIMESTAMPTZ DEFAULT NOW(),
    is_violation BOOLEAN DEFAULT FALSE,
    violation_reason TEXT
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    ip TEXT
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

-- users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public users full access" ON public.users;
CREATE POLICY "Public users full access" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- subjects
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Subjects full access" ON public.subjects;
CREATE POLICY "Subjects full access" ON public.subjects FOR ALL USING (true) WITH CHECK (true);

-- exams
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Exams full access" ON public.exams;
CREATE POLICY "Exams full access" ON public.exams FOR ALL USING (true) WITH CHECK (true);

-- questions
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Questions full access" ON public.questions;
CREATE POLICY "Questions full access" ON public.questions FOR ALL USING (true) WITH CHECK (true);

-- exam_attempts
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Exam attempts full access" ON public.exam_attempts;
CREATE POLICY "Exam attempts full access" ON public.exam_attempts FOR ALL USING (true) WITH CHECK (true);

-- results
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Results full access" ON public.results;
CREATE POLICY "Results full access" ON public.results FOR ALL USING (true) WITH CHECK (true);

-- notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Notifications full access" ON public.notifications;
CREATE POLICY "Notifications full access" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

-- activity_logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Activity logs full access" ON public.activity_logs;
CREATE POLICY "Activity logs full access" ON public.activity_logs FOR ALL USING (true) WITH CHECK (true);
