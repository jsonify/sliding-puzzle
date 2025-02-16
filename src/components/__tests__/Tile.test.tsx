import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tile from '../Tile';
import { COLORS } from '../../constants/colorMode';

describe('Tile', () => {
  const mockOnClick = vi.fn();
  const defaultProps = {
    position: { row: 0, col: 0 },
    size: 3,
    isMovable: true,
    onClick: mockOnClick,
  };

  describe('Classic Mode', () => {
    test('renders numbered tile correctly', () => {
      render(
        <Tile
          {...defaultProps}
          mode="classic"
          value={5}
        />
      );

      const tile = screen.getByRole('button');
      expect(tile).toHaveTextContent('5');
      expect(tile).toHaveAttribute('aria-label', 'Tile 5');
    });

    test('renders empty tile correctly in classic mode', () => {
      render(
        <Tile
          {...defaultProps}
          mode="classic"
          value={0}
        />
      );

      const emptyTile = screen.getByTestId('tile-empty');
      expect(emptyTile).toBeInTheDocument();
      expect(emptyTile).toHaveAttribute('aria-label', 'Empty space');
    });

    test('handles click events when movable', async () => {
      const user = userEvent.setup();
      render(
        <Tile
          {...defaultProps}
          mode="classic"
          value={1}
        />
      );

      const tile = screen.getByRole('button');
      await user.click(tile);
      expect(mockOnClick).toHaveBeenCalled();
    });

    test('disables click when not movable', () => {
      render(
        <Tile
          {...defaultProps}
          mode="classic"
          value={1}
          isMovable={false}
        />
      );

      const tile = screen.getByRole('button');
      expect(tile).toBeDisabled();
    });
  });

  describe('Color Mode', () => {
    test('renders colored tile correctly', () => {
      render(
        <Tile
          {...defaultProps}
          mode="color"
          value="RED"
        />
      );

      const tile = screen.getByRole('button');
      expect(tile).toHaveAttribute('aria-label', 'RED colored tile');
      // Check if the background color is set correctly
      expect(tile.className).toContain(`bg-[${COLORS.RED}]`);
    });

    test('renders empty tile correctly in color mode', () => {
      render(
        <Tile
          {...defaultProps}
          mode="color"
          value={0}
        />
      );

      const emptyTile = screen.getByTestId('tile-empty');
      expect(emptyTile).toBeInTheDocument();
      expect(emptyTile).toHaveAttribute('aria-label', 'Empty space');
    });

    test('handles click events for colored tiles', async () => {
      const user = userEvent.setup();
      render(
        <Tile
          {...defaultProps}
          mode="color"
          value="BLUE"
        />
      );

      const tile = screen.getByRole('button');
      await user.click(tile);
      expect(mockOnClick).toHaveBeenCalled();
    });

    test('applies hover effect on movable colored tiles', () => {
      render(
        <Tile
          {...defaultProps}
          mode="color"
          value="GREEN"
          isMovable={true}
        />
      );

      const tile = screen.getByRole('button');
      expect(tile.className).toContain('hover:opacity-90');
    });
  });

  describe('Accessibility', () => {
    test('provides appropriate aria labels for both modes', () => {
      const { rerender } = render(
        <Tile
          {...defaultProps}
          mode="classic"
          value={3}
        />
      );

      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Tile 3');

      rerender(
        <Tile
          {...defaultProps}
          mode="color"
          value="YELLOW"
        />
      );

      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'YELLOW colored tile');
    });
  });
});