import { useCallback, useMemo } from 'react';
import { BoardClassNames, BoardUI } from '../constants/boardUI';
import type { BoardProps, Position, GameMode, ClassicBoard, ColorBoard } from '../types/game';
import { isValidColor } from '../constants/colorMode';
import { getMovablePositions } from '../utils/gameUtils';
import Tile from './Tile';

const PADDING_FACTOR = 2;

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
  movablePositions.some(p => p.row === pos.row && p.col === pos.col);

/** Get board CSS classes */
const getBoardClasses = (isWon: boolean): string => [
  ...BoardClassNames.BASE,
  BoardClassNames.PADDING(BoardUI.BOARD_PADDING_REM),
  isWon ? BoardClassNames.WIN_ANIMATION : '',
].filter(Boolean).join(' ');

/** Calculate responsive board width based on viewport */
const calculateBoardWidth = (): number => {
  if (typeof window === 'undefined') return BoardUI.BOARD_MAX_WIDTH_PX;
  
  const viewportWidth = window.innerWidth;
  const availableWidth = viewportWidth - (BoardUI.VIEWPORT_MIN_PADDING_PX * PADDING_FACTOR);
  return Math.min(BoardUI.BOARD_MAX_WIDTH_PX, Math.max(availableWidth, 0));
};

/** Type guard to check if board is a classic board */
const isClassicBoard = (board: ClassicBoard | ColorBoard, mode: GameMode): board is ClassicBoard => {
  return mode === 'classic';
};

/** Type guard to check if board is a color board */
const isColorBoard = (board: ClassicBoard | ColorBoard, mode: GameMode): board is ColorBoard => {
  return mode === 'color';
};

/** Board component that displays and manages the puzzle grid */
export default function Board({ 
  mode,
  gridSize, 
  tiles, 
  onTileClick, 
  isWon, 
  onBackToMain 
}: BoardProps): JSX.Element {
  // Validate board type matches mode
  if (mode === 'classic' && !isClassicBoard(tiles, mode)) {
    throw new Error('Invalid board type for classic mode');
  }
  if (mode === 'color' && !isColorBoard(tiles, mode)) {
    throw new Error('Invalid board type for color mode');
  }

  // Get the correct board type based on mode
  const typedTiles = mode === 'classic' ? tiles as ClassicBoard : tiles as ColorBoard;

  // Memoize expensive calculations
  const movablePositions = useMemo(() => getMovablePositions(tiles), [tiles]);
  const boardClasses = useMemo(() => getBoardClasses(isWon), [isWon]);
  const boardWidth = useMemo(() => calculateBoardWidth(), []);

  // Memoize position check function to prevent unnecessary re-renders
  const checkPositionMovable = useCallback(
    (position: Position) => isPositionMovable(position, movablePositions),
    [movablePositions]
  );

  return (
    <div className="board-container">
      <button onClick={onBackToMain} className="back-button">Back to Main</button>
      <div
        className={boardClasses}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          maxWidth: `${boardWidth}px`,
          gap: '1px',
          aspectRatio: '1 / 1',
        }}
        role="grid"
        aria-label="Sliding puzzle board"
        data-testid="game-board"
      >
        {typedTiles.map((row, rowIndex) => (
          <div 
            key={createRowKey(gridSize, rowIndex)} 
            className="contents" 
            role="row"
          >
            {row.map((value, colIndex) => {
              const position = createPosition(rowIndex, colIndex);
              return (
                <Tile
                  key={createTileId(value, position.row, position.col, mode)}
                  value={value}
                  position={position}
                  mode={mode}
                  size={gridSize}
                  isMovable={checkPositionMovable(position)}
                  onClick={() => onTileClick(position)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}