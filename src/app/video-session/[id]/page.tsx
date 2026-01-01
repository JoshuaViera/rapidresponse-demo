'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import VideoCall from '@/components/VideoCall';

export default function VideoSession({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [userRole, setUserRole] = useState<'therapist' | 'inmate' | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('userRole') as 'therapist' | 'inmate' | null;
    if (!role) {
      router.push('/');
      return;
    }
    setUserRole(role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEndCall = () => {
    if (userRole === 'therapist') {
      router.push('/therapist/dashboard');
    } else {
      router.push('/inmate/dashboard');
    }
  };

  const handleConsent = () => {
    setShowConsentModal(false);
  };

  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (showConsentModal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-opacity-95">
        <div className="bg-white rounded-lg max-w-2xl w-full p-8 m-4">
          <h2 className="text-2xl font-bold mb-4">Session Consent & Privacy Notice</h2>
          
          <div className="space-y-4 text-sm text-gray-700 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <h3 className="font-bold text-blue-900 mb-2">DEMONSTRATION NOTICE</h3>
              <p className="text-blue-800">
                This is a demonstration using your device camera. Production systems would use 
                HIPAA-compliant video platforms (Twilio Video or Daily.co) with end-to-end encryption.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Privacy & Security</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>This session would be encrypted in production</li>
                <li>All video streams would comply with HIPAA requirements</li>
                <li>Sessions would be logged for security and compliance</li>
                <li>Emergency termination controls would be available</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">Informed Consent</h3>
              <p>
                By proceeding, you acknowledge that in a production environment you would be 
                consenting to a telehealth session subject to all applicable privacy regulations.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleEndCall}
              className="flex-1 bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConsent}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <VideoCall
      appointmentId={resolvedParams.id}
      userRole={userRole}
      onEndCall={handleEndCall}
    />
  );
}