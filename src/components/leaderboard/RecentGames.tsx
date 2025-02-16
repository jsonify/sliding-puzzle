import type { LeaderboardCategories, Achievement } from '../../types/game';
import { MOBILE_LAYOUT_STYLES } from '../../constants/mobileLayout';
import { formatTime } from '../../utils/leaderboardUtils';

interface RecentGamesProps {
  categories: LeaderboardCategories;
  achievements: Achievement[];
  selectedSize: string;
  selectedDifficulty: string;
}

const RECENT_GAMES_LIMIT = 10;

export default function RecentGames({
  categories,
  achievements,
  selectedSize,
  selectedDifficulty,
}: RecentGamesProps): JSX.Element {
  // Get all recent games from categories that match the filters
  const allRecentGames = Object.entries(categories)
    .filter(([key]) => {
      const [size, difficulty] = key.split('-');
      return (selectedSize === 'all' || size === selectedSize) &&
             (selectedDifficulty === 'all' || difficulty === selectedDifficulty);
    })
    .flatMap(([_, category]) => category.recentGames)
    .sort((a, b) => {
      const dateA = new Date(a.completedAt).getTime();
      const dateB = new Date(b.completedAt).getTime();
      return dateB - dateA; // Most recent first
    })
    .slice(0, RECENT_GAMES_LIMIT);

  if (allRecentGames.length === 0) {
    return (
      <p className="text-slate-400 text-center py-4">
        No games completed yet. Play a game to see your history!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {allRecentGames.map((game) => {
        const gameAchievements = game.achievementsUnlocked
          .map(id => achievements.find(a => a.id === id))
          .filter((achievement): achievement is Achievement => achievement !== undefined);

        return (
          <div 
            key={game.id}
            className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.CONTAINER}
          >
            <div className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.HEADER}>
              <h3 className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.TITLE}>
                {game.gridSize}x{game.gridSize} - {game.difficulty}
              </h3>
              <span className="text-sm text-slate-400">
                {new Date(game.completedAt).toLocaleDateString()}
              </span>
            </div>

            <div className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.GRID}>
              <div>
                <span className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.LABEL}>
                  Moves:
                </span>
                <span className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.VALUE}>
                  {game.moves}
                </span>
              </div>
              <div>
                <span className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.LABEL}>
                  Time:
                </span>
                <span className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.VALUE}>
                  {formatTime(game.timeSeconds)}
                </span>
              </div>
            </div>

            {gameAchievements.length > 0 && (
              <div className={MOBILE_LAYOUT_STYLES.ACHIEVEMENT.CONTAINER}>
                {gameAchievements.map(achievement => (
                  <span
                    key={achievement.id}
                    className={`
                      ${MOBILE_LAYOUT_STYLES.ACHIEVEMENT.BADGE.BASE}
                      ${MOBILE_LAYOUT_STYLES.ACHIEVEMENT.BADGE.UNLOCKED}
                    `}
                  >
                    🏆 {achievement.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}