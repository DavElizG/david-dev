import { useEffect, useRef, lazy, Suspense, Component } from 'react';
import type { MutableRefObject, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePersonalInfo } from '../../../hooks';

gsap.registerPlugin(ScrollTrigger);

// Lazy-load the 3D scene so it never blocks text rendering
const BlackHoleScene = lazy(() => import('../../3d/BlackHoleScene'));

// Error boundary — 3D crash must not blank the section
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

interface HeroSectionProps {
  scrollProgressRef: MutableRefObject<number>;
}

const HeroSection = ({ scrollProgressRef }: HeroSectionProps) => {
  const { personalInfo } = usePersonalInfo();
  const sectionRef = useRef<HTMLElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:             sectionRef.current,
          pin:                 true,
          start:               'top top',
          end:                 '+=2500',
          scrub:               0.6,
          anticipatePin:       1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            scrollProgressRef.current = self.progress;
          },
        },
      });

      // Text starts invisible, fades in at 40-60% scroll progress
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
        0.4
      );

      // Text fades out near the end (85-95%)
      tl.to(
        textRef.current,
        { opacity: 0, y: -30, duration: 0.1, ease: 'power2.in' },
        0.85
      );

      // Scroll indicator fades out quickly
      tl.to(
        scrollRef.current,
        { opacity: 0, duration: 0.1 },
        0.1
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [scrollProgressRef]);

  const name  = personalInfo?.name?.split(' ').slice(0, 2).join(' ') ?? 'David';
  const title = personalInfo?.title ?? 'Desarrollador Web Full Stack';

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full flex flex-col items-center justify-center text-center px-4"
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      {/* 3D Black Hole — lazy, isolated; fills viewport behind text */}
      <SceneBoundary>
        <Suspense fallback={null}>
          <BlackHoleScene scrollProgressRef={scrollProgressRef} />
        </Suspense>
      </SceneBoundary>

      {/* Radial glow overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(168,85,247,0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Hero text — starts hidden, revealed by GSAP timeline at scroll progress ~50% */}
      <div
        ref={textRef}
        className="relative flex flex-col items-center"
        style={{ zIndex: 2, opacity: 0 }}
      >
        {/* Badge */}
        <span
          className="text-xs uppercase tracking-[0.35em] mb-5 px-4 py-1.5 rounded-full"
          style={{
            color: 'var(--space-accent)',
            background: 'rgba(168,85,247,0.12)',
            border: '1px solid rgba(168,85,247,0.3)',
          }}
        >
          Full Stack Developer
        </span>

        {/* Name */}
        <h1
          className="font-bold leading-none mb-5"
          style={{
            fontSize: 'clamp(3.5rem, 10vw, 9rem)',
            background: 'linear-gradient(135deg, #f0eeff 0%, #a855f7 50%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {name}
        </h1>

        {/* Title */}
        <p
          className="text-lg md:text-2xl font-light"
          style={{ color: 'var(--space-text-dim)' }}
        >
          {title}
        </p>
      </div>

      {/* Scroll indicator — visible initially, fades out on scroll */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        style={{ color: 'var(--space-text-dim)', zIndex: 2 }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-10 animate-pulse" style={{ background: 'var(--space-border)' }} />
      </div>
    </section>
  );
};

export default HeroSection;
