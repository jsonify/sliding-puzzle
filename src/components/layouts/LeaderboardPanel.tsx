import { useState } from 'react';
import type { LeaderboardPanelProps } from '../../types/layout';
import type { GameMode, LeaderboardEntry } from '../../types/game';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { loadLeaderboard, formatTime } from '../../utils/leaderboardUtils';

const MODES: GameMode[] = ['classic', 'color'];

export default function LeaderboardPanel({
  isOpen,
  onToggle,
}: LeaderboardPanelProps): JSX.Element {
  const [activeMode, setActiveMode] = useState<GameMode>('classic');
  const leaderboard = loadLeaderboard();

  // Get sorted entries based on active mode
  const getSortedEntries = () => {
    const entries = Object.values(leaderboard.categories)
      .flatMap(category => {
        if (activeMode === 'classic') {
          return category.classicScores || [];
        }
        return category.colorScores || [];
      })
      .filter((entry): entry is LeaderboardEntry => entry !== undefined);

    // Sort entries by moves first, then by time
    return entries
      .sort((a, b) => {
        if (a.moves === b.moves) {
          return a.timeSeconds - b.timeSeconds;
        }
        return a.moves - b.moves;
      })
      .slice(0, activeMode === 'color' ? 5 : entries.length);
  };

  const sortedEntries = getSortedEntries();

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-200">Leaderboard</h3>
        <button
          type="button"
          onClick={onToggle}
          className="p-2 text-slate-200 hover:text-slate-300 transition-colors"
          aria-label={isOpen ? 'Collapse leaderboard' : 'Expand leaderboard'}
        >
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="px-4 pb-4">
          {/* Mode Tabs */}
          <div className="flex mb-4 border-b border-slate-700">
            {MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                className={`
                  px-4 py-2 font-medium
                  ${activeMode === mode 
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-slate-400 hover:text-slate-300'
                  }
                `}
                onClick={() => setActiveMode(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          {/* Entries */}
          {sortedEntries.length > 0 ? (
            <ul className="space-y-2">
              {sortedEntries.map((entry, index) => (
                <li
                  key={`${entry.gridSize}-${entry.completedAt}`}
                  className="flex justify-between items-center text-slate-200 p-2 rounded hover:bg-slate-700/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{index + 1}.</span>
                    <span>{entry.gridSize}x{entry.gridSize}</span>
                  </div>
                  <div className="text-right">
                    <div>{entry.moves} moves</div>
                    <div className="text-sm text-slate-400">
                      {formatTime(entry.timeSeconds)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 text-center py-4">
              No scores yet. Complete a puzzle to set a record!
            </p>
          )}
        </div>
      )}
    </div>
  );
}