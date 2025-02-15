import React, { useCallback, useState } from 'react';
import { Difficulty, GridSize, LevelSelectProps } from '../types/game';
import { GAME_CONFIG, DEFAULT_CONFIG } from '../constants/gameConfig';
import { LEVEL_SELECT_STYLES as styles } from '../constants/styles';
import { PreviewGrid } from './PreviewGrid/PreviewGrid';

// Define button style variants
const getButtonStyles = (isSelected: boolean): string => 
  isSelected
    ? `${styles.BASE_BUTTON} ${styles.SELECTED_BUTTON}`
    : `${styles.BASE_BUTTON} ${styles.HOVER_BUTTON}`;

const getDifficultyStyles = (isSelected: boolean): string => 
  isSelected
    ? `${styles.BASE_DIFFICULTY} ${styles.SELECTED_DIFFICULTY}`
    : `${styles.BASE_DIFFICULTY} ${styles.DEFAULT_DIFFICULTY}`;

// Button components with memoization
const SizeButton = React.memo(function SizeButton({
  size,
  isSelected,
  onClick,
}: {
  size: GridSize;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-lg ${getButtonStyles(isSelected)}`}
      aria-label={`Select ${size}x${size} grid`}
      aria-pressed={isSelected}
    >
      <div className="text-center mb-2 font-medium">
        {size}x{size}
      </div>
      <PreviewGrid size={size} />
    </button>
  );
});

const DifficultyButton = React.memo(function DifficultyButton({
  difficulty,
  isSelected,
  onClick,
}: {
  difficulty: Difficulty;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={getDifficultyStyles(isSelected)}
      aria-label={`Select ${difficulty} difficulty`}
      aria-pressed={isSelected}
    >
      {difficulty}
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
          <button type="button"
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
  currentSize = DEFAULT_CONFIG.size,
  currentDifficulty = DEFAULT_CONFIG.difficulty,
}: LevelSelectProps): JSX.Element {
  // State for tracking loading and error states
  const [isLoading, setIsLoading] = useState(false);

  // Validate input props with default fallbacks
  const validatedSize = React.useMemo(() => 
    GAME_CONFIG.GRID_SIZES.includes(currentSize) ? currentSize : DEFAULT_CONFIG.size,
    [currentSize]
  );

  const validatedDifficulty = React.useMemo(() => 
    GAME_CONFIG.DIFFICULTIES.includes(currentDifficulty) ? currentDifficulty : DEFAULT_CONFIG.difficulty,
    [currentDifficulty]
  );

  // Memoized callback handlers
  const onHandleSizeSelect = useCallback(
    (size: GridSize) => {
      setIsLoading(true);
      try {
        onLevelSelect(size, validatedDifficulty);
      } finally {
        setIsLoading(false);
      }
    },
    [validatedDifficulty, onLevelSelect]
  );

  const onHandleDifficultySelect = useCallback(
    (difficulty: Difficulty) => {
      setIsLoading(true);
      try {
        onLevelSelect(validatedSize, difficulty);
      } finally {
        setIsLoading(false);
      }
    },
    [validatedSize, onLevelSelect]
  );

  const onHandleStartGame = useCallback(() => {
    setIsLoading(true);
    try {
      onLevelSelect(validatedSize, validatedDifficulty);
    } finally {
      setIsLoading(false);
    }
  }, [validatedSize, validatedDifficulty, onLevelSelect]);

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
                onClick={() => onHandleSizeSelect(size)}
              />
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className={styles.SECTION} role="group" aria-labelledby="difficulty-label">
          <h2 id="difficulty-label" className={styles.SECTION_TITLE}>
            Select Difficulty
          </h2>
          <div className={styles.DIFFICULTY_CONTAINER}>
            {GAME_CONFIG.DIFFICULTIES.map(difficulty => (
              <DifficultyButton
                key={`difficulty-${difficulty}`}
                difficulty={difficulty}
                isSelected={validatedDifficulty === difficulty}
                onClick={() => onHandleDifficultySelect(difficulty)}
              />
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={onHandleStartGame}
            className={styles.START_BUTTON}
            aria-label="Start game with selected settings"
            disabled={isLoading}
          >
            {isLoading ? 'Starting...' : 'Start Game'}
          </button>
        </div>

        {/* Instructions */}
        <div className={styles.INSTRUCTIONS}>
          <p>Click or use arrow keys to move tiles</p>
          <p>Arrange the numbers in order with the empty space in the bottom right</p>
        </div>
      </div>
    </LevelSelectErrorBoundary>
  );
}