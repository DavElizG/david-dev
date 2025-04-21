import { lazy, Suspense } from 'react';

// Lazy load section components
const Hero = lazy(() => import('../../components/sections/Hero/Hero'));
const Skills = lazy(() => import('../../components/sections/Skills/Skills'));
const Projects = lazy(() => import('../../components/sections/Projects/Projects'));
const Contact = lazy(() => import('../../components/sections/Contact/Contact'));

// Loading component for sections
const SectionLoader = () => (
  <div className="flex justify-center items-center h-48">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const HomePage = () => {
  return (
    <main>
      <Suspense fallback={<SectionLoader />}>
        <Hero />
      </Suspense>
      
      {/* Sección de tecnologías */}
      <Suspense fallback={<SectionLoader />}>
        <Skills />
      </Suspense>
      
      {/* Sección de proyectos destacados */}
      <Suspense fallback={<SectionLoader />}>
        <Projects featured={true} />
      </Suspense>
      
      {/* Sección de contacto */}
      <Suspense fallback={<SectionLoader />}>
        <Contact />
      </Suspense>
    </main>
  );
};

export default HomePage;