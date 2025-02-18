import { useEffect, useState, useCallback } from 'react';
import { loadLeaderboard } from '../../utils/leaderboardUtils';
import { GridSizes } from '../../constants/gameConstants';
import BestScores from './BestScores';
import { Leaderboard } from '../../types/game';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const [selectedSize, setSelectedSize] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<Leaderboard | null>(null);

  // Load leaderboard data with refresh handling
  const refreshLeaderboard = useCallback(() => {
    setIsLoading(true);
    try {
      const data = loadLeaderboard();
      setLeaderboardData(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshLeaderboard();
  }, [refreshLeaderboard]);

  // Refresh when modal opens
  useEffect(() => {
    if (isOpen) {
      refreshLeaderboard();
    }
  }, [isOpen, refreshLeaderboard]);

  // Clear selected size when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedSize('all');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg z-50
          bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700"
        role="dialog"
        aria-modal="true"
        aria-label="Leaderboard"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Leaderboard</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Close leaderboard"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>

        {/* Filter */}
        <div className="flex p-4 border-b border-slate-700">
          <select
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 
              appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="all">All Puzzle Sizes</option>
            {GridSizes.SIZES.map((size) => (
              <option key={size} value={`${size}`}>
                {size}x{size} Grid
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
            </div>
          ) : !leaderboardData ? (
            <div className="text-slate-400 text-center py-4">
              Failed to load leaderboard data
            </div>
          ) : (
            <BestScores
              categories={leaderboardData.categories}
              selectedSize={selectedSize}
              selectedDifficulty="all" // Maintained for backwards compatibility
            />
          )}
        </div>
      </div>
    </>
  );
}