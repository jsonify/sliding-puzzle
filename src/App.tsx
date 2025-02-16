import type { ReactElement } from 'react';
import { useCallback, useEffect, useState, useRef } from 'react';

// Components
import Board from './components/Board';
import ModeSelect from './components/ModeSelect';
import { LevelSelect } from './components/LevelSelect';
import { GameLayout } from './components/mobile';

// Types
import type {
  Board as BoardType,
  Difficulty,
  GameMode,
  GridSize,
  Position
} from './types/game';

// Utilities
import {
  createBoard,
  findEmptyPosition,
  isValidMove,
  isWinningState,
  makeMove,
  shuffleBoard
} from './utils/gameUtils';
import {
  generatePattern,
  isPatternMatched
} from './utils/colorPatternUtils';
import { updateLeaderboard } from './utils/leaderboardUtils';
import { GAME_MODES } from './constants/gameConfig';
import { COLOR_MODE, PATTERN_TYPES } from './constants/colorMode';
import type { ColorBoard } from './types/game';
import { GameConstants } from './constants/gameConstants';

// Initial game state
const initialGameState = {
  moves: 0,
  time: 0,
  isWon: false,
  isPlaying: false,
  hasStarted: false
};

function App(): ReactElement {
  // Game configuration state
  const [mode, setMode] = useState<GameMode>(GAME_MODES.CLASSIC);
  const [gridSize, setGridSize] = useState<GridSize>(GameConstants.INITIAL_GRID_SIZE);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [patternType, setPatternType] = useState<typeof PATTERN_TYPES[keyof typeof PATTERN_TYPES]>(PATTERN_TYPES.RANDOM);
  const [modeSelected, setModeSelected] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Game state
  const [board, setBoard] = useState<BoardType>(() => createBoard(gridSize));
  const [targetPattern, setTargetPattern] = useState<ColorBoard | null>(null);
  const [gameState, setGameState] = useState(initialGameState);

  // Timer ref to prevent multiple intervals
  const timerRef = useRef<number>();

  // Timer effect
  useEffect(() => {
    if (timerRef.current !== undefined) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }

    if (gameState.hasStarted && !gameState.isWon) {
      timerRef.current = window.setInterval(() => {
        setGameState(prev => ({
          ...prev,
          time: prev.time + GameConstants.TIME_INCREMENT
        }));
      }, GameConstants.TIMER_INTERVAL) as unknown as number;
    }

    return () => {
      if (timerRef.current !== undefined) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.hasStarted, gameState.isWon]);

  // Event handlers
  const onStartNewGame = useCallback((): void => {
    if (mode === GAME_MODES.CLASSIC) {
      const updatedBoard = createBoard(gridSize);
      setBoard(shuffleBoard(updatedBoard, difficulty));
    } else {
      const newTarget = generatePattern(patternType);
      setTargetPattern(newTarget);
      const shuffled = shuffleBoard(newTarget, difficulty) as ColorBoard;
      setBoard(shuffled);
    }
    setGameState(initialGameState);
  }, [gridSize, difficulty, patternType, mode]);

  const onHandleModeSelect = useCallback((selectedMode: GameMode): void => {
    setMode(selectedMode);
    setModeSelected(true);
    if (selectedMode === GAME_MODES.COLOR) {
      setGridSize(COLOR_MODE.GRID_SIZE);
      const newTarget = generatePattern(patternType);
      setTargetPattern(newTarget);
      setBoard(shuffleBoard(newTarget, difficulty) as ColorBoard);
    }
  }, [difficulty, patternType]);

  const onHandleLevelSelect = useCallback((selectedSize: GridSize, selectedDiff: Difficulty): void => {
    if (mode !== GAME_MODES.CLASSIC) return;
    setGridSize(selectedSize);
    setDifficulty(selectedDiff);
    setGameStarted(true);
    const updatedBoard = createBoard(selectedSize);
    setBoard(shuffleBoard(updatedBoard, selectedDiff));
    setGameState(initialGameState);
  }, [mode]);

  const onBackToMain = useCallback((): void => {
    setGameStarted(false);
    setModeSelected(false);
    setGameState(initialGameState);
  }, []);

  const onHandleTileClick = useCallback((position: Position): void => {
    if (gameState.isWon) return;

    // Start the game on first move
    if (!gameState.hasStarted) {
      setGameState(previous => ({
        ...previous,
        hasStarted: true,
        isPlaying: true
      }));
    }

    const emptyPos = findEmptyPosition(board);
    if (emptyPos.row < 0 || emptyPos.col < 0) return;

    if (isValidMove(position, emptyPos)) {
      const updatedBoard = makeMove(board, position, emptyPos);
      const won = mode === GAME_MODES.CLASSIC
        ? isWinningState(updatedBoard)
        : targetPattern !== null && isPatternMatched(updatedBoard as ColorBoard, targetPattern);
      const updatedMoves = gameState.moves + GameConstants.MOVE_INCREMENT;

      setBoard(updatedBoard);
      setGameState(previous => ({
        ...previous,
        moves: updatedMoves,
        isWon: won,
        isPlaying: !won
      }));

      if (won) {
        updateLeaderboard({
          gridSize,
          difficulty,
          moves: updatedMoves,
          timeSeconds: gameState.time
        });
      }
    }
  }, [board, gameState, gridSize, difficulty, mode, targetPattern]);

  // Mode selection screen
  if (!modeSelected) {
    return (
      <div className="mobile-container">
        <ModeSelect onModeSelect={onHandleModeSelect} />
      </div>
    );
  }

  // Level selection screen (classic mode only)
  if (!gameStarted && mode === GAME_MODES.CLASSIC) {
    return (
      <div className="mobile-container">
        <LevelSelect
          onLevelSelect={onHandleLevelSelect}
          currentSize={gridSize}
          currentDifficulty={difficulty}
        />
      </div>
    );
  }

  // Main game screen
  return (
    <GameLayout
      mode={mode}
      score={gameState.moves}
      time={gameState.time}
      onNewGame={onStartNewGame}
      onModeChange={onHandleModeSelect}
      onBackToMain={onBackToMain}
    >
      <Board
        mode={mode}
        gridSize={gridSize}
        tiles={board}
        onTileClick={onHandleTileClick}
        tileSize={gridSize}
        isWon={gameState.isWon}
        onBackToMain={onBackToMain}
      />
    </GameLayout>
  );
}

export default App;
