import { useEffect, useState } from 'react';
import { loadLeaderboard } from '../../utils/leaderboardUtils';
import { GridSizes } from '../../constants/gameConstants';
import BestScores from './BestScores';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
type Difficulty = typeof DIFFICULTIES[number];

export default function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | Difficulty>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load leaderboard data
  const leaderboard = loadLeaderboard();

  // Reset loading state after data is loaded
  useEffect(() => {
    if (leaderboard) {
      setIsLoading(false);
    }
  }, [leaderboard]);

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
          <h2 className="text-xl font-bold text-white">Best Scores</h2>
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

        {/* Filters */}
        <div className="flex gap-2 p-4 border-b border-slate-700 overflow-x-auto hide-scrollbar">
          <select
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 appearance-none cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="all">All Sizes</option>
            {GridSizes.SIZES.map((size) => (
              <option key={size} value={`${size}x${size}`}>
                {size}x{size}
              </option>
            ))}
          </select>

          <select
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 appearance-none cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as 'all' | Difficulty)}
          >
            <option value="all">All Difficulties</option>
            {DIFFICULTIES.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
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
          ) : (
            <BestScores
              categories={leaderboard.categories}
              selectedSize={selectedSize}
              selectedDifficulty={selectedDifficulty}
            />
          )}
        </div>
      </div>
    </>
  );
}