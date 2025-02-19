# Grid Size Unlocking Persistence Plan

## Problem
Currently, unlocked grid sizes are not persisted between sessions. This means that even after completing levels and unlocking new grid sizes, reloading the app resets back to only having the 3x3 grid unlocked.

## Solution
Implement localStorage persistence for unlocked grid sizes:

1. Add localStorage integration:
   - Create a constant for the storage key
   - Add helper functions to get/set unlocked sizes from localStorage
   - Initialize state from localStorage on app load
   - Update localStorage when new sizes are unlocked

2. Code Changes Required:
   ```typescript
   // Add to src/constants/gameConfig.ts
   export const STORAGE_KEYS = {
     UNLOCKED_SIZES: 'slidingPuzzle_unlockedSizes'
   };

   // Modify App.tsx:
   // - Update initial state to load from localStorage
   // - Update localStorage when unlocking new sizes
   ```

3. Testing:
   - Complete a level to unlock a new grid size
   - Refresh the page to verify persistence
   - Test on mobile devices to ensure proper functionality

## Implementation Steps

1. Add storage key constant to gameConfig.ts
2. Update App.tsx initial state to load from localStorage
3. Update the unlocking logic to save to localStorage
4. Test the changes thoroughly

## Expected Results

- Grid size unlocks will persist between sessions
- Players can access previously unlocked grid sizes after reloading
- The game will maintain proper progression state