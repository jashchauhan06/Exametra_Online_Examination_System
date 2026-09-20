import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
});

export async function POST(request: Request) {
  try {
    const { assignmentId, title, facultyId, studentName, studentId } = await request.json();

    if (!assignmentId || !facultyId || !studentName) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const notifications = [{
      user_id: facultyId,
      title: 'New Assignment Submission',
      message: `${studentName} has submitted their response for "${title}".`,
      type: 'system',
      is_read: false,
      link: `/assignments/${assignmentId}`
    }];

    const { error: insertError } = await supabaseAdmin
      .from('notifications')
      .insert(notifications);

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Submission notification error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
