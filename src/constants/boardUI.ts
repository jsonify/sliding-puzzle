/** Board UI layout constants */
export const BoardUI = {
  /** Maximum board width in pixels to ensure readability on large screens */
  BOARD_MAX_WIDTH_PX: 600,

  /** Minimum viewport padding in pixels to prevent board from touching screen edges */
  VIEWPORT_MIN_PADDING_PX: 32,

  /** Grid gap size in rem units for larger screens */
  GRID_GAP_REM_MD: 2,

  /** Board padding in rem units */
  BOARD_PADDING_REM: 4,

  /** Minimum length for tile number padding to ensure consistent width */
  TILE_NUMBER_MIN_LENGTH: 2,
} as const;

/** CSS class names for board styling */
export const BoardClassNames = {
  BASE: [
    'grid',
    'gap-1',
    'bg-gray-100',
    'dark:bg-gray-800',
    'rounded-lg',
    'shadow-lg',
    'game-board'
  ],
  RESPONSIVE_GAP: (gap: number) => `md:gap-${gap}`,
  PADDING: (padding: number) => `p-${padding}`,
  WIN_ANIMATION: 'animate-win'
} as const;