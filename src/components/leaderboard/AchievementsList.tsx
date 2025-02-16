import type { Achievement } from '../../types/game';
import { MOBILE_LAYOUT_STYLES } from '../../constants/mobileLayout';

interface AchievementsListProps {
  achievements: Achievement[];
}

export default function AchievementsList({
  achievements
}: AchievementsListProps): JSX.Element {
  // Sort achievements: unlocked first, then by name
  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.unlockedAt && !b.unlockedAt) return -1;
    if (!a.unlockedAt && b.unlockedAt) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {sortedAchievements.map((achievement) => {
        const isUnlocked = Boolean(achievement.unlockedAt);
        
        return (
          <div
            key={achievement.id}
            className={`
              ${MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.CONTAINER}
              ${isUnlocked ? 'border-l-4 border-l-yellow-500' : ''}
              transition-colors duration-200
            `}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className={`
                  ${MOBILE_LAYOUT_STYLES.LEADERBOARD.CARD.TITLE}
                  flex items-center gap-2
                `}>
                  <span 
                    className={`
                      inline-flex items-center justify-center w-6 h-6 rounded-full 
                      ${isUnlocked 
                        ? 'bg-yellow-500 text-yellow-900' 
                        : 'bg-slate-700 text-slate-400'}
                    `}
                    aria-hidden="true"
                  >
                    {isUnlocked ? '🏆' : '🔒'}
                  </span>
                  {achievement.name}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  {achievement.description}
                </p>
              </div>
            </div>

            {isUnlocked && achievement.unlockedAt && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <p className="text-xs text-slate-500">
                  Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}