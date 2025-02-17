import { useState } from 'react';
import type { LeaderboardPanelProps } from '../../types/layout';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { loadLeaderboard, formatTime } from '../../utils/leaderboardUtils';

const TABS = ['score', 'time'] as const;
type TabType = typeof TABS[number];

export default function LeaderboardPanel({
  isOpen,
  onToggle,
}: LeaderboardPanelProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabType>('score');
  const leaderboard = loadLeaderboard();

  // Get sorted entries based on active tab
  const getSortedEntries = () => {
    const entries = Object.values(leaderboard.categories).flatMap(category => 
      activeTab === 'score' 
        ? [category.bestMoves]
        : [category.bestTime]
    );

    return entries.sort((a, b) => 
      activeTab === 'score'
        ? a.moves - b.moves
        : a.timeSeconds - b.timeSeconds
    ).slice(0, 5);
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
          {/* Tabs */}
          <div className="flex mb-4 border-b border-slate-700">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`
                  px-4 py-2 font-medium
                  ${activeTab === tab 
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-slate-400 hover:text-slate-300'
                  }
                `}
                onClick={() => setActiveTab(tab)}
              >
                By {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Entries */}
          <ul className="space-y-2">
            {sortedEntries.map((entry, index) => (
              <li
                key={`${entry.gridSize}-${entry.completedAt}`}
                className="flex justify-between items-center text-slate-200 p-2 rounded hover:bg-slate-700/50"
              >
                <span className="flex items-center gap-2">
                  <span className="text-slate-400">{index + 1}.</span>
                  <span>{entry.gridSize}x{entry.gridSize}</span>
                </span>
                <span>
                  {activeTab === 'score'
                    ? `${entry.moves} moves`
                    : formatTime(entry.timeSeconds)
                  }
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}