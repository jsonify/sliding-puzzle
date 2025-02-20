import type { Position, GameMode } from '../types/game';
import { isValidColor, TileColor } from '../constants/colorMode';

interface TileProps {
  value: number | TileColor | 0;
  mode: GameMode;
  position: Position;
  size: number;
  tileSize: number;
  isMovable: boolean;
  isAdjacent: boolean;
  onClick: () => void;
}

const getColorStyle = (color: TileColor | 0, isMovable: boolean, isAdjacent: boolean) => {
  if (color === 0) return '';
  
  const hoverEffect = isMovable && isAdjacent ? 'hover:scale-105' : '';
  const colorMap: Record<TileColor, string> = {
    WHITE: `bg-white ${hoverEffect}`,
    RED: `bg-red-600 ${hoverEffect}`,
    BLUE: `bg-blue-600 ${hoverEffect}`,
    ORANGE: `bg-orange-500 ${hoverEffect}`,
    GREEN: `bg-green-600 ${hoverEffect}`,
    YELLOW: `bg-yellow-400 ${hoverEffect}`,
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
  isAdjacent,
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
    'transform',  // Enable transform for hover/active animations
    'transition-all',
    'duration-200',
    'ease-in-out', // Smooth easing for animations
    'touch-target', // Mobile-specific class
    'active:scale-95', // Scale down on tap/click
  ].join(' ');

  // Only show hover effects on adjacent tiles
  const stateClasses = (mode === 'classic' || mode === 'timed')
  ? isMovable
    ? `bg-white dark:bg-gray-700 ${
        isAdjacent 
          ? 'hover:scale-105 hover:bg-blue-50 dark:hover:bg-gray-600 hover:shadow-lg' 
          : ''
      } cursor-pointer shadow-md`
    : 'bg-white dark:bg-gray-700/90 cursor-not-allowed opacity-90'
  : `${getColorStyle(value as TileColor | 0, isMovable, isAdjacent)} ${
      isMovable 
        ? 'cursor-pointer shadow-md hover:shadow-lg' 
        : 'cursor-not-allowed opacity-90'
    }`;

  // Skip rendering for empty tile (number 0)
  if (value === 0) {
    return (
      <div
        className={`${baseClasses} ${
          mode === 'color' 
            ? 'bg-slate-700/80' 
            : 'bg-transparent dark:bg-transparent'
        }`}
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