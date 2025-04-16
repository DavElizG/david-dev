import { useTheme } from './context'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { Hero, About, Skills, Projects, Contact } from './components/sections'

function App() {
  const { darkMode } = useTheme();

  return (
    <div className={`flex flex-col min-h-screen w-full overflow-x-hidden ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Header />
      
      <main className="flex-grow w-full">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default App