import type { ReactElement } from 'react'
import { useCallback, useEffect, useState } from 'react'

// Components
import Board from './components/Board'
import GameControls from './components/GameControls'
import { LevelSelect } from './components/LevelSelect'
import Leaderboard from './components/Leaderboard'

// Types
import type {
  Board as BoardType,
  Difficulty,
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
  shuffleBoard,
} from './utils/gameUtils'
import { updateLeaderboard } from './utils/leaderboardUtils'
import { GameConstants } from './constants/gameConstants'

// Initial game state
const initialGameState = {
  moves: 0,
  time: 0,
  isWon: false,
  isPlaying: false
}

function App(): ReactElement {
  // Game configuration state
  const [gridSize, setGridSize] = useState<GridSize>(GameConstants.INITIAL_GRID_SIZE)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [gameStarted, setGameStarted] = useState(false)

  // Game state
  const [board, setBoard] = useState<BoardType>(() => createBoard(gridSize))
  const [gameState, setGameState] = useState(initialGameState)

  // Timer effect
  useEffect(() => {
    let interval: number | undefined

    if (gameState.isPlaying && !gameState.isWon) {
      interval = window.setInterval(() => {
        setGameState(previous => ({
          ...previous,
          time: previous.time + GameConstants.TIME_INCREMENT
        }))
      }, GameConstants.TIMER_INTERVAL)
    }

    return function cleanup() {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [gameState.isPlaying, gameState.isWon])

  // Start new game
  const onStartNewGame = useCallback((): void => {
    const updatedBoard = createBoard(gridSize)
    setBoard(shuffleBoard(updatedBoard, difficulty))
    setGameState({ ...initialGameState, isPlaying: true })
  }, [gridSize, difficulty])

  // Handle tile click
  const onHandleTileClick = useCallback((position: Position): void => {
    if (gameState.isWon) return

    const emptyPos = findEmptyPosition(board)
    if (emptyPos.row < 0 || emptyPos.col < 0) return // Safety check for invalid coordinates

    if (isValidMove(position, emptyPos)) {
      const updatedBoard = makeMove(board, position, emptyPos)
      const won = isWinningState(updatedBoard)
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
  }, [board, gameState.isWon, gameState.moves, gridSize, difficulty, gameState.time])

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent): void => {
      if (gameState.isWon || !gameState.isPlaying) return

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
  }, [board, onHandleTileClick, gameState])

  // Handle grid size change
  const onHandleSizeChange = useCallback((size: GridSize): void => {
    setGridSize(size)
    // Auto-start new game when changing size during gameplay
    if (gameState.isPlaying) {
      setBoard(shuffleBoard(createBoard(size), difficulty))
      setGameState({ ...initialGameState, isPlaying: true })
    }
  }, [difficulty, gameState.isPlaying])

  // Handle difficulty change
  const onHandleDifficultyChange = useCallback((updatedDifficulty: Difficulty): void => {
    setDifficulty(updatedDifficulty)
    // Auto-start new game when changing difficulty during gameplay
    if (gameState.isPlaying) {
      setBoard(shuffleBoard(createBoard(gridSize), updatedDifficulty))
      setGameState({ ...initialGameState, isPlaying: true })
    }
  }, [gridSize, gameState.isPlaying])

  // Handle level selection
  const onHandleLevelSelect = useCallback((size: GridSize, diff: Difficulty): void => {
    setGridSize(size)
    setDifficulty(diff)
    setGameStarted(true)
    // Start new game after selecting level
    const updatedBoard = createBoard(size)
    setBoard(shuffleBoard(updatedBoard, diff))
    setGameState({ ...initialGameState, isPlaying: true })
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

  if (!gameStarted) {
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
          time={gameState.time}
          onNewGame={onStartNewGame}
          onSizeChange={onHandleSizeChange}
          onDifficultyChange={onHandleDifficultyChange}
          currentSize={gridSize}
          currentDifficulty={difficulty}
        />

        <Board
          gridSize={gridSize}
          tiles={board}
          onTileClick={onHandleTileClick}
          tileSize={gridSize}
          isWon={gameState.isWon}
        />

        <Leaderboard />
      </div>
    </div>
  )
}

export default App
