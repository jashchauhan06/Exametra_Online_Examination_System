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
    const { facultyId, title, message, type } = await request.json();

    if (!facultyId || !title || !message) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: facultyId,
        title,
        message,
        type: type || 'exam-violation',
        is_read: false
      });
      
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Notify faculty error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
