import { useCallback, useMemo } from 'react';
import { BoardClassNames, BoardUI } from '../constants/boardUI';
import type { BoardProps, Position, GameMode, ClassicBoard, ColorBoard } from '../types/game';
import { isValidColor } from '../constants/colorMode';
import { getMovablePositions } from '../utils/gameUtils';
import Tile from './Tile';
import TimerDisplay from './TimerDisplay';

/** Create a unique ID for a tile */
const createTileId = (number: number | string, row: number, col: number, mode: GameMode): string => {
  const padding = mode === 'classic' ? String(number).padStart(BoardUI.TILE_NUMBER_MIN_LENGTH, '0') : String(number);
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
  movablePositions.some(p => p.row === pos.row && p.col === p.col);

/** Check if a position is directly adjacent to empty tile */
const isAdjacentToEmpty = (pos: Position, tiles: ClassicBoard | ColorBoard): boolean => {
  // Find empty tile position
  let emptyPos: Position | null = null;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = 0; j < tiles[i].length; j++) {
      if (tiles[i][j] === 0) {
        emptyPos = { row: i, col: j };
        break;
      }
    }
    if (emptyPos) break;
  }

  if (!emptyPos) return false;

  // Check if position is directly adjacent (up, down, left, right)
  return (
    (Math.abs(pos.row - emptyPos.row) === 1 && pos.col === emptyPos.col) ||
    (Math.abs(pos.col - emptyPos.col) === 1 && pos.row === emptyPos.row)
  );
};

/** Get board CSS classes */
const getBoardClasses = (isWon: boolean): string => [
  ...BoardClassNames.BASE,
  'w-full',
  'h-full',
  'max-w-md',
  'mx-auto',
  'touch-none',
  isWon ? BoardClassNames.WIN_ANIMATION : '',
].filter(Boolean).join(' ');

/** Calculate tile size based on container */
const calculateTileSize = (containerSize: number, gridSize: number): number => {
  const totalGapSpace = BoardUI.TILE_GAP_PX * (gridSize - 1);
  return (containerSize - totalGapSpace) / gridSize;
};

/** Type guard to check if board is a classic board */
const isClassicBoard = (board: ClassicBoard | ColorBoard, mode: GameMode): board is ClassicBoard => {
  return mode === 'classic' || mode === 'timed';
};

/** Type guard to check if board is a color board */
const isColorBoard = (board: ClassicBoard | ColorBoard, mode: GameMode): board is ColorBoard => {
  return mode === 'color' && !isClassicBoard(board, mode);
};

/** Type guard to check if mode is timed */
const isTimedMode = (mode: GameMode): boolean => {
  return mode === 'timed';
};

/** Board component that displays and manages the puzzle grid */
export default function Board({ 
  mode,
  gridSize, 
  tiles, 
  onTileClick, 
  isWon,
  timeRemaining,
}: BoardProps): JSX.Element {
  // Validate board type matches mode
  if ((mode === 'classic' || mode === 'timed') && !isClassicBoard(tiles, mode)) {
    throw new Error('Invalid board type for classic mode');
  }
  if (mode === 'color' && !isColorBoard(tiles, mode)) {
    throw new Error('Invalid board type for color mode');
  }

  // Get the correct board type based on mode (timed mode uses classic board type)
  const typedTiles = (mode === 'classic' || mode === 'timed') 
    ? tiles as ClassicBoard 
    : tiles as ColorBoard;
    
  // Memoize expensive calculations
  const movablePositions = useMemo(() => getMovablePositions(tiles), [tiles]);
  const boardClasses = useMemo(() => getBoardClasses(isWon), [isWon]);
  const containerSize = useMemo(() => {
    // Use the smaller of the viewport width or 400px
    return Math.min(window.innerWidth - 32, 400); // 32px for padding
  }, []);
  const tileSize = useMemo(() => calculateTileSize(containerSize, gridSize), [containerSize, gridSize]);

  // Memoize position check functions
  const checkPositionMovable = useCallback(
    (position: Position) => isPositionMovable(position, movablePositions),
    [movablePositions]
  );

  const checkAdjacentToEmpty = useCallback(
    (position: Position) => isAdjacentToEmpty(position, tiles),
    [tiles]
  );

  return (
    <div
      className={boardClasses}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gap: `${BoardUI.TILE_GAP_PX}px`,
      }}
      role="grid"
      aria-label="Sliding puzzle board"
      data-testid="game-board"
    >
      {isTimedMode(mode) && timeRemaining !== undefined && (
        <div className="fixed top-16 left-0 right-0 z-50 flex justify-center">
          <TimerDisplay
            timeRemaining={timeRemaining}
            gridSize={gridSize}
            isPaused={false}
            className="bg-slate-800/80 backdrop-blur-md p-3 px-6 rounded-lg shadow-xl border border-slate-600"
          />
        </div>
      )}
      {typedTiles.map((row, rowIndex) => (
        <div 
          key={createRowKey(gridSize, rowIndex)} 
          className="contents" 
          role="row"
        >
          {row.map((value, colIndex) => {
            const position = createPosition(rowIndex, colIndex);
            const isMovable = checkPositionMovable(position);
            const isAdjacent = checkAdjacentToEmpty(position);
            
            return (
              <Tile
                key={createTileId(value, position.row, position.col, mode)}
                value={value}
                position={position}
                mode={mode}
                size={gridSize}
                tileSize={tileSize}
                isMovable={isMovable}
                isAdjacent={isAdjacent}
                onClick={() => onTileClick(position)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}