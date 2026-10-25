CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  attachment_url TEXT,
  attachment_type TEXT,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  faculty_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  deadline TIMESTAMPTZ NOT NULL,
  max_marks INTEGER NOT NULL DEFAULT 100,
  rubric TEXT,
  accepted_types TEXT[] DEFAULT ARRAY['text', 'pdf', 'image'],
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  submission_type TEXT NOT NULL CHECK (submission_type IN ('text', 'pdf', 'image')),
  text_content TEXT,
  file_url TEXT,
  file_name TEXT,
  score NUMERIC,
  max_marks INTEGER,
  feedback TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'evaluating', 'evaluated', 'error')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  evaluated_at TIMESTAMPTZ,
  UNIQUE(assignment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_assignments_faculty_id ON public.assignments(faculty_id);
CREATE INDEX IF NOT EXISTS idx_assignments_subject_id ON public.assignments(subject_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON public.assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_id ON public.assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student_id ON public.assignment_submissions(student_id);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Assignments full access" ON public.assignments;
CREATE POLICY "Assignments full access" ON public.assignments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Assignment submissions full access" ON public.assignment_submissions;
CREATE POLICY "Assignment submissions full access" ON public.assignment_submissions FOR ALL USING (true) WITH CHECK (true);
