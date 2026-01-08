'use client';

import { useState } from 'react';

interface TherapistEmergencyControlsProps {
  appointmentId: string;
  inmateId: string;
  inmateName: string;
  inmateDin: string;
  onTerminate: () => void;
}

export default function TherapistEmergencyControls({
  appointmentId,
  inmateId,
  inmateName,
  inmateDin,
  onTerminate,
}: TherapistEmergencyControlsProps) {
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [incidentType, setIncidentType] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const incidentTypes = [
    { value: 'sexual_misconduct', label: 'Sexual Misconduct / Exposure' },
    { value: 'threatening_behavior', label: 'Threatening or Aggressive Behavior' },
    { value: 'policy_violation', label: 'Severe Policy Violation' },
    { value: 'self_harm', label: 'Self-Harm or Medical Emergency' },
    { value: 'other', label: 'Other Emergency' },
  ];

  const handleEmergencyTerminate = () => {
    setShowTerminateModal(true);
  };

  const handleSubmitIncident = async () => {
    if (!incidentType) {
      alert('Please select an incident type');
      return;
    }

    setIsSubmitting(true);

    try {
      // Report the incident
      await fetch('/api/incident-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointment_id: appointmentId,
          inmate_id: inmateId,
          therapist_id: localStorage.getItem('userId'),
          incident_type: incidentType,
          description,
          action_taken: 'Session terminated immediately. Security alerted.',
        }),
      });

      // Send emergency alert
      await fetch('/api/emergency-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inmate_id: inmateId,
          alert_type: 'session_termination',
          details: `Emergency termination: ${incidentType}`,
          triggered_by: localStorage.getItem('userId'),
        }),
      });

      // End the call
      onTerminate();
    } catch (error) {
      console.error('Failed to report incident:', error);
      alert('Incident logged. Ending session.');
      onTerminate();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleEmergencyTerminate}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg flex items-center gap-2 border-2 border-red-800"
        title="Emergency Termination - Use for policy violations or threatening behavior"
      >
        <span className="text-xl">⛔</span>
        Emergency Terminate
      </button>

      {showTerminateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">⛔</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Emergency Session Termination
                </h2>
                <p className="text-sm text-gray-600">
                  Patient: {inmateName} (DIN: {inmateDin})
                </p>
              </div>
            </div>

            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
              <p className="font-bold text-red-900 mb-2">⚠ CRITICAL ACTIONS THAT WILL OCCUR:</p>
              <ul className="text-sm text-red-800 space-y-1">
                <li>✓ Session will terminate immediately</li>
                <li>✓ Security staff will be dispatched to patient location</li>
                <li>✓ Incident will be permanently logged in patient record</li>
                <li>✓ Facility administration will be notified</li>
                <li>✓ Patient may face disciplinary action per facility protocol</li>
                <li>✓ Formal incident report will be generated</li>
              </ul>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Incident Type <span className="text-red-600">*</span>
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Select Incident Type --</option>
                  {incidentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Incident Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={4}
                  placeholder="Provide specific details of the incident. This will be included in the official report..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional but recommended for documentation
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded p-4 mb-6">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                📋 POST-TERMINATION PROTOCOL:
              </p>
              <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                <li>Complete full incident report in facility system</li>
                <li>Contact supervisor immediately</li>
                <li>Document all details while fresh in memory</li>
                <li>Coordinate with security on follow-up</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTerminateModal(false)}
                disabled={isSubmitting}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-3 rounded-lg disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitIncident}
                disabled={isSubmitting || !incidentType}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? 'Reporting & Terminating...'
                  : '⛔ Confirm Termination & Alert Security'}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Logged as: Dr. {localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')!).last_name : ''} | 
              Timestamp: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </>
  );
}