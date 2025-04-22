import { useTheme } from './context'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import SmoothScroll from './components/common/SmoothScroll'
import { SEO } from './components/common'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'

// Lazy load page components
const HomePage = lazy(() => import('./pages/Home/HomePage'))
const AboutPage = lazy(() => import('./pages/About/AboutPage'))
const ResumePage = lazy(() => import('./pages/Resume/ResumePage'))

// Loading component
const PageLoader = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
)

// Componente principal de la aplicación
function AppContent() {
  const { darkMode } = useTheme();

  // Opciones para el scroll suave con Lenis
  const smoothScrollOptions = {
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2
  };

  return (
    <div className={`flex flex-col min-h-screen w-full overflow-x-hidden ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <SEO />
      <Header />
      <SmoothScroll options={smoothScrollOptions}>
        <main className="flex-grow w-full">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/resume" element={<ResumePage />} />
            </Routes>
          </Suspense>
        </main>
      </SmoothScroll>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App