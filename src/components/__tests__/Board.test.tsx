// src/__tests__/Board.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Board from '../Board';
import { BoardClassNames } from '../../constants/boardUI';
import type { BoardProps } from '../../types/game';

import { getMovablePositions } from '../../utils/gameUtils';

vi.mock('../../utils/gameUtils', () => ({
  getMovablePositions: vi.fn()
}));

describe('Board Components', () => {
  const mockProps: BoardProps = {
    gridSize: 3,
    tiles: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 0]
    ],
    onTileClick: vi.fn(),
    tileSize: 100, // Required by type but not used in component
    isWon: false,
    onBackToMain: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getMovablePositions as ReturnType<typeof vi.fn>).mockReturnValue([
      { row: 2, col: 1 }
    ]);
  });

  describe('basic rendering', () => {
    it('renders without crashing', () => {
      render(<Board {...mockProps} />);
      expect(screen.getByTestId('game-board')).toBeInTheDocument();
    });

    it('renders correct number of tiles', () => {
      render(<Board {...mockProps} />);
      
      const tiles = screen.getAllByTestId(/^tile-(?!empty)/);
      expect(tiles).toHaveLength(8);
    });
  
    it('renders correct number of tiles', () => {
      render(<Board {...mockProps} />);
      // Count all tiles including empty space
      const tiles = screen.getAllByTestId(/^tile-/);
      expect(tiles).toHaveLength(9); // 3x3 grid
    });
  
    it('has correct tile numbers', () => {
      render(<Board {...mockProps} />);
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
      numbers.forEach(num => {
        const tile = screen.getByTestId(`tile-${num}`);
        expect(tile).toHaveTextContent(num.toString());
      });
    });
  
    it('renders empty space', () => {
      render(<Board {...mockProps} />);
      const emptyTile = screen.getByTestId('tile-empty');
      expect(emptyTile).toBeInTheDocument();
      expect(emptyTile).toHaveAttribute('aria-label', 'Empty space');
    });
  
    it('renders back button', () => {
      render(<Board {...mockProps} />);
      const backButton = screen.getByRole('button', { name: 'Back to Main' });
      expect(backButton).toBeInTheDocument();
      
      fireEvent.click(backButton);
      expect(mockProps.onBackToMain).toHaveBeenCalledTimes(1);
    });
  });

  describe('grid structure', () => {
    it('renders with correct grid template', () => {
      render(<Board {...mockProps} />);
      const board = screen.getByTestId('game-board');
      expect(board).toHaveStyle({
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))'
      });
    });

    it('has correct number of rows', () => {
      render(<Board {...mockProps} />);
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(mockProps.gridSize);
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<Board {...mockProps} />);
      const board = screen.getByTestId('game-board');
      expect(board).toHaveAttribute('role', 'grid');
      expect(board).toHaveAttribute('aria-label', 'Sliding puzzle board');
    });
  });

  describe('interactions', () => {
    it('handles back button click', () => {
      render(<Board {...mockProps} />);
      const backButton = screen.getByText('Back to Main');
      fireEvent.click(backButton);
      expect(mockProps.onBackToMain).toHaveBeenCalledTimes(1);
    });

    it('shows win animation when game is won', () => {
      const wonProps = { ...mockProps, isWon: true };
      render(<Board {...wonProps} />);
      
      const board = screen.getByTestId('game-board');
      expect(board.className).toContain('animate-win');
    });

    it('handles movable tiles correctly', () => {
      (getMovablePositions as ReturnType<typeof vi.fn>).mockReturnValue([
        { row: 2, col: 1 }
      ]);
      
      render(<Board {...mockProps} />);
      const tiles = screen.getAllByRole('button').slice(1); // Exclude back button
      const movableTile = tiles.find(tile => 
        tile.getAttribute('data-position') === '2-1'
      );
      expect(movableTile).not.toBeDisabled();
    });

    it('handles tile clicks correctly', () => {
      render(<Board {...mockProps} />);
      
      // Click tile with number 5 (middle position)
      const tile = screen.getByTestId('tile-5');
      fireEvent.click(tile);
      
      expect(mockProps.onTileClick).toHaveBeenCalledWith({
        row: 1,
        col: 1
      });
    });
  
    it('applies correct responsive classes', () => {
      render(<Board {...mockProps} />);
      const board = screen.getByTestId('game-board');
      
      // Check for base classes
      BoardClassNames.BASE.forEach(className => {
        expect(board.className).toContain(className);
      });
    });
  });
});