'use client';

import { useState, useEffect } from 'react';
import { getParticipantByStaffIdAndLastName, getActiveGames } from '@/lib/database';
import { RefreshCw } from 'lucide-react';

interface ProgressTrackerProps {
  staffId: string;
  lastName: string;
}

export default function ProgressTracker({ staffId, lastName }: ProgressTrackerProps) {
  const [progress, setProgress] = useState({
    completed: 0,
    total: 0,
    completedGames: [] as string[]
  });
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [newlyCompleted, setNewlyCompleted] = useState<string[]>([]);
  const [cachedParticipant, setCachedParticipant] = useState<any>(null);
  const [cachedGames, setCachedGames] = useState<any[]>([]);
  const [cacheTimestamp, setCacheTimestamp] = useState<Date | null>(null);

  const fetchProgress = async (forceRefresh = false) => {
    if (!staffId || !lastName) return;
    
    // Check cache validity (5 minutes)
    const cacheValid = cacheTimestamp && 
      (Date.now() - cacheTimestamp.getTime()) < 5 * 60 * 1000;
    
    if (!forceRefresh && cacheValid && cachedParticipant && cachedGames.length > 0) {
      // Use cached data
      const newProgress = {
        completed: cachedParticipant.completedGames.length,
        total: cachedGames.length,
        completedGames: cachedParticipant.completedGames
      };
      setProgress(newProgress);
      setGames(cachedGames);
      setLoading(false);
      return;
    }
    
    try {
      // Fetch available games first
      const activeGames = await getActiveGames();
      setGames(activeGames);
      setCachedGames(activeGames);
      
      const participant = await getParticipantByStaffIdAndLastName(staffId, lastName);
      if (participant) {
        const newProgress = {
          completed: participant.completedGames.length,
          total: activeGames.length,
          completedGames: participant.completedGames
        };
        
        // Check if progress has increased (new game completed)
        if (newProgress.completed > progress.completed) {
          setLastUpdate(new Date());
          // Find newly completed games
          const newCompleted = newProgress.completedGames.filter(
            gameId => !progress.completedGames.includes(gameId)
          );
          setNewlyCompleted(newCompleted);
          // Clear the animation after 3 seconds
          setTimeout(() => setNewlyCompleted([]), 3000);
        }
        
        setProgress(newProgress);
        setCachedParticipant(participant);
        setCacheTimestamp(new Date());
      } else {
        setProgress({
          completed: 0,
          total: activeGames.length,
          completedGames: []
        });
        setCachedParticipant(null);
        setCacheTimestamp(new Date());
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
    
    // Refresh progress every 5 seconds for better performance
    const interval = setInterval(fetchProgress, 5000);
    return () => clearInterval(interval);
  }, [staffId, lastName, refreshKey]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  // Show message if no games are available
  if (progress.total === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Stamp Collection Progress
          </h3>
          <button
            onClick={() => {
              setRefreshKey(prev => prev + 1);
              fetchProgress(true); // Force refresh, bypass cache
            }}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            title="Refresh progress"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">🎮</div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            No Games Available
          </h4>
          <p className="text-gray-600 mb-4">
            There are no active games in the system yet.
          </p>
          <p className="text-sm text-gray-500">
            Please contact the event administrator to set up games.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          Stamp Collection Progress
        </h3>
        <button
          onClick={() => {
            setRefreshKey(prev => prev + 1);
            fetchProgress(true); // Force refresh, bypass cache
          }}
          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          title="Refresh progress"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{progress.completed}/{progress.total}</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Central Progress Display */}
      <div className="text-center mb-6">
        <div className="inline-block bg-blue-50 rounded-lg p-6">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {progress.completed} / {progress.total}
          </div>
          <div className="text-sm text-gray-600">Stamps Collected</div>
        </div>
      </div>

      {/* Progress Message */}
      {progress.completed < progress.total ? (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="text-blue-800 font-semibold text-center">
            Only {progress.total - progress.completed} more stamps to go!
          </div>
          <div className="text-blue-600 text-sm text-center mt-1">
            Keep collecting to earn your reward
          </div>
          {lastUpdate && (
            <div className="text-green-600 text-sm text-center mt-2 font-semibold">
              ✅ Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <div className="text-green-800 font-semibold text-center">
            🎉 Congratulations! You've collected all stamps!
          </div>
          <div className="text-green-600 text-sm text-center mt-1">
            Visit the Gift Corner to claim your reward
          </div>
          {lastUpdate && (
            <div className="text-green-600 text-sm text-center mt-2 font-semibold">
              ✅ Completed at: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}

        {/* Stamp Grid */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            Your Booth Stamp Collection
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            Visit all {progress.total} booths to collect unique stamps and unlock your reward.
          </p>
          
          <div className={`grid gap-4 ${progress.total <= 3 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {games.map((game, index) => {
              const isCompleted = progress.completedGames.includes(game.id);
              const isNewlyCompleted = newlyCompleted.includes(game.id);
              const boothNumber = index + 1;
              
              // Define icons for each game
              const icons = ['⭐', '🏁', '🏆', '❤️', '💎', '👑', '🎯', '🎪', '🎨', '🎭'];
              const icon = icons[index] || '🎮';
              
              return (
                <div 
                  key={game.id}
                  className={`border-2 border-dashed rounded-lg p-4 text-center relative transition-all duration-500 ${
                    isCompleted 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 bg-gray-50'
                  } ${
                    isNewlyCompleted 
                      ? 'animate-pulse bg-green-100 border-green-500 shadow-lg scale-105' 
                      : ''
                  }`}
                >
                  <div className="text-xs text-gray-500 absolute top-1 right-1">
                    B{boothNumber}
                  </div>
                  {isNewlyCompleted && (
                    <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full font-bold animate-bounce">
                      NEW!
                    </div>
                  )}
                  <div className="mt-2">
                    {isCompleted ? (
                      <div className="text-2xl">{icon}</div>
                    ) : (
                      <div className="text-2xl text-gray-400">{icon}</div>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mt-1 truncate">
                    {game.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      {/* Progress Labels */}
      <div className="flex justify-between text-sm text-gray-500">
        <span>Start</span>
        <span>{percentage}%</span>
        <span>Reward</span>
      </div>
    </div>
  );
}
