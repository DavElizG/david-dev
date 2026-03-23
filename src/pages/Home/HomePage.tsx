import { lazy, Suspense, useRef } from 'react';
import { SEO } from '../../components/common';
import HeroSection from '../../components/sections/Hero/HeroSection';

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

const HomePage = () => {
  const scrollProgressRef = useRef<number>(0);

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

        {/* ── Journey: Education + Experience (horizontal scroll) ── */}
        <Suspense fallback={<SectionLoader />}>
          <JourneySection />
        </Suspense>

        {/* ── Projects (vertical scroll — slide-based) ── */}
        <Suspense fallback={<SectionLoader />}>
          <Projects featured={true} />
        </Suspense>

        {/* ── Skills ── */}
        <div id="skills">
          <Suspense fallback={<SectionLoader />}>
            <Skills />
          </Suspense>
        </div>

        {/* ── Contact ── */}
        <div id="contact">
          <Suspense fallback={<SectionLoader />}>
            <Contact />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default HomePage;
