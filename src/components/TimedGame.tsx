import React, { useCallback, useState, useMemo, useEffect } from 'react';
import type { GridSize, Position } from '../types/game';
import { useTimer } from '../hooks/useTimer';
import Board from './Board';
import GameEndModal from './GameEndModal';
import { getMovablePositions } from '../utils/gameUtils';
import { playSound, toggleMute, isSoundMuted } from '../utils/soundUtils';
import { TIMED_MODE_CONFIG } from '../constants/gameConfig';

interface TimedGameProps {
  gridSize: GridSize;
  onBackToMain: () => void;
}

const TimedGame: React.FC<TimedGameProps> = ({ gridSize, onBackToMain }) => {
  const [board, setBoard] = useState<number[][]>(() => {
    // Initialize board based on grid size
    const numbers = Array.from({ length: gridSize * gridSize - 1 }, (_, i) => i + 1);
    numbers.push(0); // Add empty tile
    const newBoard: number[][] = [];
    
    for (let i = 0; i < gridSize; i++) {
      newBoard.push(numbers.slice(i * gridSize, (i + 1) * gridSize));
    }
    return newBoard;
  });

  const [isGameActive, setIsGameActive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isMuted, setIsMuted] = useState(isSoundMuted());

  const handleTimeUp = useCallback(() => {
    playSound('timeUp');
    setIsGameActive(false);
  }, []);

  const { timeRemaining, totalTime, stopTimer } = useTimer({
    gridSize,
    isActive: isGameActive && !isWon,
    isPaused,
    onTimeUp: handleTimeUp,
  });

  // Sound effects for low time
  useEffect(() => {
    if (isGameActive && !isPaused && timeRemaining <= TIMED_MODE_CONFIG.warningTime) {
      playSound('tick');
    }
  }, [isGameActive, isPaused, timeRemaining]);

  const handleToggleMute = useCallback(() => {
    toggleMute();
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleTogglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Handle tile movement
  const handleTileClick = useCallback((position: Position) => {
    if (!isGameActive || isWon || isPaused) return;

    const movablePositions = getMovablePositions(board);
    const isMovable = movablePositions.some(
      (pos) => pos.row === position.row && pos.col === position.col
    );

    if (!isMovable) return;

    // Find empty position
    let emptyPos: Position | null = null;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) {
          emptyPos = { row: i, col: j };
          break;
        }
      }
      if (emptyPos) break;
    }

    if (!emptyPos) return;

    // Create new board with moved tile
    const newBoard = board.map((row) => [...row]);
    newBoard[emptyPos.row][emptyPos.col] = board[position.row][position.col];
    newBoard[position.row][position.col] = 0;
    setBoard(newBoard);
    setMoves((prev) => prev + 1);

    // Check win condition
    const isComplete = newBoard.every((row, i) =>
      row.every((cell, j) => {
        const expectedValue = i * gridSize + j + 1;
        return cell === (expectedValue === gridSize * gridSize ? 0 : expectedValue);
      })
    );

    if (isComplete) {
      setIsWon(true);
      stopTimer();
      playSound('victory');
    }
  }, [board, gridSize, isGameActive, isPaused, isWon, stopTimer]);

  const handleNewGame = useCallback(() => {
    window.location.reload(); // For simplicity, reload the page
  }, []);

  const tileSize = useMemo(() => {
    // Calculate tile size similar to Board component
    const containerSize = Math.min(window.innerWidth - 32, 400); // 32px for padding
    const gapSize = 4; // Same as BoardUI.TILE_GAP_PX
    const totalGapSpace = gapSize * (gridSize - 1);
    return (containerSize - totalGapSpace) / gridSize;
  }, [gridSize]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={handleToggleMute}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
        <button
          onClick={handleTogglePause}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          {isPaused ? '▶️' : '⏸️'}
        </button>
      </div>
      <Board
        mode="timed"
        gridSize={gridSize}
        tiles={board}
        onTileClick={handleTileClick}
        isWon={isWon}
        timeRemaining={timeRemaining}
        tileSize={tileSize}
        onBackToMain={onBackToMain}
      />
      <GameEndModal
        isOpen={isWon || (!isGameActive && timeRemaining <= 0)}
        isVictory={isWon}
        timeRemaining={timeRemaining}
        totalTime={totalTime}
        moves={moves}
        gridSize={gridSize}
        mode="timed"
        onClose={onBackToMain}
        onNewGame={handleNewGame}
      />
    </div>
  );
};

export default TimedGame;