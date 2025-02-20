# New Leaderboard Types

```typescript
// New combined score entry for Classic mode
interface ClassicScoreEntry {
  moves: number;
  timeSeconds: number;
  completedAt: string;
  gridSize: GridSize;
}

// Score entry for Color mode (same as current LeaderboardEntry)
interface ColorScoreEntry extends LeaderboardEntry {}

// Updated category interface
interface LeaderboardCategory {
  mode: GameMode;
  classicScores?: ClassicScoreEntry[];  // Only for Classic mode
  colorScores?: ColorScoreEntry[];      // Only for Color mode, limited to top 5
  stats: {
    gamesPlayed: number;
    totalTime: number;
    totalMoves: number;
    averageTime: number;
    averageMoves: number;
  };
}

// Updated categories container
interface LeaderboardCategories {
  [key: string]: LeaderboardCategory;  // key format: "${gridSize}x${gridSize}"
}
```

## Key Changes

1. Separate interfaces for Classic and Color mode scores:
   - Classic mode combines moves and time into single entries
   - Color mode maintains current structure but will be limited to 5 entries

2. Mode-specific category structure:
   - Each category now includes a mode identifier
   - Scores are stored in mode-specific arrays
   - Stats remain similar but are now mode-specific

3. Migration Considerations:
   - Existing bestMoves and bestTime entries will be combined for Classic mode
   - Recent games will be filtered by mode and stored appropriately
   - Stats will be recalculated during migration