// client/src/components/SlidingPuzzle.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { generateSolvablePuzzle } from '../utils/puzzleUtils';
import SolutionGrid from './SolutionGrid';

interface GameSettings {
  showNumbers: boolean;
}

const colors = ['#01EA72', '#A600EA', '#EB9502', '#035EEA', '#EA1901', '#CBEA02'];
const isSolved = (board: any[][]) => {
  let expectedNum = 1;
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (i === GRID_SIZE - 1 && j === GRID_SIZE - 1) {
        // Last position should be empty
        if (!board[i][j].isEmpty) return false;
      } else {
        if (board[i][j].number !== expectedNum) return false;
        expectedNum++;
      }
    }
  }
  return true;
};
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
  const [solved, setSolved] = useState(false);
  const [settings, setSettings] = useState<GameSettings>({
    showNumbers: true
  });

  useEffect(() => {
    if (isSolved(board)) {
      setSolved(true);
    }
  }, [board]);

  const canMove = (row: number, col: number) => {
    return row === emptyPos.row || col === emptyPos.col;
  };

  const handleTileClick = useCallback((clickedRow: number, clickedCol: number) => {
    if (!canMove(clickedRow, clickedCol)) return;

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(r => [...r]);
      
      // Store the clicked tile
      const clickedTile = newBoard[clickedRow][clickedCol];
      
      if (clickedRow === emptyPos.row) {
        // Moving horizontally
        const direction = clickedCol < emptyPos.col ? 1 : -1;
        for (let col = emptyPos.col; col !== clickedCol; col -= direction) {
          newBoard[clickedRow][col] = newBoard[clickedRow][col - direction];
        }
      } else {
        // Moving vertically
        const direction = clickedRow < emptyPos.row ? 1 : -1;
        for (let row = emptyPos.row; row !== clickedRow; row -= direction) {
          newBoard[row][clickedCol] = newBoard[row - direction][clickedCol];
        }
      }
      
      // Place empty tile at clicked position
      newBoard[clickedRow][clickedCol] = { number: null, color: null, isEmpty: true };
      return newBoard;
    });

    setEmptyPos({ row: clickedRow, col: clickedCol });
  }, [emptyPos]);

  return (
    <div className="flex flex-col justify-center items-center min-h-[500px]">
      <div className="mb-4 flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.showNumbers}
            onChange={(e) => setSettings(prev => ({ ...prev, showNumbers: e.target.checked }))}
            className="w-4 h-4"
          />
          <span>Show Numbers</span>
        </label>
      </div>
      {solved && (
        <div className="mb-4 p-4 bg-green-500 text-white rounded-lg text-xl font-bold">
          Congratulations! Puzzle Solved! 🎉
        </div>
      )}
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
                  {settings.showNumbers ? tile.number : ''}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-2">Solution</h2>
        <SolutionGrid size={GRID_SIZE} colors={colors} showNumbers={settings.showNumbers} />
      </div>
    </div>
  );
};

export default SlidingPuzzle;
