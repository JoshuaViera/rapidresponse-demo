export interface Therapist {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  license_number: string | null;
  specialization: string | null;
  created_at: string;
}

export interface Inmate {
  id: string;
  din_number: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  facility: string | null;
  is_onboarded: boolean;
  created_at: string;
}

export interface MedicalHistory {
  id: string;
  inmate_id: string;
  mental_illnesses: string[];
  medications: string[];
  allergies: string[];
  emergency_contact: string | null;
  additional_notes: string | null;
  created_at: string;
}

export interface Appointment {
  id: string;
  therapist_id: string;
  inmate_id: string;
  scheduled_date: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  therapist?: Therapist;
  inmate?: Inmate;
}

export interface MedicationLog {
  id: string;
  inmate_id: string;
  medication_name: string;
  dosage: string;
  administered_at: string;
  administered_by: string | null;
  created_at: string;
}

export type UserRole = 'therapist' | 'inmate';

export interface AuthResponse {
  success: boolean;
  role?: UserRole;
  userId?: string;
  userData?: Therapist | Inmate;
  error?: string;
}