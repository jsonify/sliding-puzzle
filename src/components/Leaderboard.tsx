import { Leaderboard as LeaderboardType } from '../types/game';
import { formatTime, loadLeaderboard } from '../utils/gameUtils';

export function Leaderboard(): JSX.Element {
  const leaderboard = loadLeaderboard();

  // Validate each entry has required data structure
  const validEntries = Object.entries(leaderboard).filter(([_, data]) => {
    return (
      data &&
      data.bestMoves?.gridSize &&
      data.bestMoves?.difficulty &&
      data.bestTime?.timeSeconds !== undefined
    );
  });
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      {Object.keys(leaderboard).length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No high scores yet. Complete a puzzle to set a record!
        </p>
      ) : validEntries.map(([key, data]) => (
        <div key={key} className="mb-6">
          <h3 className="text-lg font-bold mb-2">
            {data.bestMoves.gridSize}x{data.bestMoves.gridSize} - {data.bestMoves.difficulty}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
              <h4 className="font-medium mb-2">Best Moves</h4>
              <p className="text-lg">{data.bestMoves.moves} moves</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Time: {formatTime(data.bestMoves.timeSeconds)}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
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
}