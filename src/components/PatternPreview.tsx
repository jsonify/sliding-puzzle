import type { PatternPreviewProps } from '../types/layout';
import { MOBILE_LAYOUT_STYLES } from '../constants/mobileLayout';

/**
 * Displays the target pattern for the current game mode
 */
export default function PatternPreview({ 
  mode,
  pattern 
}: PatternPreviewProps): JSX.Element {
  const {
    CONTAINER,
    HEADER,
    GRID,
    GRID_CONTAINER,
    HELPER_TEXT,
  } = MOBILE_LAYOUT_STYLES.PATTERN_PREVIEW;

  const getItemStyle = (value: number | string) => {
    if (mode === 'classic') {
      return value === 0 ? 'bg-transparent' : 'bg-white dark:bg-gray-700';
    }

    // Color mode
    if (value === 0) return 'bg-transparent';
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
    <div className={CONTAINER} role="complementary" aria-label="Target pattern">
      <div className="p-4">
        <h2 className={HEADER}>Target Pattern</h2>
        
        <div className={GRID_CONTAINER}>
          <div className={GRID}>
            {pattern.flat().map((value, index) => (
              <div
                key={index}
                className={`
                  aspect-square rounded-sm shadow-sm
                  ${getItemStyle(value)}
                  transition-all duration-200 hover:scale-105
                `}
                role="presentation"
              />
            ))}
          </div>
        </div>

        <p className={HELPER_TEXT}>
          Arrange the tiles to match this pattern
        </p>
      </div>
    </div>
  );
}