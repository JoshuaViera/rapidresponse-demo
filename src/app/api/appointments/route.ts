import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'Missing parameters' },
        { status: 400 }
      );
    }

    let query = supabase.from('appointments').select(`
      *,
      therapist:therapists(*),
      inmate:inmates(*)
    `);

    if (role === 'therapist') {
      query = query.eq('therapist_id', userId);
    } else if (role === 'inmate') {
      query = query.eq('inmate_id', userId);
    }

    const { data, error } = await query.order('scheduled_date', {
      ascending: true,
    });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Appointments fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { therapist_id, inmate_id, scheduled_date, duration_minutes } = body;

    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          therapist_id,
          inmate_id,
          scheduled_date,
          duration_minutes: duration_minutes || 60,
          status: 'scheduled',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Appointment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}