import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import Board from '../Board';
import { getMovablePositions } from '../../utils/gameUtils';
import type { Board as BoardType, GridSize, Position } from '../../types/game';
import { type Mock } from 'vitest';

// Mock the gameUtils functions
vi.mock('../../utils/gameUtils', () => ({
  getMovablePositions: vi.fn(),
}));

// Mock window.innerWidth
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
};

describe('Board', () => {
  const mockBoard: BoardType = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0],
  ];

  const defaultProps = {
    gridSize: 3 as GridSize,
    tiles: mockBoard,
    onTileClick: vi.fn(),
    onBackToMain: vi.fn(),
    isWon: false,
    tileSize: 100,
  };

  beforeEach(() => {
    cleanup();
    (getMovablePositions as unknown as Mock<[BoardType], Position[]>).mockReturnValue([
      { row: 2, col: 1 }, // Position of tile 8
    ]);
    mockInnerWidth(1024); // Default width for tests
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the correct number of tiles', () => {
    render(<Board {...defaultProps} />);
    // Filter out the back button from the count
    const tiles = screen.getAllByRole('button').filter(button => button.textContent !== 'Back to Main');
    expect(tiles).toHaveLength(8); // 8 numbered tiles
  });

  it('renders board with correct structure', () => {
    const { container } = render(<Board {...defaultProps} />);
    const board = container.querySelector('[data-testid="game-board"]') as HTMLElement;
    const rows = screen.getAllByRole('row');
    
    expect(board).toHaveAttribute('role', 'grid');
    expect(rows).toHaveLength(3);
    expect(board.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
    expect(board.style.aspectRatio).toBe('1 / 1');
  });

  it('calls onTileClick with correct position when tile is clicked', () => {
    const onTileClick = vi.fn();
    const { container } = render(<Board {...defaultProps} onTileClick={onTileClick} />);
    
    // Find tile 8 by data-testid
    const tile8 = container.querySelector('[data-testid="tile-08-2-1"]');
    if (tile8) {
      fireEvent.click(tile8);
    }
    expect(onTileClick).toHaveBeenCalledWith({ row: 2, col: 1 });
  });

  it('renders and handles back button correctly', () => {
    const onBackToMain = vi.fn();
    const { container } = render(<Board {...defaultProps} onBackToMain={onBackToMain} />);
    
    const backButton = container.querySelector('.back-button');
    expect(backButton).toBeInTheDocument();
    
    if (backButton) {
      fireEvent.click(backButton);
    }
    expect(onBackToMain).toHaveBeenCalled();
  });

  it('renders empty space correctly', () => {
    const { container } = render(<Board {...defaultProps} />);
    // The empty tile should have a specific class combination
    const emptyTile = container.querySelector('.bg-gray-100.dark\\:bg-gray-800.rounded');
    expect(emptyTile).toBeInTheDocument();
    // Ensure it's not rendered as a button
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('applies win animation class when game is won', () => {
    const { container } = render(<Board {...defaultProps} isWon={true} />);
    const board = container.querySelector('[data-testid="game-board"]');
    expect(board).toHaveClass('animate-win');
  });

  it('makes only valid tiles clickable', () => {
    const { container } = render(<Board {...defaultProps} />);
    
    // Find tiles by data-testid to ensure uniqueness
    const tile8 = container.querySelector('[data-testid="tile-08-2-1"]');
    const tile7 = container.querySelector('[data-testid="tile-07-2-0"]');

    expect(tile8).not.toBeDisabled();
    expect(tile8).toHaveClass('cursor-pointer');

    expect(tile7).toBeDisabled();
    expect(tile7).toHaveClass('cursor-not-allowed');
  });

  describe('responsive behavior', () => {
    it('adjusts board width based on viewport size', () => {
      // Test with small viewport
      mockInnerWidth(400);
      const { container, rerender } = render(<Board {...defaultProps} />);
      let board = container.querySelector('[data-testid="game-board"]') as HTMLElement;
      expect(board.style.maxWidth).toBe('336px'); // 400 - (32 * 2) padding

      // Test with large viewport
      mockInnerWidth(1200);
      rerender(<Board {...defaultProps} />);
      board = container.querySelector('[data-testid="game-board"]') as HTMLElement;
      expect(board.style.maxWidth).toBe('600px'); // Max width should be capped
    });

    it('adjusts tile size based on grid size', () => {
      const { container, rerender } = render(<Board {...defaultProps} />);
      
      // Check 3x3 grid
      let tiles = container.querySelectorAll('[data-testid^="tile-"]:not(.back-button)');
      tiles.forEach(tile => {
        expect(tile).toHaveClass('text-3xl');
        expect(tile).toHaveClass('p-4');
      });

      // Check 5x5 grid
      const largerBoard: BoardType = Array(5).fill(0).map((_, i) => 
        Array(5).fill(0).map((_, j) => i * 5 + j + 1)
      );
      largerBoard[4][4] = 0; // Set empty tile
      
      rerender(<Board {...defaultProps} gridSize={5 as GridSize} tiles={largerBoard} tileSize={80} />);
      tiles = container.querySelectorAll('[data-testid^="tile-"]:not(.back-button)');
      tiles.forEach(tile => {
        expect(tile).toHaveClass('text-2xl');
        expect(tile).toHaveClass('p-3');
      });
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      const { container } = render(<Board {...defaultProps} />);
      const board = container.querySelector('[data-testid="game-board"]');
      
      expect(board).toHaveAttribute('role', 'grid');
      expect(board).toHaveAttribute('aria-label', 'Sliding puzzle board');
      
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(3);
      rows.forEach(row => {
        expect(row).toHaveClass('contents');
      });
    });
  });
});