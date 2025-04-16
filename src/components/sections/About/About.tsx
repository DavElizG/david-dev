import { usePersonalInfo, useExperience } from '../../../hooks';
import { useTheme } from '../../../context';
import { MdLocationOn } from 'react-icons/md';
import { FaGraduationCap, FaLaptopCode } from 'react-icons/fa';

const About = () => {
  const { personalInfo, loading: loadingPersonal } = usePersonalInfo();
  const { currentExperience, loading: loadingExperience } = useExperience();
  const { darkMode } = useTheme();

  const isLoading = loadingPersonal || loadingExperience;

  return (
    <section id="about" className={`py-16 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Sobre mí
        </h2>
        
        {isLoading ? (
          <p className="text-center">Cargando información...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ¿Quién soy?
              </h3>
              <p className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Soy un desarrollador frontend apasionado por crear experiencias digitales atractivas y funcionales.
                Actualmente estudio Ingeniería en Sistemas de Información y me especializo en tecnologías web modernas.
              </p>
              
              <div className={`flex items-center mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <MdLocationOn className={`mr-2 text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span>{personalInfo?.location}</span>
              </div>
              
              <div className={`flex items-center mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <FaGraduationCap className={`mr-2 text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span>Estudiante de Ingeniería en Sistemas de Información</span>
              </div>
              
              <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <FaLaptopCode className={`mr-2 text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span>
                  {currentExperience ? currentExperience.role + ' en ' + currentExperience.company : 
                    'Desarrollador Frontend Junior'}
                </span>
              </div>
            </div>
            
            <div>
              <h3 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Mis objetivos
              </h3>
              <p className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Mi objetivo es desarrollar soluciones tecnológicas que impacten positivamente a los usuarios,
                combinando diseño atractivo con funcionalidad robusta.
              </p>
              <p className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Me apasiona aprender nuevas tecnologías y metodologías que me permitan mejorar constantemente
                como profesional en el campo del desarrollo de software.
              </p>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Busco colaborar en proyectos desafiantes donde pueda aplicar mis conocimientos en React,
                .NET C# y otras tecnologías para crear productos digitales de alta calidad.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default About;