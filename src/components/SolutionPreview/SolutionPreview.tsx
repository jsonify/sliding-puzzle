import type { ColorBoard } from '../../types/game';
import { COLORS, type TileColor } from '../../constants/colorMode';

interface SolutionPreviewProps {
  targetPattern: ColorBoard;
}

/** Component to display the target pattern for color mode */
export default function SolutionPreview({ targetPattern }: SolutionPreviewProps): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-4">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
        Target Pattern
      </h2>
      <div 
        className="grid gap-0.5 bg-gray-200 dark:bg-gray-800 p-1 rounded"
        style={{
          gridTemplateColumns: `repeat(${targetPattern[0].length}, 1fr)`,
          width: 'min(120px, 30vw)', // Responsive width that scales with viewport
          aspectRatio: '1 / 1',
        }}
      >
        {targetPattern.map((row, rowIndex) => (
          row.map((value, colIndex) => {
            const isEmptyTile = value === 0;
            return (
              <div
                key={`preview-${rowIndex}-${colIndex}`}
                className={`
                  w-full aspect-square rounded
                  ${isEmptyTile ? 'bg-gray-100 dark:bg-gray-900' : ''}
                `}
                style={!isEmptyTile ? { 
                  backgroundColor: COLORS[value as TileColor],
                  transition: 'background-color 0.2s ease'
                } : undefined}
                aria-label={isEmptyTile ? 'Empty space' : `${value} colored tile`}
              />
            );
          })
        ))}
      </div>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center max-w-[180px]">
        Arrange the tiles to match this pattern
      </p>
    </div>
  );
}