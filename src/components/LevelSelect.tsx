import React, { useCallback } from 'react';
import { GridSize, LevelSelectProps } from '../types/game';
import { GAME_CONFIG } from '../constants/gameConfig';
import { LEVEL_SELECT_STYLES as styles } from '../constants/styles';
import { PreviewGrid } from './PreviewGrid/PreviewGrid';
import { ClassicMenuIcon } from './MenuIcons';

// Button component with memoization
const SizeButton = React.memo(function SizeButton({
  size,
  isSelected,
  isUnlocked,
  onClick,
}: {
  size: GridSize;
  isSelected: boolean;
  isUnlocked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={isUnlocked ? onClick : undefined}
      className={`
        relative p-2 rounded-lg
        ${isUnlocked ? styles.BASE_BUTTON : 'cursor-not-allowed opacity-75'}
        ${isSelected ? styles.SELECTED_BUTTON : isUnlocked ? styles.HOVER_BUTTON : ''}
      `}
      aria-label={`${isUnlocked ? 'Select' : 'Locked'} ${size}x${size} grid`}
      aria-pressed={isSelected}
      disabled={!isUnlocked}
    >
      <div className="text-center mb-2 font-medium">
        {size}x{size}
      </div>
      <div className="relative">
        <PreviewGrid size={size} />
        {!isUnlocked && (
          <div className={styles.LOCK_OVERLAY}>
            <span className="text-2xl" role="img" aria-label="Locked">🔒</span>
          </div>
        )}
      </div>
    </button>
  );
});

// Error boundary component
class LevelSelectErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="text-center text-red-600 p-4">
          <h2>Something went wrong with the level selection.</h2>
          <button
            type="button"
            onClick={(): void => this.setState({ hasError: false })}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main component
export function LevelSelect({
  onLevelSelect,
  currentSize = GAME_CONFIG.DEFAULT_SIZE,
  unlockedSizes = new Set([GAME_CONFIG.DEFAULT_SIZE]),
  onBackToMain,
}: LevelSelectProps): JSX.Element {
  // Validate input props with default fallbacks
  const validatedSize = React.useMemo(() => 
    GAME_CONFIG.GRID_SIZES.includes(currentSize) ? currentSize : GAME_CONFIG.DEFAULT_SIZE,
    [currentSize]
  );

  // Memoized callback handler
  const onHandleSizeSelect = useCallback(
    (size: GridSize) => {
      if (unlockedSizes.has(size)) {
        onLevelSelect(size);
      }
    },
    [unlockedSizes, onLevelSelect]
  );

  return (
    <LevelSelectErrorBoundary>
      <div className={styles.CONTAINER}>
        <h1 className={styles.TITLE}>
          Sliding Puzzle
        </h1>

        {/* Grid Size Selection */}
        <div className={styles.SECTION} role="group" aria-labelledby="grid-size-label">
          <h2 id="grid-size-label" className={styles.SECTION_TITLE}>
            Select Grid Size
          </h2>
          <div className={styles.GRID_CONTAINER}>
            {GAME_CONFIG.GRID_SIZES.map(size => (
              <SizeButton
                key={`size-${size}`}
                size={size}
                isSelected={validatedSize === size}
                isUnlocked={unlockedSizes.has(size)}
                onClick={() => onHandleSizeSelect(size)}
              />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className={styles.INSTRUCTIONS}>
          <p>Click or use arrow keys to move tiles</p>
          <p>Arrange the numbers in order with the empty space in the bottom right</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Complete each puzzle to unlock the next size
          </p>
        </div>

        {/* Menu Button */}
        <button
          type="button"
          onClick={onBackToMain}
          className={styles.MENU_BUTTON}
          aria-label="Back to main menu"
        >
          <ClassicMenuIcon />
        </button>
      </div>
    </LevelSelectErrorBoundary>
  );
}