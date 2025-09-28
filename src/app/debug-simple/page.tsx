'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DebugSimplePage() {
  const [message, setMessage] = useState('');

  const testConnection = async () => {
    setMessage('Testing connection...');
    
    try {
      // Simple test without complex imports
      const response = await fetch('/api/test', { method: 'GET' });
      if (response.ok) {
        setMessage('✅ Connection successful!');
      } else {
        setMessage('❌ Connection failed');
      }
    } catch (error) {
      setMessage('❌ Error: ' + error);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Simple Debug
          </h1>
          <p className="text-gray-600">
            Basic connection test
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <button
            onClick={testConnection}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
          >
            Test Connection
          </button>

          {message && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
