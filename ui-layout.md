# Desktop Layout Implementation Plan

## Layout Structure

```
+----------------+------------------+----------------+
|                |                  |                |
|   Side Panel   |   Game Board     |  Leaderboard  |
|    (320px)     |   (flex-grow)    |    (320px)    |
|                |                  |                |
|  Game Controls |     Puzzle       |  High Scores  |
|  Target Grid   |     Grid         |    Stats      |
|                |                  |                |
+----------------+------------------+----------------+
```

## Components Structure

### 1. Side Panel (GameControls.tsx)
- Fixed width (w-80)
- Card container with blur effect
- Components:
  ```
  - Header
    - Game Title
    - Home Button
  - Stats Row
    - Moves Counter
    - Timer
  - Grid Size Selector
  - New Game Button
  - Target Pattern
  ```

### 2. Main Game Area (Board.tsx)
- Flex grow layout
- Card container with blur effect
- Centered grid layout
- Components:
  ```
  - Game Grid
    - Interactive Tiles
    - Empty Space
  ```

### 3. Leaderboard Panel (Leaderboard.tsx)
- Fixed width (w-80)
- Collapsible card with blur effect
- Components:
  ```
  - Header with Toggle
  - Tab Navigation
    - By Score
    - By Time
  - Scores List
  ```

## Styling Guidelines

### Colors
```
Background:
- Main: bg-gradient-to-b from-slate-900 to-slate-800
- Cards: bg-slate-800/50 backdrop-blur-sm
- Borders: border-slate-700

Text:
- Primary: text-slate-200
- Secondary: text-slate-400

Accents:
- Primary: bg-blue-600
- Score: text-yellow-400
```

### Layout Classes
```
Container:
- min-h-screen
- flex flex-col lg:flex-row
- items-start
- p-4 lg:p-8

Panels:
- w-80
- mb-8 lg:mb-0
- lg:mr-8 (left panel)
- lg:ml-8 (right panel)

Cards:
- bg-slate-800/50
- backdrop-blur-sm
- border-slate-700
- p-6
```

## Component Updates Needed

1. GameLayout.tsx:
   - Add responsive breakpoints
   - Implement three-column layout
   - Add blur effects and gradients

2. GameControls.tsx:
   - Reposition as left sidebar
   - Add target pattern display
   - Update styling to match design

3. Board.tsx:
   - Center in main area
   - Update tile styling
   - Add hover/animation effects

4. Leaderboard.tsx:
   - Add collapse functionality
   - Implement tabs
   - Update styling to match design

## Implementation Steps

1. Update type definitions
   - Add new props for layout controls
   - Update existing interfaces

2. Create new components
   - DesktopLayout wrapper
   - Implement panel components

3. Update existing components
   - Modify for desktop layout
   - Add responsive breakpoints
   - Implement new styling

4. Add animations
   - Tile movements
   - Panel transitions
   - Tab switches

## Responsive Behavior

- Desktop (lg: 1024px+):
  ```
  - Three-column layout
  - Fixed-width sidebars
  - Flexible center area
  ```

- Tablet (md: 768px - 1023px):
  ```
  - Stack panels vertically
  - Full-width game board
  - Collapsible panels
  ```

- Mobile (sm: < 768px):
  ```
  - Single column layout
  - Modal/drawer for controls
  - Collapsible leaderboard