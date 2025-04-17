import { usePersonalInfo, useExperience, useAboutInfo } from '../../../hooks';
import { useTheme } from '../../../context';
import { MdLocationOn } from 'react-icons/md';
import { FaGraduationCap, FaLaptopCode, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import profileImage from '../../../assets/images/profile/FB_IMG_1731451105768.webp';

const About = () => {
  const { personalInfo, loading: loadingPersonal } = usePersonalInfo();
  const { currentExperience, loading: loadingExperience } = useExperience();
  const { aboutInfo, loading: loadingAbout } = useAboutInfo();
  const { darkMode } = useTheme();

  const isLoading = loadingPersonal || loadingExperience || loadingAbout;

  return (
    <section id="about" className={`py-16 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex flex-col space-y-16">
            {/* Parte superior: Imagen a la izquierda, Info personal a la derecha */}
            <div className="flex flex-col lg:flex-row gap-10 items-center">
              {/* Imagen de perfil (lado izquierdo) */}
              <motion.div 
                className="w-full lg:w-2/5 flex justify-center"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className={`relative overflow-hidden rounded-xl ${darkMode ? 'ring-4 ring-blue-500/30' : 'ring-4 ring-blue-600/30'} shadow-xl w-full max-w-md`}>
                  <img 
                    src={profileImage} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Efecto de gradiente en la parte inferior de la imagen */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>
              </motion.div>
              
              {/* Información personal (lado derecho) - Centrado verticalmente */}
              <motion.div 
                className="w-full lg:w-3/5 flex flex-col justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ¿Quién soy?
                </h3>
                <p className={`mb-8 text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {aboutInfo?.whoAmI}
                </p>
                
                <div className="space-y-5">
                  <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <MdLocationOn className={`mr-3 text-2xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className="text-lg">{personalInfo?.location}</span>
                  </div>
                  
                  <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <FaGraduationCap className={`mr-3 text-2xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className="text-lg">{aboutInfo?.currentStudy}</span>
                  </div>
                  
                  <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <FaLaptopCode className={`mr-3 text-2xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className="text-lg">
                      {currentExperience ? currentExperience.role + ' en ' + currentExperience.company : 
                        'Desarrollador Frontend Junior'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Parte inferior: Objetivos centrados */}
            <motion.div 
              className="w-full max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className={`text-2xl font-semibold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Mis objetivos
              </h3>
              <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <ul className="space-y-5">
                  {aboutInfo?.objectives.map((objective, index) => (
                    <li 
                      key={index} 
                      className={`flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      <FaCheckCircle className={`mt-1.5 mr-4 flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className="text-lg">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default About;