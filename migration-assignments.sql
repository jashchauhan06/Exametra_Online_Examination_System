-- ==========================================================================================
-- MIGRATION: Intelligent Assignment Evaluation
-- Run this in the Supabase SQL Editor
-- ==========================================================================================

-- Enable required extensions (should already exist)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================================================
-- 1. ASSIGNMENTS TABLE
-- ==========================================================================================
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  attachment_url TEXT,                 -- optional PDF/image question file
  attachment_type TEXT,                -- 'pdf' or 'image'
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  faculty_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  deadline TIMESTAMPTZ NOT NULL,
  max_marks INTEGER NOT NULL DEFAULT 100,
  rubric TEXT,                         -- grading criteria for AI evaluation
  accepted_types TEXT[] DEFAULT ARRAY['text', 'pdf', 'image'],
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================================================
-- 2. ASSIGNMENT SUBMISSIONS TABLE
-- ==========================================================================================
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  submission_type TEXT NOT NULL CHECK (submission_type IN ('text', 'pdf', 'image')),
  text_content TEXT,                   -- for text submissions
  file_url TEXT,                       -- Supabase storage URL for PDF/image
  file_name TEXT,
  score NUMERIC,                       -- AI-evaluated score
  max_marks INTEGER,
  feedback TEXT,                       -- AI-generated detailed feedback
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'evaluating', 'evaluated', 'error')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  evaluated_at TIMESTAMPTZ,
  UNIQUE(assignment_id, student_id)    -- one submission per student per assignment
);

-- ==========================================================================================
-- 3. INDEXES
-- ==========================================================================================
CREATE INDEX IF NOT EXISTS idx_assignments_faculty_id ON public.assignments(faculty_id);
CREATE INDEX IF NOT EXISTS idx_assignments_subject_id ON public.assignments(subject_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON public.assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_id ON public.assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student_id ON public.assignment_submissions(student_id);

-- ==========================================================================================
-- 4. ROW LEVEL SECURITY
-- ==========================================================================================
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read assignments
CREATE POLICY "Authenticated users can read assignments"
  ON public.assignments FOR SELECT
  TO authenticated
  USING (true);

-- Faculty can insert/update/delete their own assignments
CREATE POLICY "Faculty can manage own assignments"
  ON public.assignments FOR ALL
  TO authenticated
  USING (faculty_id = auth.uid())
  WITH CHECK (faculty_id = auth.uid());

-- Students can read all submissions for assignments they submitted
CREATE POLICY "Students can read own submissions"
  ON public.assignment_submissions FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

-- Faculty can read all submissions for their assignments
CREATE POLICY "Faculty can read submissions for their assignments"
  ON public.assignment_submissions FOR SELECT
  TO authenticated
  USING (
    assignment_id IN (
      SELECT id FROM public.assignments WHERE faculty_id = auth.uid()
    )
  );

-- Students can insert/update their own submissions
CREATE POLICY "Students can manage own submissions"
  ON public.assignment_submissions FOR ALL
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- ==========================================================================================
-- 5. STORAGE BUCKET
-- ==========================================================================================
-- Create via Supabase Dashboard: Storage > New Bucket > Name: "assignments" > Public: Yes
-- Or uncomment below:
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('assignments', 'assignments', true)
-- ON CONFLICT (id) DO NOTHING;
