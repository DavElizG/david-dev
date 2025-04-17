import { Hero, Projects, Contact, Skills } from '../../components/sections';
import { useTheme } from '../../context';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { darkMode } = useTheme();
  
  return (
    <main>
      <Hero />
      
      {/* Sección de llamada a la acción para conocer más sobre mí */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Quieres conocerme mejor?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Descubre más sobre mi formación, experiencia profesional y las tecnologías 
            que domino en mi sección de "Sobre mí".
          </p>
          <Link 
            to="/about" 
            className={`inline-block px-8 py-3 rounded-lg font-semibold transition-all ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Conóceme más
          </Link>
        </div>
      </section>
      
      <Skills />
      
      {/* Sección de llamada a la acción para ver CV */}
      <section className={`py-16 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Mi trayectoria profesional</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Revisa mi currículum completo y descarga una versión en PDF para tener 
            una visión detallada de mi experiencia y formación.
          </p>
          <Link 
            to="/resume" 
            className={`inline-block px-8 py-3 rounded-lg font-semibold transition-all ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Ver currículum
          </Link>
        </div>
      </section>
      
      <Projects featured={false} />
      <Contact />
    </main>
  );
};

export default HomePage;