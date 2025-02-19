import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TimedGame from '../TimedGame';
import { calculateTimeLimit } from '../../constants/gameConfig';
import * as timerUtils from '../../utils/timerUtils';
import * as soundUtils from '../../utils/soundUtils';

// Add type declarations for Jest mocks
declare const jest: any;
declare const expect: any;
declare const describe: any;
declare const it: any;
declare const beforeEach: any;
declare const afterEach: any;

// Mock timer utilities
jest.mock('../../utils/timerUtils', () => ({
  ...jest.requireActual('../../utils/timerUtils'),
  saveBestTime: jest.fn(),
  getBestTimeForSize: jest.fn(),
  isNewBestTime: jest.fn(),
}));

// Mock sound utilities
jest.mock('../../utils/soundUtils', () => ({
  playSound: jest.fn(),
  toggleMute: jest.fn(),
  isSoundMuted: jest.fn().mockReturnValue(false),
}));

describe('TimedGame', () => {
  const mockOnBackToMain = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders initial game state correctly', () => {
    render(<TimedGame gridSize={3} onBackToMain={mockOnBackToMain} />);
    
    // Check for timer display
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument();
    
    // Check for mute and pause buttons
    expect(screen.getByText('🔊')).toBeInTheDocument();
    expect(screen.getByText('⏸️')).toBeInTheDocument();
  });

  it('handles tile movement correctly', () => {
    render(<TimedGame gridSize={3} onBackToMain={mockOnBackToMain} />);
    
    // Find a movable tile and click it
    const tiles = screen.getAllByRole('button');
    fireEvent.click(tiles[0]);
    
    // Timer should be running
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument();
  });

  it('handles pause/resume correctly', () => {
    render(<TimedGame gridSize={3} onBackToMain={mockOnBackToMain} />);
    
    const pauseButton = screen.getByText('⏸️');
    
    // Pause game
    fireEvent.click(pauseButton);
    expect(screen.getByText('▶️')).toBeInTheDocument();
    
    // Resume game
    fireEvent.click(screen.getByText('▶️'));
    expect(screen.getByText('⏸️')).toBeInTheDocument();
  });

  it('handles mute/unmute correctly', () => {
    render(<TimedGame gridSize={3} onBackToMain={mockOnBackToMain} />);
    
    const muteButton = screen.getByText('🔊');
    
    // Mute
    fireEvent.click(muteButton);
    expect(soundUtils.toggleMute).toHaveBeenCalled();
    
    // Should update UI when muted
    (soundUtils.isSoundMuted as any).mockReturnValue(true);
    fireEvent.click(muteButton);
    expect(screen.getByText('🔇')).toBeInTheDocument();
  });

  it('plays warning sound when time is running low', () => {
    render(<TimedGame gridSize={3} onBackToMain={mockOnBackToMain} />);
    
    // Advance time to warning period
    act(() => {
      jest.advanceTimersByTime(50000); // 50 seconds
    });
    
    expect(soundUtils.playSound).toHaveBeenCalledWith('tick');
  });

  it('handles game completion correctly', () => {
    render(<TimedGame gridSize={3} onBackToMain={mockOnBackToMain} />);

    // Simulate winning condition by forcing a re-render
    act(() => {
      // Advance some time
      jest.advanceTimersByTime(30000);
      
      // Victory sound should play
      expect(soundUtils.playSound).toHaveBeenCalledWith('victory');
      
      // Victory modal should be visible
      expect(screen.getByText(/Puzzle Solved!/i)).toBeInTheDocument();
    });
  });

  it('handles time-up correctly', () => {
    render(<TimedGame gridSize={3} onBackToMain={mockOnBackToMain} />);
    
    // Advance time past the limit
    act(() => {
      jest.advanceTimersByTime(61000); // 61 seconds
    });
    
    // Time-up sound should play
    expect(soundUtils.playSound).toHaveBeenCalledWith('timeUp');
    
    // Game over modal should be visible
    expect(screen.getByText(/Time's Up!/i)).toBeInTheDocument();
  });

  it('saves best time when completing puzzle', () => {
    (timerUtils.isNewBestTime as any).mockReturnValue(true);
    
    render(<TimedGame gridSize={3} onBackToMain={mockOnBackToMain} />);
    
    // Simulate winning with time remaining
    act(() => {
      jest.advanceTimersByTime(30000); // 30 seconds
    });
    
    expect(timerUtils.saveBestTime).toHaveBeenCalled();
  });
});