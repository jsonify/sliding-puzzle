# Game Mode Selection Feature Plan

## Overview
Add support for two distinct game modes:
1. Classic Mode (existing numbered tiles):
   - Goal: Arrange numbers in ascending order
   - Empty tile at bottom right
2. Color Mode:
   - 6 different colors with 4 tiles each (24 total)
   - 1 empty tile
   - Two pattern types:
     - Random patterns for free play
     - Predefined patterns (starting with "Column Stack")
   - Solution preview displayed alongside main grid

## Technical Changes Required

### 1. Game Mode Configuration
- Add new types and constants for game modes in `src/types/game.ts`
```typescript
export type GameMode = 'classic' | 'color';
```
- Update game configuration in `src/constants/gameConfig.ts`:
  - Add GAME_MODES constant
  - Update DEFAULT_CONFIG to include mode selection
  - Add color constants for the new mode
  - Add configuration for solution preview display

### Game Mechanics Differences
- Classic Mode: Fixed solution pattern (ascending numbers)
- Color Mode:
  - Two pattern types:
    1. Random patterns (completely random but solvable)
    2. Predefined patterns (e.g., "Column Stack")
  - Solution preview always visible
  - Single difficulty level

### 2. UI Components

#### Mode Selection Screen
- Create new component `src/components/ModeSelect.tsx`
- Replace current preview screen with mode selection
- Design should include:
  - Clear mode options with visual previews
  - Description of each mode
  - Pattern type selection for color mode
  - Consistent styling with existing UI

#### Solution Preview Component
- Create new component `src/components/SolutionPreview/SolutionPreview.tsx`
- Features:
  - Smaller scale display of target pattern
  - Always visible during color mode gameplay
  - Clear visual distinction from main game board
  - Responsive layout integration

#### Color Mode Tile Changes
- Modify `src/components/Tile.tsx` to support:
  - Color-based rendering instead of numbers
  - 6 different colors (4 tiles each)
  - Total of 24 colored tiles + 1 empty tile
  - Color-blind friendly palette
  - Dark mode support

#### Pattern Library
- Create `src/constants/colorPatterns.ts`
- Initial "Column Stack" pattern:
  - 5 columns of 4 tiles each
  - Each color forms a vertical line
  - Last color column on far right
  - Empty tile in bottom right
- Structure for adding more patterns later

### 3. Game Logic Updates

#### Board Component (`src/components/Board.tsx`)
- Add mode-aware rendering logic
- Update tile generation for color mode
- Implement pattern generation:
  - Random pattern generator
  - Predefined pattern loader
- Modify win condition checking:
  - Classic: Check for ascending order
  - Color: Compare current state with target pattern

#### Game State Management
- Update game state to track:
  - Current mode
  - Pattern type (random/predefined)
  - Target pattern
  - Solution preview state
- Add mode-specific scoring/timing

### 4. Testing Updates
- Add tests for new components
- Update existing tests to handle both modes
- Test pattern generation and validation
- Test win conditions for both modes

## Implementation Phases

1. **Phase 1: Core Configuration**
   - Add game mode types and constants
   - Update configuration system
   - Basic mode selection UI

2. **Phase 2: Color Mode Implementation**
   - Implement color tile system
   - Create solution preview component
   - Implement pattern generators (random & predefined)
   - Add color mode win condition checking

3. **Phase 3: UI Polish**
   - Enhance mode selection screen
   - Add transitions and animations
   - Implement responsive design adjustments
   - Polish solution preview layout and styling

4. **Phase 4: Testing & Refinement**
   - Implement test coverage
   - Add accessibility features
   - Performance optimization

## Technical Considerations

### Color Mode Details
- Grid Size: 5x5 (25 spaces)
- Tiles: 24 colored tiles (6 colors × 4 tiles each)
- Empty Space: 1 tile
  - Fixed position (bottom right) for predefined patterns
  - Variable position for random patterns
- Color Selection:
  - High contrast between colors
  - Clear distinction for pattern recognition
  - Dark mode compatibility
  - Using Rubik's Cube colors:
    - White (#FFFFFF)
    - Red (#B71234)
    - Blue (#0046AD)
    - Orange (#FF5800)
    - Green (#009B48)
    - Yellow (#FFD500)

### Solution Preview Layout
- Positioned to the side of the main grid
- Scaled proportionally but smaller than main grid
### Pattern Generation
- Random patterns must be solvable
- Predefined patterns follow specific layouts
- Future expansion possible with more predefined patterns

### Accessibility
- Ensure color combinations meet WCAG contrast requirements
- Add patterns or symbols along with colors
- Maintain keyboard navigation support

### Performance
- Optimize color rendering
- Minimize unnecessary re-renders
- Maintain smooth animations
- Efficient pattern comparison for win condition

## Next Steps
1. Implement color constants using Rubik's Cube color scheme
3. Begin implementation with core configuration changes
4. Create proof-of-concept for pattern generation