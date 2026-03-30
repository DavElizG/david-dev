import { useEffect, useRef, lazy, Suspense, Component } from 'react';
import type { MutableRefObject, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { usePersonalInfo } from '../../../hooks';
import { useTheme, useLanguage } from '../../../context';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

const BlackHoleScene = lazy(() => import('../../3d/BlackHoleScene'));

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
  const { darkMode } = useTheme();
  const { t } = useLanguage();
  const sectionRef   = useRef<HTMLElement>(null);
  const textRef      = useRef<HTMLDivElement>(null);
  const scrollRef    = useRef<HTMLDivElement>(null);
  const nameRef      = useRef<HTMLHeadingElement>(null);
  const infoRef      = useRef<HTMLDivElement>(null);
  const nameLabelRef = useRef<string>('David');

  useEffect(() => {
    let scramblePlayed = false;

    if (nameRef.current) nameRef.current.textContent = '';

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
            if (self.progress < 0.3) {
              scramblePlayed = false;
              if (nameRef.current) nameRef.current.textContent = '';
            }
            if (self.progress >= 0.52 && !scramblePlayed && nameRef.current) {
              scramblePlayed = true;
              gsap.to(nameRef.current, {
                duration: 1.5,
                scrambleText: {
                  text:        nameLabelRef.current,
                  chars:       'upperAndLowerCase',
                  revealDelay: 0.25,
                  tweenLength: false,
                },
                ease: 'power2.inOut',
              });
            }
          },
        },
      });

      // Scroll indicator out fast
      tl.to(scrollRef.current, { opacity: 0, duration: 0.1 }, 0.1);

      // Initial side panels fade out as the black hole pulls you in
      tl.to(infoRef.current, { opacity: 0, duration: 0.12, ease: 'power2.in' }, 0.38);

      // Centered name reveal — appears deep in the darkness, subtle scale+fade
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 28, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' },
        0.52
      );

      // Fade out near the end
      tl.to(textRef.current, { opacity: 0, y: -15, scale: 0.98, duration: 0.12, ease: 'power2.in' }, 0.85);
    }, sectionRef);

    return () => ctx.revert();
  }, [scrollProgressRef]);

  const name  = personalInfo?.name?.split(' ').slice(0, 2).join(' ') ?? 'David';
  const title = personalInfo?.title ?? t.hero.title;
  nameLabelRef.current = name;

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full"
      style={{ height: '100vh', overflow: 'hidden', background: 'var(--space-bg)' }}
    >
      {/* 3D Black Hole */}
      <SceneBoundary>
        <Suspense fallback={null}>
          <BlackHoleScene scrollProgressRef={scrollProgressRef} />
        </Suspense>
      </SceneBoundary>

      {/* Radial glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 60% at 35% 50%, rgba(255,255,255,0.05) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Initial 4-corner panels ──────────────────────────────── */}
      <div
        ref={infoRef}
        className="absolute inset-0 pointer-events-none select-none hidden md:block"
        style={{ zIndex: 2 }}
      >

        {/* RIGHT — single unified panel, vertically centered */}
        <div
          className="absolute right-10 lg:right-16 top-1/2 -translate-y-1/2 flex flex-col items-end gap-4"
        >
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--space-text-dim)' }}>
              {t.hero.available}
            </span>
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#6ee7b7', boxShadow: '0 0 6px rgba(110,231,183,0.7)' }}
            />
          </div>

          <div className="w-full h-px" style={{ background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

          {/* Role */}
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[11px] uppercase tracking-[0.35em]" style={{ color: 'var(--space-accent-2)' }}>
              {t.hero.software}
            </span>
            <span className="text-[11px] uppercase tracking-[0.35em]" style={{ color: 'var(--space-accent-2)' }}>
              {t.hero.engineer}
            </span>
          </div>

          <div className="w-full h-px" style={{ background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

          {/* Description */}
          <p className="text-right text-[11px] leading-[1.9]" style={{ color: 'var(--space-text-dim)', maxWidth: '160px' }}>
            {t.hero.description.split('\n').map((line, i) => (
              <span key={i}>{line}{i < t.hero.description.split('\n').length - 1 && <br />}</span>
            ))}
          </p>

          <div className="w-full h-px" style={{ background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

          {/* Tech stack */}
          <div className="flex flex-col items-end gap-1.5">
            {['React', 'Node.js', 'TypeScript', 'PostgreSQL'].map((tech) => (
              <span key={tech} className="text-[10px] uppercase tracking-[0.22em]" style={{ color: 'var(--space-text-dim)' }}>
                {tech}
              </span>
            ))}
          </div>

          <div className="w-full h-px" style={{ background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

          {/* Stats */}
          <div className="flex gap-6">
            <div className="text-right">
              <p className="text-base font-light leading-none" style={{ color: 'var(--space-accent)' }}>3+</p>
              <p className="text-[9px] uppercase tracking-[0.25em] mt-1" style={{ color: 'var(--space-text-dim)' }}>{t.hero.years}</p>
            </div>
            <div className="text-right">
              <p className="text-base font-light leading-none" style={{ color: 'var(--space-accent)' }}>8+</p>
              <p className="text-[9px] uppercase tracking-[0.25em] mt-1" style={{ color: 'var(--space-text-dim)' }}>{t.hero.projects}</p>
            </div>
          </div>
        </div>

      </div>
      {/* ─────────────────────────────────────────────────────────── */}

      {/* ── Revealed text — scroll-driven, always centered ────── */}
      <div
        ref={textRef}
        className="absolute left-[5%] right-[5%] flex flex-col items-center text-center"
        style={{ zIndex: 3, opacity: 0, top: '38%', transform: 'translateY(-50%)' }}
      >
        {/* Badge */}
        <span
          className="text-[10px] uppercase tracking-[0.4em] mb-5 px-4 py-1.5 rounded-full"
          style={{
            color: 'var(--space-accent-2)',
            background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
            border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          }}
        >
          {t.hero.badge}
        </span>

        {/* Name */}
        <h1
          ref={nameRef}
          className="font-bold leading-none mb-5"
          style={{
            fontSize: 'clamp(3.5rem, 10vw, 9rem)',
            letterSpacing: '-0.02em',
            background: darkMode
              ? 'linear-gradient(135deg, #ffffff 0%, #d4d4d4 50%, #8a8a8a 100%)'
              : 'linear-gradient(135deg, #1a1a1a 0%, #2e2e2e 50%, #555555 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {name}
        </h1>

        {/* Title */}
        <p
          className="text-base md:text-xl font-light tracking-[0.05em]"
          style={{ color: darkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)' }}
        >
          {title}
        </p>
      </div>

      {/* Bottom bar */}
      <div
        className="absolute bottom-8 left-0 right-0 px-10 md:px-16 flex justify-between items-end pointer-events-none"
        style={{ zIndex: 2 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--space-text-dim)' }}>
          {t.hero.copyright}
        </span>

        <div ref={scrollRef} className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--space-text-dim)' }}>
            {t.hero.scroll}
          </span>
          <div className="w-px h-10 animate-pulse" style={{ background: 'var(--space-border)' }} />
        </div>

        <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--space-text-dim)' }}>
          {t.hero.location}
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
