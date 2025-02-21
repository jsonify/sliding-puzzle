// src/components/GameEndModal.tsx
import React from 'react';
import { GameMode, GridSize } from '../types/game';
import { formatTime, isNewBestTime } from '../utils/timerUtils';
import { MOBILE_LAYOUT_STYLES } from '../constants/mobileLayout';

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
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity z-50" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-50 bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-end-title"
      >
        <div className="p-6 text-center">
          <h2 
            id="game-end-title" 
            className={`text-3xl font-bold mb-4 ${
              isVictory ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isVictory ? 'Puzzle Solved!' : "Time's Up!"}
          </h2>
          
          {mode === 'timed' && isVictory && (
            <div className="mb-4">
              <p className="text-slate-300">
                Time Remaining: {formatTime(timeRemaining)}
              </p>
              <p className="text-slate-300">
                Completion Time: {formatTime(completionTime)}
              </p>
              {isNewRecord && (
                <p className="text-yellow-500 font-bold mt-2">
                  🎉 New Best Time! 🎉
                </p>
              )}
            </div>
          )}
          
          <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Moves</p>
                <p className="text-2xl font-bold text-slate-200">{moves}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Time</p>
                <p className="text-2xl font-bold text-slate-200">
                  {formatTime(totalTime)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={onNewGame}
              className={`${MOBILE_LAYOUT_STYLES.SHEET.ACTIONS.BUTTON.PRIMARY} py-3 text-lg`}
            >
              {isVictory ? 'Play Again' : 'Try Again'}
            </button>
            <button
              onClick={onClose}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(GameEndModal);