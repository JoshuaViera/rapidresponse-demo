'use client';

import { useState } from 'react';

interface CrisisButtonProps {
  inmateId: string;
  inmateName: string;
}

export default function CrisisButton({ inmateId, inmateName }: CrisisButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const handleEmergencyClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/emergency-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inmate_id: inmateId,
          alert_type: 'mental_health_crisis',
          details: 'Inmate activated emergency crisis button',
          triggered_by: 'inmate',
        }),
      });

      if (response.ok) {
        setAlertSent(true);
      }
    } catch (error) {
      console.error('Failed to send alert:', error);
      alert('Unable to send alert. Please notify staff immediately.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  if (alertSent) {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">✓</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-900">Help is On the Way</h3>
            <p className="text-green-800">Crisis team has been notified</p>
          </div>
        </div>
        <p className="text-sm text-green-700 mb-3">
          A mental health professional and facility staff have been alerted to your location.
          Someone will be with you shortly.
        </p>
        <div className="bg-white border border-green-300 rounded p-3 text-sm">
          <p className="font-semibold text-green-900 mb-2">While you wait:</p>
          <ul className="space-y-1 text-green-800">
            <li>• Stay in your current location</li>
            <li>• Try to stay calm and breathe slowly</li>
            <li>• Staff will arrive within minutes</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-2xl">⚠</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-900">Crisis Support</h3>
            <p className="text-red-700">24/7 Emergency Mental Health Assistance</p>
          </div>
        </div>
        
        <p className="text-sm text-red-800 mb-4">
          If you are experiencing suicidal thoughts, severe distress, or need immediate mental
          health support, press the button below. A crisis response team will be notified
          immediately.
        </p>

        <button
          onClick={handleEmergencyClick}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg text-lg shadow-lg transform transition hover:scale-105"
        >
          🆘 I Need Help Now
        </button>

        <div className="mt-4 text-xs text-red-600 bg-red-100 border border-red-300 rounded p-2">
          <strong>Important:</strong> This alerts crisis staff immediately. Use only for genuine
          emergencies.
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-3xl">⚠</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Confirm Emergency Alert
              </h2>
              <p className="text-gray-700">
                You are about to activate the crisis response system.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded p-4 mb-6">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                When you press &ldquo;Send Alert&rdquo;:
              </p>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>✓ Crisis mental health team will be notified immediately</li>
                <li>✓ Facility security will be dispatched to your location</li>
                <li>✓ A mental health professional will respond urgently</li>
                <li>✓ This action cannot be undone</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-300 rounded p-3 mb-6">
              <p className="text-sm font-bold text-red-900 mb-1">
                ⚠ THIS IS FOR REAL EMERGENCIES ONLY
              </p>
              <p className="text-xs text-red-700">
                False alarms may result in disciplinary action and could delay response to actual
                emergencies.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Alerting Crisis Team...' : '🆘 Yes, Send Emergency Alert'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSubmitting}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-3 rounded-lg disabled:opacity-50"
              >
                Cancel - I&apos;m Okay
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Patient: {inmateName} | Alert will be logged with timestamp
            </p>
          </div>
        </div>
      )}
    </>
  );
}