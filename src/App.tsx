import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import SmoothScroll from './components/common/SmoothScroll'
import { SEO } from './components/common'
import { ThemeTransition } from './components/common/ThemeTransition'
import { ThemeProvider, LanguageProvider } from './context'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import ShootingStars from './components/3d/ShootingStars'
import Loader from './components/layout/Loader/Loader'

const HomePage = lazy(() => import('./pages/Home/HomePage'))

const PageLoader = () => (
  <div className="flex justify-center items-center h-64">
    <div
      className="rounded-full h-12 w-12 border-t-2 border-b-2 animate-spin"
      style={{ borderColor: 'var(--space-accent)' }}
    />
  </div>
)

function AppContent() {
  const [showLoader, setShowLoader] = useState(true);

  const smoothScrollOptions = {
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
  };

  return (
    <div
      className="flex flex-col min-h-screen w-full overflow-x-hidden"
      style={{ color: 'var(--space-text)' }}
    >
      {showLoader && <Loader onComplete={() => setShowLoader(false)} />}
      <ThemeTransition />
      <SEO />
      {/* Shooting stars — fixed, behind everything, above aurora blobs */}
      <ShootingStars />
      <Header />
      <SmoothScroll options={smoothScrollOptions}>
        <main className="flex-grow w-full">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<HomePage />} />
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
      <LanguageProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ThemeProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App