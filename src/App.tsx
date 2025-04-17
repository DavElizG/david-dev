import { useTheme } from './context'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import AboutPage from './pages/About/AboutPage'
import ResumePage from './pages/Resume/ResumePage'

function App() {
  const { darkMode } = useTheme();

  return (
    <BrowserRouter>
      <div className={`flex flex-col min-h-screen w-full overflow-x-hidden ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <Header />
        
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/resume" element={<ResumePage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App