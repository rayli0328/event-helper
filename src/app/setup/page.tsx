'use client';

import { useState } from 'react';
import { initializeSampleData } from '@/lib/setup';
import { ArrowLeft, Database, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleInitialize = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const success = await initializeSampleData();
      if (success) {
        setMessage('Sample data initialized successfully! You can now use the app.');
        setMessageType('success');
      } else {
        setMessage('Failed to initialize sample data. Check your Firebase configuration.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error initializing sample data. Make sure Firebase is properly configured.');
      setMessageType('error');
      console.error('Setup error:', error);
    } finally {
      setLoading(false);
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
            Database Setup
          </h1>
          <p className="text-gray-600">
            Initialize your database with sample games and hosts
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <Database className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Initialize Sample Data
            </h2>
            <p className="text-gray-600">
              This will create 6 sample games and assign hosts to each game.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="font-medium text-gray-900">What will be created:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                6 Sample Games (Treasure Hunt, Photo Challenge, Quiz Master, etc.)
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                6 Game Hosts assigned to each game
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                All games set as active and ready to use
              </li>
            </ul>
          </div>

          <button
            onClick={handleInitialize}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Database className="w-5 h-5 mr-2" />
                Initialize Database
              </>
            )}
          </button>

          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              messageType === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Before running setup:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Make sure your Firebase project is created</li>
              <li>• Firestore database is enabled</li>
              <li>• Environment variables are configured in .env.local</li>
              <li>• Dependencies are installed (npm install)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
