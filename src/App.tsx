import React, { useCallback, useEffect, useState } from 'react';
import { Board } from './components/Board';
import { GameControls } from './components/GameControls';
import { LevelSelect } from './components/LevelSelect';
import type { Board as BoardType, Difficulty, GridSize, Position } from './types/game';
import {
  createBoard,
  findEmptyPosition,
  isValidMove,
  isWinningState,
  makeMove,
  shuffleBoard,
} from './utils/gameUtils';

export default function App() {
  // Game configuration state
  const [gridSize, setGridSize] = useState<GridSize>(4);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);

  // Game state
  const [board, setBoard] = useState<BoardType>(() => createBoard(gridSize));
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: number | undefined;

    if (isPlaying && !isWon) {
      interval = window.setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, isWon]);

  // Start new game
  const startNewGame = useCallback(() => {
    const newBoard = createBoard(gridSize);
    setBoard(shuffleBoard(newBoard, difficulty));
    setMoves(0);
    setTime(0);
    setIsWon(false);
    setIsPlaying(true);
  }, [gridSize, difficulty]);

  // Handle tile click
  const handleTileClick = useCallback(
    (position: Position) => {
      if (isWon) return;

      const emptyPos = findEmptyPosition(board);
      
      if (isValidMove(position, emptyPos)) {
        const newBoard = makeMove(board, position, emptyPos);
        setBoard(newBoard);
        setMoves(m => m + 1);

        // Check for win condition
        if (isWinningState(newBoard)) {
          setIsWon(true);
          setIsPlaying(false);
        }
      }
    },
    [board, isWon]
  );

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isWon || !isPlaying) return;

      const emptyPos = findEmptyPosition(board);
      let newPos: Position | null = null;

      switch (event.key) {
        case 'ArrowUp':
          if (emptyPos.row < board.length - 1) {
            newPos = { row: emptyPos.row + 1, col: emptyPos.col };
          }
          break;
        case 'ArrowDown':
          if (emptyPos.row > 0) {
            newPos = { row: emptyPos.row - 1, col: emptyPos.col };
          }
          break;
        case 'ArrowLeft':
          if (emptyPos.col < board.length - 1) {
            newPos = { row: emptyPos.row, col: emptyPos.col + 1 };
          }
          break;
        case 'ArrowRight':
          if (emptyPos.col > 0) {
            newPos = { row: emptyPos.row, col: emptyPos.col - 1 };
          }
          break;
      }

      if (newPos) {
        handleTileClick(newPos);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, handleTileClick, isPlaying, isWon]);

  // Handle grid size change
  const handleSizeChange = useCallback((size: GridSize) => {
    setGridSize(size);
    // Auto-start new game when changing size during gameplay
    if (isPlaying) {
      setBoard(shuffleBoard(createBoard(size), difficulty));
      setMoves(0);
      setTime(0);
      setIsWon(false);
    }
  }, [difficulty, isPlaying]);

  // Handle difficulty change
  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    // Auto-start new game when changing difficulty during gameplay
    if (isPlaying) {
      setBoard(shuffleBoard(createBoard(gridSize), newDifficulty));
      setMoves(0);
      setTime(0);
      setIsWon(false);
    }
  }, [gridSize, isPlaying]);

  // Handle level selection
  const handleLevelSelect = useCallback((size: GridSize, diff: Difficulty) => {
    setGridSize(size);
    setDifficulty(diff);
    setGameStarted(true);
    // Start new game after selecting level
    const newBoard = createBoard(size);
    setBoard(shuffleBoard(newBoard, diff));
    setMoves(0);
    setTime(0);
    setIsWon(false);
    setIsPlaying(true);
  }, []);

  if (!gameStarted) {
    return (
      <div className="game-container">
        <LevelSelect
          onLevelSelect={handleLevelSelect}
          currentSize={gridSize}
          currentDifficulty={difficulty}
        />
      </div>
    );
  }

  return (
    <div className="game-container">
      {isWon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">🎉 Congratulations! 🎉</h2>
            <p className="text-lg mb-2">You solved the puzzle!</p>
            <p className="mb-4">
              Moves: {moves} | Time: {Math.floor(time / 60)}:
              {(time % 60).toString().padStart(2, '0')}
            </p>
            <button
              onClick={startNewGame}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto w-full space-y-6">
        <GameControls
          moves={moves}
          time={time}
          onNewGame={startNewGame}
          onSizeChange={handleSizeChange}
          onDifficultyChange={handleDifficultyChange}
          currentSize={gridSize}
          currentDifficulty={difficulty}
        />

        <Board
          gridSize={gridSize}
          tiles={board}
          onTileClick={handleTileClick}
          tileSize={gridSize}
          isWon={isWon}
        />
      </div>
    </div>
  );
}
