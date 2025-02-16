import { useState, useEffect } from 'react';

type Orientation = 'portrait' | 'landscape';

interface OrientationState {
  orientation: Orientation;
  angle: number;
}

export function useOrientation(): OrientationState {
  const [orientationState, setOrientationState] = useState<OrientationState>({
    orientation: 'portrait',
    angle: 0,
  });

  useEffect(() => {
    // Get initial orientation
    const getOrientation = (): OrientationState => {
      if (window.screen.orientation) {
        const angle = window.screen.orientation.angle;
        const type = window.screen.orientation.type;
        return {
          orientation: type.includes('portrait') ? 'portrait' : 'landscape',
          angle,
        };
      }
      // Fallback for older browsers
      return {
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
        angle: 0,
      };
    };

    // Set initial state
    setOrientationState(getOrientation());

    // Handle orientation change
    const handleOrientationChange = () => {
      setOrientationState(getOrientation());
    };

    if (window.screen.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientationChange);
    } else {
      window.addEventListener('orientationchange', handleOrientationChange);
    }
    window.addEventListener('resize', handleOrientationChange);

    // Cleanup
    return () => {
      if (window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', handleOrientationChange);
      } else {
        window.removeEventListener('orientationchange', handleOrientationChange);
      }
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return orientationState;
}