'use client';

import { useState, useEffect } from 'react';
import { getActiveGames, getParticipantByStaffIdAndLastName } from '@/lib/database';
import { ArrowLeft, RefreshCw, Database, Users, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

export default function DebugDatabasePage() {
  const [games, setGames] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const [testStaffId, setTestStaffId] = useState('');
  const [testLastName, setTestLastName] = useState('');
  const [testParticipant, setTestParticipant] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      console.log('🔍 Loading database data...');
      
      // Load games
      const activeGames = await getActiveGames();
      console.log('🎮 Games loaded:', activeGames);
      setGames(activeGames);
      
      // Load participants (we'll get a sample)
      // Note: This is just for debugging - in production you wouldn't load all participants
      setMessage(`✅ Loaded ${activeGames.length} games`);
      setMessageType('success');
      
    } catch (error) {
      console.error('❌ Error loading data:', error);
      setMessage('Failed to load data from database');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const testParticipantLookup = async () => {
    if (!testStaffId.trim() || !testLastName.trim()) {
      setMessage('Please enter both Staff ID and Last Name');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      console.log('🔍 Testing participant lookup:', { testStaffId, testLastName });
      const participant = await getParticipantByStaffIdAndLastName(testStaffId, testLastName);
      console.log('👤 Participant lookup result:', participant);
      setTestParticipant(participant);
      
      if (participant) {
        setMessage(`✅ Participant found: ${participant.staffId} ${participant.lastName}`);
        setMessageType('success');
      } else {
        setMessage('❌ No participant found with those details');
        setMessageType('error');
      }
    } catch (error) {
      console.error('❌ Error looking up participant:', error);
      setMessage('Error looking up participant');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Database Debug
          </h1>
          <p className="text-gray-600">
            Check what's in your database and test participant lookup
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Games Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Gamepad2 className="w-5 h-5 mr-2" />
                Active Games ({games.length})
              </h2>
              <button
                onClick={loadData}
                disabled={loading}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : games.length > 0 ? (
              <div className="space-y-3">
                {games.map((game) => (
                  <div key={game.id} className="border border-gray-200 rounded-lg p-3">
                    <h3 className="font-medium text-gray-900">{game.name}</h3>
                    <p className="text-sm text-gray-600">{game.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        game.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {game.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-gray-500">ID: {game.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Gamepad2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No active games found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try creating games through the Admin Panel or Setup Games page
                </p>
              </div>
            )}
          </div>

          {/* Participant Test Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
              <Users className="w-5 h-5 mr-2" />
              Test Participant Lookup
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Staff ID
                </label>
                <input
                  type="text"
                  value={testStaffId}
                  onChange={(e) => setTestStaffId(e.target.value)}
                  placeholder="Enter Staff ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={testLastName}
                  onChange={(e) => setTestLastName(e.target.value)}
                  placeholder="Enter Last Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={testParticipantLookup}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Looking up...' : 'Test Lookup'}
              </button>

              {testParticipant && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Participant Found!</h3>
                  <div className="text-sm text-green-700">
                    <p><strong>Staff ID:</strong> {testParticipant.staffId}</p>
                    <p><strong>Last Name:</strong> {testParticipant.lastName}</p>
                    <p><strong>Completed Games:</strong> {testParticipant.completedGames?.length || 0}</p>
                    <p><strong>Gift Redeemed:</strong> {testParticipant.giftRedeemed ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Database Connection Test */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
            <Database className="w-5 h-5 mr-2" />
            Database Connection Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{games.length}</div>
              <div className="text-sm text-gray-600">Active Games</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {games.length > 0 ? '✅' : '❌'}
              </div>
              <div className="text-sm text-gray-600">Games Available</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {testParticipant ? '✅' : '❓'}
              </div>
              <div className="text-sm text-gray-600">Participant Test</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
