import type { ReactElement } from 'react';
import { useCallback, useEffect, useState, useRef } from 'react';

// Components
import Board from './components/Board';
import ModeSelect from './components/ModeSelect';
import { LevelSelect } from './components/LevelSelect';
import GameLayout from './components/GameLayout';
import VictoryModal from './components/VictoryModal';

// Types
import type {
  Board as BoardType,
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
import { GAME_MODES, GAME_CONFIG } from './constants/gameConfig';
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

// Initial shuffle moves multiplier
const SHUFFLE_MULTIPLIER = 50;

function App(): ReactElement {
  // Game configuration state
  const [unlockedSizes, setUnlockedSizes] = useState<Set<GridSize>>(new Set([3]));
  const [mode, setMode] = useState<GameMode>(GAME_MODES.CLASSIC);
  const [gridSize, setGridSize] = useState<GridSize>(GameConstants.INITIAL_GRID_SIZE);
  const [patternType, setPatternType] = useState<typeof PATTERN_TYPES[keyof typeof PATTERN_TYPES]>(PATTERN_TYPES.RANDOM);
  const [modeSelected, setModeSelected] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Game state
  const [board, setBoard] = useState<BoardType>(() => createBoard(gridSize));
  const [targetPattern, setTargetPattern] = useState<BoardType>(() => createBoard(gridSize));
  const [gameState, setGameState] = useState(initialGameState);

  // Timer ref to prevent multiple intervals
  const timerRef = useRef<number>();

  // Victory
  const [showVictoryModal, setShowVictoryModal] = useState(false);

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
      const newTarget = createBoard(gridSize);
      const moves = gridSize * gridSize * SHUFFLE_MULTIPLIER;
      const updatedBoard = shuffleBoard(createBoard(gridSize), moves);
      setTargetPattern(newTarget);
      setBoard(updatedBoard);
    } else {
      const newTarget = generatePattern(patternType);
      setTargetPattern(newTarget);
      const moves = COLOR_MODE.GRID_SIZE * COLOR_MODE.GRID_SIZE * SHUFFLE_MULTIPLIER;
      const shuffled = shuffleBoard(newTarget, moves) as ColorBoard;
      setBoard(shuffled);
    }
    setGameState(initialGameState);
  }, [gridSize, patternType, mode]);

  const onHandleModeSelect = useCallback((selectedMode: GameMode): void => {
    setMode(selectedMode);
    setModeSelected(true);
    if (selectedMode === GAME_MODES.COLOR) {
      setGridSize(COLOR_MODE.GRID_SIZE);
      const newTarget = generatePattern(patternType);
      setTargetPattern(newTarget);
      const moves = COLOR_MODE.GRID_SIZE * COLOR_MODE.GRID_SIZE * SHUFFLE_MULTIPLIER;
      setBoard(shuffleBoard(newTarget, moves) as ColorBoard);
    } else {
      const newTarget = createBoard(gridSize);
      setTargetPattern(newTarget);
    }
  }, [patternType, gridSize]);

  const onHandleLevelSelect = useCallback((selectedSize: GridSize): void => {
    if (mode !== GAME_MODES.CLASSIC) return;
    setGridSize(selectedSize);
    setGameStarted(true);
    const newTarget = createBoard(selectedSize);
    const moves = selectedSize * selectedSize * SHUFFLE_MULTIPLIER;
    const shuffled = shuffleBoard(createBoard(selectedSize), moves);
    setTargetPattern(newTarget);
    setBoard(shuffled);
    setGameState(initialGameState);
  }, [mode]);

  const onBackToMain = useCallback((): void => {
    setGameStarted(false);
    setModeSelected(false);
    setGameState(initialGameState);
  }, []);

  const onHandleSizeChange = useCallback((newSize: GridSize): void => {
    setGridSize(newSize);
    const newTarget = createBoard(newSize);
    const moves = newSize * newSize * SHUFFLE_MULTIPLIER;
    const shuffled = shuffleBoard(createBoard(newSize), moves);
    setTargetPattern(newTarget);
    setBoard(shuffled);
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
        : targetPattern !== null && isPatternMatched(updatedBoard as ColorBoard, targetPattern as ColorBoard);
      const updatedMoves = gameState.moves + GameConstants.MOVE_INCREMENT;

      setBoard(updatedBoard);
      setGameState(previous => ({
        ...previous,
        moves: updatedMoves,
        isWon: won,
        isPlaying: !won
      }));

      if (won) {
        // Unlock next size if available
        const currentIndex = GAME_CONFIG.GRID_SIZES.indexOf(gridSize);
        const nextSize = GAME_CONFIG.GRID_SIZES[currentIndex + 1];
        
        if (nextSize) {
          setUnlockedSizes(prev => new Set([...prev, nextSize]));
        }

        // Update leaderboard and show victory modal
        setShowVictoryModal(true);
        updateLeaderboard({
          gridSize,
          moves: updatedMoves,
          mode,
          timeSeconds: gameState.time
        });
      }
    }
  }, [board, gameState, gridSize, mode, targetPattern, unlockedSizes]);

  const handleNextLevel = useCallback(() => {
    if (mode !== GAME_MODES.CLASSIC) return;
    
    // Find next available size
    const currentIndex = GAME_CONFIG.GRID_SIZES.indexOf(gridSize);
    const nextSize = GAME_CONFIG.GRID_SIZES[currentIndex + 1];
    
    if (nextSize && unlockedSizes.has(nextSize)) {
      // Close victory modal
      setShowVictoryModal(false);
      
      // Start new game with next size
      setGridSize(nextSize);
      const newTarget = createBoard(nextSize);
      const moves = nextSize * nextSize * SHUFFLE_MULTIPLIER;
      const shuffled = shuffleBoard(createBoard(nextSize), moves);
      setTargetPattern(newTarget);
      setBoard(shuffled);
      setGameState(initialGameState);
    }
  }, [gridSize, mode, unlockedSizes]);

  const handleVictoryClose = useCallback(() => {
    setShowVictoryModal(false);
    onStartNewGame();
  }, [onStartNewGame]);

  const hasNextLevel = useCallback(() => {
    if (mode !== GAME_MODES.CLASSIC) return false;
    const currentIndex = GAME_CONFIG.GRID_SIZES.indexOf(gridSize);
    const nextSize = GAME_CONFIG.GRID_SIZES[currentIndex + 1];
    return nextSize !== undefined && unlockedSizes.has(nextSize);
  }, [gridSize, mode, unlockedSizes]);

  const onSolve = useCallback((): void => {
    if (gameState.isWon) return;
    
    // Create solved board state
    const solvedBoard = mode === GAME_MODES.CLASSIC
      ? createBoard(gridSize)
      : targetPattern;
      
    setBoard(solvedBoard);
    setGameState(prev => ({
      ...prev,
      isWon: true,
      isPlaying: false
    }));
    setShowVictoryModal(true);
    updateLeaderboard({ gridSize, moves: gameState.moves, mode, timeSeconds: gameState.time });
  }, [gameState.moves, gameState.time, gridSize, mode, targetPattern, gameState.isWon]);

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
          unlockedSizes={unlockedSizes}
          onBackToMain={onBackToMain}
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
      onSolve={onSolve}
      targetPattern={targetPattern}
      gridSize={gridSize}
      onSizeChange={onHandleSizeChange}
      unlockedSizes={unlockedSizes}
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
      <VictoryModal
        isOpen={showVictoryModal}
        onClose={handleVictoryClose}
        moves={gameState.moves}
        time={gameState.time}
        hasNextLevel={hasNextLevel()}
        onNextLevel={handleNextLevel}
      />
    </GameLayout>
  );
}

export default App;
