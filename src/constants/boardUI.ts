/** Board UI layout constants */
export const BoardUI = {
  /** Maximum board width in pixels to ensure readability on large screens */
  BOARD_MAX_WIDTH_PX: 500,
  
  /** Gap between tiles in pixels */
  TILE_GAP_PX: 2,
  
  /** Number of gaps in each row/column (gridSize - 1) */
  GAPS_PER_DIMENSION: 4,

  /** Minimum viewport padding in pixels to prevent board from touching screen edges */
  VIEWPORT_MIN_PADDING_PX: 32,

  /** Board padding in rem units */
  BOARD_PADDING_REM: 2,

  /** Minimum length for tile number padding to ensure consistent width */
  TILE_NUMBER_MIN_LENGTH: 2,
} as const;

/** CSS class names for board styling */
export const BoardClassNames = {
  BASE: [
    'grid',
    'bg-gray-100',
    'dark:bg-gray-800',
    'rounded-lg',
    'shadow-lg',
    'game-board'
  ],
  PADDING: (padding: number) => `p-${padding}`,
  WIN_ANIMATION: 'animate-win'
} as const;