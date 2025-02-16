import { describe, expect, test } from 'vitest';
import {
  generatePattern,
  generateColumnStackPattern,
  generateRandomPattern,
  isPatternMatched
} from '../colorPatternUtils';
import { COLOR_MODE, PATTERN_TYPES, type TileColor } from '../../constants/colorMode';

describe('colorPatternUtils', () => {
  describe('generateColumnStackPattern', () => {
    test('generates a valid column stack pattern', () => {
      const pattern = generateColumnStackPattern();
      
      // Should be 5x5 grid
      expect(pattern.length).toBe(COLOR_MODE.GRID_SIZE);
      pattern.forEach(row => {
        expect(row.length).toBe(COLOR_MODE.GRID_SIZE);
      });

      // Each column should have 4 tiles of the same color
      for (let col = 0; col < COLOR_MODE.GRID_SIZE - 1; col++) {
        const columnColors = new Set<TileColor>();
        let colorCount = 0;
        for (let row = 0; row < pattern.length; row++) {
          const color = pattern[row][col];
          if (color !== 0) {
            columnColors.add(color);
            colorCount++;
          }
        }
        expect(columnColors.size).toBe(1); // Same color in column
        expect(colorCount).toBe(COLOR_MODE.TILES_PER_COLOR); // 4 tiles per color
      }

      // Bottom right should be empty
      expect(pattern[COLOR_MODE.GRID_SIZE - 1][COLOR_MODE.GRID_SIZE - 1]).toBe(0);
    });
  });

  describe('generateRandomPattern', () => {
    test('generates a valid random pattern', () => {
      const pattern = generateRandomPattern();
      
      // Should be 5x5 grid
      expect(pattern.length).toBe(COLOR_MODE.GRID_SIZE);
      pattern.forEach(row => {
        expect(row.length).toBe(COLOR_MODE.GRID_SIZE);
      });

      // Count colors and empty spaces
      const colorCounts = new Map<TileColor | 0, number>();
      pattern.forEach(row => {
        row.forEach(value => {
          colorCounts.set(value, (colorCounts.get(value) || 0) + 1);
        });
      });

      // Should have one empty space
      expect(colorCounts.get(0)).toBe(1);

      // Each color should appear exactly 4 times
      let totalColoredTiles = 0;
      colorCounts.forEach((count, color) => {
        if (color !== 0) {
          expect(count).toBe(COLOR_MODE.TILES_PER_COLOR);
          totalColoredTiles += count;
        }
      });

      // Total colored tiles should be 24 (6 colors × 4 tiles)
      expect(totalColoredTiles).toBe(COLOR_MODE.TOTAL_COLORS * COLOR_MODE.TILES_PER_COLOR);
    });
  });

  describe('generatePattern', () => {
    test('generates correct pattern type', () => {
      const randomPattern = generatePattern(PATTERN_TYPES.RANDOM);
      const columnPattern = generatePattern(PATTERN_TYPES.COLUMN_STACK);

      // Verify pattern dimensions
      expect(randomPattern.length).toBe(COLOR_MODE.GRID_SIZE);
      expect(columnPattern.length).toBe(COLOR_MODE.GRID_SIZE);

      // Column pattern should have same color in each column
      const firstColumn = columnPattern.map(row => row[0]).filter(color => color !== 0);
      expect(new Set(firstColumn).size).toBe(1);
    });

    test('throws error for invalid pattern type', () => {
      // @ts-expect-error Testing invalid pattern type
      expect(() => generatePattern('invalid')).toThrow();
    });
  });

  describe('isPatternMatched', () => {
    test('correctly identifies matching patterns', () => {
      const pattern = generateColumnStackPattern();
      expect(isPatternMatched(pattern, pattern)).toBe(true);

      // Modify one tile to create mismatch
      const modifiedPattern = JSON.parse(JSON.stringify(pattern));
      if (modifiedPattern[0][0] !== 0) {
        modifiedPattern[0][0] = 0;
      } else {
        modifiedPattern[0][0] = 'WHITE';
      }
      expect(isPatternMatched(pattern, modifiedPattern)).toBe(false);
    });
  });
});