import type { GlobalStats } from '../../types/game';
import { MOBILE_LAYOUT_STYLES } from '../../constants/mobileLayout';
import { formatTime } from '../../utils/leaderboardUtils';

interface StatsOverviewProps {
  stats: GlobalStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps): JSX.Element {
  return (
    <div className="space-y-6">
      {/* Overall Stats Card */}
      <div className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.CONTAINER}>
        <h3 className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.TITLE}>
          Overall Stats
        </h3>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <span className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.LABEL}>
              Total Games
            </span>
            <p className="text-xl font-bold text-slate-200">
              {stats.totalGamesPlayed}
            </p>
          </div>
          <div>
            <span className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.LABEL}>
              Total Time
            </span>
            <p className="text-xl font-bold text-slate-200">
              {formatTime(stats.totalTimePlayed)}
            </p>
          </div>
          <div>
            <span className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.LABEL}>
              Total Moves
            </span>
            <p className="text-xl font-bold text-slate-200">
              {stats.totalMoves}
            </p>
          </div>
          <div>
            <span className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.LABEL}>
              Avg. Time/Game
            </span>
            <p className="text-xl font-bold text-slate-200">
              {formatTime(stats.totalTimePlayed / (stats.totalGamesPlayed || 1))}
            </p>
          </div>
        </div>
      </div>

      {/* Games by Mode */}
      <div className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.CONTAINER}>
        <h3 className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.TITLE}>
          Games by Mode
        </h3>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <span className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.LABEL}>
              Classic Mode
            </span>
            <p className="text-xl font-bold text-slate-200">
              {stats.gamesPerMode.classic}
            </p>
          </div>
          <div>
            <span className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.LABEL}>
              Color Mode
            </span>
            <p className="text-xl font-bold text-slate-200">
              {stats.gamesPerMode.color}
            </p>
          </div>
        </div>
      </div>

      {/* Games by Grid Size */}
      <div className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.CONTAINER}>
        <h3 className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.TITLE}>
          Games by Size
        </h3>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {Object.entries(stats.gamesPerSize).map(([size, count]) => (
            <div key={size}>
              <span className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.LABEL}>
                {size}x{size}
              </span>
              <p className="text-xl font-bold text-slate-200">
                {count}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}