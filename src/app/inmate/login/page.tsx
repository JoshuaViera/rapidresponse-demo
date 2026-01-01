'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InmateLogin() {
  const router = useRouter();
  const [dinNumber, setDinNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: dinNumber,
          password,
          role: 'inmate',
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userRole', 'inmate');
        localStorage.setItem('userData', JSON.stringify(data.userData));

        // Check if onboarded
        if (data.userData.is_onboarded) {
          router.push('/inmate/dashboard');
        } else {
          router.push('/inmate/onboarding');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Patient Login</h1>
          <p className="text-gray-600 mt-2">Rapid Response Platform</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-6 text-sm">
          <p className="font-semibold text-blue-900 mb-1">Demo Credentials:</p>
          <p className="text-blue-800">DIN: 12345678</p>
          <p className="text-blue-800">Password: demo123</p>
          <p className="text-gray-600 text-xs mt-2">
            (Try 67890123 for onboarding demo)
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="din" className="block text-sm font-medium text-gray-700 mb-1">
              DIN Number
            </label>
            <input
              id="din"
              type="text"
              value={dinNumber}
              onChange={(e) => setDinNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="12345678"
              maxLength={8}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 font-medium disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}