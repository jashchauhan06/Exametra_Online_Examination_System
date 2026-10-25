import { NextResponse } from 'next/server';
import { insforge, insforgeAdmin } from '@/lib/insforge';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const token = authHeader.replace('Bearer ', '');

    // Get current user profile
    const { data: profile, error: profileErr } = await insforgeAdmin
      .from('users')
      .select('role')
      .eq('id', token)
      .maybeSingle();

    // Also support token validation or direct admin role check
    const { email, password, name, role, department } = await req.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Create auth user in InsForge
    const signUpResult = await insforge.auth.signUp({
      email,
      password,
      name,
    });

    if (signUpResult.error) {
      return NextResponse.json({ error: signUpResult.error.message }, { status: 400 });
    }

    const newUserId = signUpResult.data?.user?.id;
    if (!newUserId) {
      return NextResponse.json({ error: 'Failed to retrieve created user ID' }, { status: 500 });
    }

    // 2. Insert into public.users
    const { error: dbError } = await insforgeAdmin.from('users').insert([{
      id: newUserId,
      email,
      name,
      role: role.toLowerCase(),
      department: department || 'General',
      is_active: true,
    }]);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: { id: newUserId, email, name, role },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
