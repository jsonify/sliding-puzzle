import type { LeaderboardCategories, LeaderboardEntry } from '../../types/game';
import { MOBILE_LAYOUT_STYLES } from '../../constants/mobileLayout';
import { formatTime } from '../../utils/leaderboardUtils';

interface BestScoresProps {
  categories: LeaderboardCategories;
  selectedSize: string;
  selectedDifficulty: string;
}

interface ScoreDisplayProps {
  entry: LeaderboardEntry;
  showRank?: boolean;
  rank?: number;
}

const ScoreDisplay = ({ entry, showRank, rank }: ScoreDisplayProps): JSX.Element => (
  <div className="flex items-center space-x-4 py-2">
    {showRank && (
      <span className="font-medium text-slate-400 w-6">
        #{rank}
      </span>
    )}
    <div className="flex-1">
      <p className="text-lg text-slate-200">
        {entry.moves} moves
      </p>
      <p className="text-sm text-slate-400">
        Time: {formatTime(entry.timeSeconds)}
      </p>
    </div>
  </div>
);

const ClassicModeScores = ({ scores }: { scores: LeaderboardEntry[] }) => (
  <div className="space-y-2">
    <h4 className="font-medium text-slate-300 mb-3">Classic Mode</h4>
    {scores.map((score, index) => (
      <ScoreDisplay key={score.completedAt} entry={score} />
    ))}
    {scores.length === 0 && (
      <p className="text-slate-400">No scores yet</p>
    )}
  </div>
);

const ColorModeScores = ({ scores }: { scores: LeaderboardEntry[] }) => (
  <div className="space-y-2">
    <h4 className="font-medium text-slate-300 mb-3">Color Mode - Top 5</h4>
    {scores.map((score, index) => (
      <ScoreDisplay 
        key={score.completedAt} 
        entry={score} 
        showRank 
        rank={index + 1}
      />
    ))}
    {scores.length === 0 && (
      <p className="text-slate-400">No scores yet</p>
    )}
  </div>
);

export default function BestScores({ 
  categories,
  selectedSize,
  selectedDifficulty 
}: BestScoresProps): JSX.Element {
  const filteredCategories = Object.entries(categories).filter(([key]) => {
    const size = key.split('x')[0];
    return (selectedSize === 'all' || size === selectedSize);
  });

  if (filteredCategories.length === 0) {
    return (
      <p className="text-slate-400 text-center py-4">
        No high scores yet. Complete a puzzle to set a record!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {filteredCategories.map(([key, category]) => (
        <div 
          key={key}
          className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.CONTAINER}
        >
          <div className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.HEADER}>
            <h3 className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.TITLE}>
              {key}
            </h3>
          </div>

          <div className="space-y-6 mt-4">
            {/* Classic Mode Scores */}
            {category.classicScores && category.classicScores.length > 0 && (
              <ClassicModeScores scores={category.classicScores} />
            )}

            {/* Color Mode Scores */}
            {category.colorScores && category.colorScores.length > 0 && (
              <ColorModeScores scores={category.colorScores} />
            )}
          </div>

          {/* Category Stats */}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.LABEL}>
                  Games Played:
                </span>
                <span className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.VALUE}>
                  {category.stats.gamesPlayed}
                </span>
              </div>
              <div>
                <span className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.LABEL}>
                  Avg. Moves:
                </span>
                <span className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.VALUE}>
                  {Math.round(category.stats.averageMoves)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}