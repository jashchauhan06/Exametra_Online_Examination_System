import { createClient } from '@insforge/sdk';

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://kbia4qk4.us-east.insforge.app',
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'anon_1e12622464e5a267950bec5a052a0c8aaf1e58dee257f6f8b4d20836d60b3b92',
});

async function checkSubjects() {
  const { data, error } = await insforge.database.from('subjects').select('*');
  console.log('Subjects:', data);
  console.log('Error:', error);
}

checkSubjects();
