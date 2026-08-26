import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function checkPublicUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Error fetching public.users:', error.message);
  } else {
    console.log(`Found ${data.length} users in public.users`);
    if (data.length > 0) {
      console.log('Sample user:', data[0]);
    }
  }
}

checkPublicUsers();
