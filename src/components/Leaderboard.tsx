import { useState } from 'react';
import { Leaderboard as LeaderboardType, Achievement, LeaderboardCategories } from '../types/game';
import { formatTime, loadLeaderboard } from '../utils/leaderboardUtils';
import { GridSizes } from '../constants/gameConstants';

const RECENT_GAMES_LIMIT = 10;
const FIRST_CHAR_INDEX = 0;

type LeaderboardView = 'best' | 'recent' | 'achievements' | 'stats';
type CategoryKey = keyof LeaderboardCategories;
type CategoryEntry = [CategoryKey, LeaderboardCategories[CategoryKey]];

function Leaderboard(): JSX.Element {
  const [activeView, setActiveView] = useState<LeaderboardView>('best');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  
  const leaderboard: LeaderboardType = loadLeaderboard();
  
  // Filter categories based on selection
  const filteredCategories: CategoryEntry[] = Object.entries(leaderboard.categories).filter(([key]) => {
    const [size, difficulty] = key.split('-');
    return (selectedSize === 'all' || size === selectedSize) &&
           (selectedDifficulty === 'all' || difficulty === selectedDifficulty);
  }) as CategoryEntry[];

  const renderBestScores = (): JSX.Element => (
    <div className="space-y-6">
      {filteredCategories.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No high scores yet. Complete a puzzle to set a record!
        </p>
      ) : filteredCategories.map(([key, category]) => (
        <div key={key} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transform transition hover:scale-102">
          <h3 className="text-lg font-bold mb-2">
            {category.bestMoves.gridSize}x{category.bestMoves.gridSize} - {category.bestMoves.difficulty}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
              <h4 className="font-medium mb-2">Best Moves</h4>
              <p className="text-lg">{category.bestMoves.moves} moves</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Time: {formatTime(category.bestMoves.timeSeconds)}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
              <h4 className="font-medium mb-2">Best Time</h4>
              <p className="text-lg">{formatTime(category.bestTime.timeSeconds)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Moves: {category.bestTime.moves}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRecentGames = (): JSX.Element => (
    <div className="space-y-4">
      {filteredCategories
        .flatMap(({ 1: category }) => category.recentGames)
        .sort((a, b) => {
          const dateA = new Date(a.completedAt).getTime();
          const dateB = new Date(b.completedAt).getTime();
          return dateB - dateA;
        })
        .slice(0, RECENT_GAMES_LIMIT)
        .map((game) => {
          const achievements = game.achievementsUnlocked
            .map(achievementId => leaderboard.achievements.find(a => a.id === achievementId))
            .filter((achievement): achievement is Achievement => achievement !== undefined);

          return (
            <div key={game.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">
                  {game.gridSize}x{game.gridSize} - {game.difficulty}
                </h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(game.completedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Moves:</span>
                  <span className="ml-2">{game.moves}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="ml-2">{formatTime(game.timeSeconds)}</span>
                </div>
              </div>
              {achievements.length > 0 && (
                <div className="mt-2 flex gap-2">
                  {achievements.map(achievement => (
                    <span key={achievement.id} className="inline-block bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 text-xs px-2 py-1 rounded">
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

  const renderAchievements = () => (
    <div className="grid gap-4 sm:grid-cols-2">
      {leaderboard.achievements.map((achievement: Achievement) => (
        <div
          key={achievement.id}
          className={`p-4 rounded-lg ${
            achievement.unlockedAt
              ? 'bg-green-100 dark:bg-green-800'
              : 'bg-gray-100 dark:bg-gray-700'
          }`}
        >
          <h3 className="font-bold mb-1">{achievement.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {achievement.description}
          </p>
          {achievement.unlockedAt && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );

  const renderStats = () => {
    const { global } = leaderboard;
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="font-bold mb-2">Overall Stats</h3>
            <div className="space-y-2">
              <p>Total Games: {global.totalGamesPlayed}</p>
              <p>Total Time: {formatTime(global.totalTimePlayed)}</p>
              <p>Total Moves: {global.totalMoves}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="font-bold mb-2">Games by Difficulty</h3>
            <div className="space-y-2">
              <p>Easy: {global.gamesPerDifficulty.easy}</p>
              <p>Medium: {global.gamesPerDifficulty.medium}</p>
              <p>Hard: {global.gamesPerDifficulty.hard}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedSize(event.target.value);
  };

  const handleDifficultyChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedDifficulty(event.target.value);
  };

  const handleViewChange = (view: LeaderboardView): void => setActiveView(view);

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Leaderboard</h2>
        <div className="flex gap-4">
          <select
            className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
            value={selectedSize}
            onChange={handleSizeChange}
          >
            <option value="all">All Sizes</option>
            {GridSizes.SIZES.map((size) => (
              <option key={size} value={`${size}x${size}`}>
                {size}x{size}
              </option>
            ))}
          </select>
          <select
            className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
          >
            <option value="all">All Difficulties</option>
            {['easy', 'medium', 'hard'].map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty.charAt(FIRST_CHAR_INDEX).toUpperCase() + difficulty.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex border-b mb-6">
        {(['best', 'recent', 'achievements', 'stats'] as const).map((view) => (
          <button
            type="button"
            key={view}
            className={`px-4 py-2 font-medium ${
              activeView === view
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => handleViewChange(view)}
          >
            {view.charAt(0).toUpperCase() + view.slice(1).replace(/([A-Z])/g, ' $1')}
          </button>
        ))}
      </div>

      {activeView === 'best' && renderBestScores()}
      {activeView === 'recent' && renderRecentGames()}
      {activeView === 'achievements' && renderAchievements()}
      {activeView === 'stats' && renderStats()}
    </div>
  );
}

export default Leaderboard;