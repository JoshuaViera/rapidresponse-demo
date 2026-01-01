import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
            RR
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Rapid Response</h1>
          <p className="text-gray-600">Secure Telehealth Platform</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/therapist/login"
            className="block w-80 mx-auto bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 font-medium text-lg"
          >
            Therapist Login
          </Link>
          <Link
            href="/inmate/login"
            className="block w-80 mx-auto bg-gray-700 text-white py-4 rounded-lg hover:bg-gray-800 font-medium text-lg"
          >
            Patient Login
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Demo System - No Real Authentication
        </p>
      </div>
    </div>
  );
}