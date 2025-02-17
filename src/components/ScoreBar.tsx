import type { ScoreBarProps } from '../types/layout';
import { MOBILE_LAYOUT_STYLES } from '../constants/mobileLayout';
import { formatTime } from '../utils/leaderboardUtils';

/**
 * Displays the current score and timer in a fixed header bar
 */
export default function ScoreBar({ score, time }: ScoreBarProps): JSX.Element {
  const {
    CONTAINER,
    SCORE,
    SCORE_TEXT,
    TIMER,
    TIMER_TEXT,
  } = MOBILE_LAYOUT_STYLES.SCORE_BAR;

  return (
    <div 
      className={CONTAINER}
      role="banner"
      aria-label="Game statistics"
    >
      {/* Score display */}
      <div 
        className={`${SCORE} ${MOBILE_LAYOUT_STYLES.ANIMATION.HOVER}`}
        role="status"
        aria-label={`Current score: ${score}`}
      >
        <span className="text-2xl" aria-hidden="true">⭐</span>
        <span className={SCORE_TEXT}>{score}</span>
      </div>

      {/* Timer display */}
      <div 
        className={`${TIMER} ${MOBILE_LAYOUT_STYLES.ANIMATION.HOVER}`}
        role="timer"
        aria-label={`Time elapsed: ${formatTime(time)}`}
      >
        <svg 
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className={TIMER_TEXT}>{formatTime(time)}</span>
      </div>
    </div>
  );
}