# Menu and Pattern Selection Updates

## 1. Menu Icon Changes

Create a new `MenuIcons` component that provides mode-specific icons:

### Classic Mode Icon
- Traditional hamburger menu (three lines)
- Simple, clean look
- Matches the numbered tile aesthetic

### Color Mode Icon
- Color palette or color wheel icon
- More playful and colorful design
- Represents the color-matching aspect

## 2. Pattern Type Selection

### Color Mode
- Remove mode switching (Classic/Color) from menu
- Add pattern type selection with two options:
  1. Random Pattern: Generates a random but solvable pattern
  2. Column Stack: Shows the preset column-based pattern
- Pattern selection should be prominent in the menu
- Add visual preview of each pattern type

### Classic Mode
- Remove mode switching option
- Hide pattern type selection entirely
- Keep menu focused on core actions:
  1. New Game
  2. View Leaderboard
  3. Back to Main

## 3. Implementation Steps

1. Create MenuIcons Component:
```typescript
// src/components/MenuIcons.tsx
- ClassicMenuIcon: Three-line hamburger menu
- ColorMenuIcon: Color palette icon
```

2. Update GameLayout:
```typescript
// src/components/GameLayout.tsx
- Use mode prop to determine which icon to show
- Pass additional props to MenuSheet
```

3. Modify MenuSheet:
```typescript
// src/components/MenuSheet.tsx
- Add patternType prop for Color mode
- Add onPatternTypeChange handler
- Conditionally render pattern selection
- Remove mode switching
```

4. Update Types:
```typescript
// src/types/layout.ts
interface MenuSheetProps {
  patternType?: 'random' | 'column_stack';
  onPatternTypeChange?: (type: 'random' | 'column_stack') => void;
  // ... existing props
}
```

## 4. UI/UX Considerations

### Mobile View
- Large, touch-friendly buttons
- Clear visual hierarchy
- Smooth animations for interactions
- Easy-to-understand pattern previews

### Desktop View
- Hover states for interactive elements
- Keyboard accessibility
- Consistent styling with mobile
- Potentially larger pattern previews

## 5. Next Steps

1. Switch to Code mode to implement MenuIcons component
2. Update GameLayout with new icons
3. Modify MenuSheet for pattern selection
4. Add pattern preview visuals
5. Test on both mobile and desktop views