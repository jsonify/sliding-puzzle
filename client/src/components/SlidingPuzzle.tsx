import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { generateSolvablePuzzle } from '../utils/puzzleUtils';
import SolutionGrid from './SolutionGrid';

const colors = ['#01EA72', '#A600EA', '#EB9502', '#035EEA', '#EA1901', '#CBEA02'];
const GRID_SIZE = 5;
const EMPTY_POSITION = { row: 4, col: 4 };

const isSolved = (board: any[][]) => {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const position = i * GRID_SIZE + j;
      
      // Check if empty tile is in correct position (bottom right)
      if (i === GRID_SIZE - 1 && j === GRID_SIZE - 1) {
        if (!board[i][j].isEmpty) return false;
        continue;
      }
      
      // For all other positions, check if tile color matches solution
      if (board[i][j].isEmpty) return false;
      const expectedColorIndex = Math.floor(position / 4);
      if (board[i][j].color !== colors[expectedColorIndex]) return false;
    }
  }
  return true;
};

const generateOrderedBoard = (sequence: number[], emptyPos = EMPTY_POSITION) => {
  const board = Array(GRID_SIZE).fill(null).map((_, row) =>
    Array(GRID_SIZE).fill(null).map((_, col) => {
      const position = row * GRID_SIZE + col;
      
      if (row === emptyPos.row && col === emptyPos.col) {
        return { number: null, color: null, isEmpty: true };
      }
      
      const seqIndex = position - (position >= (emptyPos.row * GRID_SIZE + emptyPos.col) ? 1 : 0);
      const num = sequence[seqIndex];
      
      return {
        number: num,
        color: colors[Math.floor((num - 1) / 4)],
        isEmpty: false
      };
    })
  );
  return board;
};

const generateRandomBoard = (sequence: number[], emptyPos = EMPTY_POSITION) => {
  const shuffledSequence = [...sequence].sort(() => Math.random() - 0.5);
  
  const board = Array(GRID_SIZE).fill(null).map((_, row) =>
    Array(GRID_SIZE).fill(null).map((_, col) => {
      if (row === emptyPos.row && col === emptyPos.col) {
        return { number: null, color: null, isEmpty: true };
      }
      
      const num = shuffledSequence.shift()!;
      return {
        number: num,
        color: colors[Math.floor((num - 1) / 4)],
        isEmpty: false
      };
    })
  );
  return board;
};

const SlidingPuzzle = () => {
  const [currentSeed, setCurrentSeed] = useState<number>();
  const [emptyPos, setEmptyPos] = useState(EMPTY_POSITION);
  const [solved, setSolved] = useState(false);

  const sequence = useMemo(() => 
    generateSolvablePuzzle(GRID_SIZE, currentSeed || Math.floor(Math.random() * 1000000)),
    [currentSeed]
  );

  const [board, setBoard] = useState(() => generateRandomBoard(sequence));

  useEffect(() => {
    const checkSolved = () => {
      if (!solved && isSolved(board)) {
        setSolved(true);
      }
    };
    checkSolved();
  }, [board, solved]);

  const canMove = (row: number, col: number) => {
    if (solved) return false;
    return (row === emptyPos.row || col === emptyPos.col) &&
           !(row === emptyPos.row && col === emptyPos.col);
  };

  const handleTileClick = useCallback((clickedRow: number, clickedCol: number) => {
    if (solved || !canMove(clickedRow, clickedCol)) return;

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(r => [...r]);
      
      if (clickedRow === emptyPos.row) {
        const direction = clickedCol < emptyPos.col ? 1 : -1;
        for (let col = emptyPos.col; col !== clickedCol; col -= direction) {
          newBoard[clickedRow][col] = {...newBoard[clickedRow][col - direction]};
        }
      } else {
        const direction = clickedRow < emptyPos.row ? 1 : -1;
        for (let row = emptyPos.row; row !== clickedRow; row -= direction) {
          newBoard[row][clickedCol] = {...newBoard[row - direction][clickedCol]};
        }
      }
      
      newBoard[clickedRow][clickedCol] = { number: null, color: null, isEmpty: true };
      return newBoard;
    });

    setEmptyPos({ row: clickedRow, col: clickedCol });
  }, [emptyPos]);

  const handleNewPuzzle = useCallback((seed: number) => {
    setCurrentSeed(seed);
    setEmptyPos(EMPTY_POSITION);
    setSolved(false);
    const newSequence = generateSolvablePuzzle(GRID_SIZE, seed);
    setBoard(generateRandomBoard(newSequence));
  }, []);

  const handleAlmostSolve = useCallback(() => {
    if (!currentSeed) return;
    const nearSolvedEmptyPos = { row: 4, col: 3 };
    setEmptyPos(nearSolvedEmptyPos);
    setBoard(generateOrderedBoard(sequence, nearSolvedEmptyPos));
    setSolved(false);
  }, [currentSeed, sequence]);

  return (
    <div className="flex flex-col justify-center items-center min-h-[500px]">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Enter seed"
            className="px-2 py-1 border rounded w-24"
            onChange={(e) => {
              const seed = parseInt(e.target.value) || Math.floor(Math.random() * 1000000);
              setCurrentSeed(seed);
            }}
          />
          <button
            onClick={() => currentSeed && handleNewPuzzle(currentSeed)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Go!
          </button>
        </div>
        <button
          onClick={handleAlmostSolve}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Debug: Almost Solve
        </button>
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
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-2">Solution</h2>
        <SolutionGrid size={GRID_SIZE} colors={colors} seed={currentSeed} />
      </div>
    </div>
  );
};

export default SlidingPuzzle;
