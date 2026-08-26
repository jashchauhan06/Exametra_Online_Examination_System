import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// All users we need to create, matching the seed.sql IDs exactly
const users = [
  { id: '92694f9d-0000-0000-0000-000000000000', email: 'aarav.sharma@sit.edu.in', name: 'Aarav Sharma' },
  { id: '92694f9e-0000-0000-0000-000000000000', email: 'priya.patel@sit.edu.in', name: 'Priya Patel' },
  { id: '92694f9f-0000-0000-0000-000000000000', email: 'rohan.kumar@sit.edu.in', name: 'Rohan Kumar' },
  { id: '92694fa0-0000-0000-0000-000000000000', email: 'ananya.gupta@sit.edu.in', name: 'Ananya Gupta' },
  { id: '92694fa1-0000-0000-0000-000000000000', email: 'vikram.singh@sit.edu.in', name: 'Vikram Singh' },
  { id: '92694fa2-0000-0000-0000-000000000000', email: 'meera.reddy@sit.edu.in', name: 'Meera Reddy' },
  { id: '92694fa3-0000-0000-0000-000000000000', email: 'arjun.nair@sit.edu.in', name: 'Arjun Nair' },
  { id: '92694fa4-0000-0000-0000-000000000000', email: 'kavya.joshi@sit.edu.in', name: 'Kavya Joshi' },
  { id: '7b266249-0000-0000-0000-000000000000', email: 'priya.mehta@sit.edu.in', name: 'Dr. Priya Mehta' },
  { id: '7b26624a-0000-0000-0000-000000000000', email: 'rajesh.kumar@sit.edu.in', name: 'Prof. Rajesh Kumar' },
  { id: '7b26624b-0000-0000-0000-000000000000', email: 'sunita.verma@sit.edu.in', name: 'Dr. Sunita Verma' },
  { id: '72ccf967-0000-0000-0000-000000000000', email: 'admin@sit.edu.in', name: 'System Administrator' },
];

async function seedAuth() {
  console.log('=== STEP 1: Clean up any orphaned public.users records ===');

  // Delete all public.users first (they reference auth.users via FK)
  const { error: delPublic } = await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delPublic) {
    console.log('Delete public.users result:', delPublic.message);
  } else {
    console.log('✅ Cleared public.users');
  }

  // Also clean related tables that reference users
  await supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('results').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('exam_attempts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✅ Cleared dependent tables');

  console.log('\n=== STEP 2: Delete existing auth users ===');
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  if (existingUsers?.users.length) {
    for (const u of existingUsers.users) {
      await supabase.auth.admin.deleteUser(u.id);
      console.log(`  Deleted auth user: ${u.email}`);
    }
  } else {
    console.log('  No existing auth users to delete');
  }

  console.log('\n=== STEP 3: Create auth users via Admin API ===');
  let successCount = 0;
  for (const user of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      id: user.id,
      email: user.email,
      password: 'password123',
      email_confirm: true,
      user_metadata: { name: user.name }
    });

    if (error) {
      console.error(`  ❌ ${user.email}: ${error.message}`);
    } else {
      console.log(`  ✅ ${user.email} (${data.user.id})`);
      successCount++;
    }
  }

  console.log(`\nCreated ${successCount}/${users.length} auth users.`);

  if (successCount === users.length) {
    console.log('\n=== STEP 4: Verify login ===');
    const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
      email: 'aarav.sharma@sit.edu.in',
      password: 'password123'
    });
    if (loginErr) {
      console.error('Login test FAILED:', loginErr.message);
    } else {
      console.log(`✅ LOGIN WORKS! Authenticated as: ${loginData.user?.email}`);
    }
  }

  console.log('\n=== STEP 5: Now run the rest of seed.sql (public.users, subjects, exams, etc.) ===');
  console.log('The auth.users section in seed.sql will be skipped (ON CONFLICT DO UPDATE).');
  console.log('But the public.users, subjects, exams, questions, etc. still need to be seeded via SQL Editor.');
}

seedAuth();
