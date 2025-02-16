import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import SolutionPreview from '../SolutionPreview';
import { COLOR_MODE } from '../../../constants/colorMode';
import type { ColorBoard } from '../../../types/game';

describe('SolutionPreview', () => {
  const mockPattern: ColorBoard = Array(COLOR_MODE.GRID_SIZE)
    .fill(0)
    .map(() => Array(COLOR_MODE.GRID_SIZE).fill(0));

  // Fill mock pattern with some colors
  mockPattern[0][0] = 'RED';
  mockPattern[0][1] = 'BLUE';
  mockPattern[1][0] = 'GREEN';
  mockPattern[1][1] = 'YELLOW';
  // Leave some spaces as empty (0)

  test('renders the component with correct title', () => {
    render(<SolutionPreview targetPattern={mockPattern} />);
    
    expect(screen.getByText('Target Pattern')).toBeInTheDocument();
    expect(screen.getByText('Arrange the tiles to match this pattern')).toBeInTheDocument();
  });

  test('renders the correct grid size', () => {
    render(<SolutionPreview targetPattern={mockPattern} />);
    
    const grid = screen.getByRole('grid', { hidden: true });
    const gridStyle = window.getComputedStyle(grid);
    expect(gridStyle.getPropertyValue('grid-template-columns'))
      .toBe(`repeat(${COLOR_MODE.GRID_SIZE}, 1fr)`);
  });

  test('renders colored tiles with correct colors', () => {
    render(<SolutionPreview targetPattern={mockPattern} />);
    
    const redTile = screen.getByLabelText('RED colored tile');
    const blueTile = screen.getByLabelText('BLUE colored tile');
    const greenTile = screen.getByLabelText('GREEN colored tile');
    const yellowTile = screen.getByLabelText('YELLOW colored tile');

    expect(redTile).toBeInTheDocument();
    expect(blueTile).toBeInTheDocument();
    expect(greenTile).toBeInTheDocument();
    expect(yellowTile).toBeInTheDocument();
  });

  test('renders empty spaces correctly', () => {
    render(<SolutionPreview targetPattern={mockPattern} />);
    
    const emptySpaces = screen.getAllByLabelText('Empty space');
    // Should have multiple empty spaces in the pattern
    expect(emptySpaces.length).toBeGreaterThan(0);
    
    // Check that empty spaces have the correct styling
    emptySpaces.forEach(space => {
      expect(space.className).toContain('bg-gray-100 dark:bg-gray-900');
    });
  });

  test('applies correct dimensions', () => {
    render(<SolutionPreview targetPattern={mockPattern} />);
    
    const container = screen.getByRole('grid', { hidden: true });
    expect(container).toHaveStyle({
      width: '150px',
      aspectRatio: '1 / 1',
    });
  });

  test('handles dark mode classes', () => {
    render(<SolutionPreview targetPattern={mockPattern} />);
    
    const container = screen.getByRole('grid', { hidden: true });
    expect(container.className).toContain('dark:bg-gray-800');
  });
});