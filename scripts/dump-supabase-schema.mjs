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
    'activity_logs'
  ];

  const dump = {};

  for (const table of tables) {
    const { data, error } = await sb.from(table).select('*');
    if (error) {
      console.error(`Failed to export ${table}:`, error.message);
      dump[table] = [];
    } else {
      console.log(`Fetched ${data.length} rows from ${table}`);
      dump[table] = data;
    }
  }

  // Also get auth users
  const { data: authData, error: authErr } = await sb.auth.admin.listUsers();
  if (authErr) {
    console.error('Failed to export auth.users:', authErr.message);
    dump.auth_users = [];
  } else {
    console.log(`Fetched ${authData.users.length} auth.users`);
    dump.auth_users = authData.users;
  }

  fs.writeFileSync('scripts/supabase-dump.json', JSON.stringify(dump, null, 2));
  console.log('Saved full export to scripts/supabase-dump.json');
}

main();
