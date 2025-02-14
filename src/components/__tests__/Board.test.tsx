import { render, screen, fireEvent } from '@testing-library/react';
import Board from '../Board';
import { getMovablePositions } from '../../utils/gameUtils';
import type { Board as BoardType, GridSize, Position } from '../../types/game';
import { type Mock } from 'vitest';

// Mock the gameUtils functions
vi.mock('../../utils/gameUtils', () => ({
  getMovablePositions: vi.fn(),
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
    onTileClick: vi.fn(),
    tileSize: 3,
    isWon: false,
  };

  beforeEach(() => {
    (getMovablePositions as unknown as Mock<[BoardType], Position[]>).mockReturnValue([
      { row: 2, col: 1 }, // Position of tile 8
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the correct number of tiles', () => {
    render(<Board {...defaultProps} />);
    const tiles = screen.getAllByRole('button');
    expect(tiles).toHaveLength(8); // 8 numbered tiles, 1 empty space
  });

  it('applies grid template columns based on grid size', () => {
    render(<Board {...defaultProps} />);
    const board = screen.getByRole('grid');
    expect(board).toHaveStyle({
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    });
  });

  it('calls onTileClick with correct position when tile is clicked', () => {
    const onTileClick = vi.fn();
    render(<Board {...defaultProps} onTileClick={onTileClick} />);
    
    // Click tile "8" which should be movable
    fireEvent.click(screen.getByText('8'));
    expect(onTileClick).toHaveBeenCalledWith({ row: 2, col: 1 });
  });

  it('renders empty space correctly', () => {
    render(<Board {...defaultProps} />);
    // The empty space should not be a button
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('applies win animation class when game is won', () => {
    render(<Board {...defaultProps} isWon={true} />);
    const board = screen.getByRole('grid');
    expect(board).toHaveClass('animate-win');
  });

  it('makes only valid tiles clickable', () => {
    render(<Board {...defaultProps} />);
    const tile8 = screen.getByText('8');
    const tile7 = screen.getByText('7');

    // Tile 8 should be movable
    expect(tile8).toHaveClass('cursor-pointer');
    expect(tile8).not.toBeDisabled();

    // Tile 7 should not be movable
    expect(tile7).toHaveClass('cursor-not-allowed');
    expect(tile7).toBeDisabled();
  });

  it('renders with correct accessibility attributes', () => {
    render(<Board {...defaultProps} />);
    const board = screen.getByRole('grid');
    expect(board).toHaveAttribute('aria-label', 'Sliding puzzle board');
  });

  describe('responsive behavior', () => {
    it('adjusts tile size based on grid size', () => {
      const { rerender } = render(<Board {...defaultProps} />);
      
      // Check 3x3 grid
      let tiles = screen.getAllByRole('button');
      tiles.forEach(tile => {
        expect(tile).toHaveClass('p-4');
      });

      // Check 5x5 grid
      const largerBoard: BoardType = Array(5).fill(Array(5).fill(0));
      rerender(<Board {...defaultProps} gridSize={5 as GridSize} tiles={largerBoard} />);
      tiles = screen.getAllByRole('button');
      tiles.forEach(tile => {
        expect(tile).toHaveClass('p-3');
      });
    });
  });
});