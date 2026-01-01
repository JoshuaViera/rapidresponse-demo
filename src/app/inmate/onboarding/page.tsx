'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Inmate } from '@/lib/types';

export default function InmateOnboarding() {
  const router = useRouter();
  const [inmate, setInmate] = useState<Inmate | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mental_illnesses: [] as string[],
    medications: [] as string[],
    allergies: [] as string[],
    emergency_contact: '',
    additional_notes: '',
  });

  const [mentalIllnessInput, setMentalIllnessInput] = useState('');
  const [medicationInput, setMedicationInput] = useState('');
  const [allergyInput, setAllergyInput] = useState('');

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
      
      if (parsedData.is_onboarded) {
        router.push('/inmate/dashboard');
      }
    }
  }, [router]);

  const handleAddItem = (type: 'mental_illnesses' | 'medications' | 'allergies', value: string) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [type]: [...prev[type], value.trim()],
      }));
    }
  };

  const handleRemoveItem = (type: 'mental_illnesses' | 'medications' | 'allergies', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inmate_id: inmate?.id,
          ...formData,
        }),
      });

      if (response.ok) {
        // Update local storage
        const updatedInmate = { ...inmate, is_onboarded: true };
        localStorage.setItem('userData', JSON.stringify(updatedInmate));
        router.push('/inmate/dashboard');
      } else {
        alert('Failed to complete onboarding');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!inmate) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Intake</h1>
          <p className="text-gray-600 mb-6">
            Welcome, {inmate.first_name}. Please complete your medical history.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
            <p className="text-sm text-yellow-900">
              <strong>DEMO NOTE:</strong> In production, this information would be encrypted 
              and comply with HIPAA privacy regulations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mental Illnesses */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mental Health Conditions
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={mentalIllnessInput}
                  onChange={(e) => setMentalIllnessInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddItem('mental_illnesses', mentalIllnessInput);
                      setMentalIllnessInput('');
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Depression, Anxiety"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleAddItem('mental_illnesses', mentalIllnessInput);
                    setMentalIllnessInput('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.mental_illnesses.map((item, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('mental_illnesses', index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Medications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Medications
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={medicationInput}
                  onChange={(e) => setMedicationInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddItem('medications', medicationInput);
                      setMedicationInput('');
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Sertraline 50mg"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleAddItem('medications', medicationInput);
                    setMedicationInput('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.medications.map((item, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('medications', index)}
                      className="text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allergies
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddItem('allergies', allergyInput);
                      setAllergyInput('');
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Penicillin"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleAddItem('allergies', allergyInput);
                    setAllergyInput('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.allergies.map((item, index) => (
                  <span
                    key={index}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('allergies', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <label htmlFor="emergency" className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact
              </label>
              <input
                id="emergency"
                type="text"
                value={formData.emergency_contact}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, emergency_contact: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Name - Relationship - Phone Number"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                id="notes"
                value={formData.additional_notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, additional_notes: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={4}
                placeholder="Any other relevant medical or mental health information..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Complete Onboarding'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}