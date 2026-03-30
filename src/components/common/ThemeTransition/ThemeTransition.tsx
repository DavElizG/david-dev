import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useTheme } from '../../../context';

/**
 * Theme transition — smooth fade crossfade.
 *
 * darkMode is already the NEW value when this runs (both morphKey and darkMode
 * change together in toggleDarkMode). The overlay color matches the destination
 * theme so the fade-in blends naturally into the new theme on fade-out.
 *
 * Flow: old theme visible → overlay fades in (destination color) → new theme
 * renders underneath → overlay fades out revealing new theme.
 */
const ThemeTransition = () => {
  const { darkMode, morphKey } = useTheme();
  const overlayRef = useRef<HTMLDivElement>(null);
  const prevMorphKey = useRef(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (morphKey === prevMorphKey.current) return;
    prevMorphKey.current = morphKey;

    // darkMode is the NEW value — overlay matches destination so the reveal is seamless
    const overlayColor = darkMode ? '#111111' : '#f0f0f0';

    setVisible(true);
    gsap.killTweensOf(overlayRef.current);

    requestAnimationFrame(() => {
      const overlay = overlayRef.current;
      if (!overlay) return;

      gsap.fromTo(
        overlay,
        { opacity: 0, backgroundColor: overlayColor },
        {
          opacity: 1,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            gsap.to(overlay, {
              opacity: 0,
              duration: 0.35,
              ease: 'power2.out',
              onComplete: () => setVisible(false),
            });
          },
        }
      );
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [morphKey]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9998,
        opacity: 0,
      }}
    />
  );
};

export default ThemeTransition;
