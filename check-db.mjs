import { createClient } from '@insforge/sdk';
import fs from 'fs';

const content = fs.readFileSync('.env', 'utf-8');
content.split('\n').forEach(line => {
  const match = line.replace('\r', '').match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/['"]/g, '');
});

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://kbia4qk4.us-east.insforge.app',
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'anon_1e12622464e5a267950bec5a052a0c8aaf1e58dee257f6f8b4d20836d60b3b92',
});

async function check() {
  const { data: users } = await insforge.database.from('users').select('id, name, email, role');
  console.log('USERS:', users);
  
  const { data: notifs } = await insforge.database.from('notifications').select('*').order('created_at', { ascending: false }).limit(5);
  console.log('RECENT NOTIFS:', notifs);
  
  const { data: exams } = await insforge.database.from('exams').select('id, title, faculty_id').limit(5);
  console.log('EXAMS:', exams);
}
check();
