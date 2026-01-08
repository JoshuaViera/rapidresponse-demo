'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Inmate, Appointment, MedicalHistory, MedicationLog } from '@/lib/types';
import AppointmentCalendar from '@/components/AppointmentCalendar';
import CrisisButton from '@/components/CrisisButton';
import ScheduleAppointmentModal from '@/components/ScheduleAppointmentModal';
import { formatDateTime } from '@/lib/utils';

export default function InmateDashboard() {
  const router = useRouter();
  const [inmate, setInmate] = useState<Inmate | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null);
  const [medications, setMedications] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const userData = localStorage.getItem('userData');

    if (!userId || userRole !== 'inmate') {
      router.push('/inmate/login');
      return;
    }

    if (userData) {
      const parsedData = JSON.parse(userData);
      setInmate(parsedData);
      
      if (!parsedData.is_onboarded) {
        router.push('/inmate/onboarding');
        return;
      }
    }

    fetchData(userId);
  }, [router]);

  const fetchData = async (userId: string) => {
    try {
      // Fetch appointments
      const apptResponse = await fetch(
        `/api/appointments?userId=${userId}&role=inmate`
      );
      const apptData = await apptResponse.json();
      setAppointments(apptData);

      // Fetch inmate data
      const inmateResponse = await fetch(`/api/inmates?inmateId=${userId}`);
      const inmateData = await inmateResponse.json();
      setMedicalHistory(inmateData.medicalHistory);
      setMedications(inmateData.medications);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = (appointmentId: string) => {
    router.push(`/video-session/${appointmentId}`);
  };

  const handleScheduleSuccess = () => {
    // Refresh appointments after scheduling
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchData(userId);
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Patient Portal</h1>
            {inmate && (
              <p className="text-gray-600">
                {inmate.first_name} {inmate.last_name} - DIN: {inmate.din_number}
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

      {/* Crisis Support - Always Visible */}
      <div className="container mx-auto px-4 py-6">
        <CrisisButton
          inmateId={inmate?.id || ''}
          inmateName={inmate ? `${inmate.first_name} ${inmate.last_name}` : ''}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Schedule Appointment
            </button>
          </div>

          {/* Appointments */}
          <AppointmentCalendar
            appointments={appointments}
            userRole="inmate"
            onJoinSession={handleJoinSession}
          />

          {/* Medical History */}
          {medicalHistory && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Medical History</h3>
              </div>
              <div className="p-4 space-y-4">
                {medicalHistory.mental_illnesses && medicalHistory.mental_illnesses.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Conditions</h4>
                    <div className="flex flex-wrap gap-2">
                      {medicalHistory.mental_illnesses.map((illness, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {illness}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {medicalHistory.medications && medicalHistory.medications.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Prescribed Medications</h4>
                    <div className="flex flex-wrap gap-2">
                      {medicalHistory.medications.map((med, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {medicalHistory.allergies && medicalHistory.allergies.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Allergies</h4>
                    <div className="flex flex-wrap gap-2">
                      {medicalHistory.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Medication Log */}
          {medications && medications.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Recent Medication Administration</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {medications.map((med) => (
                    <div
                      key={med.id}
                      className="flex justify-between items-center border-b border-gray-100 pb-2"
                    >
                      <div>
                        <p className="font-medium">{med.medication_name}</p>
                        <p className="text-sm text-gray-600">
                          {med.dosage} - {formatDateTime(med.administered_at)}
                        </p>
                      </div>
                      {med.administered_by && (
                        <p className="text-sm text-gray-500">{med.administered_by}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && inmate && (
        <ScheduleAppointmentModal
          inmateId={inmate.id}
          onClose={() => setShowScheduleModal(false)}
          onSuccess={handleScheduleSuccess}
        />
      )}
    </div>
  );
}