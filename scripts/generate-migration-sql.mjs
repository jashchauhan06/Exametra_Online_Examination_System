import fs from 'fs';

const dump = JSON.parse(fs.readFileSync('scripts/supabase-dump.json', 'utf-8'));

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number' || typeof val === 'boolean') return `${val}`;
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${String(val).replace(/'/g, "''")}'`;
}

function escapeTextArray(val) {
  if (!val || !Array.isArray(val) || val.length === 0) return 'NULL';
  const escapedElements = val.map(e => `"${String(e).replace(/"/g, '\\"')}"`).join(',');
  return `'{${escapedElements}}'::text[]`;
}

let sql = `-- Migration of all data from Supabase to InsForge\n\n`;

// 1. auth.users
sql += `-- ==========================================================\n`;
sql += `-- 1. AUTH USERS\n`;
sql += `-- ==========================================================\n`;

for (const u of dump.users) {
  const name = u.name;
  const profileJson = JSON.stringify({ name, avatar_url: u.avatar || null }).replace(/'/g, "''");
  sql += `INSERT INTO auth.users (id, email, password, email_verified, profile, metadata, is_project_admin, is_anonymous, created_at, updated_at)
VALUES (
  '${u.id}',
  '${u.email}',
  crypt('password123', gen_salt('bf', 10)),
  true,
  '${profileJson}'::jsonb,
  '{}'::jsonb,
  ${u.role === 'admin' ? 'true' : 'false'},
  false,
  '${u.created_at || new Date().toISOString()}',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  email_verified = true,
  profile = EXCLUDED.profile;\n\n`;
}

// 2. public.users
sql += `-- ==========================================================\n`;
sql += `-- 2. PUBLIC USERS\n`;
sql += `-- ==========================================================\n`;

for (const u of dump.users) {
  sql += `INSERT INTO public.users (
  id, email, name, role, avatar, department, created_at, is_active,
  student_id, semester, enrolled_subjects, faculty_id, designation, teaching_subjects
) VALUES (
  '${u.id}',
  ${escapeSql(u.email)},
  ${escapeSql(u.name)},
  ${escapeSql(u.role)},
  ${escapeSql(u.avatar)},
  ${escapeSql(u.department)},
  ${escapeSql(u.created_at)},
  ${u.is_active ? 'true' : 'false'},
  ${escapeSql(u.student_id)},
  ${escapeSql(u.semester)},
  ${escapeTextArray(u.enrolled_subjects)},
  ${escapeSql(u.faculty_id)},
  ${escapeSql(u.designation)},
  ${escapeTextArray(u.teaching_subjects)}
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  student_id = EXCLUDED.student_id,
  semester = EXCLUDED.semester,
  enrolled_subjects = EXCLUDED.enrolled_subjects,
  faculty_id = EXCLUDED.faculty_id,
  designation = EXCLUDED.designation,
  teaching_subjects = EXCLUDED.teaching_subjects;\n\n`;
}

// 3. public.subjects
sql += `-- ==========================================================\n`;
sql += `-- 3. SUBJECTS\n`;
sql += `-- ==========================================================\n`;

for (const s of dump.subjects) {
  sql += `INSERT INTO public.subjects (id, code, name, department, semester, faculty_id)
VALUES (
  '${s.id}',
  ${escapeSql(s.code)},
  ${escapeSql(s.name)},
  ${escapeSql(s.department)},
  ${escapeSql(s.semester)},
  ${escapeSql(s.faculty_id)}
) ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  department = EXCLUDED.department,
  semester = EXCLUDED.semester,
  faculty_id = EXCLUDED.faculty_id;\n\n`;
}

// 4. public.exams
sql += `-- ==========================================================\n`;
sql += `-- 4. EXAMS\n`;
sql += `-- ==========================================================\n`;

for (const e of dump.exams) {
  sql += `INSERT INTO public.exams (
  id, title, description, subject_id, faculty_id, date, start_time,
  duration, total_marks, passing_marks, total_questions, attempts_allowed,
  status, instructions, settings, question_ids, created_at, updated_at
) VALUES (
  '${e.id}',
  ${escapeSql(e.title)},
  ${escapeSql(e.description)},
  ${escapeSql(e.subject_id)},
  ${escapeSql(e.faculty_id)},
  ${escapeSql(e.date)},
  ${escapeSql(e.start_time)},
  ${escapeSql(e.duration)},
  ${escapeSql(e.total_marks)},
  ${escapeSql(e.passing_marks)},
  ${escapeSql(e.total_questions)},
  ${escapeSql(e.attempts_allowed)},
  ${escapeSql(e.status)},
  ${escapeSql(e.instructions)},
  ${escapeSql(e.settings)},
  ${escapeSql(e.question_ids)},
  ${escapeSql(e.created_at)},
  ${escapeSql(e.updated_at)}
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  question_ids = EXCLUDED.question_ids,
  settings = EXCLUDED.settings;\n\n`;
}

// 5. public.questions
sql += `-- ==========================================================\n`;
sql += `-- 5. QUESTIONS\n`;
sql += `-- ==========================================================\n`;

for (const q of dump.questions) {
  sql += `INSERT INTO public.questions (
  id, text, type, options, marks, difficulty, topic, subject_id, created_by,
  explanation, created_at, coding_languages, starter_code, test_cases,
  time_limit_ms, memory_limit_kb, expected_answer, rubric
) VALUES (
  '${q.id}',
  ${escapeSql(q.text)},
  ${escapeSql(q.type)},
  ${escapeSql(q.options)},
  ${escapeSql(q.marks)},
  ${escapeSql(q.difficulty)},
  ${escapeSql(q.topic)},
  ${escapeSql(q.subject_id)},
  ${escapeSql(q.created_by)},
  ${escapeSql(q.explanation)},
  ${escapeSql(q.created_at)},
  ${escapeSql(q.coding_languages)},
  ${escapeSql(q.starter_code)},
  ${escapeSql(q.test_cases)},
  ${escapeSql(q.time_limit_ms)},
  ${escapeSql(q.memory_limit_kb)},
  ${escapeSql(q.expected_answer)},
  ${escapeSql(q.rubric)}
) ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  test_cases = EXCLUDED.test_cases,
  starter_code = EXCLUDED.starter_code,
  expected_answer = EXCLUDED.expected_answer,
  rubric = EXCLUDED.rubric;\n\n`;
}

// 6. public.exam_attempts
sql += `-- ==========================================================\n`;
sql += `-- 6. EXAM ATTEMPTS\n`;
sql += `-- ==========================================================\n`;

for (const a of dump.exam_attempts) {
  sql += `INSERT INTO public.exam_attempts (
  id, exam_id, student_id, started_at, submitted_at, status, answers,
  tab_switch_count, time_spent, is_violation, violation_reason
) VALUES (
  '${a.id}',
  ${escapeSql(a.exam_id)},
  ${escapeSql(a.student_id)},
  ${escapeSql(a.started_at)},
  ${escapeSql(a.submitted_at)},
  ${escapeSql(a.status)},
  ${escapeSql(a.answers)},
  ${escapeSql(a.tab_switch_count)},
  ${escapeSql(a.time_spent)},
  ${a.is_violation ? 'true' : 'false'},
  ${escapeSql(a.violation_reason)}
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  answers = EXCLUDED.answers;\n\n`;
}

// 7. public.results
sql += `-- ==========================================================\n`;
sql += `-- 7. RESULTS\n`;
sql += `-- ==========================================================\n`;

for (const r of dump.results) {
  sql += `INSERT INTO public.results (
  id, attempt_id, exam_id, student_id, total_marks, obtained_marks,
  percentage, status, correct_count, incorrect_count, unanswered_count,
  time_spent, question_results, evaluated_at, is_violation, violation_reason
) VALUES (
  '${r.id}',
  ${escapeSql(r.attempt_id)},
  ${escapeSql(r.exam_id)},
  ${escapeSql(r.student_id)},
  ${escapeSql(r.total_marks)},
  ${escapeSql(r.obtained_marks)},
  ${escapeSql(r.percentage)},
  ${escapeSql(r.status)},
  ${escapeSql(r.correct_count)},
  ${escapeSql(r.incorrect_count)},
  ${escapeSql(r.unanswered_count)},
  ${escapeSql(r.time_spent)},
  ${escapeSql(r.question_results)},
  ${escapeSql(r.evaluated_at)},
  ${r.is_violation ? 'true' : 'false'},
  ${escapeSql(r.violation_reason)}
) ON CONFLICT (id) DO UPDATE SET
  obtained_marks = EXCLUDED.obtained_marks,
  percentage = EXCLUDED.percentage,
  question_results = EXCLUDED.question_results;\n\n`;
}

// 8. public.notifications
sql += `-- ==========================================================\n`;
sql += `-- 8. NOTIFICATIONS\n`;
sql += `-- ==========================================================\n`;

for (const n of dump.notifications) {
  sql += `INSERT INTO public.notifications (
  id, user_id, type, title, message, is_read, link, created_at
) VALUES (
  '${n.id}',
  ${escapeSql(n.user_id)},
  ${escapeSql(n.type)},
  ${escapeSql(n.title)},
  ${escapeSql(n.message)},
  ${n.is_read ? 'true' : 'false'},
  ${escapeSql(n.link)},
  ${escapeSql(n.created_at)}
) ON CONFLICT (id) DO UPDATE SET
  is_read = EXCLUDED.is_read;\n\n`;
}

fs.writeFileSync('scripts/insforge-data-migration.sql', sql);
console.log('Successfully generated scripts/insforge-data-migration.sql');
