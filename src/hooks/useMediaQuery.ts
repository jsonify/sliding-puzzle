import { useState, useEffect } from 'react';

/**
 * Hook to detect if a media query matches
 * @param query Media query string (e.g., '(min-width: 1024px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with SSR-friendly default
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create media query list
    const mediaQuery = window.matchMedia(query);

    // Update state to match initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Listen for changes
    mediaQuery.addEventListener('change', handler);

    // Cleanup
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]); // Only re-run effect if query changes

  return matches;
}