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
    const { assignmentId, title, facultyId, deadline } = await request.json();

    if (!title || !facultyId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Fetch all students to notify them
    const { data: students, error: studentError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('role', 'student');

    if (studentError) {
      console.error('Failed to fetch students:', studentError);
    }

    const notifications = [];

    // Notification for Faculty
    notifications.push({
      user_id: facultyId,
      title: 'Assignment Created Successfully',
      message: `Your assignment "${title}" has been created with deadline ${new Date(deadline).toLocaleDateString()}.`,
      type: 'system',
      is_read: false,
      link: `/assignments/${assignmentId}`
    });

    // Notifications for Students
    if (students && students.length > 0) {
      students.forEach(student => {
        notifications.push({
          user_id: student.id,
          title: 'New Assignment',
          message: `A new assignment "${title}" has been posted. Due: ${new Date(deadline).toLocaleDateString()}.`,
          type: 'system',
          is_read: false,
          link: `/assignments/${assignmentId}`
        });
      });
    }

    const { error: insertError } = await supabaseAdmin
      .from('notifications')
      .insert(notifications);

    if (insertError) throw insertError;

    return NextResponse.json({ success: true, count: notifications.length });
  } catch (error: any) {
    console.error('Broadcast notification error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
