import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest'
import App from '../App'
import renderWithProviders from '../testUtils'

describe('<App />', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.clearAllTimers()
  })

  it('renders level select screen initially', async () => {
    vi.useFakeTimers()
    renderWithProviders(<App />, false)
    expect(screen.getByText('Sliding Puzzle')).toBeInTheDocument()
    expect(screen.getByText('Select Grid Size')).toBeInTheDocument()
    expect(screen.getByText('Select Difficulty')).toBeInTheDocument()
  })

  it('starts game when clicking start game', async () => {
    vi.useFakeTimers()
    renderWithProviders(<App />, false)
    const user = userEvent.setup({ delay: undefined })

    await user.click(screen.getByRole('button', { name: 'Start Game' }))
    vi.advanceTimersByTime(100)
    
    await waitFor(() => {
      expect(screen.getByText('Moves:')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText('Time:')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText('New Game')).toBeInTheDocument()
    })
  })

  it('updates time while game is in progress', async () => {
    vi.useFakeTimers()
    renderWithProviders(<App />, false)
    const user = userEvent.setup({ delay: undefined })

    await user.click(screen.getByRole('button', { name: 'Start Game' }))
    await vi.advanceTimersByTimeAsync(100)

    await waitFor(() => {
      vi.runOnlyPendingTimers()
      expect(screen.getByText('Time: 0:00')).toBeInTheDocument()
    })

    vi.advanceTimersByTime(1000)
    vi.runOnlyPendingTimers()
    
    await waitFor(() => {
      expect(screen.getByText('Time: 0:01')).toBeInTheDocument()
    })

    vi.advanceTimersByTime(60000)
    vi.runOnlyPendingTimers()
    
    await waitFor(() => {
      expect(screen.getByText('Time: 1:01')).toBeInTheDocument()
    })
  })

  it('updates moves counter when making valid moves', async () => {
    vi.useFakeTimers()
    renderWithProviders(<App />, false)
    const user = userEvent.setup({ delay: undefined })

    await user.click(screen.getByRole('button', { name: 'Start Game' }))
    await vi.advanceTimersByTimeAsync(100)

    await waitFor(() => {
      expect(screen.getByText('Moves: 0')).toBeInTheDocument()
    })

    const tiles = screen.getAllByRole('button', { name: /Tile/ })
    await user.click(tiles[0])
    await vi.runOnlyPendingTimersAsync()

    await waitFor(() => {
      expect(screen.getByText('Moves: 1')).toBeInTheDocument()
    })
  })

  it('handles keyboard controls', async () => {
    vi.useFakeTimers()
    renderWithProviders(<App />, false)
    const user = userEvent.setup({ delay: undefined })

    await user.click(screen.getByRole('button', { name: 'Start Game' }))
    await vi.advanceTimersByTimeAsync(100)

    const keys = ['{ArrowUp}', '{ArrowDown}', '{ArrowLeft}', '{ArrowRight}']
    await user.keyboard(keys.join(''))
    await vi.advanceTimersByTimeAsync(100)
    await vi.runOnlyPendingTimersAsync()

    await waitFor(() => {
      const movesText = screen.getByText(/Moves:/)
      const movesCount = movesText.textContent?.split(': ')[1] ?? '0'
      expect(parseInt(movesCount, 10)).toBeGreaterThan(0)
    })
  })

  it('shows Next Level button when next level is available and unlocked', async () => {
    vi.useFakeTimers()
    renderWithProviders(<App />, false)
    const user = userEvent.setup({ delay: undefined })

    // Start game
    await user.click(screen.getByRole('button', { name: 'Start Game' }))
    await vi.runOnlyPendingTimersAsync()
    
    // Simulate winning state
    const board = screen.getByTestId('game-board')
    board.dispatchEvent(new CustomEvent('win'))
    await vi.runOnlyPendingTimersAsync()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Next Level' })).toBeInTheDocument()
    })
  })

  it('transitions to next grid size when clicking Next Level', async () => {
    vi.useFakeTimers()
    renderWithProviders(<App />, false)
    const user = userEvent.setup({ delay: undefined })

    // Start game with 3x3 grid
    await user.click(screen.getByRole('button', { name: 'Start Game' }))
    await vi.runOnlyPendingTimersAsync()
    
    // Simulate winning state
    const board = screen.getByTestId('game-board')
    board.dispatchEvent(new CustomEvent('win'))
    await vi.runOnlyPendingTimersAsync()

    // Click Next Level
    await user.click(screen.getByRole('button', { name: 'Next Level' }))
    await vi.runOnlyPendingTimersAsync()

    // Verify we're on 4x4 grid (16 tiles - 1 empty = 15 tiles)
    await waitFor(() => {
      const tiles = screen.getAllByRole('button', { name: /Tile/ })
      expect(tiles).toHaveLength(15)
    })

    // Verify game state is reset
    expect(screen.getByText('Moves: 0')).toBeInTheDocument()
    expect(screen.getByText('Time: 0:00')).toBeInTheDocument()
  })

  it('does not show Next Level button on final level', async () => {
    vi.useFakeTimers()
    renderWithProviders(<App />, false)
    const user = userEvent.setup({ delay: undefined })

    // Start game
    await user.click(screen.getByRole('button', { name: 'Start Game' }))
    await vi.runOnlyPendingTimersAsync()

    // Set to max grid size
    const sizeSelect = screen.getByLabelText('Grid Size')
    await user.selectOptions(sizeSelect, '9')
    await vi.runOnlyPendingTimersAsync()
    
    // Simulate winning state
    const board = screen.getByTestId('game-board')
    board.dispatchEvent(new CustomEvent('win'))
    await vi.runOnlyPendingTimersAsync()

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Next Level' })).not.toBeInTheDocument()
    })
  })

  it('allows changing grid size during gameplay', async () => {
    vi.useFakeTimers()
    renderWithProviders(<App />, false)
    const user = userEvent.setup({ delay: undefined })

    await user.click(screen.getByRole('button', { name: 'Start Game' }))
    await vi.runOnlyPendingTimersAsync()
    
    const sizeSelect = screen.getByLabelText('Grid Size')
    await user.selectOptions(sizeSelect, '3')
    await vi.runOnlyPendingTimersAsync()

    await waitFor(() => {
      const tiles = screen.getAllByRole('button', { name: /Tile/ })
      expect(tiles).toHaveLength(8)
    })
  })

  it('allows changing difficulty during gameplay', async () => {
    vi.useFakeTimers()
    renderWithProviders(<App />, false)
    const user = userEvent.setup({ delay: undefined })

    await user.click(screen.getByRole('button', { name: 'Start Game' }))
    await vi.runOnlyPendingTimersAsync()

    const difficultySelect = screen.getByLabelText('Difficulty')
    await user.selectOptions(difficultySelect, 'hard')
    await vi.runOnlyPendingTimersAsync()

    await waitFor(() => {
      expect(screen.getByText('Moves: 0')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('Time: 0:00')).toBeInTheDocument()
    })
  })

  it('displays winning modal when winning state is achieved', async () => {
    vi.useFakeTimers()
    renderWithProviders(<App />, false)
    const user = userEvent.setup({ delay: undefined })

    await user.click(screen.getByRole('button', { name: 'Start Game' }))
    await vi.runOnlyPendingTimersAsync()
    
    const tiles = screen.getAllByRole('button', { name: /Tile/ })
    await user.click(tiles[0])
    await vi.runOnlyPendingTimersAsync()

    // Simulate winning state
    const board = screen.getByTestId('game-board')
    board.dispatchEvent(new CustomEvent('win'))
    await vi.runOnlyPendingTimersAsync()

    await waitFor(() => {
      expect(screen.getByText('🎉 Congratulations! 🎉')).toBeInTheDocument()
    })

    await waitFor(() => {
            expect(screen.getByText('You solved the puzzle!')).toBeInTheDocument()
    })
  })

  it('starts new game when clicking Play Again in winning modal', async () => {
    vi.useFakeTimers()
    renderWithProviders(<App />, false)
    const user = userEvent.setup({ delay: undefined })

    await user.click(screen.getByRole('button', { name: 'Start Game' }))
    await vi.runOnlyPendingTimersAsync()
    
    const tiles = screen.getAllByRole('button', { name: /Tile/ })
    await user.click(tiles[0])
    await vi.runOnlyPendingTimersAsync()
    
    // Simulate winning state
    const board = screen.getByTestId('game-board')
    board.dispatchEvent(new CustomEvent('win'))
    await vi.runOnlyPendingTimersAsync()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Play Again' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Play Again' }))
    await vi.runOnlyPendingTimersAsync()

    await waitFor(() => {
      expect(screen.getByText('Moves: 0')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('Time: 0:00')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.queryByText('🎉 Congratulations! 🎉')).not.toBeInTheDocument()
    })
  })
})
