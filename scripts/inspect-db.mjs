import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(l => {
  const m = l.replace('\r', '').match(/^([^=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/['"]/g, '');
});

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const tables = [
    'users',
    'subjects',
    'exams',
    'questions',
    'exam_attempts',
    'results',
    'notifications',
    'activity_logs',
    'activity_log',
    'test_cases',
    'options'
  ];

  for (const t of tables) {
    const { data, error, count } = await sb.from(t).select('*', { count: 'exact' }).limit(1);
    if (error) {
      console.log(`${t}: ERROR -> ${error.message} (${error.code})`);
    } else {
      console.log(`${t}: count = ${count}, columns = [${data[0] ? Object.keys(data[0]).join(', ') : 'EMPTY'}]`);
    }
  }

  // Also check auth.users count
  const { data: authData, error: authError } = await sb.auth.admin.listUsers();
  if (authError) {
    console.log('auth.users: ERROR ->', authError.message);
  } else {
    console.log(`auth.users: count = ${authData.users.length}`);
    authData.users.forEach(u => console.log(`  - ${u.email} (${u.id})`));
  }
}

main();
