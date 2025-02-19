import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PauseOverlay from '../PauseOverlay';
import { useMediaQuery } from '../../hooks/useMediaQuery';

// Mock the useMediaQuery hook
vi.mock('../../hooks/useMediaQuery');
const mockUseMediaQuery = vi.mocked(useMediaQuery);

describe('PauseOverlay', () => {
  const mockOnResume = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when not paused', () => {
    render(<PauseOverlay isPaused={false} onResume={mockOnResume} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  describe('on desktop', () => {
    beforeEach(() => {
      // Mock desktop viewport
      mockUseMediaQuery.mockReturnValue(false);
    });

    it('should show ESC instruction on desktop', () => {
      render(<PauseOverlay isPaused={true} onResume={mockOnResume} />);
      expect(screen.getByText('Press ESC to resume')).toBeInTheDocument();
    });

    it('should resume game when ESC key is pressed', () => {
      render(<PauseOverlay isPaused={true} onResume={mockOnResume} />);
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(mockOnResume).toHaveBeenCalledTimes(1);
    });
  });

  describe('on mobile', () => {
    beforeEach(() => {
      // Mock mobile viewport
      mockUseMediaQuery.mockReturnValue(true);
    });

    it('should show tap instruction on mobile', () => {
      render(<PauseOverlay isPaused={true} onResume={mockOnResume} />);
      expect(screen.getByText('Tap anywhere to resume')).toBeInTheDocument();
    });
  });

  it('should resume game when clicked/tapped', () => {
    render(<PauseOverlay isPaused={true} onResume={mockOnResume} />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(mockOnResume).toHaveBeenCalledTimes(1);
  });
});