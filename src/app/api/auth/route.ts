import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AuthResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { identifier, password, role } = await request.json();

    if (!identifier || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'Missing credentials' } as AuthResponse,
        { status: 400 }
      );
    }

    if (role === 'therapist') {
      // Therapist login via email
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .eq('email', identifier)
        .eq('password', password)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { success: false, error: 'Invalid credentials' } as AuthResponse,
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        role: 'therapist',
        userId: data.id,
        userData: data,
      } as AuthResponse);
    } else if (role === 'inmate') {
      // Inmate login via DIN number
      const { data, error } = await supabase
        .from('inmates')
        .select('*')
        .eq('din_number', identifier)
        .eq('password', password)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { success: false, error: 'Invalid credentials' } as AuthResponse,
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        role: 'inmate',
        userId: data.id,
        userData: data,
      } as AuthResponse);
    }

    return NextResponse.json(
      { success: false, error: 'Invalid role' } as AuthResponse,
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' } as AuthResponse,
      { status: 500 }
    );
  }
}