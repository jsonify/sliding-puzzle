import type { LeaderboardCategories } from '../../types/game';
import { MOBILE_LAYOUT_STYLES } from '../../constants/mobileLayout';
import { formatTime } from '../../utils/leaderboardUtils';

interface BestScoresProps {
  categories: LeaderboardCategories;
  selectedSize: string;
  selectedDifficulty: string;
}

export default function BestScores({ 
  categories,
  selectedSize,
  selectedDifficulty 
}: BestScoresProps): JSX.Element {
  const filteredCategories = Object.entries(categories).filter(([key]) => {
    const [size, difficulty] = key.split('-');
    return (selectedSize === 'all' || size === selectedSize) &&
           (selectedDifficulty === 'all' || difficulty === selectedDifficulty);
  });

  if (filteredCategories.length === 0) {
    return (
      <p className="text-slate-400 text-center py-4">
        No high scores yet. Complete a puzzle to set a record!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {filteredCategories.map(([key, category]) => (
        <div 
          key={key}
          className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.CONTAINER}
        >
          <div className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.HEADER}>
            <h3 className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.TITLE}>
              {category.bestMoves.gridSize}x{category.bestMoves.gridSize} - {category.bestMoves.difficulty}
            </h3>
          </div>

          <div className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.GRID}>
            {/* Best Moves */}
            <div className="space-y-1">
              <h4 className="font-medium text-slate-300">Best Moves</h4>
              <p className="text-lg text-slate-200">
                {category.bestMoves.moves} moves
              </p>
              <p className="text-sm text-slate-400">
                Time: {formatTime(category.bestMoves.timeSeconds)}
              </p>
            </div>

            {/* Best Time */}
            <div className="space-y-1">
              <h4 className="font-medium text-slate-300">Best Time</h4>
              <p className="text-lg text-slate-200">
                {formatTime(category.bestTime.timeSeconds)}
              </p>
              <p className="text-sm text-slate-400">
                Moves: {category.bestTime.moves}
              </p>
            </div>
          </div>

          {/* Category Stats */}
          <div className="mt-4 pt-4 border-t border-slate-700">
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