import { lazy, Suspense, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SEO } from '../../components/common';
import HeroSection from '../../components/sections/Hero/HeroSection';

gsap.registerPlugin(ScrollTrigger);

const JourneySection = lazy(() => import('../../components/sections/Journey/JourneySection'));
const Skills         = lazy(() => import('../../components/sections/Skills/Skills'));
const Projects       = lazy(() => import('../../components/sections/Projects/Projects'));
const Contact        = lazy(() => import('../../components/sections/Contact/Contact'));

const SectionLoader = () => (
  <div className="flex justify-center items-center h-48">
    <div
      className="rounded-full h-8 w-8 border-t-2 border-b-2 animate-spin"
      style={{ borderColor: 'var(--space-accent)' }}
    />
  </div>
);

// Transparent panels — fluid background shows through
// overflow:'clip' (not 'auto') prevents inner vertical scroll
// from conflicting with GSAP's page-scroll-driven horizontal progress
const panelBase: React.CSSProperties = {
  flexShrink: 0,
  height: '100vh',
  overflow: 'clip',
};

const HomePage = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stripRef   = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<number>(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const strip = stripRef.current!;

      gsap.to(strip, {
        x: () => -(strip.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger:             wrapperRef.current,
          pin:                 true,
          scrub:               1,
          start:               'top top',
          end:                 () => `+=${strip.scrollWidth - window.innerWidth}`,
          anticipatePin:       1,
          invalidateOnRefresh: true,
        },
      });
    }, wrapperRef);

    // Initial refresh after a short delay — catches layout after lazy panels load
    const initialTimer = setTimeout(() => ScrollTrigger.refresh(), 300);

    // Re-refresh whenever the strip changes size (lazy sections finish rendering)
    let debounceTimer: number;
    const ro = new ResizeObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    });
    if (stripRef.current) ro.observe(stripRef.current);

    return () => {
      ctx.revert();
      clearTimeout(initialTimer);
      clearTimeout(debounceTimer);
      ro.disconnect();
    };
  }, []);

  return (
    <>
      <SEO
        title="Jose Guadamuz | Full Stack Developer"
        description="Portafolio profesional de Jose Guadamuz, desarrollador web Full Stack especializado en React, TypeScript y .NET."
        keywords="desarrollador web, full stack, React, TypeScript, .NET, JavaScript, frontend, backend, Jose Guadamuz"
      />

      {/* ── Scrollable content ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection scrollProgressRef={scrollProgressRef} />

        {/* ── Journey: Education + Experience (vertical scroll) ── */}
        <Suspense fallback={<SectionLoader />}>
          <JourneySection />
        </Suspense>

        {/* ── Horizontal scroll section ── */}
        <div
          ref={wrapperRef}
          style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}
        >
          <div
            ref={stripRef}
            style={{ display: 'flex', height: '100vh', willChange: 'transform' }}
          >

            {/* Panel 1 — Skills */}
            <div id="skills" className="no-scrollbar" style={{ ...panelBase, width: '100vw' }}>
              <Suspense fallback={<SectionLoader />}>
                <Skills />
              </Suspense>
            </div>

            {/* Panel 2 — Projects */}
            <div id="projects" className="no-scrollbar" style={{ ...panelBase, width: '140vw' }}>
              <Suspense fallback={<SectionLoader />}>
                <Projects featured={true} />
              </Suspense>
            </div>

            {/* Panel 3 — Contact */}
            <div id="contact" className="no-scrollbar" style={{ ...panelBase, width: '80vw' }}>
              <Suspense fallback={<SectionLoader />}>
                <Contact />
              </Suspense>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
