import { createClient } from '@insforge/sdk';

const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://kbia4qk4.us-east.insforge.app';
const insforgeAnonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'anon_1e12622464e5a267950bec5a052a0c8aaf1e58dee257f6f8b4d20836d60b3b92';

const insforge = createClient({
  baseUrl: insforgeUrl,
  anonKey: insforgeAnonKey,
});

async function main() {
  console.log('InsForge auth check...');
  const { data, error } = await insforge.database.from('users').select('id, name, email');
  if (error) console.error('Error:', error);
  else console.log('Users count:', data?.length);
}

main();
