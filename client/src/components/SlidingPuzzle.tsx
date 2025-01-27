// client/src/components/SlidingPuzzle.tsx
import React, { useState, useCallback } from 'react';

const colors = ['#90caf9', '#f48fb1', '#81c784', '#ffb74d', '#ba68c8', '#4fc3f7'];
const GRID_SIZE = 5;
const EMPTY_POSITION = { row: 4, col: 4 };

const SlidingPuzzle = () => {
  const [board, setBoard] = useState(() => {
    const sequence = [7,19,21,16,2,10,13,12,18,1,14,8,11,22,24,9,3,17,4,5,15,20,6,23];
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

  const isAdjacent = (row, col) => (
    (Math.abs(row - emptyPos.row) === 1 && col === emptyPos.col) ||
    (Math.abs(col - emptyPos.col) === 1 && row === emptyPos.row)
  );

  const handleTileClick = useCallback((row, col) => {
    if (!isAdjacent(row, col)) return;

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(r => [...r]);
      const clickedTile = newBoard[row][col];
      newBoard[row][col] = newBoard[emptyPos.row][emptyPos.col];
      newBoard[emptyPos.row][emptyPos.col] = clickedTile;
      return newBoard;
    });

    setEmptyPos({ row, col });
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
                    ${isAdjacent(rowIndex, colIndex) && !tile.isEmpty ? 'cursor-pointer' : 'cursor-not-allowed'}
                    transition-all duration-200
                  `}
                  style={{ backgroundColor: tile.isEmpty ? undefined : tile.color }}
                  onClick={() => handleTileClick(rowIndex, colIndex)}
                  disabled={tile.isEmpty || !isAdjacent(rowIndex, colIndex)}
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