'use client';

import { useState, useEffect } from 'react';
import { createGame, getGames, createGameHost, getGameHosts, deleteGame } from '@/lib/database';
import { Game, GameHost } from '@/types';
import { ArrowLeft, Plus, Settings, Users, Trash2, Database, QrCode, Gamepad2, BarChart3, Download } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useConfig } from '@/contexts/ConfigContext';
import { getParticipantReport } from '@/lib/database';
import { exportParticipantReport } from '@/lib/excelExport';

function AdminPageContent() {
  const { eventName, eventDescription, updateConfig } = useConfig();
  const [games, setGames] = useState<Game[]>([]);
  const [hosts, setHosts] = useState<GameHost[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [activeTab, setActiveTab] = useState<'games' | 'hosts' | 'config' | 'debug' | 'reports'>('games');

  // Game form state
  const [gameForm, setGameForm] = useState({
    name: '',
    description: '',
    hostId: '',
  });

  // Local configuration state for form
  const [configForm, setConfigForm] = useState({
    eventName: eventName,
    eventDescription: eventDescription,
  });

  // Report state
  const [reportData, setReportData] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);

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

  const handleDeleteGame = async (gameId: string, gameName: string) => {
    if (!confirm(`Are you sure you want to delete "${gameName}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      await deleteGame(gameId);
      setMessage(`Game "${gameName}" deleted successfully!`);
      setMessageType('success');
      loadData();
    } catch (error) {
      setMessage('Failed to delete game');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const loadReport = async () => {
    try {
      setReportLoading(true);
      const data = await getParticipantReport();
      setReportData(data);
    } catch (error) {
      setMessage('Error loading report. Please try again.');
      setMessageType('error');
    } finally {
      setReportLoading(false);
    }
  };

  const handleExportReport = () => {
    if (reportData) {
      exportParticipantReport(reportData);
      setMessage('Report exported successfully!');
      setMessageType('success');
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
            <button
              onClick={() => setActiveTab('config')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'config'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="w-5 h-5 inline mr-2" />
              Configuration
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'reports'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-5 h-5 inline mr-2" />
              Reports
            </button>
            <button
              onClick={() => setActiveTab('debug')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'debug'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Database className="w-5 h-5 inline mr-2" />
              Debug Tools
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
                      <div className="flex-1">
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
                      <button
                        onClick={() => handleDeleteGame(game.id, game.name)}
                        disabled={loading}
                        className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete game"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

        {/* Configuration Tab */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Event Configuration
              </h2>
              <p className="text-gray-600 mb-6">
                Configure the event name and description that appears throughout the system
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    value={configForm.eventName}
                    onChange={(e) => setConfigForm({ ...configForm, eventName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event name"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This will appear in the "Welcome to [Event Name]" message
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Description
                  </label>
                  <input
                    type="text"
                    value={configForm.eventDescription}
                    onChange={(e) => setConfigForm({ ...configForm, eventDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event description"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This will appear as the subtitle on the participant page
                  </p>
                </div>

                <button
                  onClick={async () => {
                    try {
                      setLoading(true);
                      await updateConfig(configForm.eventName, configForm.eventDescription);
                      setMessage('Configuration saved successfully!');
                      setMessageType('success');
                    } catch (error) {
                      setMessage('Error saving configuration. Please try again.');
                      setMessageType('error');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">RBAC Configuration</h3>
              <div className="text-sm text-yellow-700 space-y-2">
                <p><strong>Role-Based Access Control (RBAC) is configured in the code:</strong></p>
                <p>• <strong>Admin:</strong> Email contains "admin" or "manager"</p>
                <p>• <strong>Game Host:</strong> Email contains "host", "staff", or "admin"</p>
                <p>• <strong>Gift Corner:</strong> Email contains "gift", "staff", or "admin"</p>
                <p className="mt-2 text-xs">To modify RBAC rules, edit the <code>hasRole</code> function in <code>src/contexts/AuthContext.tsx</code></p>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Participant Activity Report</h2>
                <div className="flex gap-3">
                  <button
                    onClick={loadReport}
                    disabled={reportLoading}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    {reportLoading ? 'Loading...' : 'Load Report'}
                  </button>
                  {reportData && (
                    <button
                      onClick={handleExportReport}
                      className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export Excel
                    </button>
                  )}
                </div>
              </div>

              {reportData && (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">{reportData.summary.totalParticipants}</div>
                      <div className="text-sm text-blue-800">Total Participants</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">{reportData.summary.totalGames}</div>
                      <div className="text-sm text-green-800">Total Games</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-600">{reportData.summary.participantsWithGifts}</div>
                      <div className="text-sm text-purple-800">Gifts Redeemed</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-orange-600">{reportData.summary.averageCompletion}%</div>
                      <div className="text-sm text-orange-800">Avg Completion</div>
                    </div>
                  </div>

                  {/* Participants Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gift Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reportData.participants.map((participant: any, index: number) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{participant.staffId}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{participant.lastName}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {participant.createdAt.toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${participant.completionPercentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-gray-600">{participant.completionPercentage}%</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {participant.completedGames}/{participant.totalGames} games
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {participant.giftRedeemed ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Redeemed
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Not Redeemed
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {!reportData && !reportLoading && (
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Report Data</h3>
                  <p className="text-gray-500 mb-4">Click "Load Report" to generate participant activity data</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Debug Tools Tab */}
        {activeTab === 'debug' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Debug Tools
              </h2>
              <p className="text-gray-600 mb-6">
                Development and debugging utilities for system maintenance
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link 
                  href="/setup"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center mb-2">
                    <Database className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Database Setup</h3>
                  </div>
                  <p className="text-sm text-gray-600">First-time database initialization</p>
                </Link>

                <Link 
                  href="/setup-games"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center mb-2">
                    <Plus className="w-5 h-5 text-orange-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Setup Default Games</h3>
                  </div>
                  <p className="text-sm text-gray-600">Create sample games for testing</p>
                </Link>

                <Link 
                  href="/test-qr"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center mb-2">
                    <QrCode className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Test QR Generator</h3>
                  </div>
                  <p className="text-sm text-gray-600">Test QR code generation</p>
                </Link>

                <Link 
                  href="/debug-json"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center mb-2">
                    <QrCode className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="font-medium text-gray-900">JSON Data Debug</h3>
                  </div>
                  <p className="text-sm text-gray-600">Debug JSON data format</p>
                </Link>

                <Link 
                  href="/debug-simple"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center mb-2">
                    <Database className="w-5 h-5 text-indigo-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Simple Debug</h3>
                  </div>
                  <p className="text-sm text-gray-600">Basic connection testing</p>
                </Link>

                <Link 
                  href="/debug-games"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center mb-2">
                    <Gamepad2 className="w-5 h-5 text-orange-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Debug Games</h3>
                  </div>
                  <p className="text-sm text-gray-600">Inspect games database</p>
                </Link>
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

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminPageContent />
    </ProtectedRoute>
  );
}
