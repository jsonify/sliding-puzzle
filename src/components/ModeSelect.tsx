import { useState } from 'react';
import type { GameMode } from '../types/game';
import { COLORS } from '../constants/colorMode';
import { TIMED_MODE_CONFIG } from '../constants/gameConfig';

interface ModeSelectProps {
  onModeSelect: (mode: GameMode) => void;
}

export default function ModeSelect({ onModeSelect }: ModeSelectProps): JSX.Element {
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');

  const handleModeSelect = () => {
    onModeSelect(selectedMode);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Select Game Mode
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Classic Mode Card */}
        <button
          className={`flex flex-col items-center p-6 rounded-lg border-2 transition-all ${
            selectedMode === 'classic'
              ? 'border-blue-500 bg-blue-50 dark:bg-gray-700'
              : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-gray-500'
          }`}
          onClick={() => setSelectedMode('classic')}
        >
          <div className="grid grid-cols-3 gap-1 p-4 bg-white dark:bg-gray-800 rounded shadow-sm">
            {[1, 2, 3, 4, 5, 6, 7, 8, 0].map((num) => (
              <div
                key={`classic-preview-${num}`}
                className={`w-8 h-8 flex items-center justify-center rounded ${
                  num === 0
                    ? 'bg-gray-100 dark:bg-gray-900'
                    : 'bg-white dark:bg-gray-700'
                }`}
              >
                {num !== 0 && (
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {num}
                  </span>
                )}
              </div>
            ))}
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
            Classic Mode
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center">
            Arrange numbers in ascending order
          </p>
        </button>

        {/* Color Mode Card */}
        <button
          className={`flex flex-col items-center p-6 rounded-lg border-2 transition-all ${
            selectedMode === 'color'
              ? 'border-blue-500 bg-blue-50 dark:bg-gray-700'
              : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-gray-500'
          }`}
          onClick={() => setSelectedMode('color')}
        >
          <div className="grid grid-cols-3 gap-1 p-4 bg-white dark:bg-gray-800 rounded shadow-sm">
            {/* Sample color preview */}
            {Object.values(COLORS).slice(0, 8).map((color, index) => (
              <div
                key={`color-preview-${index}`}
                className="w-8 h-8 rounded"
                style={{ backgroundColor: color }}
              />
            ))}
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-900 rounded" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
            Color Mode
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center">
            Match the target color pattern
          </p>
        </button>

        {/* Timed Mode Card */}
        <button
          className={`flex flex-col items-center p-6 rounded-lg border-2 transition-all ${
            selectedMode === 'timed'
              ? 'border-blue-500 bg-blue-50 dark:bg-gray-700'
              : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-gray-500'
          }`}
          onClick={() => setSelectedMode('timed')}
        >
          <div className="grid grid-cols-3 gap-1 p-4 bg-white dark:bg-gray-800 rounded shadow-sm">
            {/* Timer preview with example time */}
            <div className="col-span-3 h-16 flex items-center justify-center">
              <div className="text-2xl font-mono font-bold text-blue-500 dark:text-blue-400">
                01:00
              </div>
            </div>
            {[1, 2, 3, 4, 5, 6, 7, 8, 0].map((num) => (
              <div
                key={`timed-preview-${num}`}
                className={`w-6 h-6 flex items-center justify-center rounded ${
                  num === 0
                    ? 'bg-gray-100 dark:bg-gray-900'
                    : 'bg-white dark:bg-gray-700'
                }`}
              >
                {num !== 0 && <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{num}</span>}
              </div>
            ))}
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
            Timed Mode
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center">
            Race against time to solve puzzles
          </p>
        </button>
      </div>

      <button
        onClick={handleModeSelect}
        className="mt-8 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
      >
        Start Game
      </button>
    </div>
  );
}