import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('therapists')
      .select('id, first_name, last_name, specialization')
      .order('last_name', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Therapists fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch therapists' },
      { status: 500 }
    );
  }
}