'use client';

import { useState, useEffect } from 'react';
import { getActiveGames, getGames } from '@/lib/database';
import { ArrowLeft, RefreshCw, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

export default function DebugGamesPage() {
  const [activeGames, setActiveGames] = useState<any[]>([]);
  const [allGames, setAllGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadGames = async () => {
    setLoading(true);
    setMessage('');

    try {
      console.log('🔍 Loading games...');
      
      // Load active games
      const active = await getActiveGames();
      console.log('🎮 Active games:', active);
      setActiveGames(active);
      
      // Load all games
      const all = await getGames();
      console.log('🎮 All games:', all);
      setAllGames(all);
      
      setMessage(`✅ Loaded ${active.length} active games and ${all.length} total games`);
      
    } catch (error) {
      console.error('❌ Error loading games:', error);
      setMessage('Failed to load games: ' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
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
            Debug Games
          </h1>
          <p className="text-gray-600">
            Check what games are in your database
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('✅') 
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Games */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Gamepad2 className="w-5 h-5 mr-2" />
                Active Games ({activeGames.length})
              </h2>
              <button
                onClick={loadGames}
                disabled={loading}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                title="Refresh games"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : activeGames.length > 0 ? (
              <div className="space-y-3">
                {activeGames.map((game) => (
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
              </div>
            )}
          </div>

          {/* All Games */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
              <Gamepad2 className="w-5 h-5 mr-2" />
              All Games ({allGames.length})
            </h2>

            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : allGames.length > 0 ? (
              <div className="space-y-3">
                {allGames.map((game) => (
                  <div key={game.id} className="border border-gray-200 rounded-lg p-3">
                    <h3 className="font-medium text-gray-900">{game.name}</h3>
                    <p className="text-sm text-gray-600">{game.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        game.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {game.isActive ? 'Active' : 'No isActive field'}
                      </span>
                      <span className="text-xs text-gray-500">ID: {game.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Gamepad2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No games found</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{activeGames.length}</div>
              <div className="text-sm text-gray-600">Active Games</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">{allGames.length}</div>
              <div className="text-sm text-gray-600">Total Games</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {activeGames.length > 0 ? '✅' : '❌'}
              </div>
              <div className="text-sm text-gray-600">Progress Tracker Ready</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
