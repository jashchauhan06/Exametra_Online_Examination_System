import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkSubjects() {
  const { data, error } = await supabase.from('subjects').select('*');
  console.log('Subjects:', data);
  console.log('Error:', error);
}

checkSubjects();
