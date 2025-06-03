import { useState, useEffect } from 'react';

export const useIsMobileDevice = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

    // Set the initial value
    setIsMobile(mediaQuery.matches);

    // Define a callback to handle changes in the media query
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Add the event listener for media query changes
    mediaQuery.addEventListener('change', handleMediaChange);

    // Clean up event listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [breakpoint]);

  return isMobile;
};
