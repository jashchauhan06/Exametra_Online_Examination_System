import fs from 'fs';
import path from 'path';
import {
  students, faculty, admins, subjects, questions, exams,
  examAttempts, results, notifications
} from '../src/lib/data/mock-data';

// Helper to generate a deterministic UUID from a string (simple hash for mock data)
function stringToUuid(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  return `${hex}-0000-0000-0000-000000000000`;
}

let sql = `-- Auto-generated seed file from mock-data.ts\n\n`;

// 1. Insert Users (Bypass auth.users by inserting directly into public.users)
// Note: In a real system, they must exist in auth.users first, but for this seed to work, 
// the user needs to temporarily disable the foreign key or we insert dummy auth records.
sql += `-- Note: You may need to drop the auth.users foreign key constraint temporarily to run this seed:\n`;
sql += `-- ALTER TABLE users DROP CONSTRAINT users_id_fkey;\n\n`;

const allUsers = [...students, ...faculty, ...admins];
allUsers.forEach(u => {
  const uuid = stringToUuid(u.id);
  sql += `INSERT INTO users (id, email, name, role, department, is_active) VALUES ('${uuid}', '${u.email}', '${u.name.replace(/'/g, "''")}', '${u.role}', '${u.department}', ${u.isActive}) ON CONFLICT DO NOTHING;\n`;
});

// 2. Insert Subjects
subjects.forEach(s => {
  const uuid = stringToUuid(s.id);
  const facultyUuid = stringToUuid(s.facultyId);
  sql += `INSERT INTO subjects (id, code, name, department, semester, faculty_id) VALUES ('${uuid}', '${s.code}', '${s.name}', '${s.department}', ${s.semester}, '${facultyUuid}') ON CONFLICT DO NOTHING;\n`;
});

// 3. Insert Exams
exams.forEach(e => {
  const uuid = stringToUuid(e.id);
  const subjectUuid = stringToUuid(e.subjectId);
  const facultyUuid = stringToUuid(e.facultyId);
  const settingsJson = JSON.stringify(e.settings).replace(/'/g, "''");
  sql += `INSERT INTO exams (id, title, description, subject_id, faculty_id, date, start_time, duration, total_marks, passing_marks, total_questions, attempts_allowed, status, settings) VALUES ('${uuid}', '${e.title}', '${e.description}', '${subjectUuid}', '${facultyUuid}', '${e.date}', '${e.startTime}', ${e.duration}, ${e.totalMarks}, ${e.passingMarks}, ${e.totalQuestions}, ${e.attemptsAllowed}, '${e.status}', '${settingsJson}') ON CONFLICT DO NOTHING;\n`;
});

// Write to file
const outputPath = path.join(process.cwd(), 'seed.sql');
fs.writeFileSync(outputPath, sql);
console.log('Successfully generated seed.sql');
