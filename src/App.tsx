import { useTheme } from './context'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import SmoothScroll from './components/common/SmoothScroll'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import AboutPage from './pages/About/AboutPage'
import ResumePage from './pages/Resume/ResumePage'

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
      <Header />
      <SmoothScroll options={smoothScrollOptions}>
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/resume" element={<ResumePage />} />
          </Routes>
        </main>
      </SmoothScroll>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App