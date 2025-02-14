import { render, screen, fireEvent } from '@testing-library/react';
import { LevelSelect } from '../LevelSelect';
import type { Difficulty, GridSize } from '../../types/game';

describe('LevelSelect', () => {
  const defaultProps = {
    onLevelSelect: vi.fn(),
    currentSize: 4 as GridSize,
    currentDifficulty: 'medium' as Difficulty,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the title correctly', () => {
    render(<LevelSelect {...defaultProps} />);
    expect(screen.getByText('Sliding Puzzle')).toBeInTheDocument();
  });

  describe('Grid Size Selection', () => {
    const sizes: GridSize[] = [3, 4, 5, 6, 7, 8, 9];

    it('renders all grid size options', () => {
      render(<LevelSelect {...defaultProps} />);
      sizes.forEach(size => {
        expect(screen.getByText(`${size}x${size}`)).toBeInTheDocument();
      });
    });

    it('renders preview grids for each size', () => {
      render(<LevelSelect {...defaultProps} />);
      sizes.forEach(size => {
        const button = screen.getByText(`${size}x${size}`).closest('button');
        const grid = button?.querySelector(`[style*="grid-template-columns: repeat(${size}, 1fr)"]`);
        expect(grid).toBeInTheDocument();
      });
    });

    it('highlights current grid size selection', () => {
      render(<LevelSelect {...defaultProps} />);
      const currentSizeButton = screen.getByText('4x4').closest('button');
      expect(currentSizeButton).toHaveClass('ring-2', 'ring-blue-500');
    });

    it('calls onLevelSelect with correct size when clicking a size option', () => {
      render(<LevelSelect {...defaultProps} />);
      fireEvent.click(screen.getByText('3x3'));
      expect(defaultProps.onLevelSelect).toHaveBeenCalledWith(3, 'medium');
    });
  });

  describe('Difficulty Selection', () => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

    it('renders all difficulty options', () => {
      render(<LevelSelect {...defaultProps} />);
      difficulties.forEach(difficulty => {
        expect(screen.getByText(difficulty, { exact: false })).toBeInTheDocument();
      });
    });

    it('highlights current difficulty selection', () => {
      render(<LevelSelect {...defaultProps} />);
      const currentDifficultyButton = screen.getByText('medium', { exact: false });
      expect(currentDifficultyButton).toHaveClass('bg-blue-500');
    });

    it('calls onLevelSelect with correct difficulty when clicking a difficulty option', () => {
      render(<LevelSelect {...defaultProps} />);
      fireEvent.click(screen.getByText('hard', { exact: false }));
      expect(defaultProps.onLevelSelect).toHaveBeenCalledWith(4, 'hard');
    });
  });

  describe('Start Game Button', () => {
    it('renders the start game button', () => {
      render(<LevelSelect {...defaultProps} />);
      expect(screen.getByText('Start Game')).toBeInTheDocument();
    });

    it('calls onLevelSelect with current settings when clicking start game', () => {
      render(<LevelSelect {...defaultProps} />);
      fireEvent.click(screen.getByText('Start Game'));
      expect(defaultProps.onLevelSelect).toHaveBeenCalledWith(4, 'medium');
    });

    it('applies hover and focus styles to start button', () => {
      render(<LevelSelect {...defaultProps} />);
      const startButton = screen.getByText('Start Game');
      expect(startButton).toHaveClass('hover:bg-green-600', 'hover:shadow-xl');
    });
  });

  describe('Instructions', () => {
    it('displays game instructions', () => {
      render(<LevelSelect {...defaultProps} />);
      expect(screen.getByText(/Click or use arrow keys/)).toBeInTheDocument();
      expect(screen.getByText(/Arrange the numbers in order/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses semantic headings for sections', () => {
      render(<LevelSelect {...defaultProps} />);
      expect(screen.getByText('Select Grid Size')).toHaveAttribute('class', expect.stringContaining('text-xl'));
      expect(screen.getByText('Select Difficulty')).toHaveAttribute('class', expect.stringContaining('text-xl'));
    });

    it('provides visual feedback for interactive elements', () => {
      render(<LevelSelect {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('transition-all');
      });
    });
  });

  describe('Responsive Layout', () => {
    it('uses responsive grid for size options', () => {
      render(<LevelSelect {...defaultProps} />);
      const gridContainer = screen.getByText('3x3').closest('.grid');
      expect(gridContainer).toHaveClass('grid-cols-2', 'sm:grid-cols-3', 'md:grid-cols-4');
    });

    it('maintains consistent spacing and padding', () => {
      render(<LevelSelect {...defaultProps} />);
      const container = screen.getByText('Sliding Puzzle').closest('.space-y-8');
      expect(container).toBeInTheDocument();
    });
  });
});