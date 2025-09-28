'use client';

import { useState } from 'react';
import { createGame, createGameHost } from '@/lib/database';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function SetupGamesPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const defaultGames = [
    { name: 'Treasure Hunt', description: 'Find hidden treasures around the venue' },
    { name: 'Photo Challenge', description: 'Take creative photos at designated spots' },
    { name: 'Quiz Station', description: 'Answer trivia questions about the event' },
    { name: 'Craft Workshop', description: 'Create something unique with provided materials' },
    { name: 'Dance Challenge', description: 'Learn and perform a fun dance routine' },
    { name: 'Memory Game', description: 'Test your memory with card matching' }
  ];

  const handleCreateDefaultGames = async () => {
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const createdGames = [];
      
      for (const gameData of defaultGames) {
        const gameId = await createGame({
          name: gameData.name,
          description: gameData.description,
          hostId: '', // Will be assigned later
          isActive: true,
        });
        
        // Create a default host for each game
        await createGameHost({
          name: `${gameData.name} Host`,
          gameId: gameId,
          isActive: true,
        });
        
        createdGames.push({ id: gameId, name: gameData.name });
      }

      setMessage(`✅ Successfully created ${createdGames.length} games with hosts!`);
      setMessageType('success');
    } catch (error) {
      setMessage('Failed to create games. Please try again.');
      setMessageType('error');
      console.error('Error creating games:', error);
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
            Setup Default Games
          </h1>
          <p className="text-gray-600">
            Create sample games for testing the Event Helper app
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Default Games to Create
          </h2>
          
          <div className="grid gap-3 mb-6">
            {defaultGames.map((game, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium text-gray-900">{game.name}</h3>
                <p className="text-sm text-gray-600">{game.description}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleCreateDefaultGames}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Plus className="w-5 h-5 mr-2" />
            )}
            {loading ? 'Creating Games...' : 'Create All Games'}
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
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">📝 Note</h3>
          <p className="text-yellow-700 text-sm">
            This will create 6 sample games with default hosts. You can modify or delete them later through the Admin Panel.
          </p>
        </div>
      </div>
    </div>
  );
}
