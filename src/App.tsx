import type { ReactElement } from 'react'
import { useCallback, useEffect, useState, useRef } from 'react'

// Components
import Board from './components/Board'
import GameControls from './components/GameControls'
import ModeSelect from './components/ModeSelect'
import SolutionPreview from './components/SolutionPreview/SolutionPreview'
import { LevelSelect } from './components/LevelSelect'
import Leaderboard from './components/Leaderboard'

// Types
import type {
  Board as BoardType,
  Difficulty,
  GameMode,
  GridSize,
  Position
} from './types/game'

// Utilities
import {
  createBoard,
  findEmptyPosition,
  isValidMove,
  isWinningState,
  makeMove,
  shuffleBoard
} from './utils/gameUtils'
import {
  generatePattern,
  isPatternMatched
} from './utils/colorPatternUtils'
import { updateLeaderboard } from './utils/leaderboardUtils'
import { GAME_MODES } from './constants/gameConfig'
import { COLOR_MODE, PATTERN_TYPES } from './constants/colorMode'
import type { ColorBoard } from './types/game'
import { GameConstants } from './constants/gameConstants'

// Initial game state
const initialGameState = {
  moves: 0,
  time: 0,
  isWon: false,
  isPlaying: false,
  hasStarted: false
}

function App(): ReactElement {
  // Game configuration state
  const [mode, setMode] = useState<GameMode>(GAME_MODES.CLASSIC)
  const [gridSize, setGridSize] = useState<GridSize>(GameConstants.INITIAL_GRID_SIZE)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [patternType, setPatternType] = useState<typeof PATTERN_TYPES[keyof typeof PATTERN_TYPES]>(PATTERN_TYPES.RANDOM)
  const [modeSelected, setModeSelected] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  // Game state
  const [board, setBoard] = useState<BoardType>(() => createBoard(gridSize))
  const [targetPattern, setTargetPattern] = useState<ColorBoard | null>(null)
  const [gameState, setGameState] = useState(initialGameState)
  const [colorModeStarted, setColorModeStarted] = useState(false)

  // Timer ref to prevent multiple intervals
  const timerRef = useRef<number>()

  // Timer effect
  useEffect(() => {
    // Always clear existing interval first
    if (timerRef.current !== undefined) {
      clearInterval(timerRef.current)
      timerRef.current = undefined
    }

    // Only start a new timer if the game is active
    if (gameState.hasStarted && !gameState.isWon) {
      timerRef.current = window.setInterval(() => {
        setGameState(prev => ({
          ...prev,
          time: prev.time + GameConstants.TIME_INCREMENT
        }))
      }, GameConstants.TIMER_INTERVAL) as unknown as number
    }

    // Cleanup function
    return () => {
      if (timerRef.current !== undefined) {
        clearInterval(timerRef.current)
      }
    }
  }, [gameState.hasStarted, gameState.isWon])

  // Start new game
  const onStartNewGame = useCallback((): void => {
    if (mode === GAME_MODES.CLASSIC) {
      const updatedBoard = createBoard(gridSize)
      setBoard(shuffleBoard(updatedBoard, difficulty))
    } else {
      // Color mode: generate new target pattern
      const newTarget = generatePattern(patternType)
      setTargetPattern(newTarget)
      // Create a shuffled version of the target pattern
      const shuffled = shuffleBoard(newTarget, difficulty) as ColorBoard
      setBoard(shuffled)
      setColorModeStarted(true)
    }
    setGameState(initialGameState)
  }, [gridSize, difficulty, patternType, mode])

  // Handle pattern type change
  const handlePatternTypeChange = useCallback((type: typeof PATTERN_TYPES[keyof typeof PATTERN_TYPES]) => {
    setPatternType(type)
  }, [])

  // Handle tile click
  const onHandleTileClick = useCallback((position: Position): void => {
    if (gameState.isWon) return

    // Start the game on first move
    if (!gameState.hasStarted) {
      setGameState(previous => ({
        ...previous,
        hasStarted: true,
        isPlaying: true
      }))
    }

    const emptyPos = findEmptyPosition(board)
    if (emptyPos.row < 0 || emptyPos.col < 0) return // Safety check for invalid coordinates

    if (isValidMove(position, emptyPos)) {
      const updatedBoard = makeMove(board, position, emptyPos)
      const won = mode === GAME_MODES.CLASSIC
        ? isWinningState(updatedBoard)
        : targetPattern !== null && isPatternMatched(
            updatedBoard as ColorBoard, 
            targetPattern)
      const updatedMoves = gameState.moves + GameConstants.MOVE_INCREMENT

      setBoard(updatedBoard)
      setGameState(previous => ({
        ...previous,
        moves: updatedMoves,
        isWon: won,
        isPlaying: !won
      }))

      if (won) {
        updateLeaderboard({
          gridSize,
          difficulty,
          moves: updatedMoves,
          timeSeconds: gameState.time
        })
      }
    }
  }, [board, gameState, gridSize, difficulty, mode, targetPattern])

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent): void => {
      if (gameState.isWon) return

      const emptyPos = findEmptyPosition(board)
      if (emptyPos.row < 0 || emptyPos.col < 0) return // Safety check for invalid coordinates

      let targetPosition: Position | undefined

      switch (event.key) {
        case 'ArrowUp': {
          if (emptyPos.row < board.length - GameConstants.SINGLE_POSITION_OFFSET) {
            targetPosition = {
              row: emptyPos.row + GameConstants.SINGLE_POSITION_OFFSET,
              col: emptyPos.col
            }
          }
          break
        }
        case 'ArrowDown': {
          if (emptyPos.row > GameConstants.MIN_GRID_INDEX) {
            targetPosition = {
              row: emptyPos.row - GameConstants.SINGLE_POSITION_OFFSET,
              col: emptyPos.col
            }
          }
          break
        }
        case 'ArrowLeft': {
          if (emptyPos.col < board.length - GameConstants.SINGLE_POSITION_OFFSET) {
            targetPosition = {
              row: emptyPos.row,
              col: emptyPos.col + GameConstants.SINGLE_POSITION_OFFSET
            }
          }
          break
        }
        case 'ArrowRight': {
          if (emptyPos.col > GameConstants.MIN_GRID_INDEX) {
            targetPosition = {
              row: emptyPos.row,
              col: emptyPos.col - GameConstants.SINGLE_POSITION_OFFSET
            }
          }
          break
        }
        default: {
          break
        }
      }

      if (targetPosition !== undefined) {
        onHandleTileClick(targetPosition)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [board, onHandleTileClick, gameState.isWon])

  // Handle grid size change
  const onHandleSizeChange = useCallback((size: GridSize): void => {
    setGridSize(size)
    if (mode === GAME_MODES.CLASSIC) {
      const updatedBoard = createBoard(size)
      setBoard(shuffleBoard(updatedBoard, difficulty))
    } else {
      // Color mode always uses 5x5 grid
      if (size !== COLOR_MODE.GRID_SIZE) {
        console.warn('Color mode only supports 5x5 grid')
        return
      }
      onStartNewGame()
    }
    setGameState(initialGameState)
  }, [difficulty])

  // Handle difficulty change
  const onHandleDifficultyChange = useCallback((updatedDifficulty: Difficulty): void => {
    setDifficulty(updatedDifficulty)
    const updatedBoard = createBoard(gridSize)
    setBoard(shuffleBoard(updatedBoard, updatedDifficulty))
    setGameState(initialGameState)
  }, [gridSize])

  // Handle mode selection
  const onHandleModeSelect = useCallback((selectedMode: GameMode): void => {
    setMode(selectedMode)
    setModeSelected(true)
    if (selectedMode === GAME_MODES.COLOR) {
      setGridSize(COLOR_MODE.GRID_SIZE)
      const newTarget = generatePattern(patternType)
      setTargetPattern(newTarget)
      setBoard(shuffleBoard(newTarget, difficulty) as ColorBoard)
    }
  }, [difficulty])

  // Handle level selection (only for classic mode)
  const onHandleLevelSelect = useCallback((selectedSize: GridSize, selectedDiff: Difficulty): void => {
    if (mode !== GAME_MODES.CLASSIC) return
    setGridSize(selectedSize)
    setDifficulty(selectedDiff)
    setGameStarted(true)
    const updatedBoard = createBoard(selectedSize)
    setBoard(shuffleBoard(updatedBoard, selectedDiff))
    setGameState(initialGameState)
  }, [mode])

  const onBackToMain = useCallback((): void => {
    setGameStarted(false)
    setModeSelected(false)
    setGameState(initialGameState)
    setColorModeStarted(false)
  }, [])

  const renderWinningModal = (): ReactElement => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-${GameConstants.MODAL_BACKDROP_OPACITY} flex items-center justify-center`}
    >
      <div
        className={`bg-white dark:bg-gray-800 p-${GameConstants.DEFAULT_SPACING} rounded-lg text-center`}
      >
        <h2 className='mb-4 text-2xl font-bold'>🎉 Congratulations! 🎉</h2>
        <p className='mb-2 text-lg'>You solved the puzzle!</p>
        <p className='mb-4'>
          Moves: {gameState.moves} | Time: {Math.floor(gameState.time / GameConstants.SECONDS_IN_MINUTE)}:
          {(gameState.time % GameConstants.SECONDS_IN_MINUTE)
            .toString()
            .padStart(GameConstants.TIME_DISPLAY_PAD_LENGTH, '0')}
        </p>
        <button
          type="button"
          aria-label="Play Again"
          onClick={onStartNewGame}
          className='rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600'
        >
          Play Again
        </button>
      </div>
    </div>
  )

  if (!modeSelected) {
    return (
      <div className='game-container'>
        <ModeSelect onModeSelect={onHandleModeSelect} />
      </div>
    )
  }

  if (!gameStarted && mode === GAME_MODES.CLASSIC) {
    // Only show level select for classic mode
    // Color mode uses fixed grid size and skips this screen
    return (
      <div className='game-container'>
        <LevelSelect
          onLevelSelect={onHandleLevelSelect}
          currentSize={gridSize}
          currentDifficulty={difficulty}
        />
      </div>
    )
  }

  return (
    <div className='game-container'>
      {gameState.isWon ? renderWinningModal() : undefined}

      <div className='mx-auto w-full max-w-4xl space-y-6'>
        <GameControls
          moves={gameState.moves}
          mode={mode}
          time={gameState.time}
          onNewGame={onStartNewGame}
          onSizeChange={onHandleSizeChange}
          onDifficultyChange={onHandleDifficultyChange}
          currentSize={gridSize}
          currentDifficulty={difficulty}
          onBackToMain={onBackToMain}
          onPatternTypeChange={mode === GAME_MODES.COLOR ? handlePatternTypeChange : undefined}
        />
        
        <div className="flex gap-8 items-start justify-center">
          <Board
            mode={mode}
            gridSize={gridSize}
            tiles={board}
            onTileClick={onHandleTileClick}
            tileSize={gridSize}
            isWon={gameState.isWon}
            onBackToMain={onBackToMain}
          />

          {/* Show solution preview only in color mode */}
          {mode === GAME_MODES.COLOR && targetPattern && colorModeStarted && (
            <div className="flex-shrink-0">
              <SolutionPreview 
                targetPattern={targetPattern}
              />
            </div>
          )}
        </div>

        <Leaderboard />
      </div>
    </div>
  )
}

export default App
