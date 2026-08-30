import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const content = fs.readFileSync('.env', 'utf-8');
content.split('\n').forEach(line => {
  const match = line.replace('\r', '').match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/['"]/g, '');
});

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: users } = await supabase.from('users').select('id, name, email, role');
  console.log('USERS:', users);
  
  const { data: notifs } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(5);
  console.log('RECENT NOTIFS:', notifs);
  
  const { data: exams } = await supabase.from('exams').select('id, title, faculty_id').limit(5);
  console.log('EXAMS:', exams);
}
check();
