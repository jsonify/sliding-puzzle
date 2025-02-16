import type { Position, GameMode } from '../types/game';
import { COLORS, isValidColor, type TileColor } from '../constants/colorMode';
import { BoardUI } from '../constants/boardUI';

/** Get background color for a colored tile */
const getColorStyle = (color: TileColor | 0) => {
  if (color === 0) return '';
  // Map colors to Tailwind classes
  const colorMap: Record<TileColor, string> = {
    WHITE: 'bg-white hover:opacity-90',
    RED: 'bg-red-600 hover:opacity-90',
    BLUE: 'bg-blue-600 hover:opacity-90',
    ORANGE: 'bg-orange-500 hover:opacity-90',
    GREEN: 'bg-green-600 hover:opacity-90',
    YELLOW: 'bg-yellow-400 hover:opacity-90',
  };
  
  return colorMap[color] || 'bg-gray-400';
};

/** Single tile in the puzzle grid */
export default function Tile({ 
  value,
  mode, 
  position,
  size, 
  isMovable, 
  tileSize,
  onClick 
}: {
  value: number | TileColor | 0;
  mode: GameMode;
  position: Position;
  size: number;
  isMovable: boolean;
  tileSize: number;
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
    'w-full',
    'h-full',
    'aspect-square',
    'text-2xl',
  ].join(' ');

  let stateClasses = '';
  if (mode === 'classic') {
    stateClasses = isMovable
      ? 'bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 cursor-pointer'
      : 'bg-white dark:bg-gray-700 cursor-not-allowed';
  } else {
    // Color mode
    const colorValue = value as TileColor | 0;
    stateClasses = `${getColorStyle(colorValue)} ${isMovable ? 'cursor-pointer' : 'cursor-not-allowed'}`;
  }

  // Skip rendering for empty tile (number 0)
  if (value === 0) {
    return (
      <div
        className={`${baseClasses}`}
        style={{ visibility: 'hidden' }}
        aria-hidden="true"
        data-testid="tile-empty"
        aria-label="Empty space"
      />
    );
  }

  const tilePosition: Position = position;
  const displayValue = mode === 'classic' ? value : '';
  const ariaLabel = mode === 'classic' 
    ? `Tile ${value}` 
    : `${isValidColor(value) ? value : 'Unknown'} colored tile`;

  return (
    <button
      type="button"
      className={`${baseClasses} ${stateClasses}`}
      style={{
        width: `${tileSize}px`,
        height: `${tileSize}px`,
      }}
      onClick={onClick}
      disabled={!isMovable}
      aria-label={ariaLabel}
      data-testid={`tile-${value}`}
      data-position={`${tilePosition.row}-${tilePosition.col}`}
    >
      {displayValue}
    </button>
  );
}