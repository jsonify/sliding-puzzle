import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import GameControls from '../GameControls';
import type { Difficulty, GridSize } from '../../types/game';

describe('GameControls', () => {
  const defaultProps = {
    moves: 42,
    time: 123,
    onNewGame: vi.fn(),
    onSizeChange: vi.fn(),
    onDifficultyChange: vi.fn(),
    currentSize: 4 as GridSize,
    currentDifficulty: 'medium' as Difficulty,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays current moves count', () => {
    render(<GameControls {...defaultProps} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('formats and displays time correctly', () => {
    render(<GameControls {...defaultProps} />);
    expect(screen.getByText('02:03')).toBeInTheDocument(); // 123 seconds = 02:03
  });

  it('calls onNewGame when new game button is clicked', () => {
    render(<GameControls {...defaultProps} />);
    fireEvent.click(screen.getByText('New Game'));
    expect(defaultProps.onNewGame).toHaveBeenCalled();
  });

  describe('Grid Size Selection', () => {
    const sizes: GridSize[] = [3, 4, 5, 6, 7, 8, 9];

    it('renders all grid size options', () => {
      render(<GameControls {...defaultProps} />);
      sizes.forEach(size => {
        expect(screen.getByText(`${size}x${size}`)).toBeInTheDocument();
      });
    });

    it('highlights current grid size', () => {
      render(<GameControls {...defaultProps} />);
      const currentSizeButton = screen.getByText('4x4');
      expect(currentSizeButton).toHaveClass('bg-blue-500');
    });

    it('calls onSizeChange with correct size when clicking size button', () => {
      render(<GameControls {...defaultProps} />);
      fireEvent.click(screen.getByText('3x3'));
      expect(defaultProps.onSizeChange).toHaveBeenCalledWith(3);
    });
  });

  describe('Difficulty Selection', () => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

    it('renders all difficulty options', () => {
      render(<GameControls {...defaultProps} />);
      difficulties.forEach(difficulty => {
        expect(screen.getByText(difficulty, { exact: false })).toBeInTheDocument();
      });
    });

    it('highlights current difficulty', () => {
      render(<GameControls {...defaultProps} />);
      const currentDifficultyButton = screen.getByText('medium', { exact: false });
      expect(currentDifficultyButton).toHaveClass('bg-blue-500');
    });

    it('calls onDifficultyChange with correct difficulty when clicking difficulty button', () => {
      render(<GameControls {...defaultProps} />);
      fireEvent.click(screen.getByText('easy', { exact: false }));
      expect(defaultProps.onDifficultyChange).toHaveBeenCalledWith('easy');
    });
  });

  describe('Accessibility', () => {
    it('has accessible button labels', () => {
      render(<GameControls {...defaultProps} />);
      expect(screen.getByText('New Game')).toBeInTheDocument();
    });

    it('provides visual feedback for interactive elements', () => {
      render(<GameControls {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('transition-colors');
      });
    });
  });

  describe('Responsive Layout', () => {
    it('renders grid size buttons in a flex wrap container', () => {
      render(<GameControls {...defaultProps} />);
      const gridSizeContainer = screen.getAllByRole('button')[0].parentElement;
      expect(gridSizeContainer).toHaveClass('flex', 'flex-wrap');
    });

    it('maintains consistent spacing between controls', () => {
      render(<GameControls {...defaultProps} />);
      const container = screen.getByText('Moves:').closest('.space-y-4');
      expect(container).toBeInTheDocument();
    });
  });
});