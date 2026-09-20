const { createClient } = require('@supabase/supabase-js');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function run() {
  const { data: users, error: err1 } = await supabase.from('users').select('*').limit(1);
  const { data: subjects, error: err2 } = await supabase.from('subjects').select('*').limit(1);
  console.log("Users schema:", Object.keys(users[0] || {}));
  console.log("Subjects schema:", Object.keys(subjects[0] || {}));
}
run();
