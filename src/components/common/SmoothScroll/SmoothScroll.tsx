import React, { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';
import { setupLenisWithScrollTrigger } from '../../../utils/gsap/animations';

// Extend window to expose Lenis instance for programmatic scrolling
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

interface SmoothScrollProps {
  children: ReactNode;
  options?: {
    duration?: number;
    easing?: (t: number) => number;
    smoothWheel?: boolean;
    orientation?: 'vertical' | 'horizontal';
    wheelMultiplier?: number;
    smoothTouch?: boolean;
    touchMultiplier?: number;
  };
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children, options = {} }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const defaultOptions = {
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    };

    const lenis = new Lenis({ ...defaultOptions, ...options });
    lenisRef.current = lenis;

    // Expose instance for programmatic scroll (e.g. NavBar)
    window.__lenis = lenis;

    const cleanup = setupLenisWithScrollTrigger(lenis);

    return () => {
      cleanup();
      lenis.destroy();
      lenisRef.current = null;
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;