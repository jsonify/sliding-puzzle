import type { PatternPreviewProps } from '../types/layout';
import { useOrientation } from '../hooks/useOrientation';
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
  const { orientation } = useOrientation();
  const {
    CONTAINER,
    HEADER,
    GRID_CONTAINER,
    HELPER_TEXT,
  } = MOBILE_LAYOUT_STYLES.PATTERN_PREVIEW;

  const getItemStyle = (value: number | string) => {
    if (mode === 'classic' || mode === 'timed') {
      // For classic mode, show numbers with consistent styling
      const baseStyle = value === 0 
        ? 'bg-transparent border border-dashed border-gray-600'
        : 'bg-white dark:bg-gray-700 flex items-center justify-center font-medium text-gray-900 dark:text-gray-200';
      return baseStyle;
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
      className={`${CONTAINER} ${className} ${orientation === 'portrait' ? 'w-full max-w-md mx-auto' : 'w-full'}`}
      role="complementary" 
      aria-label="Target pattern"
    >
      <div className="p-4">
        <h2 className={`${HEADER} mb-2 text-center`}>Target Pattern</h2>
        <div className={GRID_CONTAINER}>
          <div 
            className={`
              grid gap-1 bg-slate-700/50 p-2 rounded-lg mx-auto
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
                    aspect-square w-full rounded
                    ${getItemStyle(value)}
                    transition-all duration-150
                  `}
                  role="presentation"
                >
                  {(mode === 'classic' || mode === 'timed') && value !== GameConstants.EMPTY_CELL && (
                    <span className="text-sm">
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