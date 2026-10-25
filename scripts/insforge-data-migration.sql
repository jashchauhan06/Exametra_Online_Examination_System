-- Migration of all data from Supabase to InsForge

-- ==========================================================
-- 1. AUTH USERS
-- ==========================================================
INSERT INTO auth.users (id, email, password, email_verified, profile, metadata, is_project_admin, is_anonymous, created_at, updated_at)
VALUES (
  '92694f9d-0000-0000-0000-000000000000',
  'aarav.sharma@sit.edu.in',
  crypt('password123', gen_salt('bf', 10)),
  true,
  '{"name":"Aarav Sharma","avatar_url":null}'::jsonb,
  '{}'::jsonb,
  false,
  false,
  '2026-08-25T18:25:47.60405+00:00',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  email_verified = true,
  profile = EXCLUDED.profile;

INSERT INTO auth.users (id, email, password, email_verified, profile, metadata, is_project_admin, is_anonymous, created_at, updated_at)
VALUES (
  '92694f9e-0000-0000-0000-000000000000',
  'priya.patel@sit.edu.in',
  crypt('password123', gen_salt('bf', 10)),
  true,
  '{"name":"Priya Patel","avatar_url":null}'::jsonb,
  '{}'::jsonb,
  false,
  false,
  '2026-08-25T18:25:47.60405+00:00',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  email_verified = true,
  profile = EXCLUDED.profile;

INSERT INTO auth.users (id, email, password, email_verified, profile, metadata, is_project_admin, is_anonymous, created_at, updated_at)
VALUES (
  '92694f9f-0000-0000-0000-000000000000',
  'rohan.kumar@sit.edu.in',
  crypt('password123', gen_salt('bf', 10)),
  true,
  '{"name":"Rohan Kumar","avatar_url":null}'::jsonb,
  '{}'::jsonb,
  false,
  false,
  '2026-08-25T18:25:47.60405+00:00',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  email_verified = true,
  profile = EXCLUDED.profile;

INSERT INTO auth.users (id, email, password, email_verified, profile, metadata, is_project_admin, is_anonymous, created_at, updated_at)
VALUES (
  '92694fa0-0000-0000-0000-000000000000',
  'ananya.gupta@sit.edu.in',
  crypt('password123', gen_salt('bf', 10)),
  true,
  '{"name":"Ananya Gupta","avatar_url":null}'::jsonb,
  '{}'::jsonb,
  false,
  false,
  '2026-08-25T18:25:47.60405+00:00',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  email_verified = true,
  profile = EXCLUDED.profile;

INSERT INTO auth.users (id, email, password, email_verified, profile, metadata, is_project_admin, is_anonymous, created_at, updated_at)
VALUES (
  '92694fa1-0000-0000-0000-000000000000',
  'vikram.singh@sit.edu.in',
  crypt('password123', gen_salt('bf', 10)),
  true,
  '{"name":"Vikram Singh","avatar_url":null}'::jsonb,
  '{}'::jsonb,
  false,
  false,
  '2026-08-25T18:25:47.60405+00:00',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  email_verified = true,
  profile = EXCLUDED.profile;

INSERT INTO auth.users (id, email, password, email_verified, profile, metadata, is_project_admin, is_anonymous, created_at, updated_at)
VALUES (
  '92694fa2-0000-0000-0000-000000000000',
  'meera.reddy@sit.edu.in',
  crypt('password123', gen_salt('bf', 10)),
  true,
  '{"name":"Meera Reddy","avatar_url":null}'::jsonb,
  '{}'::jsonb,
  false,
  false,
  '2026-08-25T18:25:47.60405+00:00',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  email_verified = true,
  profile = EXCLUDED.profile;

INSERT INTO auth.users (id, email, password, email_verified, profile, metadata, is_project_admin, is_anonymous, created_at, updated_at)
VALUES (
  '92694fa3-0000-0000-0000-000000000000',
  'arjun.nair@sit.edu.in',
  crypt('password123', gen_salt('bf', 10)),
  true,
  '{"name":"Arjun Nair","avatar_url":null}'::jsonb,
  '{}'::jsonb,
  false,
  false,
  '2026-08-25T18:25:47.60405+00:00',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  email_verified = true,
  profile = EXCLUDED.profile;

INSERT INTO auth.users (id, email, password, email_verified, profile, metadata, is_project_admin, is_anonymous, created_at, updated_at)
VALUES (
  '92694fa4-0000-0000-0000-000000000000',
  'kavya.joshi@sit.edu.in',
  crypt('password123', gen_salt('bf', 10)),
  true,
  '{"name":"Kavya Joshi","avatar_url":null}'::jsonb,
  '{}'::jsonb,
  false,
  false,
  '2026-08-25T18:25:47.60405+00:00',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  email_verified = true,
  profile = EXCLUDED.profile;

INSERT INTO auth.users (id, email, password, email_verified, profile, metadata, is_project_admin, is_anonymous, created_at, updated_at)
VALUES (
  '7b26624a-0000-0000-0000-000000000000',
  'rajesh.kumar@sit.edu.in',
  crypt('password123', gen_salt('bf', 10)),
  true,
  '{"name":"Prof. Rajesh Kumar","avatar_url":null}'::jsonb,
  '{}'::jsonb,
  false,
  false,
  '2026-08-25T18:25:47.60405+00:00',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  email_verified = true,
  profile = EXCLUDED.profile;

INSERT INTO auth.users (id, email, password, email_verified, profile, metadata, is_project_admin, is_anonymous, created_at, updated_at)
VALUES (
  '7b26624b-0000-0000-0000-000000000000',
  'sunita.verma@sit.edu.in',
  crypt('password123', gen_salt('bf', 10)),
  true,
  '{"name":"Dr. Sunita Verma","avatar_url":null}'::jsonb,
  '{}'::jsonb,
  false,
  false,
  '2026-08-25T18:25:47.60405+00:00',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  email_verified = true,
  profile = EXCLUDED.profile;

INSERT INTO auth.users (id, email, password, email_verified, profile, metadata, is_project_admin, is_anonymous, created_at, updated_at)
VALUES (
  '72ccf967-0000-0000-0000-000000000000',
  'admin@sit.edu.in',
  crypt('password123', gen_salt('bf', 10)),
  true,
  '{"name":"System Administrator","avatar_url":null}'::jsonb,
  '{}'::jsonb,
  true,
  false,
  '2026-08-25T18:25:47.60405+00:00',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  email_verified = true,
  profile = EXCLUDED.profile;

INSERT INTO auth.users (id, email, password, email_verified, profile, metadata, is_project_admin, is_anonymous, created_at, updated_at)
VALUES (
  '7b266249-0000-0000-0000-000000000000',
  'priya.mehta@sit.edu.in',
  crypt('password123', gen_salt('bf', 10)),
  true,
  '{"name":"Dr. Priya Mehta","avatar_url":null}'::jsonb,
  '{}'::jsonb,
  false,
  false,
  '2026-08-25T18:25:47.60405+00:00',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  email_verified = true,
  profile = EXCLUDED.profile;

-- ==========================================================
-- 2. PUBLIC USERS
-- ==========================================================
INSERT INTO public.users (
  id, email, name, role, avatar, department, created_at, is_active,
  student_id, semester, enrolled_subjects, faculty_id, designation, teaching_subjects
) VALUES (
  '92694f9d-0000-0000-0000-000000000000',
  'aarav.sharma@sit.edu.in',
  'Aarav Sharma',
  'student',
  NULL,
  'Computer Science',
  '2026-08-25T18:25:47.60405+00:00',
  true,
  'SIT23CS001',
  3,
  NULL,
  NULL,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  student_id = EXCLUDED.student_id,
  semester = EXCLUDED.semester,
  enrolled_subjects = EXCLUDED.enrolled_subjects,
  faculty_id = EXCLUDED.faculty_id,
  designation = EXCLUDED.designation,
  teaching_subjects = EXCLUDED.teaching_subjects;

INSERT INTO public.users (
  id, email, name, role, avatar, department, created_at, is_active,
  student_id, semester, enrolled_subjects, faculty_id, designation, teaching_subjects
) VALUES (
  '92694f9e-0000-0000-0000-000000000000',
  'priya.patel@sit.edu.in',
  'Priya Patel',
  'student',
  NULL,
  'Computer Science',
  '2026-08-25T18:25:47.60405+00:00',
  true,
  'SIT23CS002',
  3,
  NULL,
  NULL,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  student_id = EXCLUDED.student_id,
  semester = EXCLUDED.semester,
  enrolled_subjects = EXCLUDED.enrolled_subjects,
  faculty_id = EXCLUDED.faculty_id,
  designation = EXCLUDED.designation,
  teaching_subjects = EXCLUDED.teaching_subjects;

INSERT INTO public.users (
  id, email, name, role, avatar, department, created_at, is_active,
  student_id, semester, enrolled_subjects, faculty_id, designation, teaching_subjects
) VALUES (
  '92694f9f-0000-0000-0000-000000000000',
  'rohan.kumar@sit.edu.in',
  'Rohan Kumar',
  'student',
  NULL,
  'Computer Science',
  '2026-08-25T18:25:47.60405+00:00',
  true,
  'SIT23CS003',
  3,
  NULL,
  NULL,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  student_id = EXCLUDED.student_id,
  semester = EXCLUDED.semester,
  enrolled_subjects = EXCLUDED.enrolled_subjects,
  faculty_id = EXCLUDED.faculty_id,
  designation = EXCLUDED.designation,
  teaching_subjects = EXCLUDED.teaching_subjects;

INSERT INTO public.users (
  id, email, name, role, avatar, department, created_at, is_active,
  student_id, semester, enrolled_subjects, faculty_id, designation, teaching_subjects
) VALUES (
  '92694fa0-0000-0000-0000-000000000000',
  'ananya.gupta@sit.edu.in',
  'Ananya Gupta',
  'student',
  NULL,
  'Computer Science',
  '2026-08-25T18:25:47.60405+00:00',
  true,
  'SIT23CS004',
  3,
  NULL,
  NULL,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  student_id = EXCLUDED.student_id,
  semester = EXCLUDED.semester,
  enrolled_subjects = EXCLUDED.enrolled_subjects,
  faculty_id = EXCLUDED.faculty_id,
  designation = EXCLUDED.designation,
  teaching_subjects = EXCLUDED.teaching_subjects;

INSERT INTO public.users (
  id, email, name, role, avatar, department, created_at, is_active,
  student_id, semester, enrolled_subjects, faculty_id, designation, teaching_subjects
) VALUES (
  '92694fa1-0000-0000-0000-000000000000',
  'vikram.singh@sit.edu.in',
  'Vikram Singh',
  'student',
  NULL,
  'Computer Science',
  '2026-08-25T18:25:47.60405+00:00',
  true,
  'SIT23CS005',
  3,
  NULL,
  NULL,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  student_id = EXCLUDED.student_id,
  semester = EXCLUDED.semester,
  enrolled_subjects = EXCLUDED.enrolled_subjects,
  faculty_id = EXCLUDED.faculty_id,
  designation = EXCLUDED.designation,
  teaching_subjects = EXCLUDED.teaching_subjects;

INSERT INTO public.users (
  id, email, name, role, avatar, department, created_at, is_active,
  student_id, semester, enrolled_subjects, faculty_id, designation, teaching_subjects
) VALUES (
  '92694fa2-0000-0000-0000-000000000000',
  'meera.reddy@sit.edu.in',
  'Meera Reddy',
  'student',
  NULL,
  'Computer Science',
  '2026-08-25T18:25:47.60405+00:00',
  true,
  'SIT23CS006',
  3,
  NULL,
  NULL,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  student_id = EXCLUDED.student_id,
  semester = EXCLUDED.semester,
  enrolled_subjects = EXCLUDED.enrolled_subjects,
  faculty_id = EXCLUDED.faculty_id,
  designation = EXCLUDED.designation,
  teaching_subjects = EXCLUDED.teaching_subjects;

INSERT INTO public.users (
  id, email, name, role, avatar, department, created_at, is_active,
  student_id, semester, enrolled_subjects, faculty_id, designation, teaching_subjects
) VALUES (
  '92694fa3-0000-0000-0000-000000000000',
  'arjun.nair@sit.edu.in',
  'Arjun Nair',
  'student',
  NULL,
  'Information Technology',
  '2026-08-25T18:25:47.60405+00:00',
  true,
  'SIT23IT001',
  3,
  NULL,
  NULL,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  student_id = EXCLUDED.student_id,
  semester = EXCLUDED.semester,
  enrolled_subjects = EXCLUDED.enrolled_subjects,
  faculty_id = EXCLUDED.faculty_id,
  designation = EXCLUDED.designation,
  teaching_subjects = EXCLUDED.teaching_subjects;

INSERT INTO public.users (
  id, email, name, role, avatar, department, created_at, is_active,
  student_id, semester, enrolled_subjects, faculty_id, designation, teaching_subjects
) VALUES (
  '92694fa4-0000-0000-0000-000000000000',
  'kavya.joshi@sit.edu.in',
  'Kavya Joshi',
  'student',
  NULL,
  'Computer Science',
  '2026-08-25T18:25:47.60405+00:00',
  true,
  'SIT23CS007',
  3,
  NULL,
  NULL,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  student_id = EXCLUDED.student_id,
  semester = EXCLUDED.semester,
  enrolled_subjects = EXCLUDED.enrolled_subjects,
  faculty_id = EXCLUDED.faculty_id,
  designation = EXCLUDED.designation,
  teaching_subjects = EXCLUDED.teaching_subjects;

INSERT INTO public.users (
  id, email, name, role, avatar, department, created_at, is_active,
  student_id, semester, enrolled_subjects, faculty_id, designation, teaching_subjects
) VALUES (
  '7b26624a-0000-0000-0000-000000000000',
  'rajesh.kumar@sit.edu.in',
  'Prof. Rajesh Kumar',
  'faculty',
  NULL,
  'Computer Science',
  '2026-08-25T18:25:47.60405+00:00',
  true,
  NULL,
  NULL,
  NULL,
  'FAC002',
  'Professor',
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  student_id = EXCLUDED.student_id,
  semester = EXCLUDED.semester,
  enrolled_subjects = EXCLUDED.enrolled_subjects,
  faculty_id = EXCLUDED.faculty_id,
  designation = EXCLUDED.designation,
  teaching_subjects = EXCLUDED.teaching_subjects;

INSERT INTO public.users (
  id, email, name, role, avatar, department, created_at, is_active,
  student_id, semester, enrolled_subjects, faculty_id, designation, teaching_subjects
) VALUES (
  '7b26624b-0000-0000-0000-000000000000',
  'sunita.verma@sit.edu.in',
  'Dr. Sunita Verma',
  'faculty',
  NULL,
  'Computer Science',
  '2026-08-25T18:25:47.60405+00:00',
  true,
  NULL,
  NULL,
  NULL,
  'FAC003',
  'Assistant Professor',
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  student_id = EXCLUDED.student_id,
  semester = EXCLUDED.semester,
  enrolled_subjects = EXCLUDED.enrolled_subjects,
  faculty_id = EXCLUDED.faculty_id,
  designation = EXCLUDED.designation,
  teaching_subjects = EXCLUDED.teaching_subjects;

INSERT INTO public.users (
  id, email, name, role, avatar, department, created_at, is_active,
  student_id, semester, enrolled_subjects, faculty_id, designation, teaching_subjects
) VALUES (
  '72ccf967-0000-0000-0000-000000000000',
  'admin@sit.edu.in',
  'System Administrator',
  'admin',
  NULL,
  'Administration',
  '2026-08-25T18:25:47.60405+00:00',
  true,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  student_id = EXCLUDED.student_id,
  semester = EXCLUDED.semester,
  enrolled_subjects = EXCLUDED.enrolled_subjects,
  faculty_id = EXCLUDED.faculty_id,
  designation = EXCLUDED.designation,
  teaching_subjects = EXCLUDED.teaching_subjects;

INSERT INTO public.users (
  id, email, name, role, avatar, department, created_at, is_active,
  student_id, semester, enrolled_subjects, faculty_id, designation, teaching_subjects
) VALUES (
  '7b266249-0000-0000-0000-000000000000',
  'priya.mehta@sit.edu.in',
  'Dr. Priya Mehta',
  'faculty',
  NULL,
  'Computer Science',
  '2026-08-25T18:25:47.60405+00:00',
  true,
  NULL,
  NULL,
  NULL,
  'FAC001',
  'Associate Professor',
  '{"926ec413-0000-0000-0000-000000000000","926ec412-0000-0000-0000-000000000000"}'::text[]
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  student_id = EXCLUDED.student_id,
  semester = EXCLUDED.semester,
  enrolled_subjects = EXCLUDED.enrolled_subjects,
  faculty_id = EXCLUDED.faculty_id,
  designation = EXCLUDED.designation,
  teaching_subjects = EXCLUDED.teaching_subjects;

-- ==========================================================
-- 3. SUBJECTS
-- ==========================================================
INSERT INTO public.subjects (id, code, name, department, semester, faculty_id)
VALUES (
  '926ec414-0000-0000-0000-000000000000',
  'CS204',
  'Operating Systems',
  'Computer Science',
  3,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  department = EXCLUDED.department,
  semester = EXCLUDED.semester,
  faculty_id = EXCLUDED.faculty_id;

INSERT INTO public.subjects (id, code, name, department, semester, faculty_id)
VALUES (
  '926ec415-0000-0000-0000-000000000000',
  'CS205',
  'Web Technology',
  'Computer Science',
  3,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  department = EXCLUDED.department,
  semester = EXCLUDED.semester,
  faculty_id = EXCLUDED.faculty_id;

INSERT INTO public.subjects (id, code, name, department, semester, faculty_id)
VALUES (
  '926ec411-0000-0000-0000-000000000000',
  'CS201',
  'Data Structures',
  'Computer Science',
  3,
  '7b266249-0000-0000-0000-000000000000'
) ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  department = EXCLUDED.department,
  semester = EXCLUDED.semester,
  faculty_id = EXCLUDED.faculty_id;

INSERT INTO public.subjects (id, code, name, department, semester, faculty_id)
VALUES (
  '926ec412-0000-0000-0000-000000000000',
  'CS202',
  'Database Management Systems',
  'Computer Science',
  3,
  '7b266249-0000-0000-0000-000000000000'
) ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  department = EXCLUDED.department,
  semester = EXCLUDED.semester,
  faculty_id = EXCLUDED.faculty_id;

INSERT INTO public.subjects (id, code, name, department, semester, faculty_id)
VALUES (
  '926ec413-0000-0000-0000-000000000000',
  'CS203',
  'Computer Networks',
  'Computer Science',
  3,
  '7b266249-0000-0000-0000-000000000000'
) ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  department = EXCLUDED.department,
  semester = EXCLUDED.semester,
  faculty_id = EXCLUDED.faculty_id;

-- ==========================================================
-- 4. EXAMS
-- ==========================================================
INSERT INTO public.exams (
  id, title, description, subject_id, faculty_id, date, start_time,
  duration, total_marks, passing_marks, total_questions, attempts_allowed,
  status, instructions, settings, question_ids, created_at, updated_at
) VALUES (
  'c925a4b3-ca39-4073-a6b8-398b32fd6b0b',
  'TEST',
  'SUBJECTIVE',
  '926ec413-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  '2026-09-20',
  '13:59:00',
  60,
  12,
  10,
  5,
  1,
  'upcoming',
  '["The exam contains 5 questions.","Duration is 60 minutes.","Total marks: 12.","Answers are automatically saved.","The exam will automatically submit when time expires."]'::jsonb,
  '{"shuffleOptions":false,"shuffleQuestions":true,"allowAnswerReview":true,"autoSubmitOnTimeEnd":true,"enableNegativeMarking":false,"showResultImmediately":true,"negativeMarkPercentage":25}'::jsonb,
  '["c0a09f1c-72da-4d76-9880-3806e86b78c4","b60d8817-25d2-4f4e-b075-10e969ed0839","8f558850-e089-4392-938d-aba0e93854bf","621c8371-2401-4944-9c60-0af7e6b455ef","5d0b5cd8-e0ec-45c5-968b-d8949283b0bf"]'::jsonb,
  '2026-09-20T08:56:32.052639+00:00',
  '2026-09-20T08:56:32.052639+00:00'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  question_ids = EXCLUDED.question_ids,
  settings = EXCLUDED.settings;

INSERT INTO public.exams (
  id, title, description, subject_id, faculty_id, date, start_time,
  duration, total_marks, passing_marks, total_questions, attempts_allowed,
  status, instructions, settings, question_ids, created_at, updated_at
) VALUES (
  '6798eb3d-b936-48ff-b215-058faf15a447',
  'TEST 2',
  '',
  '926ec413-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  '2026-09-20',
  '15:19:00',
  60,
  12,
  5,
  5,
  1,
  'upcoming',
  '["The exam contains 5 questions.","Duration is 60 minutes.","Total marks: 12.","Answers are automatically saved.","The exam will automatically submit when time expires."]'::jsonb,
  '{"shuffleOptions":false,"shuffleQuestions":true,"allowAnswerReview":true,"autoSubmitOnTimeEnd":true,"enableNegativeMarking":false,"showResultImmediately":true,"negativeMarkPercentage":25}'::jsonb,
  '["c0a09f1c-72da-4d76-9880-3806e86b78c4","b60d8817-25d2-4f4e-b075-10e969ed0839","8f558850-e089-4392-938d-aba0e93854bf","621c8371-2401-4944-9c60-0af7e6b455ef","5d0b5cd8-e0ec-45c5-968b-d8949283b0bf"]'::jsonb,
  '2026-09-20T09:49:49.790041+00:00',
  '2026-09-20T09:49:49.790041+00:00'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  question_ids = EXCLUDED.question_ids,
  settings = EXCLUDED.settings;

INSERT INTO public.exams (
  id, title, description, subject_id, faculty_id, date, start_time,
  duration, total_marks, passing_marks, total_questions, attempts_allowed,
  status, instructions, settings, question_ids, created_at, updated_at
) VALUES (
  '2c2eded8-560d-4876-b980-810241b6aeed',
  'new',
  '',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  '2026-08-31',
  '10:17:00',
  60,
  17,
  7,
  10,
  1,
  'upcoming',
  '["The exam contains 10 questions.","Duration is 60 minutes.","Total marks: 17.","Answers are automatically saved.","The exam will automatically submit when time expires."]'::jsonb,
  '{"shuffleOptions":true,"shuffleQuestions":true,"allowAnswerReview":true,"autoSubmitOnTimeEnd":true,"enableNegativeMarking":false,"showResultImmediately":true,"negativeMarkPercentage":25}'::jsonb,
  '["00259024-0000-0000-0000-000000000000","00259023-0000-0000-0000-000000000000","00259022-0000-0000-0000-000000000000","00259021-0000-0000-0000-000000000000","00259020-0000-0000-0000-000000000000","0025901f-0000-0000-0000-000000000000","00259009-0000-0000-0000-000000000000","00259008-0000-0000-0000-000000000000","00259007-0000-0000-0000-000000000000","00259006-0000-0000-0000-000000000000"]'::jsonb,
  '2026-08-31T04:47:42.156893+00:00',
  '2026-08-31T04:47:42.156893+00:00'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  question_ids = EXCLUDED.question_ids,
  settings = EXCLUDED.settings;

INSERT INTO public.exams (
  id, title, description, subject_id, faculty_id, date, start_time,
  duration, total_marks, passing_marks, total_questions, attempts_allowed,
  status, instructions, settings, question_ids, created_at, updated_at
) VALUES (
  'ce6113a6-04bb-4048-8811-84d95ae025dc',
  'test',
  '',
  '926ec413-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  '2026-09-23',
  '14:32:00',
  60,
  30,
  10,
  4,
  1,
  'upcoming',
  '["The exam contains 4 questions.","Duration is 60 minutes.","Total marks: 30.","Answers are automatically saved.","The exam will automatically submit when time expires."]'::jsonb,
  '{"shuffleOptions":false,"shuffleQuestions":true,"allowAnswerReview":true,"autoSubmitOnTimeEnd":true,"enableNegativeMarking":false,"showResultImmediately":true,"negativeMarkPercentage":25}'::jsonb,
  '["9a43c90e-4f27-41c5-98ef-81020e6752c3","96629a2c-ced2-4249-8c0b-7e72e164fbf4","50a1c9c4-6b07-4371-93c9-82eb833b8b3f","212b4765-1237-4926-8df2-f91b4d154fc7"]'::jsonb,
  '2026-09-23T09:03:39.502297+00:00',
  '2026-09-23T09:03:39.502297+00:00'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  question_ids = EXCLUDED.question_ids,
  settings = EXCLUDED.settings;

INSERT INTO public.exams (
  id, title, description, subject_id, faculty_id, date, start_time,
  duration, total_marks, passing_marks, total_questions, attempts_allowed,
  status, instructions, settings, question_ids, created_at, updated_at
) VALUES (
  '93c0fba4-69d3-4333-8945-efec63bae96c',
  'Week 1 TEST',
  '',
  '926ec413-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  '2026-10-05',
  '10:51:00',
  60,
  22,
  9,
  6,
  1,
  'upcoming',
  '["The exam contains 6 questions.","Duration is 60 minutes.","Total marks: 22.","Answers are automatically saved.","The exam will automatically submit when time expires."]'::jsonb,
  '{"shuffleOptions":false,"shuffleQuestions":true,"allowAnswerReview":true,"autoSubmitOnTimeEnd":true,"enableNegativeMarking":false,"showResultImmediately":true,"negativeMarkPercentage":25}'::jsonb,
  '["c0a09f1c-72da-4d76-9880-3806e86b78c4","b60d8817-25d2-4f4e-b075-10e969ed0839","8f558850-e089-4392-938d-aba0e93854bf","621c8371-2401-4944-9c60-0af7e6b455ef","5d0b5cd8-e0ec-45c5-968b-d8949283b0bf","9a43c90e-4f27-41c5-98ef-81020e6752c3"]'::jsonb,
  '2026-10-05T05:22:44.085103+00:00',
  '2026-10-05T05:22:44.085103+00:00'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  question_ids = EXCLUDED.question_ids,
  settings = EXCLUDED.settings;

-- ==========================================================
-- 5. QUESTIONS
-- ==========================================================
INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '212b4765-1237-4926-8df2-f91b4d154fc7',
  'Write a function to return the sum of two numbers. The input will be two space-separated integers on a single line.',
  'coding',
  '[]'::jsonb,
  5,
  'easy',
  'Basic Arithmetic',
  '926ec413-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-26T18:50:55.767484+00:00',
  '["c","cpp","python","javascript","java"]'::jsonb,
  '{"python":"def solve():\n    # Read input from stdin\n    # Example: a, b = map(int, input().split())\n    pass\n\nif __name__ == ''__main__'':\n    solve()","javascript":"const readline = require(''readline'');\nconst rl = readline.createInterface({ input: process.stdin, output: process.stdout });\n\nrl.on(''line'', (line) => {\n    // Split the line, convert to numbers, and print the sum\n    \n});"}'::jsonb,
  '[{"id":"tc1","input":"5 3","points":2,"is_hidden":false,"expected_output":"8"},{"id":"tc2","input":"-2 10","points":1,"is_hidden":false,"expected_output":"8"},{"id":"tc3","input":"100 200","points":2,"is_hidden":true,"expected_output":"300"}]'::jsonb,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '9a43c90e-4f27-41c5-98ef-81020e6752c3',
  'Write a program to reverse a given string. The input will be a single line containing a string.',
  'coding',
  '[]'::jsonb,
  10,
  'medium',
  'Strings',
  '926ec413-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-26T18:50:55.767484+00:00',
  '["c","cpp","python","javascript","java"]'::jsonb,
  '{"python":"def solve():\n    s = input()\n    # Reverse and print the string\n    pass\n\nif __name__ == ''__main__'':\n    solve()","javascript":"const readline = require(''readline'');\nconst rl = readline.createInterface({ input: process.stdin, output: process.stdout });\n\nrl.on(''line'', (line) => {\n    // Reverse the string and print it\n    \n});"}'::jsonb,
  '[{"id":"tc4","input":"hello","points":5,"is_hidden":false,"expected_output":"olleh"},{"id":"tc5","input":"Exametra","points":5,"is_hidden":false,"expected_output":"artemaxE"},{"id":"tc6","input":"12345","points":5,"is_hidden":true,"expected_output":"54321"}]'::jsonb,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '8f558850-e089-4392-938d-aba0e93854bf',
  'What is a Star topology? Describe its main advantage and main disadvantage.',
  'subjective',
  '[]'::jsonb,
  3,
  'easy',
  'All Topologies',
  '926ec413-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-09-20T08:50:38.556521+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  'A star topology is a network structure where all individual nodes or devices are connected directly to a central device, such as a hub or a switch. Main advantage: Easy to add or remove devices without disrupting the network, and the failure of one node or cable does not affect other nodes. Main disadvantage: High dependency on the central device; if the central hub or switch fails, the entire network becomes unavailable.',
  '1 mark for defining Star topology and mentioning the central device. 1 mark for correctly stating a valid advantage. 1 mark for correctly stating a valid disadvantage.'
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '621c8371-2401-4944-9c60-0af7e6b455ef',
  'Explain the structure of a Bus topology and describe how data travels along the network.',
  'subjective',
  '[]'::jsonb,
  2,
  'easy',
  'All Topologies',
  '926ec413-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-09-20T08:50:38.556521+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  'In a bus topology, all network devices are connected to a single central cable called the backbone or bus. Data is transmitted along the bus as electronic signals. As data travels, each connected device checks the destination address; if the address matches the device, it processes the data, otherwise it ignores it. Terminators at both ends of the cable absorb signals to prevent reflection.',
  '1 mark for describing the central backbone cable structure. 1 mark for explaining how data travels and is filtered by destination addresses/terminated.'
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  'c0a09f1c-72da-4d76-9880-3806e86b78c4',
  'Compare Mesh topology and Ring topology with respect to redundancy and cabling requirements.',
  'subjective',
  '[]'::jsonb,
  3,
  'easy',
  'All Topologies',
  '926ec413-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-09-20T08:50:38.556521+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  'Redundancy: Mesh topology offers very high redundancy because devices have multiple dedicated links, allowing alternate paths if a link fails. Ring topology has low redundancy because data travels sequentially, so a single break can disable the loop (unless a dual ring is used). Cabling Requirements: Mesh topology requires a very large amount of cabling due to point-to-point connections between nodes. Ring topology requires much less cabling, as each node only connects to its two immediate neighbors.',
  '1.5 marks for accurately comparing redundancy between Mesh and Ring. 1.5 marks for accurately comparing cabling requirements between Mesh and Ring.'
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  'b60d8817-25d2-4f4e-b075-10e969ed0839',
  'What is a Hybrid topology? Provide one practical example of how it is implemented.',
  'subjective',
  '[]'::jsonb,
  2,
  'easy',
  'All Topologies',
  '926ec413-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-09-20T08:50:38.556521+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  'A hybrid topology is a network architecture created by combining two or more different standard network topologies (such as Star, Bus, or Ring) into a single network. A common practical example is a Star-Bus topology, where individual departments in a building use star networks connected to a central bus backbone line.',
  '1 mark for defining Hybrid topology as a combination of two or more distinct topologies. 1 mark for giving a valid, accurate practical example.'
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '5d0b5cd8-e0ec-45c5-968b-d8949283b0bf',
  'Why is a Mesh topology considered highly fault-tolerant, and what is its primary drawback?',
  'subjective',
  '[]'::jsonb,
  2,
  'easy',
  'All Topologies',
  '926ec413-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-09-20T08:50:38.556521+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  'Mesh topology is highly fault-tolerant because every node is connected via redundant point-to-point links to other nodes. If one link fails, network traffic can be seamlessly rerouted through alternative paths without causing downtime. Its primary drawback is the high cost and extreme complexity associated with installing and managing the extensive amount of cabling and I/O ports.',
  '1 mark for explaining why it is fault-tolerant (redundant paths/rerouting). 1 mark for stating the primary drawback (high cost/cabling complexity).'
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '8915a611-d6e1-4b84-81f3-8aab56d3119c',
  'In Python''s DB-API 2.0 standard specification, which method of a cursor object is used to safely execute a database command using parameter binding to prevent SQL injection?',
  'mcq',
  '[{"text":"cursor.execute(sql, parameters)","isCorrect":true},{"text":"cursor.run(sql, parameters)","isCorrect":false},{"text":"cursor.query(sql, parameters)","isCorrect":false},{"text":"cursor.bind_and_execute(sql, parameters)","isCorrect":false}]'::jsonb,
  1,
  'medium',
  'Generate question related to python programing',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-10-05T05:28:29.998644+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  'd2c9c1f8-a8b3-4e2a-a9f7-704c776ee23a',
  'When using Python''s sqlite3 module, what happens by default when you issue Data Manipulation Language (DML) statements like INSERT or UPDATE without calling connection.commit() before closing the connection?',
  'mcq',
  '[{"text":"The changes are automatically committed upon calling connection.close().","isCorrect":false},{"text":"The uncommitted transaction is implicitly rolled back and changes are not saved.","isCorrect":true},{"text":"An OperationalError exception is raised during connection.close().","isCorrect":false},{"text":"The database remains permanently locked until the script is executed again.","isCorrect":false}]'::jsonb,
  2,
  'medium',
  'Generate question related to python programing',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-10-05T05:28:29.998644+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '96629a2c-ced2-4249-8c0b-7e72e164fbf4',
  'Write a function to return the sum of two numbers. The input will be two space-separated integers on a single line.',
  'coding',
  '[]'::jsonb,
  5,
  'easy',
  'Basic Arithmetic',
  '926ec413-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-26T18:51:53.946548+00:00',
  '["c","cpp","python","javascript","java"]'::jsonb,
  '{"python":"def solve():\n    # Read input from stdin\n    # Example: a, b = map(int, input().split())\n    pass\n\nif __name__ == ''__main__'':\n    solve()","javascript":"const readline = require(''readline'');\nconst rl = readline.createInterface({ input: process.stdin, output: process.stdout });\n\nrl.on(''line'', (line) => {\n    // Split the line, convert to numbers, and print the sum\n    \n});"}'::jsonb,
  '[{"id":"tc1","input":"5 3","points":2,"is_hidden":false,"expected_output":"8"},{"id":"tc2","input":"-2 10","points":1,"is_hidden":false,"expected_output":"8"},{"id":"tc3","input":"100 200","points":2,"is_hidden":true,"expected_output":"300"}]'::jsonb,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '50a1c9c4-6b07-4371-93c9-82eb833b8b3f',
  'Write a program to reverse a given string. The input will be a single line containing a string.',
  'coding',
  '[]'::jsonb,
  10,
  'medium',
  'Strings',
  '926ec413-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-26T18:51:53.946548+00:00',
  '["c","cpp","python","javascript","java"]'::jsonb,
  '{"python":"def solve():\n    s = input()\n    # Reverse and print the string\n    pass\n\nif __name__ == ''__main__'':\n    solve()","javascript":"const readline = require(''readline'');\nconst rl = readline.createInterface({ input: process.stdin, output: process.stdout });\n\nrl.on(''line'', (line) => {\n    // Reverse the string and print it\n    \n});"}'::jsonb,
  '[{"id":"tc4","input":"hello","points":5,"is_hidden":false,"expected_output":"olleh"},{"id":"tc5","input":"Exametra","points":5,"is_hidden":false,"expected_output":"artemaxE"},{"id":"tc6","input":"12345","points":5,"is_hidden":true,"expected_output":"54321"}]'::jsonb,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '2054aeb3-f6e3-40ea-990c-c1eb714f6f86',
  'What is the default behavior of the fetchmany(size) method on a Python DB-API 2.0 compliant cursor if the size argument is omitted?',
  'mcq',
  '[{"text":"It fetches all remaining rows in the result set.","isCorrect":false},{"text":"It fetches the number of rows specified by the cursor.arraysize attribute.","isCorrect":true},{"text":"It raises a TypeError because the size parameter is strictly mandatory.","isCorrect":false},{"text":"It fetches exactly one row, behaving identically to fetchone().","isCorrect":false}]'::jsonb,
  2,
  'medium',
  'Generate question related to python programing',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-10-05T05:28:29.998644+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '8dacceb4-b434-4566-b108-86bd04d4c2cc',
  'When executing parameterized SQL queries using the psycopg2 driver for PostgreSQL in Python, which placeholder style must be used for parameter substitution?',
  'mcq',
  '[{"text":"%s positional placeholder","isCorrect":true},{"text":"? positional placeholder","isCorrect":false},{"text":":1, :2 numbered placeholder","isCorrect":false},{"text":"$1, $2 dollar-sign placeholder","isCorrect":false}]'::jsonb,
  1,
  'medium',
  'Generate question related to python programing',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-10-05T05:28:29.998644+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '37db1fba-b23d-4420-be8e-2669c367ae81',
  'In SQLAlchemy ORM, which method on a Query object returns the first result or None if the query returns no rows, without raising an exception if multiple rows exist?',
  'mcq',
  '[{"text":"query.first()","isCorrect":true},{"text":"query.one()","isCorrect":false},{"text":"query.one_or_none()","isCorrect":false},{"text":"query.scalar()","isCorrect":false}]'::jsonb,
  2,
  'medium',
  'Generate question related to python programing',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-10-05T05:28:29.998644+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259023-0000-0000-0000-000000000000',
  'A view in SQL stores data physically on disk.',
  'true-false',
  '[{"id":"Q114_A","text":"True","isCorrect":false},{"id":"Q114_B","text":"False","isCorrect":true}]'::jsonb,
  1,
  'medium',
  'Views',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259024-0000-0000-0000-000000000000',
  'Which aggregate function returns the number of rows in a result set?',
  'mcq',
  '[{"id":"Q115_A","text":"SUM()","isCorrect":false},{"id":"Q115_B","text":"AVG()","isCorrect":false},{"id":"Q115_C","text":"COUNT()","isCorrect":true},{"id":"Q115_D","text":"MAX()","isCorrect":false}]'::jsonb,
  2,
  'easy',
  'SQL Basics',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '002593c2-0000-0000-0000-000000000000',
  'Which layer of the OSI model is responsible for routing?',
  'mcq',
  '[{"id":"Q201_A","text":"Data Link Layer","isCorrect":false},{"id":"Q201_B","text":"Network Layer","isCorrect":true},{"id":"Q201_C","text":"Transport Layer","isCorrect":false},{"id":"Q201_D","text":"Session Layer","isCorrect":false}]'::jsonb,
  2,
  'easy',
  'OSI Model',
  '926ec413-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c40-0000-0000-0000-000000000000',
  'Which data structure follows the FIFO (First In, First Out) principle?',
  'mcq',
  '[{"id":"Q001_A","text":"Stack","isCorrect":false},{"id":"Q001_B","text":"Queue","isCorrect":true},{"id":"Q001_C","text":"Tree","isCorrect":false},{"id":"Q001_D","text":"Graph","isCorrect":false}]'::jsonb,
  2,
  'easy',
  'Queue',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c41-0000-0000-0000-000000000000',
  'What is the time complexity of searching for an element in a balanced Binary Search Tree?',
  'mcq',
  '[{"id":"Q002_A","text":"O(n)","isCorrect":false},{"id":"Q002_B","text":"O(log n)","isCorrect":true},{"id":"Q002_C","text":"O(n log n)","isCorrect":false},{"id":"Q002_D","text":"O(1)","isCorrect":false}]'::jsonb,
  2,
  'medium',
  'Trees',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c42-0000-0000-0000-000000000000',
  'A stack can be used to check balanced parentheses in an expression.',
  'true-false',
  '[{"id":"Q003_A","text":"True","isCorrect":true},{"id":"Q003_B","text":"False","isCorrect":false}]'::jsonb,
  1,
  'easy',
  'Stack',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c45-0000-0000-0000-000000000000',
  'Which of the following are applications of a stack? (Select all that apply)',
  'multi-select',
  '[{"id":"Q006_A","text":"Function call management","isCorrect":true},{"id":"Q006_B","text":"Expression evaluation","isCorrect":true},{"id":"Q006_C","text":"BFS traversal","isCorrect":false},{"id":"Q006_D","text":"Undo/Redo operations","isCorrect":true}]'::jsonb,
  3,
  'medium',
  'Stack',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c47-0000-0000-0000-000000000000',
  'A complete binary tree with n nodes has a height of approximately log₂(n).',
  'true-false',
  '[{"id":"Q008_A","text":"True","isCorrect":true},{"id":"Q008_B","text":"False","isCorrect":false}]'::jsonb,
  1,
  'medium',
  'Trees',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c48-0000-0000-0000-000000000000',
  'Which traversal of a Binary Search Tree gives elements in sorted order?',
  'mcq',
  '[{"id":"Q009_A","text":"Preorder","isCorrect":false},{"id":"Q009_B","text":"Inorder","isCorrect":true},{"id":"Q009_C","text":"Postorder","isCorrect":false},{"id":"Q009_D","text":"Level order","isCorrect":false}]'::jsonb,
  2,
  'easy',
  'Trees',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c5e-0000-0000-0000-000000000000',
  'What data structure is used in Breadth-First Search (BFS)?',
  'mcq',
  '[{"id":"Q010_A","text":"Stack","isCorrect":false},{"id":"Q010_B","text":"Queue","isCorrect":true},{"id":"Q010_C","text":"Priority Queue","isCorrect":false},{"id":"Q010_D","text":"Deque","isCorrect":false}]'::jsonb,
  2,
  'easy',
  'Graph',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c5f-0000-0000-0000-000000000000',
  'Which sorting algorithm has the best average-case time complexity?',
  'mcq',
  '[{"id":"Q011_A","text":"Bubble Sort — O(n²)","isCorrect":false},{"id":"Q011_B","text":"Merge Sort — O(n log n)","isCorrect":true},{"id":"Q011_C","text":"Selection Sort — O(n²)","isCorrect":false},{"id":"Q011_D","text":"Insertion Sort — O(n²)","isCorrect":false}]'::jsonb,
  2,
  'medium',
  'Sorting',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c60-0000-0000-0000-000000000000',
  'What is the maximum number of nodes at level k of a binary tree?',
  'mcq',
  '[{"id":"Q012_A","text":"2k","isCorrect":false},{"id":"Q012_B","text":"2^k","isCorrect":true},{"id":"Q012_C","text":"k²","isCorrect":false},{"id":"Q012_D","text":"2^(k+1) - 1","isCorrect":false}]'::jsonb,
  2,
  'medium',
  'Trees',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c62-0000-0000-0000-000000000000',
  'Which of the following are valid collision resolution techniques in hashing? (Select all that apply)',
  'multi-select',
  '[{"id":"Q014_A","text":"Chaining","isCorrect":true},{"id":"Q014_B","text":"Linear Probing","isCorrect":true},{"id":"Q014_C","text":"Binary Search","isCorrect":false},{"id":"Q014_D","text":"Double Hashing","isCorrect":true}]'::jsonb,
  3,
  'hard',
  'Hashing',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c63-0000-0000-0000-000000000000',
  'What is the space complexity of Merge Sort?',
  'mcq',
  '[{"id":"Q015_A","text":"O(1)","isCorrect":false},{"id":"Q015_B","text":"O(log n)","isCorrect":false},{"id":"Q015_C","text":"O(n)","isCorrect":true},{"id":"Q015_D","text":"O(n²)","isCorrect":false}]'::jsonb,
  2,
  'hard',
  'Sorting',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c64-0000-0000-0000-000000000000',
  'In a max-heap, the value of each node is greater than or equal to the values of its children.',
  'true-false',
  '[{"id":"Q016_A","text":"True","isCorrect":true},{"id":"Q016_B","text":"False","isCorrect":false}]'::jsonb,
  1,
  'easy',
  'Heap',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c65-0000-0000-0000-000000000000',
  'What is the time complexity of building a heap from an unsorted array?',
  'mcq',
  '[{"id":"Q017_A","text":"O(n log n)","isCorrect":false},{"id":"Q017_B","text":"O(n²)","isCorrect":false},{"id":"Q017_C","text":"O(n)","isCorrect":true},{"id":"Q017_D","text":"O(log n)","isCorrect":false}]'::jsonb,
  2,
  'hard',
  'Heap',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c66-0000-0000-0000-000000000000',
  'Dijkstra''s algorithm is used to find the shortest path in a graph with non-negative edge weights.',
  'true-false',
  '[{"id":"Q018_A","text":"True","isCorrect":true},{"id":"Q018_B","text":"False","isCorrect":false}]'::jsonb,
  1,
  'medium',
  'Graph',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c67-0000-0000-0000-000000000000',
  'Which data structure is most appropriate for implementing a priority queue?',
  'mcq',
  '[{"id":"Q019_A","text":"Array","isCorrect":false},{"id":"Q019_B","text":"Linked List","isCorrect":false},{"id":"Q019_C","text":"Heap","isCorrect":true},{"id":"Q019_D","text":"Stack","isCorrect":false}]'::jsonb,
  2,
  'medium',
  'Heap',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c7d-0000-0000-0000-000000000000',
  'An adjacency matrix representation of a graph with V vertices requires O(V²) space.',
  'true-false',
  '[{"id":"Q020_A","text":"True","isCorrect":true},{"id":"Q020_B","text":"False","isCorrect":false}]'::jsonb,
  1,
  'easy',
  'Graph',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259001-0000-0000-0000-000000000000',
  'What does SQL stand for?',
  'mcq',
  '[{"id":"Q101_A","text":"Structured Query Language","isCorrect":true},{"id":"Q101_B","text":"Sequential Query Language","isCorrect":false},{"id":"Q101_C","text":"Standard Query Logic","isCorrect":false},{"id":"Q101_D","text":"Simple Query Language","isCorrect":false}]'::jsonb,
  2,
  'easy',
  'SQL Basics',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259002-0000-0000-0000-000000000000',
  'Which normal form removes partial dependencies?',
  'mcq',
  '[{"id":"Q102_A","text":"1NF","isCorrect":false},{"id":"Q102_B","text":"2NF","isCorrect":true},{"id":"Q102_C","text":"3NF","isCorrect":false},{"id":"Q102_D","text":"BCNF","isCorrect":false}]'::jsonb,
  2,
  'medium',
  'Normalization',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259003-0000-0000-0000-000000000000',
  'A primary key can contain NULL values.',
  'true-false',
  '[{"id":"Q103_A","text":"True","isCorrect":false},{"id":"Q103_B","text":"False","isCorrect":true}]'::jsonb,
  1,
  'easy',
  'Keys',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259004-0000-0000-0000-000000000000',
  'Which SQL clause is used to filter grouped results?',
  'mcq',
  '[{"id":"Q104_A","text":"WHERE","isCorrect":false},{"id":"Q104_B","text":"GROUP BY","isCorrect":false},{"id":"Q104_C","text":"HAVING","isCorrect":true},{"id":"Q104_D","text":"ORDER BY","isCorrect":false}]'::jsonb,
  2,
  'medium',
  'SQL Basics',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259005-0000-0000-0000-000000000000',
  'Which of the following are properties of a transaction (ACID)? (Select all that apply)',
  'multi-select',
  '[{"id":"Q105_A","text":"Atomicity","isCorrect":true},{"id":"Q105_B","text":"Consistency","isCorrect":true},{"id":"Q105_C","text":"Isolation","isCorrect":true},{"id":"Q105_D","text":"Durability","isCorrect":true}]'::jsonb,
  3,
  'medium',
  'Transactions',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259006-0000-0000-0000-000000000000',
  'A foreign key in a table refers to the primary key of another table.',
  'true-false',
  '[{"id":"Q106_A","text":"True","isCorrect":true},{"id":"Q106_B","text":"False","isCorrect":false}]'::jsonb,
  1,
  'easy',
  'Keys',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259007-0000-0000-0000-000000000000',
  'Which type of JOIN returns all rows from both tables, including unmatched rows?',
  'mcq',
  '[{"id":"Q107_A","text":"INNER JOIN","isCorrect":false},{"id":"Q107_B","text":"LEFT JOIN","isCorrect":false},{"id":"Q107_C","text":"RIGHT JOIN","isCorrect":false},{"id":"Q107_D","text":"FULL OUTER JOIN","isCorrect":true}]'::jsonb,
  2,
  'medium',
  'Joins',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259008-0000-0000-0000-000000000000',
  'Which of the following are types of database indexes? (Select all that apply)',
  'multi-select',
  '[{"id":"Q108_A","text":"B-Tree Index","isCorrect":true},{"id":"Q108_B","text":"Hash Index","isCorrect":true},{"id":"Q108_C","text":"Stack Index","isCorrect":false},{"id":"Q108_D","text":"Bitmap Index","isCorrect":true}]'::jsonb,
  3,
  'hard',
  'Indexing',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259009-0000-0000-0000-000000000000',
  'What is a deadlock in database systems?',
  'mcq',
  '[{"id":"Q109_A","text":"A transaction that takes too long","isCorrect":false},{"id":"Q109_B","text":"Two or more transactions waiting for each other to release locks","isCorrect":true},{"id":"Q109_C","text":"A database crash","isCorrect":false},{"id":"Q109_D","text":"An index becoming corrupted","isCorrect":false}]'::jsonb,
  2,
  'medium',
  'Transactions',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '0025901f-0000-0000-0000-000000000000',
  'The TRUNCATE command in SQL can be rolled back.',
  'true-false',
  '[{"id":"Q110_A","text":"True","isCorrect":false},{"id":"Q110_B","text":"False","isCorrect":true}]'::jsonb,
  1,
  'hard',
  'SQL Basics',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259021-0000-0000-0000-000000000000',
  'In the relational model, a relation is essentially a table.',
  'true-false',
  '[{"id":"Q112_A","text":"True","isCorrect":true},{"id":"Q112_B","text":"False","isCorrect":false}]'::jsonb,
  1,
  'easy',
  'Relational Model',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259022-0000-0000-0000-000000000000',
  'Which command is used to create a new table in SQL?',
  'mcq',
  '[{"id":"Q113_A","text":"INSERT TABLE","isCorrect":false},{"id":"Q113_B","text":"CREATE TABLE","isCorrect":true},{"id":"Q113_C","text":"NEW TABLE","isCorrect":false},{"id":"Q113_D","text":"ADD TABLE","isCorrect":false}]'::jsonb,
  2,
  'easy',
  'DDL',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '002593c3-0000-0000-0000-000000000000',
  'TCP is a connectionless protocol.',
  'true-false',
  '[{"id":"Q202_A","text":"True","isCorrect":false},{"id":"Q202_B","text":"False","isCorrect":true}]'::jsonb,
  1,
  'easy',
  'TCP/IP',
  '926ec413-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '002593c4-0000-0000-0000-000000000000',
  'What is the default port number for HTTP?',
  'mcq',
  '[{"id":"Q203_A","text":"21","isCorrect":false},{"id":"Q203_B","text":"25","isCorrect":false},{"id":"Q203_C","text":"80","isCorrect":true},{"id":"Q203_D","text":"443","isCorrect":false}]'::jsonb,
  2,
  'easy',
  'Application Layer',
  '926ec413-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '002593c5-0000-0000-0000-000000000000',
  'Which protocol is used to resolve IP addresses to MAC addresses?',
  'mcq',
  '[{"id":"Q204_A","text":"DNS","isCorrect":false},{"id":"Q204_B","text":"ARP","isCorrect":true},{"id":"Q204_C","text":"DHCP","isCorrect":false},{"id":"Q204_D","text":"RARP","isCorrect":false}]'::jsonb,
  2,
  'medium',
  'Network Layer',
  '926ec413-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '002593c6-0000-0000-0000-000000000000',
  'Which of the following are transport layer protocols? (Select all that apply)',
  'multi-select',
  '[{"id":"Q205_A","text":"TCP","isCorrect":true},{"id":"Q205_B","text":"UDP","isCorrect":true},{"id":"Q205_C","text":"IP","isCorrect":false},{"id":"Q205_D","text":"HTTP","isCorrect":false}]'::jsonb,
  3,
  'easy',
  'Transport Layer',
  '926ec413-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '002593c7-0000-0000-0000-000000000000',
  'A subnet mask is used to identify the network and host portions of an IP address.',
  'true-false',
  '[{"id":"Q206_A","text":"True","isCorrect":true},{"id":"Q206_B","text":"False","isCorrect":false}]'::jsonb,
  1,
  'easy',
  'IP Addressing',
  '926ec413-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '002593c8-0000-0000-0000-000000000000',
  'What is the maximum data rate of Fast Ethernet?',
  'mcq',
  '[{"id":"Q207_A","text":"10 Mbps","isCorrect":false},{"id":"Q207_B","text":"100 Mbps","isCorrect":true},{"id":"Q207_C","text":"1 Gbps","isCorrect":false},{"id":"Q207_D","text":"10 Gbps","isCorrect":false}]'::jsonb,
  2,
  'medium',
  'Data Link Layer',
  '926ec413-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '002593c9-0000-0000-0000-000000000000',
  'DNS translates domain names to IP addresses.',
  'true-false',
  '[{"id":"Q208_A","text":"True","isCorrect":true},{"id":"Q208_B","text":"False","isCorrect":false}]'::jsonb,
  1,
  'easy',
  'Application Layer',
  '926ec413-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '002593ca-0000-0000-0000-000000000000',
  'Which device operates at the Data Link Layer?',
  'mcq',
  '[{"id":"Q209_A","text":"Hub","isCorrect":false},{"id":"Q209_B","text":"Repeater","isCorrect":false},{"id":"Q209_C","text":"Switch","isCorrect":true},{"id":"Q209_D","text":"Router","isCorrect":false}]'::jsonb,
  2,
  'medium',
  'Network Devices',
  '926ec413-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '002593e0-0000-0000-0000-000000000000',
  'What is the size of an IPv4 address?',
  'mcq',
  '[{"id":"Q210_A","text":"16 bits","isCorrect":false},{"id":"Q210_B","text":"32 bits","isCorrect":true},{"id":"Q210_C","text":"64 bits","isCorrect":false},{"id":"Q210_D","text":"128 bits","isCorrect":false}]'::jsonb,
  2,
  'easy',
  'IP Addressing',
  '926ec413-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259783-0000-0000-0000-000000000000',
  'Which scheduling algorithm gives the minimum average waiting time?',
  'mcq',
  '[{"id":"Q301_A","text":"FCFS","isCorrect":false},{"id":"Q301_B","text":"SJF (Shortest Job First)","isCorrect":true},{"id":"Q301_C","text":"Round Robin","isCorrect":false},{"id":"Q301_D","text":"Priority Scheduling","isCorrect":false}]'::jsonb,
  2,
  'medium',
  'Scheduling',
  '926ec414-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259784-0000-0000-0000-000000000000',
  'A semaphore is a synchronization mechanism used in operating systems.',
  'true-false',
  '[{"id":"Q302_A","text":"True","isCorrect":true},{"id":"Q302_B","text":"False","isCorrect":false}]'::jsonb,
  1,
  'easy',
  'Synchronization',
  '926ec414-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259785-0000-0000-0000-000000000000',
  'What is thrashing in an operating system?',
  'mcq',
  '[{"id":"Q303_A","text":"A type of CPU scheduling","isCorrect":false},{"id":"Q303_B","text":"Excessive paging activity causing low CPU utilization","isCorrect":true},{"id":"Q303_C","text":"A deadlock resolution technique","isCorrect":false},{"id":"Q303_D","text":"A disk scheduling algorithm","isCorrect":false}]'::jsonb,
  2,
  'hard',
  'Memory Management',
  '926ec414-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259786-0000-0000-0000-000000000000',
  'Which page replacement algorithm is known as the optimal algorithm?',
  'mcq',
  '[{"id":"Q304_A","text":"FIFO","isCorrect":false},{"id":"Q304_B","text":"LRU","isCorrect":false},{"id":"Q304_C","text":"Optimal (OPT)","isCorrect":true},{"id":"Q304_D","text":"Clock","isCorrect":false}]'::jsonb,
  2,
  'medium',
  'Memory Management',
  '926ec414-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259787-0000-0000-0000-000000000000',
  'Which of the following are necessary conditions for deadlock? (Select all that apply)',
  'multi-select',
  '[{"id":"Q305_A","text":"Mutual Exclusion","isCorrect":true},{"id":"Q305_B","text":"Hold and Wait","isCorrect":true},{"id":"Q305_C","text":"Preemption","isCorrect":false},{"id":"Q305_D","text":"Circular Wait","isCorrect":true}]'::jsonb,
  3,
  'hard',
  'Deadlock',
  '926ec414-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259788-0000-0000-0000-000000000000',
  'Virtual memory allows a process to execute even if it is not completely in main memory.',
  'true-false',
  '[{"id":"Q306_A","text":"True","isCorrect":true},{"id":"Q306_B","text":"False","isCorrect":false}]'::jsonb,
  1,
  'easy',
  'Memory Management',
  '926ec414-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c43-0000-0000-0000-000000000000',
  'Which of the following is NOT a linear data structure?',
  'mcq',
  '[{"id":"Q004_A","text":"Array","isCorrect":false},{"id":"Q004_B","text":"Linked List","isCorrect":false},{"id":"Q004_C","text":"Tree","isCorrect":true},{"id":"Q004_D","text":"Queue","isCorrect":false}]'::jsonb,
  2,
  'easy',
  'Basics',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c44-0000-0000-0000-000000000000',
  'What is the worst-case time complexity of QuickSort?',
  'mcq',
  '[{"id":"Q005_A","text":"O(n log n)","isCorrect":false},{"id":"Q005_B","text":"O(n)","isCorrect":false},{"id":"Q005_C","text":"O(n²)","isCorrect":true},{"id":"Q005_D","text":"O(log n)","isCorrect":false}]'::jsonb,
  2,
  'medium',
  'Sorting',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c46-0000-0000-0000-000000000000',
  'In a singly linked list, what is the time complexity of inserting an element at the beginning?',
  'mcq',
  '[{"id":"Q007_A","text":"O(1)","isCorrect":true},{"id":"Q007_B","text":"O(n)","isCorrect":false},{"id":"Q007_C","text":"O(log n)","isCorrect":false},{"id":"Q007_D","text":"O(n²)","isCorrect":false}]'::jsonb,
  2,
  'easy',
  'Linked List',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259020-0000-0000-0000-000000000000',
  'What does the DISTINCT keyword do in SQL?',
  'mcq',
  '[{"id":"Q111_A","text":"Sorts the results","isCorrect":false},{"id":"Q111_B","text":"Removes duplicate rows","isCorrect":true},{"id":"Q111_C","text":"Limits the number of rows","isCorrect":false},{"id":"Q111_D","text":"Groups the results","isCorrect":false}]'::jsonb,
  2,
  'easy',
  'SQL Basics',
  '926ec412-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00258c61-0000-0000-0000-000000000000',
  'A hash table provides O(1) average-case time for search operations.',
  'true-false',
  '[{"id":"Q013_A","text":"True","isCorrect":true},{"id":"Q013_B","text":"False","isCorrect":false}]'::jsonb,
  1,
  'easy',
  'Hashing',
  '926ec411-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '00259789-0000-0000-0000-000000000000',
  'What is the purpose of a Translation Lookaside Buffer (TLB)?',
  'mcq',
  '[{"id":"Q307_A","text":"To store frequently used data","isCorrect":false},{"id":"Q307_B","text":"To speed up virtual-to-physical address translation","isCorrect":true},{"id":"Q307_C","text":"To manage disk I/O","isCorrect":false},{"id":"Q307_D","text":"To schedule processes","isCorrect":false}]'::jsonb,
  2,
  'hard',
  'Memory Management',
  '926ec414-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '0025978a-0000-0000-0000-000000000000',
  'A context switch involves saving and restoring the state of a process.',
  'true-false',
  '[{"id":"Q308_A","text":"True","isCorrect":true},{"id":"Q308_B","text":"False","isCorrect":false}]'::jsonb,
  1,
  'easy',
  'Process Management',
  '926ec414-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '0025978b-0000-0000-0000-000000000000',
  'Which disk scheduling algorithm services requests in the order they arrive?',
  'mcq',
  '[{"id":"Q309_A","text":"FCFS","isCorrect":true},{"id":"Q309_B","text":"SSTF","isCorrect":false},{"id":"Q309_C","text":"SCAN","isCorrect":false},{"id":"Q309_D","text":"C-SCAN","isCorrect":false}]'::jsonb,
  2,
  'easy',
  'Disk Scheduling',
  '926ec414-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '002597a1-0000-0000-0000-000000000000',
  'What is the role of a kernel in an operating system?',
  'mcq',
  '[{"id":"Q310_A","text":"Managing user interface only","isCorrect":false},{"id":"Q310_B","text":"Core component managing system resources and hardware","isCorrect":true},{"id":"Q310_C","text":"Compiling programs","isCorrect":false},{"id":"Q310_D","text":"Managing network connections only","isCorrect":false}]'::jsonb,
  2,
  'medium',
  'OS Basics',
  '926ec414-0000-0000-0000-000000000000',
  '7b26624a-0000-0000-0000-000000000000',
  NULL,
  '2026-08-25T18:11:46.379181+00:00',
  NULL,
  NULL,
  NULL,
  2000,
  128000,
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;

-- ==========================================================
-- 6. EXAM ATTEMPTS
-- ==========================================================
INSERT INTO public.exam_attempts (
  id, exam_id, student_id, started_at, submitted_at, status, answers,
  tab_switch_count, time_spent, is_violation, violation_reason
) VALUES (
  '1b904ebf-9036-4ecb-9d0b-b683cdac66b6',
  '2c2eded8-560d-4876-b980-810241b6aeed',
  '92694f9d-0000-0000-0000-000000000000',
  '2026-08-31T04:49:20.087958+00:00',
  '2026-08-31T04:49:46.153+00:00',
  'submitted',
  '[{"timeTaken":0,"questionId":"00259006-0000-0000-0000-000000000000","isMarkedForReview":false,"selectedOptionIds":[]},{"timeTaken":0,"questionId":"00259007-0000-0000-0000-000000000000","isMarkedForReview":false,"selectedOptionIds":[]},{"timeTaken":0,"questionId":"00259008-0000-0000-0000-000000000000","isMarkedForReview":false,"selectedOptionIds":[]},{"timeTaken":0,"questionId":"00259009-0000-0000-0000-000000000000","isMarkedForReview":false,"selectedOptionIds":[]},{"timeTaken":0,"questionId":"0025901f-0000-0000-0000-000000000000","isMarkedForReview":false,"selectedOptionIds":[]},{"timeTaken":0,"questionId":"00259020-0000-0000-0000-000000000000","isMarkedForReview":false,"selectedOptionIds":[]},{"timeTaken":0,"questionId":"00259021-0000-0000-0000-000000000000","isMarkedForReview":false,"selectedOptionIds":[]},{"timeTaken":0,"questionId":"00259022-0000-0000-0000-000000000000","isMarkedForReview":false,"selectedOptionIds":[]},{"timeTaken":0,"questionId":"00259023-0000-0000-0000-000000000000","isMarkedForReview":false,"selectedOptionIds":[]},{"timeTaken":0,"questionId":"00259024-0000-0000-0000-000000000000","isMarkedForReview":false,"selectedOptionIds":[]}]'::jsonb,
  0,
  27,
  true,
  'Exceeded maximum warnings (2) for exiting exam environment'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  answers = EXCLUDED.answers;

INSERT INTO public.exam_attempts (
  id, exam_id, student_id, started_at, submitted_at, status, answers,
  tab_switch_count, time_spent, is_violation, violation_reason
) VALUES (
  'e03e0636-c5e2-4eb7-9132-ae86257b3fea',
  'c925a4b3-ca39-4073-a6b8-398b32fd6b0b',
  '92694f9d-0000-0000-0000-000000000000',
  '2026-09-20T08:56:58.301525+00:00',
  '2026-09-20T08:59:03.838+00:00',
  'submitted',
  '[{"timeTaken":0,"questionId":"5d0b5cd8-e0ec-45c5-968b-d8949283b0bf","isMarkedForReview":false,"selectedOptionIds":[]},{"timeTaken":0,"questionId":"621c8371-2401-4944-9c60-0af7e6b455ef","isMarkedForReview":false,"selectedOptionIds":[]},{"timeTaken":0,"answeredAt":"2026-09-20T08:59:00.110Z","questionId":"8f558850-e089-4392-938d-aba0e93854bf","isMarkedForReview":false,"selectedOptionIds":["Star Topology is a network where all devices are connected to a central hub or switch.\nadvantage: easy to manage and troubleshoot.\ndisadvantage: if the central hub fails, the entire network stops working."]},{"timeTaken":0,"questionId":"b60d8817-25d2-4f4e-b075-10e969ed0839","isMarkedForReview":false,"selectedOptionIds":[]},{"timeTaken":0,"questionId":"c0a09f1c-72da-4d76-9880-3806e86b78c4","isMarkedForReview":false,"selectedOptionIds":[]}]'::jsonb,
  0,
  123,
  false,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  answers = EXCLUDED.answers;

INSERT INTO public.exam_attempts (
  id, exam_id, student_id, started_at, submitted_at, status, answers,
  tab_switch_count, time_spent, is_violation, violation_reason
) VALUES (
  '3d56d4dd-e60f-4fae-a09c-82f6f183daaa',
  '6798eb3d-b936-48ff-b215-058faf15a447',
  '92694f9d-0000-0000-0000-000000000000',
  '2026-09-20T09:51:36.320912+00:00',
  '2026-09-20T10:18:03.173+00:00',
  'submitted',
  '[{"timeTaken":0,"questionId":"5d0b5cd8-e0ec-45c5-968b-d8949283b0bf","isMarkedForReview":false,"selectedOptionIds":[]},{"timeTaken":0,"questionId":"621c8371-2401-4944-9c60-0af7e6b455ef","isMarkedForReview":false,"selectedOptionIds":[]},{"timeTaken":0,"questionId":"8f558850-e089-4392-938d-aba0e93854bf","isMarkedForReview":false,"selectedOptionIds":[]},{"timeTaken":0,"questionId":"b60d8817-25d2-4f4e-b075-10e969ed0839","isMarkedForReview":false,"selectedOptionIds":[]},{"timeTaken":0,"questionId":"c0a09f1c-72da-4d76-9880-3806e86b78c4","isMarkedForReview":false,"selectedOptionIds":[]}]'::jsonb,
  0,
  43,
  true,
  'Exceeded maximum warnings (2) for exiting exam environment'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  answers = EXCLUDED.answers;

-- ==========================================================
-- 7. RESULTS
-- ==========================================================
INSERT INTO public.results (
  id, attempt_id, exam_id, student_id, total_marks, obtained_marks,
  percentage, status, correct_count, incorrect_count, unanswered_count,
  time_spent, question_results, evaluated_at, is_violation, violation_reason
) VALUES (
  'bba72065-cb8a-4cfd-9b70-5ab1d8121aaf',
  '1b904ebf-9036-4ecb-9d0b-b683cdac66b6',
  '2c2eded8-560d-4876-b980-810241b6aeed',
  '92694f9d-0000-0000-0000-000000000000',
  17,
  0,
  0,
  'failed',
  0,
  0,
  10,
  27,
  '[{"isCorrect":false,"questionId":"00259006-0000-0000-0000-000000000000","marksAwarded":0,"correctAnswer":["Q106_A"],"marksDeducted":0,"studentAnswer":[]},{"isCorrect":false,"questionId":"00259007-0000-0000-0000-000000000000","marksAwarded":0,"correctAnswer":["Q107_D"],"marksDeducted":0,"studentAnswer":[]},{"isCorrect":false,"questionId":"00259008-0000-0000-0000-000000000000","marksAwarded":0,"correctAnswer":["Q108_A","Q108_B","Q108_D"],"marksDeducted":0,"studentAnswer":[]},{"isCorrect":false,"questionId":"00259009-0000-0000-0000-000000000000","marksAwarded":0,"correctAnswer":["Q109_B"],"marksDeducted":0,"studentAnswer":[]},{"isCorrect":false,"questionId":"0025901f-0000-0000-0000-000000000000","marksAwarded":0,"correctAnswer":["Q110_B"],"marksDeducted":0,"studentAnswer":[]},{"isCorrect":false,"questionId":"00259020-0000-0000-0000-000000000000","marksAwarded":0,"correctAnswer":["Q111_B"],"marksDeducted":0,"studentAnswer":[]},{"isCorrect":false,"questionId":"00259021-0000-0000-0000-000000000000","marksAwarded":0,"correctAnswer":["Q112_A"],"marksDeducted":0,"studentAnswer":[]},{"isCorrect":false,"questionId":"00259022-0000-0000-0000-000000000000","marksAwarded":0,"correctAnswer":["Q113_B"],"marksDeducted":0,"studentAnswer":[]},{"isCorrect":false,"questionId":"00259023-0000-0000-0000-000000000000","marksAwarded":0,"correctAnswer":["Q114_B"],"marksDeducted":0,"studentAnswer":[]},{"isCorrect":false,"questionId":"00259024-0000-0000-0000-000000000000","marksAwarded":0,"correctAnswer":["Q115_C"],"marksDeducted":0,"studentAnswer":[]}]'::jsonb,
  '2026-08-31T04:49:45.468271+00:00',
  true,
  'Exceeded maximum warnings (2) for exiting exam environment'
) ON CONFLICT (id) DO UPDATE SET
  obtained_marks = EXCLUDED.obtained_marks,
  percentage = EXCLUDED.percentage,
  question_results = EXCLUDED.question_results;

INSERT INTO public.results (
  id, attempt_id, exam_id, student_id, total_marks, obtained_marks,
  percentage, status, correct_count, incorrect_count, unanswered_count,
  time_spent, question_results, evaluated_at, is_violation, violation_reason
) VALUES (
  '81c17f3f-ea2c-4a72-ba52-82039339cd44',
  'e03e0636-c5e2-4eb7-9132-ae86257b3fea',
  'c925a4b3-ca39-4073-a6b8-398b32fd6b0b',
  '92694f9d-0000-0000-0000-000000000000',
  12,
  3,
  25,
  'failed',
  1,
  0,
  4,
  123,
  '[{"feedback":"No answer provided.","isCorrect":false,"questionId":"5d0b5cd8-e0ec-45c5-968b-d8949283b0bf","marksAwarded":0,"correctAnswer":[],"marksDeducted":0,"studentAnswer":[]},{"feedback":"No answer provided.","isCorrect":false,"questionId":"621c8371-2401-4944-9c60-0af7e6b455ef","marksAwarded":0,"correctAnswer":[],"marksDeducted":0,"studentAnswer":[]},{"feedback":"Excellent answer. You provided an accurate definition of a Star topology mentioning the central device (hub/switch), and correctly identified both a valid main advantage (easy to manage and troubleshoot) and the main disadvantage (central hub failure disrupts the entire network). Full marks awarded.","isCorrect":true,"questionId":"8f558850-e089-4392-938d-aba0e93854bf","marksAwarded":3,"correctAnswer":[],"marksDeducted":0,"studentAnswer":["Star Topology is a network where all devices are connected to a central hub or switch.\nadvantage: easy to manage and troubleshoot.\ndisadvantage: if the central hub fails, the entire network stops working."]},{"feedback":"No answer provided.","isCorrect":false,"questionId":"b60d8817-25d2-4f4e-b075-10e969ed0839","marksAwarded":0,"correctAnswer":[],"marksDeducted":0,"studentAnswer":[]},{"feedback":"No answer provided.","isCorrect":false,"questionId":"c0a09f1c-72da-4d76-9880-3806e86b78c4","marksAwarded":0,"correctAnswer":[],"marksDeducted":0,"studentAnswer":[]}]'::jsonb,
  '2026-09-20T08:59:03.754314+00:00',
  false,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  obtained_marks = EXCLUDED.obtained_marks,
  percentage = EXCLUDED.percentage,
  question_results = EXCLUDED.question_results;

INSERT INTO public.results (
  id, attempt_id, exam_id, student_id, total_marks, obtained_marks,
  percentage, status, correct_count, incorrect_count, unanswered_count,
  time_spent, question_results, evaluated_at, is_violation, violation_reason
) VALUES (
  '556b6dcc-67fe-4917-b8ab-2f5fa83ccfcd',
  '3d56d4dd-e60f-4fae-a09c-82f6f183daaa',
  '6798eb3d-b936-48ff-b215-058faf15a447',
  '92694f9d-0000-0000-0000-000000000000',
  12,
  0,
  0,
  'failed',
  0,
  0,
  5,
  43,
  '[{"feedback":"No answer provided.","isCorrect":false,"questionId":"5d0b5cd8-e0ec-45c5-968b-d8949283b0bf","marksAwarded":0,"correctAnswer":[],"marksDeducted":0,"studentAnswer":[]},{"feedback":"No answer provided.","isCorrect":false,"questionId":"621c8371-2401-4944-9c60-0af7e6b455ef","marksAwarded":0,"correctAnswer":[],"marksDeducted":0,"studentAnswer":[]},{"feedback":"No answer provided.","isCorrect":false,"questionId":"8f558850-e089-4392-938d-aba0e93854bf","marksAwarded":0,"correctAnswer":[],"marksDeducted":0,"studentAnswer":[]},{"feedback":"No answer provided.","isCorrect":false,"questionId":"b60d8817-25d2-4f4e-b075-10e969ed0839","marksAwarded":0,"correctAnswer":[],"marksDeducted":0,"studentAnswer":[]},{"feedback":"No answer provided.","isCorrect":false,"questionId":"c0a09f1c-72da-4d76-9880-3806e86b78c4","marksAwarded":0,"correctAnswer":[],"marksDeducted":0,"studentAnswer":[]}]'::jsonb,
  '2026-09-20T10:18:02.37996+00:00',
  true,
  'Exceeded maximum warnings (2) for exiting exam environment'
) ON CONFLICT (id) DO UPDATE SET
  obtained_marks = EXCLUDED.obtained_marks,
  percentage = EXCLUDED.percentage,
  question_results = EXCLUDED.question_results;

-- ==========================================================
-- 8. NOTIFICATIONS
-- ==========================================================
INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '899a2a9f-0000-0000-0000-000000000000',
  '92694f9d-0000-0000-0000-000000000000',
  'result-published',
  'Result Published',
  'Your result for Database Systems Quiz has been published. You scored 84%.',
  true,
  '/results/RES001',
  '2026-07-22T14:25:00+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '899a2aa2-0000-0000-0000-000000000000',
  '92694f9d-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'Operating Systems Midterm has been scheduled for August 12, 2026.',
  true,
  '/exams/EXAM004',
  '2026-07-24T15:00:00+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '899a2aa3-0000-0000-0000-000000000000',
  '7b266249-0000-0000-0000-000000000000',
  'system',
  'Quiz Completed',
  'Database Systems Quiz has been completed by 6 students. View results.',
  true,
  '/results/manage',
  '2026-07-22T14:40:00+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '899a2a9e-0000-0000-0000-000000000000',
  '92694f9d-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'Data Structures Midterm has been scheduled for July 29, 2026 at 10:00 AM.',
  true,
  '/exams/EXAM001',
  '2026-07-25T10:00:00+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '899a2aa0-0000-0000-0000-000000000000',
  '92694f9d-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'Computer Networks Unit Test has been scheduled for August 5, 2026 at 11:00 AM.',
  true,
  '/exams/EXAM003',
  '2026-07-26T09:00:00+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '899a2aa1-0000-0000-0000-000000000000',
  '92694f9d-0000-0000-0000-000000000000',
  'exam-starting-soon',
  'Exam Starting Soon',
  'Data Structures Midterm starts in 2 days. Make sure you are prepared.',
  true,
  '/exams/EXAM001',
  '2026-07-27T08:00:00+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'b58337e9-85aa-4b49-b97b-ceae32e778b2',
  '7b266249-0000-0000-0000-000000000000',
  'exam-violation',
  'Test Violation',
  'Test message',
  true,
  NULL,
  '2026-08-30T16:54:42.7419+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '6fc903ce-5220-4076-a442-f4c55f24fb0c',
  '7b266249-0000-0000-0000-000000000000',
  'exam-violation',
  'Exam Violation: Aarav Sharma',
  'Student navigated away or lost focus during exam "new": Your test will end if you go out',
  true,
  NULL,
  '2026-08-30T16:56:03.733477+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'a4a47b49-4a39-4a79-8dfe-0e003bd40350',
  '7b266249-0000-0000-0000-000000000000',
  'exam-violation',
  'Exam Violation: Aarav Sharma',
  'Student navigated away or lost focus during exam "new": Your test will end if you go out',
  true,
  NULL,
  '2026-08-30T16:56:05.447319+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'c636c367-614d-4daa-82b2-112e57b2b6de',
  '92694f9e-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "test2" has been scheduled for 2026-08-30.',
  false,
  '/exams/c08acded-ccff-4c6e-9040-61b6abf06e9c',
  '2026-08-30T16:59:27.532996+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '3ea92662-2fbd-43b8-bec0-beb20977bde0',
  '92694f9f-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "test2" has been scheduled for 2026-08-30.',
  false,
  '/exams/c08acded-ccff-4c6e-9040-61b6abf06e9c',
  '2026-08-30T16:59:27.532996+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '7ef74933-190e-4645-8efd-a024d0666547',
  '92694fa0-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "test2" has been scheduled for 2026-08-30.',
  false,
  '/exams/c08acded-ccff-4c6e-9040-61b6abf06e9c',
  '2026-08-30T16:59:27.532996+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'af42a0eb-fdd4-4323-98d1-4a18d1fd75c7',
  '92694fa1-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "test2" has been scheduled for 2026-08-30.',
  false,
  '/exams/c08acded-ccff-4c6e-9040-61b6abf06e9c',
  '2026-08-30T16:59:27.532996+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '9276df06-0c41-43a0-be0e-477646541573',
  '92694fa2-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "test2" has been scheduled for 2026-08-30.',
  false,
  '/exams/c08acded-ccff-4c6e-9040-61b6abf06e9c',
  '2026-08-30T16:59:27.532996+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '547d6a89-d28c-45c2-9cf6-0c39d9ad6918',
  '92694fa3-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "test2" has been scheduled for 2026-08-30.',
  false,
  '/exams/c08acded-ccff-4c6e-9040-61b6abf06e9c',
  '2026-08-30T16:59:27.532996+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '19cef74e-4e10-4d67-8e26-d8a9898e5b1a',
  '92694fa4-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "test2" has been scheduled for 2026-08-30.',
  false,
  '/exams/c08acded-ccff-4c6e-9040-61b6abf06e9c',
  '2026-08-30T16:59:27.532996+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '94c74535-4b6b-46d3-ba88-1d0ec73a9db0',
  '7b266249-0000-0000-0000-000000000000',
  'system',
  'Exam Created Successfully',
  'Your exam "test2" has been scheduled for 2026-08-30.',
  true,
  '/exams',
  '2026-08-30T16:59:27.532996+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'ebf19575-5ac4-4777-ad51-00b77b5a53ec',
  '92694f9d-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "test2" has been scheduled for 2026-08-30.',
  true,
  '/exams/c08acded-ccff-4c6e-9040-61b6abf06e9c',
  '2026-08-30T16:59:27.532996+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'ccefdb7d-6afd-4537-8576-c63d3b683f31',
  '92694f9e-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "new" has been scheduled for 2026-08-31.',
  false,
  '/exams/2c2eded8-560d-4876-b980-810241b6aeed',
  '2026-08-31T04:47:43.530732+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '6dae82b1-437d-4320-aa75-a58492c114dc',
  '92694f9f-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "new" has been scheduled for 2026-08-31.',
  false,
  '/exams/2c2eded8-560d-4876-b980-810241b6aeed',
  '2026-08-31T04:47:43.530732+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'c393f446-e87c-488c-80c1-84e2322ca8ed',
  '92694fa0-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "new" has been scheduled for 2026-08-31.',
  false,
  '/exams/2c2eded8-560d-4876-b980-810241b6aeed',
  '2026-08-31T04:47:43.530732+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '8a895161-fa4c-42cb-bf02-03f3f92fe3a2',
  '7b266249-0000-0000-0000-000000000000',
  'system',
  'Exam Created Successfully',
  'Your exam "new" has been scheduled for 2026-08-31.',
  true,
  '/exams',
  '2026-08-31T04:47:43.530732+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '4e8b07a1-d2db-4cd5-98e5-7294d2bf324d',
  '92694f9d-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "new" has been scheduled for 2026-08-31.',
  true,
  '/exams/2c2eded8-560d-4876-b980-810241b6aeed',
  '2026-08-31T04:47:43.530732+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '6e30c520-2bbe-4228-ac41-efcf3dc28754',
  '92694fa1-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "new" has been scheduled for 2026-08-31.',
  false,
  '/exams/2c2eded8-560d-4876-b980-810241b6aeed',
  '2026-08-31T04:47:43.530732+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '750dcd6c-dfa0-41b6-8b16-0c9ca85d50d7',
  '92694fa2-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "new" has been scheduled for 2026-08-31.',
  false,
  '/exams/2c2eded8-560d-4876-b980-810241b6aeed',
  '2026-08-31T04:47:43.530732+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'b51a0a2c-4c4a-43d0-ac1b-00af2da532a8',
  '92694fa3-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "new" has been scheduled for 2026-08-31.',
  false,
  '/exams/2c2eded8-560d-4876-b980-810241b6aeed',
  '2026-08-31T04:47:43.530732+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'd7b3f9c0-99bf-469e-9204-acb2dacb73ca',
  '92694fa4-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "new" has been scheduled for 2026-08-31.',
  false,
  '/exams/2c2eded8-560d-4876-b980-810241b6aeed',
  '2026-08-31T04:47:43.530732+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'fe5ba137-6299-4b2f-8ec4-290de6e4a252',
  '92694f9e-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "TEST" has been scheduled for 2026-09-20.',
  false,
  '/exams/c925a4b3-ca39-4073-a6b8-398b32fd6b0b',
  '2026-09-20T08:56:33.47565+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '8d8d5c69-c675-4615-b92c-6885acc7ef40',
  '92694f9f-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "TEST" has been scheduled for 2026-09-20.',
  false,
  '/exams/c925a4b3-ca39-4073-a6b8-398b32fd6b0b',
  '2026-09-20T08:56:33.47565+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '02d544e0-e5fd-4ea5-91dd-06a5d9fce7c7',
  '92694fa0-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "TEST" has been scheduled for 2026-09-20.',
  false,
  '/exams/c925a4b3-ca39-4073-a6b8-398b32fd6b0b',
  '2026-09-20T08:56:33.47565+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'bb58892e-9c36-4a26-95d8-0e0d58170c91',
  '92694fa1-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "TEST" has been scheduled for 2026-09-20.',
  false,
  '/exams/c925a4b3-ca39-4073-a6b8-398b32fd6b0b',
  '2026-09-20T08:56:33.47565+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '247db97f-5526-4441-a6c1-6fddcb29c450',
  '92694fa2-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "TEST" has been scheduled for 2026-09-20.',
  false,
  '/exams/c925a4b3-ca39-4073-a6b8-398b32fd6b0b',
  '2026-09-20T08:56:33.47565+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'c1444bd4-1461-43bd-99ba-21b54a560ba8',
  '92694fa3-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "TEST" has been scheduled for 2026-09-20.',
  false,
  '/exams/c925a4b3-ca39-4073-a6b8-398b32fd6b0b',
  '2026-09-20T08:56:33.47565+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '06ef3c0b-4049-4e7e-8704-af8df75a144f',
  '92694fa4-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "TEST" has been scheduled for 2026-09-20.',
  false,
  '/exams/c925a4b3-ca39-4073-a6b8-398b32fd6b0b',
  '2026-09-20T08:56:33.47565+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '65c5472e-61e0-44dc-8ace-d7b5a3c86aba',
  '7b266249-0000-0000-0000-000000000000',
  'system',
  'Exam Created Successfully',
  'Your exam "TEST" has been scheduled for 2026-09-20.',
  true,
  '/exams',
  '2026-09-20T08:56:33.47565+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '6d2e85dd-6a90-4890-ba0b-322ad6da18b6',
  '7b266249-0000-0000-0000-000000000000',
  'exam-violation',
  'Exam Violation: Aarav Sharma',
  'Student navigated away or lost focus during exam "new": Your test will end if you go out',
  true,
  NULL,
  '2026-08-31T04:49:38.021+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'd9d856c6-767b-438d-acd6-248fe9324e49',
  '7b266249-0000-0000-0000-000000000000',
  'exam-violation',
  'Exam Violation: Aarav Sharma',
  'Student navigated away or lost focus during exam "new": Your test will end if you go out',
  true,
  NULL,
  '2026-08-31T04:49:46.075747+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '86a2c79e-8fa4-478c-be1d-bd3b9342aad8',
  '92694f9d-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "TEST" has been scheduled for 2026-09-20.',
  true,
  '/exams/c925a4b3-ca39-4073-a6b8-398b32fd6b0b',
  '2026-09-20T08:56:33.47565+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '1904e506-c3f2-4cfb-bb0e-0c34047a67cc',
  '92694f9e-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "TEST 2" has been scheduled for 2026-09-20.',
  false,
  '/exams/6798eb3d-b936-48ff-b215-058faf15a447',
  '2026-09-20T09:49:51.164467+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '4c4b92fd-94f7-4436-944c-17fe6ec232ce',
  '92694f9f-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "TEST 2" has been scheduled for 2026-09-20.',
  false,
  '/exams/6798eb3d-b936-48ff-b215-058faf15a447',
  '2026-09-20T09:49:51.164467+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '54e95af6-8a5d-4513-b9f6-40f2f8263b92',
  '92694fa0-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "TEST 2" has been scheduled for 2026-09-20.',
  false,
  '/exams/6798eb3d-b936-48ff-b215-058faf15a447',
  '2026-09-20T09:49:51.164467+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '1ec05dd2-b027-490d-a8fc-84490bb08a4a',
  '92694fa1-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "TEST 2" has been scheduled for 2026-09-20.',
  false,
  '/exams/6798eb3d-b936-48ff-b215-058faf15a447',
  '2026-09-20T09:49:51.164467+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '63044c53-c7ab-4bd4-bd10-65275616cfda',
  '92694fa2-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "TEST 2" has been scheduled for 2026-09-20.',
  false,
  '/exams/6798eb3d-b936-48ff-b215-058faf15a447',
  '2026-09-20T09:49:51.164467+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '76627b33-5299-4975-b840-17b2e3c290b1',
  '92694fa3-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "TEST 2" has been scheduled for 2026-09-20.',
  false,
  '/exams/6798eb3d-b936-48ff-b215-058faf15a447',
  '2026-09-20T09:49:51.164467+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'be4ba738-21d2-455f-a0df-07b0875eb9b2',
  '92694fa4-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "TEST 2" has been scheduled for 2026-09-20.',
  false,
  '/exams/6798eb3d-b936-48ff-b215-058faf15a447',
  '2026-09-20T09:49:51.164467+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'f2de2b4c-e625-4f0f-bcdc-abf37a5cfb16',
  '92694f9d-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "TEST 2" has been scheduled for 2026-09-20.',
  true,
  '/exams/6798eb3d-b936-48ff-b215-058faf15a447',
  '2026-09-20T09:49:51.164467+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'e8647249-8d64-4898-9669-5f06b91c04b1',
  '7b266249-0000-0000-0000-000000000000',
  'system',
  'Exam Created Successfully',
  'Your exam "TEST 2" has been scheduled for 2026-09-20.',
  true,
  '/exams',
  '2026-09-20T09:49:51.164467+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '05014d70-6271-44d7-ae02-05a9ad9a8e05',
  '7b266249-0000-0000-0000-000000000000',
  'exam-violation',
  'Exam Violation: Aarav Sharma',
  'Student navigated away or lost focus during exam "TEST 2": Your test will end if you go out',
  true,
  NULL,
  '2026-09-20T09:54:40.310922+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '2b1b078d-9281-453d-bfa8-d891d30a286e',
  '7b266249-0000-0000-0000-000000000000',
  'exam-violation',
  'Exam Violation: Aarav Sharma',
  'Student navigated away or lost focus during exam "TEST 2": Your test will end if you go out',
  true,
  NULL,
  '2026-09-20T09:54:43.393518+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '51a9fc8d-2b11-4b51-9edc-24952b00086e',
  '7b266249-0000-0000-0000-000000000000',
  'exam-violation',
  'Exam Violation: Aarav Sharma',
  'Student navigated away or lost focus during exam "TEST 2": Your test will end if you go out',
  true,
  NULL,
  '2026-09-20T10:18:01.093295+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'c3298a75-f26f-48a6-a4f9-66040a5b8986',
  '7b266249-0000-0000-0000-000000000000',
  'exam-violation',
  'Exam Violation: Aarav Sharma',
  'Student navigated away or lost focus during exam "TEST 2": Your test will end if you go out',
  true,
  NULL,
  '2026-09-20T10:18:02.546803+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '634b1636-2f96-482f-a7e5-607e2ea652d6',
  '7b266249-0000-0000-0000-000000000000',
  'system',
  'New Assignment Submission',
  'Aarav Sharma has submitted their response for "Data Structures Lab Assignment 1".',
  true,
  '/assignments/3910182a-a1bc-45af-afa9-7179d9f67c3c',
  '2026-09-20T13:58:00.578381+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '7b5d5c21-0313-4f86-8c0e-6f007b1c15d1',
  '7b266249-0000-0000-0000-000000000000',
  'system',
  'Exam Created Successfully',
  'Your exam "test" has been scheduled for 2026-09-23.',
  false,
  '/exams',
  '2026-09-23T09:03:41.968709+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'cc66fabd-31d7-4c9a-ae5c-bb90d6ca7563',
  '92694f9e-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "test" has been scheduled for 2026-09-23.',
  false,
  '/exams/ce6113a6-04bb-4048-8811-84d95ae025dc',
  '2026-09-23T09:03:41.968709+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '2ec673f8-f34c-497d-a0e6-3c9a5627ae3b',
  '92694f9f-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "test" has been scheduled for 2026-09-23.',
  false,
  '/exams/ce6113a6-04bb-4048-8811-84d95ae025dc',
  '2026-09-23T09:03:41.968709+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '22eeb8a4-481d-4382-a3c1-b42e184b7252',
  '92694fa0-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "test" has been scheduled for 2026-09-23.',
  false,
  '/exams/ce6113a6-04bb-4048-8811-84d95ae025dc',
  '2026-09-23T09:03:41.968709+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'c7d4833b-a20f-4152-9d8d-f4ff313f3c6e',
  '92694fa1-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "test" has been scheduled for 2026-09-23.',
  false,
  '/exams/ce6113a6-04bb-4048-8811-84d95ae025dc',
  '2026-09-23T09:03:41.968709+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '00e3ec9a-1c7e-4125-82af-31480f05fe98',
  '92694fa2-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "test" has been scheduled for 2026-09-23.',
  false,
  '/exams/ce6113a6-04bb-4048-8811-84d95ae025dc',
  '2026-09-23T09:03:41.968709+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '9d37196e-8e29-4653-a085-ba63bdda7304',
  '92694fa3-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "test" has been scheduled for 2026-09-23.',
  false,
  '/exams/ce6113a6-04bb-4048-8811-84d95ae025dc',
  '2026-09-23T09:03:41.968709+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '23ae0a13-ec45-4c20-8472-1d91c5c2db6e',
  '92694fa4-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "test" has been scheduled for 2026-09-23.',
  false,
  '/exams/ce6113a6-04bb-4048-8811-84d95ae025dc',
  '2026-09-23T09:03:41.968709+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'dd09cffe-9d11-4d79-a1f4-629533dde713',
  '92694f9d-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "test" has been scheduled for 2026-09-23.',
  true,
  '/exams/ce6113a6-04bb-4048-8811-84d95ae025dc',
  '2026-09-23T09:03:41.968709+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'ab9dda31-5ae4-4234-8706-57044827dce1',
  '7b266249-0000-0000-0000-000000000000',
  'system',
  'Exam Created Successfully',
  'Your exam "Week 1 TEST" has been scheduled for 2026-10-05.',
  false,
  '/exams',
  '2026-10-05T05:22:45.488364+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'dd3e8dc0-cc27-4317-8a5d-729806fa8427',
  '92694f9d-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "Week 1 TEST" has been scheduled for 2026-10-05.',
  false,
  '/exams/93c0fba4-69d3-4333-8945-efec63bae96c',
  '2026-10-05T05:22:45.488364+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'e7c7d160-fd39-451d-a76a-c85dadefab69',
  '92694f9e-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "Week 1 TEST" has been scheduled for 2026-10-05.',
  false,
  '/exams/93c0fba4-69d3-4333-8945-efec63bae96c',
  '2026-10-05T05:22:45.488364+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  'b63852ca-538f-4e76-bbaf-9fc5d36279fc',
  '92694f9f-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "Week 1 TEST" has been scheduled for 2026-10-05.',
  false,
  '/exams/93c0fba4-69d3-4333-8945-efec63bae96c',
  '2026-10-05T05:22:45.488364+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '5149356e-3723-4918-8c35-66e0766e6cb3',
  '92694fa0-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "Week 1 TEST" has been scheduled for 2026-10-05.',
  false,
  '/exams/93c0fba4-69d3-4333-8945-efec63bae96c',
  '2026-10-05T05:22:45.488364+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '236931ea-b190-46fc-a694-66dd402db13c',
  '92694fa1-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "Week 1 TEST" has been scheduled for 2026-10-05.',
  false,
  '/exams/93c0fba4-69d3-4333-8945-efec63bae96c',
  '2026-10-05T05:22:45.488364+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '97b2c736-0caf-46fd-bbf9-f5852edbc7ef',
  '92694fa2-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "Week 1 TEST" has been scheduled for 2026-10-05.',
  false,
  '/exams/93c0fba4-69d3-4333-8945-efec63bae96c',
  '2026-10-05T05:22:45.488364+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '5fffe7e2-f06a-41dc-b7d5-41b746f26c90',
  '92694fa3-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "Week 1 TEST" has been scheduled for 2026-10-05.',
  false,
  '/exams/93c0fba4-69d3-4333-8945-efec63bae96c',
  '2026-10-05T05:22:45.488364+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '7b84dc12-d82d-4fc1-9d1b-c5df6572c7c8',
  '92694fa4-0000-0000-0000-000000000000',
  'exam-scheduled',
  'New Exam Scheduled',
  'A new exam "Week 1 TEST" has been scheduled for 2026-10-05.',
  false,
  '/exams/93c0fba4-69d3-4333-8945-efec63bae96c',
  '2026-10-05T05:22:45.488364+00:00'
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;

