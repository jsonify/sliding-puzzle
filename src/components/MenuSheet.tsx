import { useState, useEffect, useRef } from 'react';
import type { MenuSheetProps } from '../types/layout';
import type { GameMode } from '../types/game';
import { MOBILE_LAYOUT_STYLES } from '../constants/mobileLayout';
import { loadLeaderboard } from '../utils/leaderboardUtils';
import { GridSizes } from '../constants/gameConstants';
import BestScores from './leaderboard/BestScores';
import RecentGames from './leaderboard/RecentGames';
import AchievementsList from './leaderboard/AchievementsList';
import StatsOverview from './leaderboard/StatsOverview';

const ANIMATION_DURATION = 200; // matches our CSS duration
const SWIPE_THRESHOLD = 50; // minimum pixels to trigger swipe
const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

type TabType = 'best' | 'recent' | 'achievements' | 'stats';
type Difficulty = typeof DIFFICULTIES[number];

const GAME_MODES: { value: GameMode; label: string }[] = [
  { value: 'classic', label: 'Classic Mode' },
  { value: 'color', label: 'Color Mode' },
];

/**
 * Bottom sheet component for game controls and leaderboard
 */
export default function MenuSheet({
  isOpen,
  onOpenChange,
  mode,
  onNewGame,
  onModeChange,
  onBackToMain,
}: MenuSheetProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabType>('best');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | Difficulty>('all');
  const [isLoading, setIsLoading] = useState(true);
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef(0);

  // Load leaderboard data
  const leaderboard = loadLeaderboard();

  // Reset loading state after data is loaded
  useEffect(() => {
    if (leaderboard) {
      setIsLoading(false);
    }
  }, [leaderboard]);

  // Handle touch events for swipe-to-close
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isOpen) return;

    const touchDelta = e.touches[0].clientY - touchStartRef.current;
    if (touchDelta > 0) { // Only allow downward swipe
      e.preventDefault();
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${touchDelta}px)`;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isOpen) return;

    const touchDelta = e.changedTouches[0].clientY - touchStartRef.current;
    if (touchDelta > SWIPE_THRESHOLD) {
      onOpenChange(false);
    } else {
      // Reset position
      if (sheetRef.current) {
        sheetRef.current.style.transform = '';
      }
    }
  };

  // Clean up transform style on close
  useEffect(() => {
    if (!isOpen && sheetRef.current) {
      sheetRef.current.style.transform = '';
    }
  }, [isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle mode change with proper typing
  const handleModeChange = (selectedMode: string) => {
    const gameMode = GAME_MODES.find(m => m.value === selectedMode);
    if (gameMode) {
      onModeChange(gameMode.value);
    }
  };

  // Render leaderboard content based on active tab
  const renderLeaderboardContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
        </div>
      );
    }

    switch (activeTab) {
      case 'best':
        return (
          <BestScores
            categories={leaderboard.categories}
            selectedSize={selectedSize}
            selectedDifficulty={selectedDifficulty}
          />
        );
      case 'recent':
        return (
          <RecentGames
            categories={leaderboard.categories}
            achievements={leaderboard.achievements}
            selectedSize={selectedSize}
            selectedDifficulty={selectedDifficulty}
          />
        );
      case 'achievements':
        return (
          <AchievementsList
            achievements={leaderboard.achievements}
          />
        );
      case 'stats':
        return (
          <StatsOverview
            stats={leaderboard.global}
          />
        );
      default:
        return null;
    }
  };

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
          ${MOBILE_LAYOUT_STYLES.SHEET.CONTENT}
          transform transition-transform duration-200 ease-out z-50
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Game menu"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-slate-600 rounded-full mx-auto mb-4" />

        <div className={MOBILE_LAYOUT_STYLES.SHEET.INNER}>
          {/* Quick actions */}
          <button
            type="button"
            className={MOBILE_LAYOUT_STYLES.SHEET.ACTIONS.BUTTON.PRIMARY}
            onClick={onNewGame}
          >
            New Game
          </button>

          {/* Game mode selector */}
          <select
            className={MOBILE_LAYOUT_STYLES.LEADERBOARD.FILTERS.SELECT}
            value={mode}
            onChange={(e) => handleModeChange(e.target.value)}
          >
            {GAME_MODES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {/* Back button */}
          <button
            type="button"
            className={MOBILE_LAYOUT_STYLES.SHEET.ACTIONS.BUTTON.SECONDARY}
            onClick={onBackToMain}
          >
            Back to Main
          </button>

          {/* Leaderboard section */}
          <div className={MOBILE_LAYOUT_STYLES.LEADERBOARD.CONTAINER}>
            <h2 className={MOBILE_LAYOUT_STYLES.LEADERBOARD.HEADER}>Leaderboard</h2>
            
            {/* Tabs */}
            <div className={MOBILE_LAYOUT_STYLES.LEADERBOARD.TABS}>
              {(['best', 'recent', 'achievements', 'stats'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`
                    ${MOBILE_LAYOUT_STYLES.LEADERBOARD.TAB.BASE}
                    ${activeTab === tab 
                      ? MOBILE_LAYOUT_STYLES.LEADERBOARD.TAB.ACTIVE 
                      : MOBILE_LAYOUT_STYLES.LEADERBOARD.TAB.INACTIVE}
                  `}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Filters - Only show for best and recent tabs */}
            {(activeTab === 'best' || activeTab === 'recent') && (
              <div className={MOBILE_LAYOUT_STYLES.LEADERBOARD.FILTERS.CONTAINER}>
                <select
                  className={MOBILE_LAYOUT_STYLES.LEADERBOARD.FILTERS.SELECT}
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="all">All Sizes</option>
                  {GridSizes.SIZES.map((size) => (
                    <option key={size} value={`${size}x${size}`}>
                      {size}x{size}
                    </option>
                  ))}
                </select>

                <select
                  className={MOBILE_LAYOUT_STYLES.LEADERBOARD.FILTERS.SELECT}
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as 'all' | Difficulty)}
                >
                  <option value="all">All Difficulties</option>
                  {DIFFICULTIES.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Leaderboard content with smooth transitions */}
            <div className="overflow-y-auto max-h-[50vh] transition-opacity duration-200">
              {renderLeaderboardContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}