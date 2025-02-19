# Timed Challenge Mode Implementation Plan

## Overview
Add a new timed challenge mode to the sliding puzzle game where players must solve puzzles within a time limit that scales with grid size.

## 1. Type and Configuration Updates

### Update Game Types (`src/types/game.ts`)
```typescript
// Add to GameMode type
export type GameMode = 'classic' | 'color' | 'timed';

// Add new interface for timed mode configuration
export interface TimedModeConfig {
  baseTime: number;        // Base time in seconds (e.g., 60 for 3x3)
  timeMultiplier: number;  // Multiplier per grid size increase (e.g., 2)
  warningTime: number;     // Time in seconds when warning starts (e.g., 10)
}

// Add to GameConfig interface
export interface GameConfig {
  mode: GameMode;
  gridSize: GridSize;
  patternType?: PatternType;
  timedConfig?: TimedModeConfig;  // New field
}

// Add new interface for timed mode state
export interface TimedModeState extends GameState {
  timeRemaining: number;
  initialTime: number;
  bestTimes: Record<GridSize, number>;
}
```

### Update Game Configuration (`src/constants/gameConfig.ts`)
```typescript
export const TIMED_MODE_CONFIG: TimedModeConfig = {
  baseTime: 60,          // 60 seconds for 3x3
  timeMultiplier: 2,     // Double time for each size increase
  warningTime: 10        // Warning at 10 seconds remaining
};

// Add to GAME_MODES
export const GAME_MODES = {
  CLASSIC: 'classic',
  COLOR: 'color',
  TIMED: 'timed'
} as const;
```

## 2. Core Timer Implementation

### Create Timer Logic (`src/utils/timerUtils.ts`)
- Implement timer calculation based on grid size
- Create countdown timer mechanism
- Add time formatting utilities
- Implement high score tracking per grid size

## 3. UI Components

### Timer Display Component (`src/components/TimerDisplay.tsx`)
- Create prominent countdown display
- Implement warning state styling
- Add visual pulse effect for last 10 seconds
- Show best time for current grid size

### Mode Toggle (`src/components/ModeSelect.tsx`)
- Add timed mode to mode selection
- Include explanation of timed mode rules
- Show high scores per grid size

### Victory/Game Over Modal (`src/components/GameEndModal.tsx`)
- Update to handle timed mode outcomes
- Display time remaining on victory
- Show "Time's Up!" on failure
- Compare against and display best times

## 4. State Management

### Update Game State
- Add timer state management
- Implement pause/resume functionality
- Track best completion times
- Handle game over conditions

## 5. Audio Feedback

### Sound Effects (`src/utils/soundUtils.ts`)
- Add tick sound for last 10 seconds
- Include victory/failure sounds
- Implement mute toggle

## 6. Storage

### High Score System
- Store best times per grid size
- Implement leaderboard updates
- Add time-based achievements

## 7. Testing

### New Test Cases
- Timer calculation tests
- Game over condition tests
- High score storage tests
- UI component tests

## Git Branch Strategy
```
feature/timed-mode
├── implement-timer-logic
├── add-ui-components
├── update-state-management
├── add-sound-effects
└── implement-storage
```

## Implementation Order
1. Core timer logic and state management
2. Basic UI components without styling
3. Game over conditions and storage
4. Sound effects and polish
5. Testing and bug fixes

## Technical Considerations
- Timer accuracy and performance
- State management during app suspension/resume
- Mobile device optimizations
- Backward compatibility with existing modes
- Accessibility for timer display