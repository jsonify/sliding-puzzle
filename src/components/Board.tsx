import type { BoardProps, Position } from '../types/game';
import { getMovablePositions } from '../utils/gameUtils';
import Tile from './Tile';

/** UI layout constants */
const UI = {
  /** Maximum board width in pixels */
  MAX_WIDTH: 600,
  /** Minimum padding from viewport edges */
  MIN_PADDING: 32,
  /** Grid gap size for larger screens */
  MD_GAP: 2,
  /** Default padding for board */
  BOARD_PADDING: 4,
  /** Minimum length for number padding */
  NUM_PAD_LENGTH: 2,
} as const;

/** Create a unique ID for a tile */
const createTileId = (number: number, row: number, col: number): string => {
  const padding = String(number).padStart(UI.NUM_PAD_LENGTH, '0');
  return `tile-${number === 0 ? 'empty' : padding}-${row}-${col}`;
};

/** Create a position object */
const createPosition = (row: number, col: number): Position => ({
  row,
  col,
});

/** Create a unique row key */
const createRowKey = (gridSize: number, row: number): string => 
  `board-row-${gridSize}-${row}`;

/** Check if a position is movable */
const isPositionMovable = (pos: Position, movablePositions: Position[]): boolean =>
  movablePositions.some(p => p.row === pos.row && p.col === pos.col);

/** Get board CSS classes */
const getBoardClasses = (isWon: boolean): string => [
  'grid',
  'gap-1',
  `md:gap-${UI.MD_GAP}`,
  `p-${UI.BOARD_PADDING}`,
  'bg-gray-100',
  'dark:bg-gray-800',
  'rounded-lg',
  'shadow-lg',
  isWon && 'animate-win',
].filter(Boolean).join(' ');

/** Board component that displays and manages the puzzle grid */
export default function Board({ gridSize, tiles, onTileClick, isWon }: BoardProps): JSX.Element {
  const movablePositions = getMovablePositions(tiles);
  const boardClasses = getBoardClasses(isWon);

  return (
    <div
      className={boardClasses}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        maxWidth: `${Math.min(UI.MAX_WIDTH, window.innerWidth - UI.MIN_PADDING)}px`,
        aspectRatio: '1 / 1',
      }}
      role="grid"
      aria-label="Sliding puzzle board"
    >
      {tiles.map((row, rowIndex) => (
        <div key={createRowKey(gridSize, rowIndex)} className="contents">
          {row.map((number, colIndex) => {
            const position = createPosition(rowIndex, colIndex);
            return (
              <Tile
                key={createTileId(number, position.row, position.col)}
                number={number}
                position={position}
                size={gridSize}
                isMovable={isPositionMovable(position, movablePositions)}
                onClick={() => onTileClick(position)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}