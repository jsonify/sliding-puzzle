// client/src/components/SlidingPuzzle.tsx
import React, { useState, useCallback } from 'react';
import { generateSolvablePuzzle } from '../utils/puzzleUtils';

const colors = ['#90caf9', '#f48fb1', '#81c784', '#ffb74d', '#ba68c8', '#4fc3f7'];
const GRID_SIZE = 5;
const EMPTY_POSITION = { row: 4, col: 4 };

const SlidingPuzzle = () => {
  const [board, setBoard] = useState(() => {
    const sequence = generateSolvablePuzzle(GRID_SIZE);
    const initialBoard = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    let seqIndex = 0;
    
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (i === EMPTY_POSITION.row && j === EMPTY_POSITION.col) {
          initialBoard[i][j] = { number: null, color: null, isEmpty: true };
        } else {
          const num = sequence[seqIndex++];
          initialBoard[i][j] = {
            number: num,
            color: colors[Math.floor((num - 1) / 4)],
            isEmpty: false
          };
        }
      }
    }
    return initialBoard;
  });

  const [emptyPos, setEmptyPos] = useState(EMPTY_POSITION);

  const canMove = (row: number, col: number) => {
    return row === emptyPos.row || col === emptyPos.col;
  };

  const handleTileClick = useCallback((clickedRow: number, clickedCol: number) => {
    if (!canMove(clickedRow, clickedCol)) return;

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(r => [...r]);
      
      if (clickedRow === emptyPos.row) {
        // Moving horizontally
        const start = Math.min(clickedCol, emptyPos.col);
        const end = Math.max(clickedCol, emptyPos.col);
        const row = clickedRow;
        
        if (clickedCol < emptyPos.col) {
          // Moving right
          for (let col = end; col > start; col--) {
            newBoard[row][col] = newBoard[row][col - 1];
          }
        } else {
          // Moving left
          for (let col = start; col < end; col++) {
            newBoard[row][col] = newBoard[row][col + 1];
          }
        }
      } else {
        // Moving vertically
        const start = Math.min(clickedRow, emptyPos.row);
        const end = Math.max(clickedRow, emptyPos.row);
        const col = clickedCol;
        
        if (clickedRow < emptyPos.row) {
          // Moving down
          for (let row = end; row > start; row--) {
            newBoard[row][col] = newBoard[row - 1][col];
          }
        } else {
          // Moving up
          for (let row = start; row < end; row++) {
            newBoard[row][col] = newBoard[row + 1][col];
          }
        }
      }
      
      // Place empty tile at clicked position
      newBoard[clickedRow][clickedCol] = newBoard[emptyPos.row][emptyPos.col];
      return newBoard;
    });

    setEmptyPos({ row: clickedRow, col: clickedCol });
  }, [emptyPos]);

  return (
    <div className="flex justify-center items-center min-h-[500px]">
      <div className="w-[500px] h-[500px] bg-gray-100 p-6 rounded-xl">
        <div className="grid grid-rows-5 h-full">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 gap-2">
              {row.map((tile, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-full h-full rounded-lg flex items-center justify-center
                    text-white text-2xl font-bold
                    ${tile.isEmpty ? 'bg-gray-300' : 'hover:brightness-90'}
                    ${canMove(rowIndex, colIndex) && !tile.isEmpty ? 'cursor-pointer' : 'cursor-not-allowed'}
                    transition-all duration-200
                  `}
                  style={{ backgroundColor: tile.isEmpty ? undefined : tile.color }}
                  onClick={() => handleTileClick(rowIndex, colIndex)}
                  disabled={tile.isEmpty || !canMove(rowIndex, colIndex)}
                >
                  {tile.number}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlidingPuzzle;
