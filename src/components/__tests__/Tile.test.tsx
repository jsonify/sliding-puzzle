import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import Tile from '../Tile';
import type { Position } from '../../types/game';

describe('Tile', () => {
  const defaultProps = {
    number: 1,
    position: { row: 0, col: 0 } as Position,
    size: 4,
    isMovable: true,
    onClick: vi.fn(),
  };

  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the tile number', () => {
    render(<Tile {...defaultProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders empty tile (number 0) with correct styling', () => {
    const { container } = render(<Tile {...defaultProps} number={0} />);
    const emptyTile = container.querySelector('.bg-gray-100');
    expect(emptyTile).toHaveClass('bg-gray-100', 'dark:bg-gray-800', 'rounded');
  });

  it('applies correct styles for movable tiles', () => {
    const { container } = render(<Tile {...defaultProps} />);
    const tile = container.querySelector('button');
    expect(tile).toHaveClass(
      'cursor-pointer',
      'bg-white',
      'dark:bg-gray-700',
      'hover:bg-blue-50',
      'dark:hover:bg-gray-600'
    );
    expect(tile).not.toHaveClass('cursor-not-allowed');
  });

  it('applies correct styles for non-movable tiles', () => {
    const { container } = render(<Tile {...defaultProps} isMovable={false} />);
    const tile = container.querySelector('button');
    expect(tile).toHaveClass('cursor-not-allowed', 'bg-white', 'dark:bg-gray-700');
    expect(tile).not.toHaveClass('cursor-pointer', 'hover:bg-blue-50', 'dark:hover:bg-gray-600');
  });

  it('calls onClick when clicked and tile is movable', () => {
    const onClick = vi.fn();
    const { container } = render(<Tile {...defaultProps} onClick={onClick} />);
    const tile = container.querySelector('button');
    if (tile) {
      fireEvent.click(tile);
    }
    expect(onClick).toHaveBeenCalled();
  });

  it('does not call onClick when clicked and tile is not movable', () => {
    const onClick = vi.fn();
    const { container } = render(<Tile {...defaultProps} isMovable={false} onClick={onClick} />);
    const tile = container.querySelector('button');
    if (tile) {
      fireEvent.click(tile);
    }
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies different text sizes based on grid size', () => {
    // Test small grid (3x3)
    const { container, rerender } = render(<Tile {...defaultProps} size={3} />);
    const smallTile = container.querySelector('button');
    expect(smallTile).toHaveClass('text-3xl', 'p-4');

    // Test medium grid (5x5)
    rerender(<Tile {...defaultProps} size={5} />);
    const mediumTile = container.querySelector('button');
    expect(mediumTile).toHaveClass('text-2xl', 'p-3');

    // Test large grid (7x7)
    rerender(<Tile {...defaultProps} size={7} />);
    const largeTile = container.querySelector('button');
    expect(largeTile).toHaveClass('text-xl', 'p-2');
  });

  it('has correct accessibility attributes', () => {
    const { container } = render(<Tile {...defaultProps} />);
    const tile = container.querySelector('button');
    expect(tile).toHaveAttribute('aria-label', 'Tile 1');
    expect(tile).toHaveAttribute('type', 'button');
    expect(tile).not.toBeDisabled();
  });

  it('includes base styling classes', () => {
    const { container } = render(<Tile {...defaultProps} />);
    const tile = container.querySelector('button');
    expect(tile).toHaveClass(
      'flex',
      'items-center',
      'justify-center',
      'font-bold',
      'transition-all',
      'duration-150',
      'rounded',
      'select-none',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500'
    );
  });
});