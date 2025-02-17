import type { PatternPreviewProps } from '../types/layout';
import { MOBILE_LAYOUT_STYLES } from '../constants/mobileLayout';
import { GameConstants } from '../constants/gameConstants';

const SIZES = {
  sm: 'w-[160px]',
  md: 'w-[200px]',
  lg: 'w-[240px]',
} as const;

/**
 * Displays the target pattern for the current game mode
 */
export default function PatternPreview({ 
  mode,
  pattern,
  size = 'md',
  className = '',
}: PatternPreviewProps): JSX.Element {
  const {
    CONTAINER,
    HEADER,
    GRID_CONTAINER,
    HELPER_TEXT,
  } = MOBILE_LAYOUT_STYLES.PATTERN_PREVIEW;

  const getItemStyle = (value: number | string) => {
    if (mode === 'classic') {
      // For classic mode, show numbers with consistent styling
      return value === 0 
        ? 'bg-transparent' 
        : 'bg-white dark:bg-gray-700 flex items-center justify-center text-sm font-medium';
    }

    // Color mode
    if (value === 0) return 'bg-slate-700';
    const colorMap: Record<string, string> = {
      'WHITE': 'bg-white',
      'RED': 'bg-red-600',
      'BLUE': 'bg-blue-600',
      'ORANGE': 'bg-orange-500',
      'GREEN': 'bg-green-600',
      'YELLOW': 'bg-yellow-400',
    };
    return colorMap[value as string] || 'bg-gray-400';
  };

  return (
    <div 
      className={`${CONTAINER} ${className}`}
      role="complementary" 
      aria-label="Target pattern"
    >
      <div className="p-4">
        <h2 className={HEADER}>Target Pattern</h2>
        
        <div className={GRID_CONTAINER}>
          <div 
            className={`
              grid gap-1 bg-slate-700 p-2 rounded mx-auto
              ${SIZES[size]}
            `}
            style={{ 
              gridTemplateColumns: `repeat(${pattern[0].length}, 1fr)`,
              gridTemplateRows: `repeat(${pattern.length}, 1fr)`,
              aspectRatio: '1/1',
            }}
          >
            {pattern.map((row, rowIndex) => (
              row.map((value, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    aspect-square w-full rounded-sm
                    ${getItemStyle(value)}
                    transition-all duration-200
                  `}
                  role="presentation"
                >
                  {mode === 'classic' && value !== GameConstants.EMPTY_CELL && (
                    <span className="text-gray-900 dark:text-gray-200">
                      {value}
                    </span>
                  )}
                </div>
              ))
            ))}
          </div>
        </div>

        {/* Helper text - only show on larger screens or landscape */}
        <p className={`${HELPER_TEXT} hidden sm:block`}>
          Arrange the tiles to match this pattern
        </p>
      </div>
    </div>
  );
}