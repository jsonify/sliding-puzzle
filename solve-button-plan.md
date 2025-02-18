# Solve Button Implementation Plan

## Overview
Add a "Solve" button that instantly brings the puzzle to a solved state and triggers the victory modal.

## Implementation Steps

### 1. Update Types
Add onSolve handler to GameControlsProperties in src/types/game.ts:
```typescript
export interface GameControlsProperties {
  // ... existing props
  onSolve?: () => void;  // Optional to maintain backward compatibility
}
```

### 2. Update GameControls Component
Add solve button in src/components/GameControls.tsx:
- Place next to "New Game" button
- Use consistent styling
- Only show in appropriate game states

```tsx
<div className="flex space-x-4">
  <button
    type="button"
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    onClick={onNewGame}
  >
    New Game
  </button>
  <button
    type="button"
    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
    onClick={onSolve}
  >
    Solve
  </button>
  {/* ... existing buttons ... */}
</div>
```

### 3. Update GameLayout Component
Pass onSolve handler through GameLayout to GameControls

### 4. Implement Solve Handler in App.tsx
Add onSolve handler that:
1. Creates solved board state using createBoard()
2. Updates game state:
   - Sets isWon to true
   - Keeps current moves count
   - Keeps current time
3. Shows victory modal
4. Updates leaderboard with current game stats

```typescript
const onSolve = useCallback((): void => {
  const solvedBoard = createBoard(gridSize);
  setBoard(solvedBoard);
  setGameState(prev => ({
    ...prev,
    isWon: true,
    isPlaying: false
  }));
  setShowVictoryModal(true);
  updateLeaderboard({
    gridSize,
    moves: gameState.moves,
    mode,
    timeSeconds: gameState.time
  });
}, [gridSize, gameState.moves, gameState.time, mode]);
```

## Testing Considerations
1. Verify victory modal appears
2. Ensure leaderboard updates correctly
3. Check that moves and time are preserved
4. Test in both classic and color modes
5. Verify button styling matches design system

## Future Enhancements
1. Add confirmation dialog before solving
2. Add keyboard shortcut
3. Consider disabling in certain game states