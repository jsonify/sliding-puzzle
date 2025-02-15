import { screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest'
import App from '../App'
import renderWithProviders from '../testUtils'

describe('<App />', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'requestAnimationFrame', 'cancelAnimationFrame']
    })
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('renders level select screen initially', () => {
    act(() => {
      renderWithProviders(<App />, false)
    })
    expect(screen.getByText('Sliding Puzzle')).toBeInTheDocument()
    expect(screen.getByText('Select Grid Size')).toBeInTheDocument()
    expect(screen.getByText('Select Difficulty')).toBeInTheDocument()
  })

  it('starts game when clicking start game', async () => {
    act(() => {
      renderWithProviders(<App />, false)
    })
    const user = userEvent.setup({ delay: null })

    await act(async () => {
      await user.click(screen.getByText('Start Game'))
      vi.runOnlyPendingTimers()
    })
    
    await waitFor(() => {
      expect(screen.getByText('Moves:')).toBeInTheDocument()
      expect(screen.getByText('Time:')).toBeInTheDocument()
      expect(screen.getByText('New Game')).toBeInTheDocument()
    })
  })

  it('updates time while game is in progress', async () => {
    renderWithProviders(<App />, false)
    const user = userEvent.setup({ delay: null })

    await user.click(screen.getByText('Start Game'))
    vi.runOnlyPendingTimers()

    await waitFor(() => {
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
    renderWithProviders(<App />, false)
    const user = userEvent.setup({ delay: null })

    await user.click(screen.getByText('Start Game'))
    vi.runOnlyPendingTimers()

    await waitFor(() => {
      expect(screen.getByText('Moves: 0')).toBeInTheDocument()
    })

    const tiles = screen.getAllByRole('button', { name: /Tile/ })
    await user.click(tiles[0])
    vi.runOnlyPendingTimers()

    await waitFor(() => {
      expect(screen.getByText('Moves: 1')).toBeInTheDocument()
    })
  })

  it('handles keyboard controls', async () => {
    renderWithProviders(<App />, false)
    const user = userEvent.setup({ delay: null })

    await user.click(screen.getByText('Start Game'))
    vi.runOnlyPendingTimers()

    await user.keyboard('{ArrowUp}')
    vi.runOnlyPendingTimers()
    await user.keyboard('{ArrowDown}')
    vi.runOnlyPendingTimers()
    await user.keyboard('{ArrowLeft}')
    vi.runOnlyPendingTimers()
    await user.keyboard('{ArrowRight}')
    vi.runOnlyPendingTimers()

    await waitFor(() => {
      const movesText = screen.getByText(/Moves:/)
      expect(parseInt(movesText.textContent?.split(': ')[1] || '0')).toBeGreaterThan(0)
    })
  })

  it('allows changing grid size during gameplay', async () => {
    renderWithProviders(<App />, false)
    const user = userEvent.setup({ delay: null })

    await user.click(screen.getByText('Start Game'))
    vi.runOnlyPendingTimers()
    
    const sizeSelect = screen.getByLabelText('Grid Size')
    await user.selectOptions(sizeSelect, '3')
    vi.runOnlyPendingTimers()

    await waitFor(() => {
      const tiles = screen.getAllByRole('button', { name: /Tile/ })
      expect(tiles).toHaveLength(8)
    })
  })

  it('allows changing difficulty during gameplay', async () => {
    renderWithProviders(<App />, false)
    const user = userEvent.setup({ delay: null })

    await user.click(screen.getByText('Start Game'))
    vi.runOnlyPendingTimers()

    const difficultySelect = screen.getByLabelText('Difficulty')
    await user.selectOptions(difficultySelect, 'hard')
    vi.runOnlyPendingTimers()

    await waitFor(() => {
      expect(screen.getByText('Moves: 0')).toBeInTheDocument()
      expect(screen.getByText('Time: 0:00')).toBeInTheDocument()
    })
  })

  it('displays winning modal when winning state is achieved', async () => {
    renderWithProviders(<App />, false)
    const user = userEvent.setup({ delay: null })

    await user.click(screen.getByText('Start Game'))
    vi.runOnlyPendingTimers()
    
    const tiles = screen.getAllByRole('button', { name: /Tile/ })
    await user.click(tiles[0])
    vi.runOnlyPendingTimers()

    const board = document.querySelector('.game-board')
    if (board) {
      board.dispatchEvent(new CustomEvent('win'))
    }
    vi.runOnlyPendingTimers()

    await waitFor(() => {
      expect(screen.getByText('🎉 Congratulations! 🎉')).toBeInTheDocument()
      expect(screen.getByText('You solved the puzzle!')).toBeInTheDocument()
    })
  })

  it('starts new game when clicking Play Again in winning modal', async () => {
    renderWithProviders(<App />, false)
    const user = userEvent.setup({ delay: null })

    await user.click(screen.getByText('Start Game'))
    vi.runOnlyPendingTimers()
    
    const tiles = screen.getAllByRole('button', { name: /Tile/ })
    await user.click(tiles[0])
    vi.runOnlyPendingTimers()
    
    const board = document.querySelector('.game-board')
    if (board) {
      board.dispatchEvent(new CustomEvent('win'))
    }
    vi.runOnlyPendingTimers()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Play Again' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Play Again' }))
    vi.runOnlyPendingTimers()

    await waitFor(() => {
      expect(screen.getByText('Moves: 0')).toBeInTheDocument()
      expect(screen.getByText('Time: 0:00')).toBeInTheDocument()
      expect(screen.queryByText('🎉 Congratulations! 🎉')).not.toBeInTheDocument()
    })
  })
})
