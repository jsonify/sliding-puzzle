# Sliding Puzzle Game

A modern implementation of the classic 15-puzzle (sliding puzzle) game built with React, TypeScript, and Tailwind CSS, but with a twist.

```
+------------------+
|     15 Puzzle     |
+------------------+
|  1   2   3   4   |
|  5   6   7   8   |
|  9  10  11  12   |
| 13  14  15       |
+------------------+
|   [New Game]     |
|   Grid Size: 4   |
+------------------+
```

## Features

- Multiple grid sizes (3x3, 4x4, 5x5)
- Responsive design that works on mobile and desktop
- Dark mode support
- Smooth tile animations
- Keyboard navigation support
- Victory detection and celebration
- Accessibility features including ARIA labels and keyboard support

## Game Implementation Details

### State Management

The game uses React's built-in state management with TypeScript for type safety:

```typescript
interface GameState {
  tiles: number[][];           // 2D array of tile positions
  gridSize: number;           // Current grid size (3-5)
  moves: number;             // Move counter
  isWon: boolean;           // Victory state
  gameStarted: boolean;     // Game status
}

interface TilePosition {
  row: number;
  col: number;
}
```

### Key Features Implementation

1. **Move Validation**
   - Checks adjacent tiles using matrix position calculations
   - Prevents invalid moves
   - Optimizes re-renders with position memoization

2. **Victory Detection**
   ```typescript
   const checkWinCondition = (tiles: number[][]): boolean => {
     let expected = 1;
     return tiles.every(row => 
       row.every(tile => tile === expected++ || 
         (tile === 0 && expected === gridSize * gridSize))
     );
   };
   ```

3. **Grid Generation**
   - Fisher-Yates shuffle for randomization
   - Ensures puzzle is solvable
   - Supports dynamic grid sizes

4. **Performance Optimizations**
   - Memoized tile rendering
   - Event delegation for move handling
   - Efficient state updates

## Getting Started

### Prerequisites

- Node.js 16 or higher
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sliding-puzzle-game.git
cd sliding-puzzle-game
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## How to Play

1. Select a puzzle size (3x3, 4x4, or 5x5)
2. Click 'New Game' to start
3. Click tiles adjacent to the empty space to move them
4. Arrange the numbers in ascending order to win
5. Use keyboard arrow keys for alternative controls

### Keyboard Controls

- ↑: Move tile from below up
- ↓: Move tile from above down
- ←: Move tile from right left
- →: Move tile from left right
- R: Reset game
- N: New game
- 3/4/5: Change grid size

## Built With

- [React](https://reactjs.org/) - UI Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build Tool
- [Vitest](https://vitest.dev/) - Testing Framework

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run tests
- `pnpm lint` - Lint code
- `pnpm format` - Format code

### Project Structure

```
src/
├── components/     # React components
│   ├── Board.tsx        # Game grid component
│   ├── Tile.tsx        # Individual tile component
│   ├── GameControls.tsx # Game controls
│   └── LevelSelect.tsx # Grid size selector
├── types/         # TypeScript type definitions
│   └── game.ts        # Game-related types
├── utils/         # Helper functions
│   └── gameUtils.ts   # Game logic
└── __tests__/     # Test files
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Note: See the [docs/images](docs/images) directory for additional game previews and screenshots.
