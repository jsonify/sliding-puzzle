import { render, screen, fireEvent } from '@testing-library/react';
import { Tile } from '../Tile';
import type { Position } from '../../types/game';

describe('Tile', () => {
  const defaultProps = {
    number: 1,
    position: { row: 0, col: 0 } as Position,
    size: 4,
    isMovable: true,
    onClick: vi.fn(),
  };

  it('renders the tile number', () => {
    render(<Tile {...defaultProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders empty space for number 0', () => {
    render(<Tile {...defaultProps} number={0} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies correct styles for movable tiles', () => {
    render(<Tile {...defaultProps} />);
    const tile = screen.getByRole('button');
    expect(tile).toHaveClass('cursor-pointer');
    expect(tile).not.toHaveClass('cursor-not-allowed');
  });

  it('applies correct styles for non-movable tiles', () => {
    render(<Tile {...defaultProps} isMovable={false} />);
    const tile = screen.getByRole('button');
    expect(tile).toHaveClass('cursor-not-allowed');
    expect(tile).not.toHaveClass('cursor-pointer');
  });

  it('calls onClick when clicked and tile is movable', () => {
    const onClick = vi.fn();
    render(<Tile {...defaultProps} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('does not call onClick when clicked and tile is not movable', () => {
    const onClick = vi.fn();
    render(<Tile {...defaultProps} isMovable={false} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies different text sizes based on grid size', () => {
    // Test 3x3 grid
    const { rerender } = render(<Tile {...defaultProps} size={3} />);
    expect(screen.getByRole('button')).toHaveClass('text-3xl');

    // Test 5x5 grid
    rerender(<Tile {...defaultProps} size={5} />);
    expect(screen.getByRole('button')).toHaveClass('text-2xl');

    // Test 7x7 grid
    rerender(<Tile {...defaultProps} size={7} />);
    expect(screen.getByRole('button')).toHaveClass('text-xl');
  });

  it('has correct accessibility attributes', () => {
    render(<Tile {...defaultProps} />);
    const tile = screen.getByRole('button');
    expect(tile).toHaveAttribute('aria-label', 'Tile 1');
    expect(tile).toHaveAttribute('data-testid', 'tile-1');
    expect(tile).toHaveAttribute('data-position', '0-0');
  });
});