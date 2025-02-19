import { useEffect } from 'react';
import type { PauseOverlayProps } from '../types/layout';

/**
 * PauseOverlay component that displays when the game is paused
 * Shows a blurred overlay with a pause icon and resume button
 */
export default function PauseOverlay({ isPaused, onResume }: PauseOverlayProps): JSX.Element | null {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isPaused) {
        onResume();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPaused, onResume]);

  if (!isPaused) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
      role="dialog"
      aria-label="Game paused"
      onClick={onResume}
    >
      <div 
        className="flex flex-col items-center space-y-6 p-8 rounded-lg bg-white/10 backdrop-blur-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-white text-4xl font-bold">Game Paused</div>
        <button
          type="button"
          onClick={onResume}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-200 font-medium text-lg"
          aria-label="Resume game"
        >
          Resume
        </button>
        <div className="text-white/60 text-sm mt-4">
          Press ESC to resume
        </div>
      </div>
    </div>
  );
}