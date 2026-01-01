'use client';

import { useState } from 'react';
import { Appointment } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/utils';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  userRole: 'therapist' | 'inmate';
  onScheduleNew?: () => void;
  onJoinSession?: (appointmentId: string) => void;
}

export default function AppointmentCalendar({
  appointments,
  userRole,
  onScheduleNew,
  onJoinSession,
}: AppointmentCalendarProps) {
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

  const now = new Date();
  const upcoming = appointments.filter(
    (apt) => new Date(apt.scheduled_date) > now && apt.status === 'scheduled'
  );
  const past = appointments.filter(
    (apt) => new Date(apt.scheduled_date) <= now || apt.status === 'completed'
  );

  const displayedAppointments = filter === 'upcoming' ? upcoming : past;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Appointments</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded ${
              filter === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded ${
              filter === 'past'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Past ({past.length})
          </button>
        </div>
      </div>

      <div className="p-4">
        {displayedAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No {filter} appointments</p>
            {userRole === 'inmate' && filter === 'upcoming' && onScheduleNew && (
              <button
                onClick={onScheduleNew}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Schedule Appointment
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayedAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-semibold">
                        {formatDate(appointment.scheduled_date)}
                      </span>
                      <span className="text-gray-600">
                        {formatTime(appointment.scheduled_date)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          appointment.status === 'scheduled'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {userRole === 'therapist' && appointment.inmate && (
                        <p>
                          Patient: {appointment.inmate.first_name}{' '}
                          {appointment.inmate.last_name} (DIN: {appointment.inmate.din_number})
                        </p>
                      )}
                      {userRole === 'inmate' && appointment.therapist && (
                        <p>
                          Therapist: Dr. {appointment.therapist.last_name}
                          {appointment.therapist.specialization && (
                            <span className="text-gray-500">
                              {' '}
                              - {appointment.therapist.specialization}
                            </span>
                          )}
                        </p>
                      )}
                      <p>Duration: {appointment.duration_minutes} minutes</p>
                    </div>
                    {appointment.notes && (
                      <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                        <strong>Notes:</strong> {appointment.notes}
                      </div>
                    )}
                  </div>
                  {appointment.status === 'scheduled' &&
                    filter === 'upcoming' &&
                    onJoinSession && (
                      <button
                        onClick={() => onJoinSession(appointment.id)}
                        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Join Session
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}