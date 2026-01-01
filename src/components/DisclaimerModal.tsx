'use client';

import { useState, useEffect } from 'react';

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This pattern is acceptable for client-side only hydration
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mounted) {
      const hasSeenDisclaimer = localStorage.getItem('hasSeenDisclaimer');
      if (!hasSeenDisclaimer) {
        setIsOpen(true);
      }
    }
  }, [mounted]);

  const handleAccept = () => {
    localStorage.setItem('hasSeenDisclaimer', 'true');
    setIsOpen(false);
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Important Notice</h2>
        
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h3 className="font-bold text-lg mb-2">DEMONSTRATION SYSTEM ONLY</h3>
            <p>
              This is a non-functional demonstration prototype of the Rapid Response platform. 
              This system contains no real patient data and should not be used for actual 
              clinical purposes.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">HIPAA Compliance Notice</h3>
            <p>
              In a production environment, this system would be fully HIPAA compliant with:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>End-to-end encryption for all data transmission</li>
              <li>Encrypted data storage at rest</li>
              <li>Comprehensive audit logging</li>
              <li>Role-based access controls</li>
              <li>Secure authentication mechanisms</li>
              <li>Business Associate Agreements with all service providers</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Correctional Facility Compliance</h3>
            <p>
              Production deployment would include additional security measures specific to 
              correctional environments, including restricted device access, session monitoring, 
              and emergency termination capabilities.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="font-semibold">
              No Authentication: This demo uses simplified login for demonstration purposes only. 
              Production systems implement multi-factor authentication and secure session management.
            </p>
          </div>
        </div>

        <button
          onClick={handleAccept}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
        >
          I Understand - Continue to Demo
        </button>
      </div>
    </div>
  );
}