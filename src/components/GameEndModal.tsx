import React from 'react';
import { GameMode, GridSize } from '../types/game';
import { formatTime, isNewBestTime } from '../utils/timerUtils';

interface GameEndModalProps {
  isOpen: boolean;
  isVictory: boolean;
  timeRemaining: number;
  totalTime: number;
  moves: number;
  gridSize: GridSize;
  mode: GameMode;
  onClose: () => void;
  onNewGame: () => void;
}

const GameEndModal: React.FC<GameEndModalProps> = ({
  isOpen,
  isVictory,
  timeRemaining,
  totalTime,
  moves,
  gridSize,
  mode,
  onClose,
  onNewGame,
}) => {
  if (!isOpen) return null;

  const completionTime = mode === 'timed' ? totalTime - timeRemaining : totalTime;
  const isNewRecord = mode === 'timed' && isVictory && isNewBestTime(gridSize, completionTime);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          {isVictory ? (
            <>
              <h2 className="text-3xl font-bold text-green-500 mb-4">
                Puzzle Solved!
              </h2>
              {mode === 'timed' && (
                <div className="mb-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Time Remaining: {formatTime(timeRemaining)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Completion Time: {formatTime(completionTime)}
                  </p>
                  {isNewRecord && (
                    <p className="text-yellow-500 font-bold mt-2">
                      🎉 New Best Time! 🎉
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <h2 className="text-3xl font-bold text-red-500 mb-4">
              Time's Up!
            </h2>
          )}
          
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Moves Made: {moves}
          </p>
          
          <div className="mt-8 flex flex-col gap-4">
            <button
              onClick={onNewGame}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={onClose}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(GameEndModal);