import React from 'react';
import { GridSize } from '../../types/game';
import { GAME_CONFIG } from '../../constants/gameConfig';

// Type definitions
interface PreviewCellProps {
  size: GridSize;
  index: number;
  isEmpty?: boolean;
  'aria-label'?: string;
  'data-testid'?: string;
  role?: string;
}

interface PreviewGridProps {
  size: GridSize;
}

// Utility function to generate unique cell IDs
const generateCellId = (size: GridSize, index: number): string => 
  `preview-cell-${size}-${index}`;

// PreviewCell component with memoization
const PreviewCell = React.memo(function PreviewCell({ 
  size, 
  index, 
  isEmpty = false,
  ...props 
}: PreviewCellProps) {
  return (
    <div
      key={generateCellId(size, index)}
      className={`rounded-sm ${isEmpty ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gray-300 dark:bg-gray-600'}`}
      style={{ aspectRatio: '1 / 1' }}
      role="gridcell"
      aria-label={isEmpty ? 'Empty cell' : `Cell ${index + 1}`}
      {...props}
    />
  );
});

// PreviewGrid component with memoization
export const PreviewGrid = React.memo(function PreviewGrid({ size }: PreviewGridProps) {
  const totalCells = size * size;

  const cells = React.useMemo(() => {
    const filledCells = Array.from(
      { length: totalCells - GAME_CONFIG.EMPTY_TILES_COUNT },
      (_, index) => (
        <PreviewCell 
          key={generateCellId(size, index)} 
          size={size} 
          index={index} 
        />
      )
    );

    const emptyCell = (
      <PreviewCell
        key={generateCellId(size, totalCells - GAME_CONFIG.EMPTY_TILE_OFFSET)}
        size={size}
        index={totalCells - GAME_CONFIG.EMPTY_TILE_OFFSET}
        isEmpty
        aria-label={`Empty cell at position ${size}x${size}`}
        role="gridcell"
      />
    );

    return [...filledCells, emptyCell];
  }, [size, totalCells]);
  
  return (
    <div
      className="grid gap-0.5 w-full aspect-square"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      role="grid"
      aria-label={`${size}x${size} grid preview`}
    >
      {cells}
    </div>
  );
});