/**
 * useHoverSplitText
 *
 * Reusable hook that applies the SplitText char-scatter hover effect.
 *
 * The target element must contain:
 *   - .hover-split__text   (always required — the visible/primary layer)
 *   - .hover-split__hover  (optional — secondary layer that assembles from below)
 *
 * Single-layer mode (no .hover-split__hover):
 *   Chars jitter randomly upward on mouseenter, return on mouseleave.
 *
 * Double-layer mode (with .hover-split__hover):
 *   Primary chars fly up randomly while hover chars converge from scattered
 *   positions to y=0 — giving the "out + in" exchange effect.
 */
import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

export interface HoverSplitOptions {
  /** Max random y offset in pixels (absolute value). Default: 18 */
  amplitude?: number;
  /** Duration in seconds. Default: 0.4 */
  duration?: number;
}

export function useHoverSplitText(
  ref: RefObject<HTMLElement | null>,
  options: HoverSplitOptions = {},
) {
  const { amplitude = 18, duration = 0.4 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const textEl  = el.querySelector<HTMLElement>('.hover-split__text');
    const hoverEl = el.querySelector<HTMLElement>('.hover-split__hover');
    if (!textEl) return;

    const split1 = new SplitText(textEl,  { type: 'chars,words' });
    const split2 = hoverEl ? new SplitText(hoverEl, { type: 'chars,words' }) : null;

    /* Scatter hover chars below to start */
    split2?.chars.forEach((c) => {
      gsap.set(c, { y: amplitude * 0.8 + Math.random() * amplitude });
    });

    const rnd = () => amplitude * 0.5 + Math.random() * amplitude;

    const onEnter = () => {
      /* Primary chars fly up randomly */
      split1.chars.forEach((c) =>
        gsap.to(c, { y: -rnd(), duration, ease: 'power2.out' }),
      );
      /* Hover chars converge to 0 */
      if (split2) {
        gsap.to(split2.chars, { y: 0, duration: duration + 0.05, stagger: 0.012, ease: 'power2.out' });
      }
    };

    const onLeave = () => {
      /* Primary chars return */
      gsap.to(split1.chars, { y: 0, duration: duration + 0.05, stagger: 0.01, ease: 'power2.inOut' });
      /* Hover chars scatter back below */
      split2?.chars.forEach((c) =>
        gsap.to(c, { y: amplitude * 0.8 + Math.random() * amplitude, duration, ease: 'power2.in' }),
      );
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      split1.revert();
      split2?.revert();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
