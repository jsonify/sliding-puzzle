import { useState } from 'react';
import { Leaderboard as LeaderboardType, Achievement } from '../types/game';
import { formatTime, loadLeaderboard } from '../utils/gameUtils';

type LeaderboardView = 'best' | 'recent' | 'achievements' | 'stats';

export function Leaderboard(): JSX.Element {
  const [activeView, setActiveView] = useState<LeaderboardView>('best');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  
  const leaderboard = loadLeaderboard();
  
  // Filter categories based on selection
  const filteredCategories = Object.entries(leaderboard.categories).filter(([key]) => {
    const [size, difficulty] = key.split('-');
    return (selectedSize === 'all' || size === selectedSize) &&
           (selectedDifficulty === 'all' || difficulty === selectedDifficulty);
  });

  const renderBestScores = () => (
    <div className="space-y-6">
      {filteredCategories.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No high scores yet. Complete a puzzle to set a record!
        </p>
      ) : filteredCategories.map(([key, data]) => (
        <div key={key} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transform transition hover:scale-102">
          <h3 className="text-lg font-bold mb-2">
            {data.bestMoves.gridSize}x{data.bestMoves.gridSize} - {data.bestMoves.difficulty}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
              <h4 className="font-medium mb-2">Best Moves</h4>
              <p className="text-lg">{data.bestMoves.moves} moves</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Time: {formatTime(data.bestMoves.timeSeconds)}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
              <h4 className="font-medium mb-2">Best Time</h4>
              <p className="text-lg">{formatTime(data.bestTime.timeSeconds)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Moves: {data.bestTime.moves}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRecentGames = () => (
    <div className="space-y-4">
      {filteredCategories.flatMap(([_, data]) => data.recentGames)
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
        .slice(0, 10)
        .map((game) => (
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
            {game.achievementsUnlocked.length > 0 && (
              <div className="mt-2 flex gap-2">
                {game.achievementsUnlocked.map(id => {
                  const achievement = leaderboard.achievements.find(a => a.id === id);
                  return achievement ? (
                    <span key={id} className="inline-block bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 text-xs px-2 py-1 rounded">
                      🏆 {achievement.name}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
        ))}
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

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Leaderboard</h2>
        <div className="flex gap-4">
          <select
            className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="all">All Sizes</option>
            {[3, 4, 5, 6, 7, 8, 9].map((size) => (
              <option key={size} value={`${size}x${size}`}>
                {size}x{size}
              </option>
            ))}
          </select>
          <select
            className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeView === 'best'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600 dark:text-gray-400'
          }`}
          onClick={() => setActiveView('best')}
        >
          Best Scores
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeView === 'recent'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600 dark:text-gray-400'
          }`}
          onClick={() => setActiveView('recent')}
        >
          Recent Games
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeView === 'achievements'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600 dark:text-gray-400'
          }`}
          onClick={() => setActiveView('achievements')}
        >
          Achievements
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeView === 'stats'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600 dark:text-gray-400'
          }`}
          onClick={() => setActiveView('stats')}
        >
          Statistics
        </button>
      </div>

      {activeView === 'best' && renderBestScores()}
      {activeView === 'recent' && renderRecentGames()}
      {activeView === 'achievements' && renderAchievements()}
      {activeView === 'stats' && renderStats()}
    </div>
  );
}