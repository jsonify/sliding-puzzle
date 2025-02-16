import type { Position } from '../types/game';

/** Grid size breakpoints for styling */
const SMALL_SIZE = 3;
const MEDIUM_SIZE = 5;
const LARGE_SIZE = 6;
const GRID_SIZE = {
  SMALL: SMALL_SIZE,
  MEDIUM: MEDIUM_SIZE,
  LARGE: LARGE_SIZE,
} as const;

const PADDING_SIZE = 1;

/** Single tile in the puzzle grid */
export default function Tile({ 
  number, 
  position,
  size, 
  isMovable, 
  onClick 
}: {
  number: number;
  position: Position;
  size: number;
  isMovable: boolean;
  onClick: () => void;
}): JSX.Element {
  const baseClasses = [
    'flex',
    'items-center',
    'justify-center',
    'font-bold',
    'transition-all',
    'duration-150',
    'rounded',
    'select-none',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500',
  ].join(' ');

  const sizeClasses = {
    text: size <= GRID_SIZE.SMALL 
      ? 'text-3xl'
      : (size <= GRID_SIZE.MEDIUM ? 'text-2xl' : 'text-xl'),
    padding: size <= (GRID_SIZE.SMALL + PADDING_SIZE)
      ? 'p-4'
      : (size <= GRID_SIZE.LARGE ? 'p-3' : 'p-2'),
  };

  const stateClasses = isMovable
    ? 'bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 cursor-pointer'
    : 'bg-white dark:bg-gray-700 cursor-not-allowed';

  // Skip rendering for empty tile (number 0)
  if (number === 0) {
    return (
      <div 
        className="bg-gray-100 dark:bg-gray-800 rounded" 
        data-testid="tile-empty"
        aria-label="Empty space"
      />
    );
  }

  const tilePosition: Position = position;

  return (
    <button
      type="button"
      className={`${baseClasses} ${sizeClasses.text} ${sizeClasses.padding} ${stateClasses}`}
      onClick={onClick}
      disabled={!isMovable}
      aria-label={`Tile ${number}`}
      data-testid={`tile-${number}`}
      data-position={`${tilePosition.row}-${tilePosition.col}`}
    >
      {number}
    </button>
  );
}