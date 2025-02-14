import type { TileProps } from '../types/game';

/** Grid size breakpoints for styling */
const GRID_SIZE = {
  SMALL: 3,
  MEDIUM: 5,
  LARGE: 6,
} as const;

/** Single tile in the puzzle grid */
export default function Tile({ number, position, size, isMovable, onClick }: TileProps): JSX.Element {
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
    padding: size <= (GRID_SIZE.SMALL + 1)
      ? 'p-4'
      : (size <= GRID_SIZE.LARGE ? 'p-3' : 'p-2'),
  };

  const stateClasses = isMovable
    ? 'bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 cursor-pointer'
    : 'bg-white dark:bg-gray-700 cursor-not-allowed';

  // Skip rendering for empty tile (number 0)
  if (number === 0) {
    return <div className="bg-gray-100 dark:bg-gray-800 rounded" />;
  }

  return (
    <button
      type="button"
      className={`${baseClasses} ${sizeClasses.text} ${sizeClasses.padding} ${stateClasses}`}
      onClick={onClick}
      disabled={!isMovable}
      aria-label={`Tile ${number}`}
      data-testid={`tile-${number}`}
      data-position={`${String(position.row)}-${String(position.col)}`}
    >
      {number}
    </button>
  );
}