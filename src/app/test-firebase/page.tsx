'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function TestFirebasePage() {
  const [status, setStatus] = useState('Testing...');
  const [error, setError] = useState('');

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Test Firestore connection
        const testCollection = collection(db, 'test');
        await getDocs(testCollection);
        setStatus('✅ Firebase connection successful!');
      } catch (err: any) {
        setError(`❌ Firebase error: ${err.message}`);
        setStatus('❌ Firebase connection failed');
      }
    };

    testFirebase();
  }, []);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Firebase Connection Test
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Connection Status
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-medium text-blue-900">Status:</p>
              <p className="text-blue-700">{status}</p>
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-medium text-red-900">Error:</p>
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Environment Variables:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}</li>
                <li>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}</li>
                <li>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
