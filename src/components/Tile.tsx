import type { Position, GameMode } from '../types/game';
import { isValidColor, TileColor } from '../constants/colorMode';

interface TileProps {
  value: number | TileColor | 0;
  mode: GameMode;
  position: Position;
  size: number;
  tileSize: number;
  isMovable: boolean;
  onClick: () => void;
}

const getColorStyle = (color: TileColor | 0) => {
  if (color === 0) return '';
  
  const colorMap: Record<TileColor, string> = {
    WHITE: 'bg-white hover:opacity-90',
    RED: 'bg-red-600 hover:opacity-90',
    BLUE: 'bg-blue-600 hover:opacity-90',
    ORANGE: 'bg-orange-500 hover:opacity-90',
    GREEN: 'bg-green-600 hover:opacity-90',
    YELLOW: 'bg-yellow-400 hover:opacity-90',
  };
  
  return colorMap[color as TileColor] || 'bg-gray-400';
};

/**
 * Single tile in the puzzle grid with enhanced mobile support
 */
export default function Tile({ 
  value,
  mode, 
  position,
  size, 
  isMovable, 
  onClick 
}: TileProps): JSX.Element {
  const baseClasses = [
    'flex',
    'items-center',
    'justify-center',
    'font-bold',
    'rounded-lg',
    'select-none',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500',
    'w-full',
    'h-full',
    'aspect-square',
    'text-2xl',
    'transition-all',
    'duration-200',
    'touch-target', // Mobile-specific class
    'active-state', // Mobile animation class
  ].join(' ');

  const stateClasses = mode === 'classic'
    ? isMovable
      ? 'bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 cursor-pointer'
      : 'bg-white dark:bg-gray-700 cursor-not-allowed opacity-90'
    : `${getColorStyle(value as TileColor | 0)} ${isMovable ? 'cursor-pointer' : 'cursor-not-allowed opacity-90'}`;

  // Skip rendering for empty tile (number 0)
  if (value === 0) {
    return (
      <div
        className={baseClasses}
        style={{ visibility: 'hidden' }}
        aria-hidden="true"
        data-testid="tile-empty"
        aria-label="Empty space"
      />
    );
  }

  const handleClick = () => {
    if (!isMovable) return;
    
    // Try to trigger haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
    
    onClick();
  };

  const tilePosition: Position = position;
  const displayValue = mode === 'classic' ? value : '';
  const ariaLabel = mode === 'classic' 
    ? `Tile ${value}` 
    : `${isValidColor(value) ? value : 'Unknown'} colored tile`;

  return (
    <button
      type="button"
      className={`${baseClasses} ${stateClasses}`}
      onClick={handleClick}
      disabled={!isMovable}
      aria-label={ariaLabel}
      data-testid={`tile-${value}`}
      data-position={`${tilePosition.row}-${tilePosition.col}`}
    >
      {displayValue}
    </button>
  );
}