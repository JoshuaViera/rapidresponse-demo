import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const inmateId = searchParams.get('inmateId');

    if (!inmateId) {
      return NextResponse.json({ error: 'Missing inmate ID' }, { status: 400 });
    }

    // Get inmate data
    const { data: inmate, error: inmateError } = await supabase
      .from('inmates')
      .select('*')
      .eq('id', inmateId)
      .single();

    if (inmateError) throw inmateError;

    // Get medical history
    const { data: medicalHistory, error: medicalError } = await supabase
      .from('medical_history')
      .select('*')
      .eq('inmate_id', inmateId)
      .single();

    if (medicalError && medicalError.code !== 'PGRST116') {
      // PGRST116 is "no rows returned"
      throw medicalError;
    }

    // Get medication logs
    const { data: medications, error: medsError } = await supabase
      .from('medication_logs')
      .select('*')
      .eq('inmate_id', inmateId)
      .order('administered_at', { ascending: false })
      .limit(10);

    if (medsError) throw medsError;

    return NextResponse.json({
      inmate,
      medicalHistory,
      medications,
    });
  } catch (error) {
    console.error('Inmate data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inmate data' },
      { status: 500 }
    );
  }
}