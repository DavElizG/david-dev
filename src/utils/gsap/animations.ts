import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

interface LenisLike {
  on(event: string, cb: (...args: unknown[]) => void): void;
  raf(time: number): void;
}

/**
 * Integrates Lenis smooth scroll with GSAP ScrollTrigger.
 * Call this once after creating the Lenis instance (e.g. in SmoothScroll or App).
 */
export const setupLenisWithScrollTrigger = (lenis: LenisLike) => {
  lenis.on('scroll', ScrollTrigger.update);
  const lenisRaf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(lenisRaf);
  gsap.ticker.lagSmoothing(0);
  return () => gsap.ticker.remove(lenisRaf);
};

/**
 * Fade in animation
 */
export const fadeIn = (target: gsap.TweenTarget, duration = 0.6, delay = 0) => {
  return gsap.to(target, {
    opacity: 1,
    duration,
    delay,
    ease: 'power2.out'
  });
};

/**
 * Fade out animation
 */
export const fadeOut = (target: gsap.TweenTarget, duration = 0.6, delay = 0) => {
  return gsap.to(target, {
    opacity: 0,
    duration,
    delay,
    ease: 'power2.in'
  });
};

/**
 * Scale animation
 */
export const scaleIn = (target: gsap.TweenTarget, duration = 0.6, delay = 0) => {
  gsap.set(target, { scale: 0 });
  return gsap.to(target, {
    scale: 1,
    duration,
    delay,
    ease: 'back.out'
  });
};

/**
 * Slide in from left
 */
export const slideInLeft = (target: gsap.TweenTarget, duration = 0.6, delay = 0) => {
  gsap.set(target, { x: -50, opacity: 0 });
  return gsap.to(target, {
    x: 0,
    opacity: 1,
    duration,
    delay,
    ease: 'power2.out'
  });
};

/**
 * Slide in from right
 */
export const slideInRight = (target: gsap.TweenTarget, duration = 0.6, delay = 0) => {
  gsap.set(target, { x: 50, opacity: 0 });
  return gsap.to(target, {
    x: 0,
    opacity: 1,
    duration,
    delay,
    ease: 'power2.out'
  });
};

/**
 * Slide in from top
 */
export const slideInTop = (target: gsap.TweenTarget, duration = 0.6, delay = 0) => {
  gsap.set(target, { y: -50, opacity: 0 });
  return gsap.to(target, {
    y: 0,
    opacity: 1,
    duration,
    delay,
    ease: 'power2.out'
  });
};

/**
 * Slide in from bottom
 */
export const slideInBottom = (target: gsap.TweenTarget, duration = 0.6, delay = 0) => {
  gsap.set(target, { y: 50, opacity: 0 });
  return gsap.to(target, {
    y: 0,
    opacity: 1,
    duration,
    delay,
    ease: 'power2.out'
  });
};

/**
 * Rotate animation
 */
export const rotate = (target: gsap.TweenTarget, duration = 1, delay = 0) => {
  return gsap.to(target, {
    rotation: 360,
    duration,
    delay,
    ease: 'none',
    repeat: -1
  });
};

/**
 * Stagger animation for multiple elements
 */
export const staggerIn = (targets: gsap.TweenTarget, duration = 0.6, staggerDelay = 0.1) => {
  gsap.set(targets, { opacity: 0 });
  return gsap.to(targets, {
    opacity: 1,
    duration,
    stagger: staggerDelay,
    ease: 'power2.out'
  });
};

/**
 * Pulse animation
 */
export const pulse = (target: gsap.TweenTarget, duration = 0.8) => {
  return gsap.to(target, {
    scale: 1.1,
    duration: duration / 2,
    ease: 'power2.inOut',
    yoyo: true,
    repeat: -1
  });
};

/**
 * Float animation (up and down)
 */
export const float = (target: gsap.TweenTarget, distance = 20, duration = 2) => {
  return gsap.to(target, {
    y: distance,
    duration,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  });
};

/**
 * Scroll trigger animation.
 * @param target - A CSS selector or Element to animate and use as the scroll trigger.
 */
export const onScroll = (target: string | Element, tweenVars: gsap.TweenVars) => {
  return gsap.to(target, {
    ...tweenVars,
    scrollTrigger: {
      trigger: target,
      start: 'top bottom',
      end: 'top center',
      scrub: 1,
      markers: false,
      invalidateOnRefresh: true
    }
  });
};

export default {
  fadeIn,
  fadeOut,
  scaleIn,
  slideInLeft,
  slideInRight,
  slideInTop,
  slideInBottom,
  rotate,
  staggerIn,
  pulse,
  float,
  onScroll,
  setupLenisWithScrollTrigger
};
