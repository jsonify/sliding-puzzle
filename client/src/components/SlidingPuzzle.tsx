// client/src/components/SlidingPuzzle.tsx
import React, { useState, useCallback } from 'react';

const colors = ['#90caf9', '#f48fb1', '#81c784', '#ffb74d', '#ba68c8', '#4fc3f7'];

const GRID_SIZE = 5;
const EMPTY_POSITION = { row: 4, col: 4 };

const SlidingPuzzle = () => {
  const [board, setBoard] = useState(() => {
    const sequence = [7,19,21,16,2,10,13,12,18,1,14,8,11,22,24,9,3,17,4,5,15,20,6,23];
    const initialBoard = [];
    let seqIndex = 0;
    
    for (let i = 0; i < GRID_SIZE; i++) {
      const row = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        if (i === EMPTY_POSITION.row && j === EMPTY_POSITION.col) {
          row.push({ number: null, color: null, isEmpty: true });
        } else {
          row.push({
            number: sequence[seqIndex],
            color: colors[Math.floor(sequence[seqIndex] - 1) / 4],
            isEmpty: false
          });
          seqIndex++;
        }
      }
      initialBoard.push(row);
    }
    return initialBoard;
  });

  const [emptyPos, setEmptyPos] = useState(EMPTY_POSITION);

  const isAdjacent = (row, col) => {
    return (
      (Math.abs(row - emptyPos.row) === 1 && col === emptyPos.col) ||
      (Math.abs(col - emptyPos.col) === 1 && row === emptyPos.row)
    );
  };

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
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="grid grid-cols-5 gap-1 bg-gray-200 p-4 rounded-lg aspect-square">
        {board.map((row, rowIndex) => (
          row.map((tile, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`
                aspect-square rounded-lg flex items-center justify-center
                text-white text-xl font-bold
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
          ))
        ))}
      </div>
    </div>
  );
};

export default SlidingPuzzle;
