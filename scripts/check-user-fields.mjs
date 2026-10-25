import fs from 'fs';

const dump = JSON.parse(fs.readFileSync('scripts/supabase-dump.json', 'utf-8'));
const users = dump.users;

users.forEach(u => {
  console.log(`[${u.role}] ${u.email}:`);
  console.log(`  student_id: ${u.student_id}, semester: ${u.semester}, enrolled_subjects: ${JSON.stringify(u.enrolled_subjects)}`);
  console.log(`  faculty_id: ${u.faculty_id}, designation: ${u.designation}, teaching_subjects: ${JSON.stringify(u.teaching_subjects)}`);
});
