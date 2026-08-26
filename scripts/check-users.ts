import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkUsers() {
  const { data, error } = await supabase.from('users').select('*');
  console.log('Users:', data);
}

checkUsers();
