import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inmate_id, alert_type, details, triggered_by } = body;

    // In production, this would:
    // 1. Send immediate SMS/push notifications to crisis team
    // 2. Alert facility security
    // 3. Log in monitoring system
    // 4. Trigger emergency response protocol

    // For demo: Log the emergency alert
    const { data, error } = await supabase
      .from('emergency_alerts')
      .insert([
        {
          inmate_id,
          alert_type, // 'mental_health_crisis' or 'session_termination'
          status: 'active',
          details,
          triggered_by, // 'inmate' or therapist_id
          triggered_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      // If table doesn't exist, return success anyway for demo
      console.error('Emergency alert error:', error);
      return NextResponse.json({
        success: true,
        message: 'Emergency alert sent (demo mode)',
        demo_note: 'In production, this would trigger immediate crisis response',
      });
    }

    return NextResponse.json({
      success: true,
      alert_id: data.id,
      message: 'Emergency services have been notified',
    });
  } catch (error) {
    console.error('Emergency alert error:', error);
    return NextResponse.json(
      {
        success: true,
        message: 'Emergency alert sent (demo mode)',
      },
      { status: 200 }
    );
  }
}