# Pause Overlay Mobile Update Plan

## Overview
Update the PauseOverlay component to show different messages based on device type, providing a better user experience for mobile users.

## Current State
- PauseOverlay shows "Press ESC to resume" for all users
- Already has useMediaQuery hook available for device detection
- Component responds to both ESC key and click/tap events

## Implementation Plan

### 1. Device Detection
- Use the existing `useMediaQuery` hook to detect mobile devices
- Implement using standard mobile breakpoint (e.g., 768px)
```typescript
const isMobile = useMediaQuery('(max-width: 767px)');
```

### 2. Update PauseOverlay Component
- Modify component to conditionally render different messages
- Keep ESC message for desktop
- Add touch-specific message for mobile
- Keep existing click/tap functionality

### 3. UI Changes
Desktop:
- Keep current "Press ESC to resume" message
- Maintain existing keyboard listener

Mobile:
- Change message to "Tap anywhere to resume"
- Remove ESC key instruction
- Keep existing tap-to-resume functionality

### 4. Testing Considerations
- Test responsive behavior
- Verify message changes on window resize
- Ensure functionality works on both platforms
- Update any existing tests to account for conditional rendering

### 5. Accessibility
- Maintain existing aria labels and roles
- Ensure instructions are clear for all users

## Implementation Path
1. Update PauseOverlay component with device detection
2. Add conditional rendering logic
3. Test responsive behavior
4. Update component tests if needed

## Success Criteria
- Desktop users see "Press ESC to resume"
- Mobile users see "Tap anywhere to resume"
- Both ESC key and tap interactions continue to work as expected
- Component remains responsive to window resizing