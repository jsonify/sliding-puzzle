# Next Level Feature Implementation Plan

## Overview
Add functionality to transition players to the next level via a "Next Level" button in the victory modal of the sliding puzzle game.

## Technical Implementation Steps

### 1. VictoryModal Component Updates
- Add new props:
  ```typescript
  hasNextLevel: boolean;  // Whether there is a next level available
  onNextLevel: () => void;  // Handler for next level button click
  ```
- Modify UI to include "Next Level" button:
  - Show both "Play Again" and "Next Level" buttons when hasNextLevel is true
  - Keep only "Play Again" button when hasNextLevel is false
  - Style buttons consistently with game's design

### 2. App/Game Logic Updates
- Add helper function to determine next level:
  ```typescript
  function getNextLevel(currentSize: GridSize): GridSize | null {
    const currentIndex = GAME_CONFIG.GRID_SIZES.indexOf(currentSize);
    return currentIndex < GAME_CONFIG.GRID_SIZES.length - 1 
      ? GAME_CONFIG.GRID_SIZES[currentIndex + 1] 
      : null;
  }
  ```
- Add logic to check if next level is unlocked:
  ```typescript
  function canProgressToNextLevel(
    currentSize: GridSize,
    unlockedSizes: Set<GridSize>
  ): boolean {
    const nextSize = getNextLevel(currentSize);
    return nextSize !== null && unlockedSizes.has(nextSize);
  }
  ```

### 3. Integration
1. Update VictoryModal usage to include new props
2. Implement next level transition logic
3. Handle edge cases:
   - Last level reached
   - Next level locked
   - Save game progress/stats

## Testing Plan
1. Unit Tests:
   - Test getNextLevel helper:
     - Returns correct next size
     - Returns null for max size
   - Test canProgressToNextLevel:
     - Returns true when next level is unlocked
     - Returns false when next level is locked/nonexistent

2. Integration Tests:
   - Verify modal displays correct buttons based on level state
   - Verify next level transition works correctly
   - Verify game state is properly reset for new level

3. End-to-End Tests:
   - Complete game flow from first to last level
   - Verify proper button behavior in all scenarios

## UI/UX Considerations
1. Button Layout:
   ```
   [Play Again] [Next Level]  // When next level available
   [Play Again]              // When on final level
   ```

2. Visual Feedback:
   - Highlight "Next Level" button to encourage progression
   - Show locked state if next level isn't unlocked yet
   - Smooth transition animation between levels

## Implementation Order
1. Create helper functions for next level logic
2. Update VictoryModal component
3. Integrate changes into main game flow
4. Add tests
5. Implement UI polish and animations

## Success Criteria
1. Players can seamlessly progress to next level via victory modal
2. Clear visual indication of level progression
3. Proper handling of all edge cases
4. Maintained game state consistency
5. Complete test coverage