// src/components/VictoryModal.tsx
import { MOBILE_LAYOUT_STYLES } from '../constants/mobileLayout';
import { formatTime } from '../utils/leaderboardUtils';

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  moves: number;
  time: number;
  hasNextLevel?: boolean;
  onNextLevel?: () => void;
}

export default function VictoryModal({
  isOpen, onClose, moves, time,
  hasNextLevel = false,
  onNextLevel
}: VictoryModalProps): JSX.Element | null {
  if (!isOpen) return null;

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
        aria-labelledby="victory-title"
      >
        {/* Content */}
        <div className="p-6 text-center">
          <h2 
            id="victory-title"
            className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent mb-4"
          >
            🎉 Congratulations! 🎉
          </h2>
          
          <p className="text-xl text-slate-200 mb-6">
            You solved the puzzle!
          </p>
          
          <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Moves</p>
                <p className="text-2xl font-bold text-slate-200">{moves}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Time</p>
                <p className="text-2xl font-bold text-slate-200">{formatTime(time)}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onClose}
              className={`${MOBILE_LAYOUT_STYLES.SHEET.ACTIONS.BUTTON.PRIMARY} py-3 text-lg flex-1`}
              aria-label="Play current level again"
            >
              Play Again
            </button>
            {hasNextLevel && onNextLevel && (
              <button
                onClick={onNextLevel}
                className={`${MOBILE_LAYOUT_STYLES.SHEET.ACTIONS.BUTTON.PRIMARY} py-3 text-lg flex-1 bg-emerald-600 hover:bg-emerald-500`}
                aria-label="Progress to next level"
              >
                Next Level
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}