import { useCallback, useMemo } from 'react';
import { BoardClassNames, BoardUI } from '../constants/boardUI';
import type { BoardProps, Position } from '../types/game';
import { getMovablePositions } from '../utils/gameUtils';
import Tile from './Tile';

const PADDING_FACTOR = 2;

/** Create a unique ID for a tile */
const createTileId = (number: number, row: number, col: number): string => {
  const padding = String(number).padStart(BoardUI.TILE_NUMBER_MIN_LENGTH, '0');
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
  BoardClassNames.RESPONSIVE_GAP(BoardUI.GRID_GAP_REM_MD),
  BoardClassNames.PADDING(BoardUI.BOARD_PADDING_REM),
  isWon && BoardClassNames.WIN_ANIMATION,
].filter(Boolean).join(' ');

/** Calculate responsive board width based on viewport */
const calculateBoardWidth = (): number => {
  if (typeof window === 'undefined') return BoardUI.BOARD_MAX_WIDTH_PX;
  
  const viewportWidth = window.innerWidth;
  const availableWidth = viewportWidth - (BoardUI.VIEWPORT_MIN_PADDING_PX * PADDING_FACTOR);
  return Math.min(BoardUI.BOARD_MAX_WIDTH_PX, Math.max(availableWidth, 0));
};

/** Board component that displays and manages the puzzle grid */
export default function Board({ gridSize, tiles, onTileClick, isWon, onBackToMain }: BoardProps): JSX.Element {
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
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          maxWidth: `${boardWidth}px`,
          aspectRatio: '1 / 1',
        }}
        role="grid"
        aria-label="Sliding puzzle board"
        data-testid="game-board"
      >
        {tiles.map((row: number[], rowIndex: number) => (
          <div 
            key={createRowKey(gridSize, rowIndex)} 
            className="contents" 
            role="row"
          >
            {row.map((number: number, colIndex: number) => {
              const position = createPosition(rowIndex, colIndex);
              return (
                <Tile
                  key={createTileId(number, position.row, position.col)}
                  number={number}
                  position={position}
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