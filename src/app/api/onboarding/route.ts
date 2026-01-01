import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      inmate_id,
      mental_illnesses,
      medications,
      allergies,
      emergency_contact,
      additional_notes,
    } = body;

    // Create medical history
    const { error: medicalError } = await supabase
      .from('medical_history')
      .insert([
        {
          inmate_id,
          mental_illnesses,
          medications,
          allergies,
          emergency_contact,
          additional_notes,
        },
      ]);

    if (medicalError) throw medicalError;

    // Update inmate onboarding status
    const { error: updateError } = await supabase
      .from('inmates')
      .update({ is_onboarded: true })
      .eq('id', inmate_id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}