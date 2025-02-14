# Sliding Puzzle Game UI Layout

## Level Selection Screen
```
┌────────────────────────────────────────┐
│         Select Puzzle Size             │
├────────────────────────────────────────┤
│                                        │
│    ┌────┐  ┌────┐  ┌────┐  ┌────┐    │
│    │3x3 │  │4x4 │  │5x5 │  │6x6 │    │
│    └────┘  └────┘  └────┘  └────┘    │
│                                        │
│    ┌────┐  ┌────┐  ┌────┐            │
│    │7x7 │  │8x8 │  │9x9 │            │
│    └────┘  └────┘  └────┘            │
│                                        │
│    Select Difficulty:                  │
│    ┌────────┐ ┌────────┐ ┌────────┐   │
│    │ Easy   │ │ Medium │ │ Hard   │   │
│    └────────┘ └────────┘ └────────┘   │
│                                        │
└────────────────────────────────────────┘
```

## Game Board (Various Sizes)

### 3x3 Grid
```
┌────────────────────┐
│    ┌───┬───┬───┐  │
│    │ 1 │ 2 │ 3 │  │
│    ├───┼───┼───┤  │
│    │ 4 │ 5 │ 6 │  │
│    ├───┼───┼───┤  │
│    │ 7 │ 8 │   │  │
│    └───┴───┴───┘  │
└────────────────────┘
```

### 4x4 Grid (Classic)
```
┌────────────────────────┐
│  ┌────┬────┬────┬────┐ │
│  │ 1  │ 2  │ 3  │ 4  │ │
│  ├────┼────┼────┼────┤ │
│  │ 5  │ 6  │ 7  │ 8  │ │
│  ├────┼────┼────┼────┤ │
│  │ 9  │ 10 │ 11 │ 12 │ │
│  ├────┼────┼────┼────┤ │
│  │ 13 │ 14 │ 15 │    │ │
│  └────┴────┴────┴────┘ │
└────────────────────────┘
```

### 5x5 Grid (Preview)
```
┌──────────────────────────┐
│ ┌───┬───┬───┬───┬───┐   │
│ │ 1 │ 2 │ 3 │ 4 │ 5 │   │
│ ├───┼───┼───┼───┼───┤   │
│ │ 6 │ 7 │ 8 │ 9 │10 │   │
│ ├───┼───┼───┼───┼───┤   │
│ │11 │12 │13 │14 │15 │   │
│ ├───┼───┼───┼───┼───┤   │
│ │16 │17 │18 │19 │20 │   │
│ ├───┼───┼───┼───┼───┤   │
│ │21 │22 │23 │24 │   │   │
│ └───┴───┴───┴───┴───┘   │
└──────────────────────────┘
```

## Game Controls
```
┌────────────────────────────────────────┐
│ Moves: 42    Time: 01:23              │
│                                        │
│ Grid Size: 4x4  Difficulty: Medium    │
│                                        │
│ ┌──────────┐  ┌─────────┐  ┌────────┐ │
│ │New Game  │  │Change   │  │Back to │ │
│ │          │  │Size     │  │Menu    │ │
│ └──────────┘  └─────────┘  └────────┘ │
└────────────────────────────────────────┘
```

## Win State Overlay
```
┌────────────────────────┐
│                        │
│    🎉 You Won! 🎉     │
│                        │
│    Grid Size: 4x4      │
│    Difficulty: Medium  │
│    Moves: 127          │
│    Time: 03:45        │
│                        │
│   ┌──────────────┐    │
│   │  Play Again  │    │
│   └──────────────┘    │
│                        │
│   ┌──────────────┐    │
│   │ Try 5x5 Next │    │
│   └──────────────┘    │
│                        │
└────────────────────────┘
```

## Mobile Layout Adaptations

### Level Selection (Mobile)
```
┌──────────────────┐
│  Select Size     │
├──────────────────┤
│ ┌───┐ ┌───┐ ┌───┐│
│ │3x3│ │4x4│ │5x5││
│ └───┘ └───┘ └───┘│
│ ┌───┐ ┌───┐ ┌───┐│
│ │6x6│ │7x7│ │8x8││
│ └───┘ └───┘ └───┘│
│     ┌───┐        │
│     │9x9│        │
│     └───┘        │
│                  │
│ Difficulty:      │
│ ┌────┐┌────┐┌───┐│
│ │Easy││Med ││Hard││
│ └────┘└────┘└───┘│
└──────────────────┘
```

## Design Specifications

### Colors (Tailwind Classes)
- Background: `bg-gray-100 dark:bg-gray-800`
- Level Select Buttons: `bg-white dark:bg-gray-700`
- Active Level: `ring-2 ring-blue-500`
- Tiles: 
  - Normal: `bg-white dark:bg-gray-700`
  - Movable: `hover:bg-blue-50 dark:hover:bg-gray-600`
- Text: `text-gray-900 dark:text-gray-100`

### Typography
- Title: `text-2xl md:text-3xl font-bold`
- Grid Size Text: `text-lg font-medium`
- Tile Numbers: 
  - 3x3: `text-3xl`
  - 4x4: `text-2xl`
  - 5x5+: `text-xl`
- Stats: `text-sm font-medium`

### Spacing & Sizing
- Grid gaps: `gap-1 md:gap-2`
- Tile padding: 
  - 3x3: `p-6`
  - 4x4: `p-4`
  - 5x5+: `p-2`
- Container margin: `m-4`
- Level buttons: `p-3 md:p-4`

### Animations
- Tile Movement: `transition-transform duration-150`
- Size Change: `transition-all duration-300`
- Win Overlay: `animate-fade-in`

### Responsive Behavior
- Grid size adjusts based on viewport
- Minimum touch target size: 44px
- Maximum board size: 90vh

### Accessibility
- Keyboard navigation with arrow keys
- Focus indicators
- ARIA labels for tiles
- Screen reader game state announcements
- Color contrast compliance