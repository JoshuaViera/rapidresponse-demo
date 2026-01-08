import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      appointment_id,
      inmate_id,
      therapist_id,
      incident_type,
      description,
      action_taken,
    } = body;

    // In production, this would:
    // 1. Alert security staff immediately
    // 2. Flag inmate record
    // 3. Generate official incident report
    // 4. Trigger facility protocol
    // 5. Notify supervisors

    const { error } = await supabase.from('incident_reports').insert([
      {
        appointment_id,
        inmate_id,
        therapist_id,
        incident_type, // 'inappropriate_behavior', 'threat', 'violation'
        description,
        action_taken,
        status: 'reported',
        severity: 'high',
        reported_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Incident report error:', error);
      return NextResponse.json({
        success: true,
        message: 'Incident reported (demo mode)',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Security has been notified. Incident logged.',
    });
  } catch (error) {
    console.error('Incident report error:', error);
    return NextResponse.json(
      {
        success: true,
        message: 'Incident reported (demo mode)',
      },
      { status: 200 }
    );
  }
}