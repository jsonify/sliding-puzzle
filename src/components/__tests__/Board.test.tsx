import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Board from '../Board';
import { getMovablePositions } from '../../utils/gameUtils';
import type { Board as BoardType, GridSize, Position } from '../../types/game';
import { type Mock } from 'vitest';

// Mock the gameUtils functions
vi.mock('../../utils/gameUtils', () => ({
  getMovablePositions: vi.fn()
}));

describe('Board', () => {
  const mockBoard: BoardType = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0],
  ];

  const defaultProps = {
    gridSize: 3 as GridSize,
    tiles: mockBoard,
    tileSize: 100,
    onTileClick: vi.fn(),
    isWon: false
  };

  beforeEach(() => {
    // Reset document body between tests
    document.body.innerHTML = '';
    
    (getMovablePositions as unknown as Mock<[BoardType], Position[]>).mockReturnValue([
      { row: 2, col: 1 } // Position of tile 8
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the correct number of tiles', () => {
    render(<Board {...defaultProps} />);
    const tiles = screen.getAllByRole('button');
    expect(tiles).toHaveLength(8); // 8 numbered tiles (excluding empty space)
  });

  it('renders board with correct structure', () => {
    const { container } = render(<Board {...defaultProps} />);
    const board = container.querySelector('[data-testid="game-board"]');
    
    expect(board).toHaveAttribute('role', 'grid');
    expect(board).toHaveStyle({
      'grid-template-columns': 'repeat(3, minmax(0, 1fr))',
      'aspect-ratio': '1 / 1'
    });
  });

  it('calls onTileClick with correct position when tile is clicked', () => {
    const onTileClick = vi.fn();
    const { container } = render(<Board {...defaultProps} onTileClick={onTileClick} />);
    
    const tile8 = container.querySelector('[data-testid="tile-8"]');
    expect(tile8).toBeInTheDocument();
    
    fireEvent.click(tile8!);
    expect(onTileClick).toHaveBeenCalledWith({ row: 2, col: 1 });
  });

  it('renders empty space correctly', () => {
    const { container } = render(<Board {...defaultProps} />);
    const emptyTile = container.querySelector('.bg-gray-100.dark\\:bg-gray-800.rounded');
    expect(emptyTile).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('applies win animation class when game is won', () => {
    const { container } = render(<Board {...defaultProps} isWon={true} />);
    const board = container.querySelector('[data-testid="game-board"]');
    expect(board).toHaveClass('animate-win');
  });

  it('makes only valid tiles clickable', () => {
    const { container } = render(<Board {...defaultProps} />);
    
    const tile8 = container.querySelector('[data-testid="tile-8"]');
    const tile7 = container.querySelector('[data-testid="tile-7"]');

    expect(tile8).not.toBeDisabled();
    expect(tile8).toHaveClass('cursor-pointer');
    
    expect(tile7).toBeDisabled();
    expect(tile7).toHaveClass('cursor-not-allowed');
  });

  describe('responsive behavior', () => {
    const setWindowWidth = (width: number) => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width
      });
      global.dispatchEvent(new Event('resize'));
    };

    it('adjusts board width based on viewport size', () => {
      // Set small viewport before rendering
      setWindowWidth(400);
      
      const { container } = render(<Board {...defaultProps} />);
      let board = container.querySelector('[data-testid="game-board"]') as HTMLElement;
      expect(board.style.maxWidth).toBe('336px'); // 400 - (32 * 2) viewport padding

      // Change to large viewport and verify max width
      setWindowWidth(1200);
      board = container.querySelector('[data-testid="game-board"]') as HTMLElement;
      expect(board.style.maxWidth).toBe('336px'); // Width should not exceed viewport - padding
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      const { container } = render(<Board {...defaultProps} />);
      const board = container.querySelector('[data-testid="game-board"]');
      
      expect(board).toHaveAttribute('role', 'grid');
      expect(board).toHaveAttribute('aria-label', 'Sliding puzzle board');
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label', expect.stringMatching(/^Tile \d+$/));
      });
    });
  });
});