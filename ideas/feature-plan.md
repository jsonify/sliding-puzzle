# Classic Mode Improvements Plan

## Current Issues

1. **Target Pattern Display**
   - Problem: Only showing a single tile instead of the complete pattern
   - Requires investigation of pattern generation and passing in classic mode

2. **Level Select UI**
   - Current: Using responsive grid (2/3/4 columns)
   - Need: Show all 7 grid sizes without scrolling
   - Ensure Menu button remains visible at bottom left

## Suggested Changes

1. **Remove Complexity**
   - Remove difficulty levels (easy/medium/hard)
   - Remove "Start Game" button
   - Direct entry into selected grid size

2. **Progressive Level System**
   - Only unlock next level after successfully solving current highest level
   - Add lock icon overlay on locked grid sizes
   - Initial state: Only 3x3 unlocked

## Implementation Plan

1. **UI Updates**
   - Modify grid layout to show all sizes
   - Add lock overlay component
   - Maintain menu button visibility
   - Remove difficulty selection section
   - Remove start game button

2. **Game Logic Updates**
   - Implement level progression system
   - Track completed levels
   - Handle locked level selection

3. **Pattern Display Fix**
   - Debug pattern generation
   - Ensure proper pattern passing to preview

## Technical Changes Required

1. **Component Updates**
   - LevelSelect.tsx
     - Remove difficulty section
     - Update grid layout
     - Add lock overlay
     - Remove start button
   - PatternPreview.tsx
     - Debug pattern display

2. **Configuration Updates**
   - Remove difficulty settings
   - Add level progression logic

3. **State Management**
   - Track unlocked levels
   - Persist progress

## Testing Considerations

1. **Functionality**
   - Pattern display
   - Level selection
   - Lock/unlock progression
   - Menu visibility

2. **UI/UX**
   - Grid layout
   - Lock overlay visibility
   - Touch targets
   - Responsive design