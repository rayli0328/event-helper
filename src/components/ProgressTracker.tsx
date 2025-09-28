'use client';

import { useState, useEffect } from 'react';
import { getParticipantByStaffId } from '@/lib/database';

interface ProgressTrackerProps {
  staffId: string;
  lastName: string;
}

export default function ProgressTracker({ staffId, lastName }: ProgressTrackerProps) {
  const [progress, setProgress] = useState({
    completed: 0,
    total: 6,
    completedGames: [] as string[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!staffId || !lastName) return;
      
      try {
        const participant = await getParticipantByStaffId(staffId);
        if (participant) {
          setProgress({
            completed: participant.completedGames.length,
            total: 6,
            completedGames: participant.completedGames
          });
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
    
    // Refresh progress every 5 seconds
    const interval = setInterval(fetchProgress, 5000);
    return () => clearInterval(interval);
  }, [staffId, lastName]);

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

  const percentage = Math.round((progress.completed / progress.total) * 100);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
        Stamp Collection Progress
      </h3>
      
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
        </div>
      ) : (
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <div className="text-green-800 font-semibold text-center">
            🎉 Congratulations! You've collected all stamps!
          </div>
          <div className="text-green-600 text-sm text-center mt-1">
            Visit the Gift Corner to claim your reward
          </div>
        </div>
      )}

      {/* Stamp Grid */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          Your Booth Stamp Collection
        </h4>
        <p className="text-gray-600 text-sm mb-4">
          Visit all 6 booths to collect unique stamps and unlock your reward.
        </p>
        
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }, (_, index) => {
            const boothNumber = index + 1;
            const isCompleted = progress.completedGames.includes(`game-${boothNumber}`);
            
            return (
              <div 
                key={boothNumber}
                className={`border-2 border-dashed rounded-lg p-4 text-center relative ${
                  isCompleted 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="text-xs text-gray-500 absolute top-1 right-1">
                  B{boothNumber}
                </div>
                <div className="mt-2">
                  {isCompleted ? (
                    <div className="text-2xl">✅</div>
                  ) : (
                    <div className="text-2xl text-gray-400">
                      {boothNumber === 1 && '⭐'}
                      {boothNumber === 2 && '🏁'}
                      {boothNumber === 3 && '🏆'}
                      {boothNumber === 4 && '❤️'}
                      {boothNumber === 5 && '💎'}
                      {boothNumber === 6 && '👑'}
                    </div>
                  )}
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
