'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Appointment, Therapist } from '@/lib/types';
import AppointmentCalendar from '@/components/AppointmentCalendar';

export default function TherapistDashboard() {
  const router = useRouter();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const userData = localStorage.getItem('userData');

    if (!userId || userRole !== 'therapist') {
      router.push('/therapist/login');
      return;
    }

    if (userData) {
      setTherapist(JSON.parse(userData));
    }

    fetchAppointments(userId);
  }, [router]);

  const fetchAppointments = async (userId: string) => {
    try {
      const response = await fetch(
        `/api/appointments?userId=${userId}&role=therapist`
      );
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = (appointmentId: string) => {
    router.push(`/video-session/${appointmentId}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Therapist Dashboard</h1>
            {therapist && (
              <p className="text-gray-600">
                Dr. {therapist.first_name} {therapist.last_name}
                {therapist.specialization && ` - ${therapist.specialization}`}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 text-sm font-medium">Total Appointments</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {appointments.length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 text-sm font-medium">Upcoming</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {
                  appointments.filter(
                    (a) => a.status === 'scheduled' && new Date(a.scheduled_date) > new Date()
                  ).length
                }
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 text-sm font-medium">Completed</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {appointments.filter((a) => a.status === 'completed').length}
              </p>
            </div>
          </div>

          {/* Appointments Calendar */}
          <AppointmentCalendar
            appointments={appointments}
            userRole="therapist"
            onJoinSession={handleJoinSession}
          />
        </div>
      </div>
    </div>
  );
}