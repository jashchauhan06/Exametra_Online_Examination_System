import { NextResponse } from 'next/server';
import { insforgeAdmin } from '@/lib/insforge';

export async function POST(request: Request) {
  try {
    const { facultyId, title, message, type } = await request.json();

    if (!facultyId || !title || !message) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const { error } = await insforgeAdmin
      .from('notifications')
      .insert([{
        user_id: facultyId,
        title,
        message,
        type: type || 'exam-violation',
        is_read: false,
      }]);
      
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Notify faculty error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
