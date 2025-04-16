import { usePersonalInfo } from '../../../hooks';
import { useTheme } from '../../../context';
import { FaArrowDown } from 'react-icons/fa';

const Hero = () => {
  const { personalInfo, loading } = usePersonalInfo();
  const { darkMode } = useTheme();

  return (
    <section id="hero" className={`py-20 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {personalInfo?.name}
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            {personalInfo?.title}
          </p>
          <p className="max-w-2xl mx-auto text-lg">
            {personalInfo?.bio}
          </p>
          <div className="mt-10">
            <a 
              href="#contact" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mr-4 transition-colors"
            >
              Contáctame
            </a>
            <a 
              href="#projects" 
              className={`border border-blue-600 ${darkMode ? 'text-blue-400 hover:text-white' : 'text-blue-600 hover:text-white'} hover:bg-blue-600 px-6 py-3 rounded-lg transition-colors`}
            >
              Ver proyectos
            </a>
          </div>

          <div className="mt-16 animate-bounce">
            <a href="#about" aria-label="Desplazarse hacia abajo">
              <FaArrowDown className={`mx-auto text-2xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </a>
          </div>
        </>
      )}
    </section>
  );
};

export default Hero;