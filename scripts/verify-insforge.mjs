import { createClient } from '@insforge/sdk';

const client = createClient({
  baseUrl: 'https://kbia4qk4.us-east.insforge.app',
  anonKey: 'anon_1e12622464e5a267950bec5a052a0c8aaf1e58dee257f6f8b4d20836d60b3b92'
});

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

  console.log('--- InsForge Table Counts ---');
  for (const t of tables) {
    const { count, error, data } = await client.database
      .from(t)
      .select('*', { count: 'exact' });

    if (error) {
      console.log(`[FAIL] ${t}: ${error.message}`);
    } else {
      console.log(`[OK]   ${t}: count = ${count} (retrieved ${data?.length} rows)`);
    }
  }

  // Test sign in as student
  console.log('\n--- Testing Authentication ---');
  const studentLogin = await client.auth.signInWithPassword({
    email: 'aarav.sharma@sit.edu.in',
    password: 'password123'
  });
  if (studentLogin.error) {
    console.error('Student login failed:', studentLogin.error);
  } else {
    console.log('[OK] Student login successful:', studentLogin.data?.user?.email, '(id:', studentLogin.data?.user?.id, ')');
  }

  // Test sign in as faculty
  const facultyLogin = await client.auth.signInWithPassword({
    email: 'priya.mehta@sit.edu.in',
    password: 'password123'
  });
  if (facultyLogin.error) {
    console.error('Faculty login failed:', facultyLogin.error);
  } else {
    console.log('[OK] Faculty login successful:', facultyLogin.data?.user?.email);
  }

  // Test sign in as admin
  const adminLogin = await client.auth.signInWithPassword({
    email: 'admin@sit.edu.in',
    password: 'password123'
  });
  if (adminLogin.error) {
    console.error('Admin login failed:', adminLogin.error);
  } else {
    console.log('[OK] Admin login successful:', adminLogin.data?.user?.email);
  }
}

main();
