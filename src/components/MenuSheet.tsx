import { useRef, useEffect } from 'react';
import type { MenuSheetProps } from '../types/layout';
import type { GameMode } from '../types/game';
import { MOBILE_LAYOUT_STYLES } from '../constants/mobileLayout';
import LeaderboardModal from './leaderboard/LeaderboardModal';
import { useState } from 'react';
import { PATTERN_TYPES } from '../constants/colorMode';

const SWIPE_THRESHOLD = 50; // minimum pixels to trigger swipe

const PATTERN_OPTIONS = [
  { value: PATTERN_TYPES.RANDOM, label: 'Random Pattern' },
  { value: PATTERN_TYPES.COLUMN_STACK, label: 'Column Pattern' },
] as const;

/**
 * Bottom sheet component for game controls
 */
export default function MenuSheet({
  isOpen,
  onOpenChange,
  mode,
  patternType,
  onPatternTypeChange,
  onNewGame,
  onModeChange,
  onBackToMain,
}: MenuSheetProps): JSX.Element {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef(0);

  // Add non-passive touch event listeners
  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isOpen) return;

      const touchDelta = e.touches[0].clientY - touchStartRef.current;
      if (touchDelta > 0) { // Only allow downward swipe
        e.preventDefault();
        if (sheet) {
          sheet.style.transform = `translateY(${touchDelta}px)`;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isOpen) return;

      const touchDelta = e.changedTouches[0].clientY - touchStartRef.current;
      if (touchDelta > SWIPE_THRESHOLD) {
        onOpenChange(false);
      } else {
        // Reset position
        if (sheet) {
          sheet.style.transform = '';
        }
      }
    };

    sheet.addEventListener('touchstart', handleTouchStart);
    sheet.addEventListener('touchmove', handleTouchMove, { passive: false });
    sheet.addEventListener('touchend', handleTouchEnd);

    return () => {
      sheet.removeEventListener('touchstart', handleTouchStart);
      sheet.removeEventListener('touchmove', handleTouchMove);
      sheet.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, onOpenChange]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-40"
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />
      )}

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`
          fixed bottom-0 left-0 right-0 
          bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800
          border-t border-slate-700/50 rounded-t-2xl shadow-2xl
          transform transition-transform duration-200 ease-out z-50
          touch-pan-y
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Game menu"
      >
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-slate-600/50 rounded-full mx-auto my-4" />

        {/* Content */}
        <div className="px-4 pb-8 space-y-4 max-w-md mx-auto">
          {/* Game actions */}
          <button
            type="button"
            onClick={() => {
              onNewGame();
              onOpenChange(false);
            }}
            className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
              text-white font-bold py-4 px-6 rounded-xl shadow-lg active:scale-95 transform transition-all duration-200"
          >
            New Game
          </button>

          {/* Pattern Type Selection - Only show for color mode */}
          {mode === 'color' && onPatternTypeChange && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Pattern Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {PATTERN_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => onPatternTypeChange(value)}
                    className={`
                      py-3 px-4 rounded-lg font-medium text-sm
                      transform transition-all duration-200
                      ${patternType === value
                        ? 'bg-blue-500 text-white shadow-lg scale-100'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:scale-95'
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowLeaderboard(true)}
            className="w-full bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700
              text-white font-bold py-4 px-6 rounded-xl shadow-lg active:scale-95 transform transition-all duration-200"
          >
            Leaderboard
          </button>

          <button
            type="button"
            onClick={onBackToMain}
            className="w-full bg-gradient-to-br from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500
              text-white font-bold py-4 px-6 rounded-xl shadow-lg active:scale-95 transform transition-all duration-200"
          >
            Back to Main
          </button>
        </div>
      </div>

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />
    </>
  );
}