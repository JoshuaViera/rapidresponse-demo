'use client';

import { useWebcam } from '@/hooks/useWebcam';
import { useEffect } from 'react';

interface VideoCallProps {
  appointmentId: string;
  userRole: 'therapist' | 'inmate';
  onEndCall: () => void;
}

export default function VideoCall({ appointmentId, userRole, onEndCall }: VideoCallProps) {
  const { videoRef, isActive, error, startCamera, stopCamera } = useWebcam();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Therapy Session</h2>
          <p className="text-sm text-gray-400">Session ID: {appointmentId}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEndCall}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-medium"
          >
            End Call
          </button>
        </div>
      </div>

      {/* HIPAA Notice */}
      <div className="bg-yellow-900 text-yellow-100 px-4 py-2 text-sm text-center">
        <strong>DEMO:</strong> Production system would use HIPAA-compliant encrypted video (Twilio/Daily.co)
      </div>

      {/* Video Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <p className="text-red-400 mb-2">{error}</p>
                <button
                  onClick={startCamera}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Retry Camera Access
                </button>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
              {isActive && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  LIVE
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex justify-center gap-4">
        <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg">
          🎤 Mute
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg">
          📹 Stop Video
        </button>
        {userRole === 'therapist' && (
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg">
            📝 Notes
          </button>
        )}
      </div>

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}