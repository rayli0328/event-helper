'use client';

import { useState, useEffect } from 'react';
import { createGame, getGames, createGameHost, getGameHosts } from '@/lib/database';
import { Game, GameHost } from '@/types';
import { ArrowLeft, Plus, Settings, Users } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [hosts, setHosts] = useState<GameHost[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [activeTab, setActiveTab] = useState<'games' | 'hosts'>('games');

  // Game form state
  const [gameForm, setGameForm] = useState({
    name: '',
    description: '',
    hostId: '',
  });

  // Host form state
  const [hostForm, setHostForm] = useState({
    name: '',
    gameId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [gamesData, hostsData] = await Promise.all([
        getGames(),
        getGameHosts(),
      ]);
      setGames(gamesData);
      setHosts(hostsData);
    } catch (error) {
      setMessage('Failed to load data');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createGame({
        name: gameForm.name,
        description: gameForm.description,
        hostId: gameForm.hostId,
        isActive: true,
      });
      setMessage('Game created successfully!');
      setMessageType('success');
      setGameForm({ name: '', description: '', hostId: '' });
      loadData();
    } catch (error) {
      setMessage('Failed to create game');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createGameHost({
        name: hostForm.name,
        gameId: hostForm.gameId,
        isActive: true,
      });
      setMessage('Game host created successfully!');
      setMessageType('success');
      setHostForm({ name: '', gameId: '' });
      loadData();
    } catch (error) {
      setMessage('Failed to create game host');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

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
            Admin Panel
          </h1>
          <p className="text-gray-600">
            Manage games, hosts, and view system analytics
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('games')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'games'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="w-5 h-5 inline mr-2" />
              Games
            </button>
            <button
              onClick={() => setActiveTab('hosts')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'hosts'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Game Hosts
            </button>
          </div>
        </div>

        {/* Games Tab */}
        {activeTab === 'games' && (
          <div className="space-y-6">
            {/* Create Game Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Create New Game
              </h2>
              <form onSubmit={handleCreateGame} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Game Name
                  </label>
                  <input
                    type="text"
                    value={gameForm.name}
                    onChange={(e) => setGameForm({ ...gameForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter game name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={gameForm.description}
                    onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter game description"
                    rows={3}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Create Game
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Games List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Existing Games
              </h2>
              <div className="space-y-3">
                {games.map((game) => (
                  <div key={game.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{game.name}</h3>
                        <p className="text-sm text-gray-600">{game.description}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          game.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {game.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hosts Tab */}
        {activeTab === 'hosts' && (
          <div className="space-y-6">
            {/* Create Host Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Create New Game Host
              </h2>
              <form onSubmit={handleCreateHost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Host Name
                  </label>
                  <input
                    type="text"
                    value={hostForm.name}
                    onChange={(e) => setHostForm({ ...hostForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter host name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to Game
                  </label>
                  <select
                    value={hostForm.gameId}
                    onChange={(e) => setHostForm({ ...hostForm, gameId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a game...</option>
                    {games.map((game) => (
                      <option key={game.id} value={game.id}>
                        {game.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Create Host
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Hosts List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Game Hosts
              </h2>
              <div className="space-y-3">
                {hosts.map((host) => {
                  const game = games.find(g => g.id === host.gameId);
                  return (
                    <div key={host.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{host.name}</h3>
                          <p className="text-sm text-gray-600">
                            Assigned to: {game?.name || 'Unknown Game'}
                          </p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            host.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {host.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {message && (
          <div className={`p-4 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
