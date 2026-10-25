import { NextResponse } from 'next/server';
import { insforgeAdmin } from '@/lib/insforge';

export async function POST(request: Request) {
  try {
    const { id, userId, all } = await request.json();

    if (all && userId) {
      const { error } = await insforgeAdmin
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);
        
      if (error) throw error;
      return NextResponse.json({ success: true });
    }
    
    if (id) {
      const { error } = await insforgeAdmin
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
        
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
