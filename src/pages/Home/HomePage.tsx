import { lazy, Suspense, useRef } from 'react';
import { SEO } from '../../components/common';
import { useLanguage } from '../../context';
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
  const { t } = useLanguage();

  return (
    <>
      <SEO
        title={t.seo.title}
        description={t.seo.description}
        keywords={t.seo.keywords}
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
        <Suspense fallback={<SectionLoader />}>
          <Skills />
        </Suspense>

        {/* ── Contact ── */}
        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>
      </div>
    </>
  );
};

export default HomePage;
