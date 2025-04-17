import { usePersonalInfo, useExperience, useAboutInfo } from '../../../hooks';
import { useTheme } from '../../../context';
import { MdLocationOn } from 'react-icons/md';
import { FaGraduationCap, FaLaptopCode } from 'react-icons/fa';

const About = () => {
  const { personalInfo, loading: loadingPersonal } = usePersonalInfo();
  const { currentExperience, loading: loadingExperience } = useExperience();
  const { aboutInfo, loading: loadingAbout } = useAboutInfo();
  const { darkMode } = useTheme();

  const isLoading = loadingPersonal || loadingExperience || loadingAbout;

  return (
    <section id="about" className={`py-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto px-4">
        {isLoading ? (
          <p className="text-center">Cargando información...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ¿Quién soy?
              </h3>
              <p className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {aboutInfo?.whoAmI}
              </p>
              
              <div className={`flex items-center mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <MdLocationOn className={`mr-2 text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span>{personalInfo?.location}</span>
              </div>
              
              <div className={`flex items-center mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <FaGraduationCap className={`mr-2 text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span>{aboutInfo?.currentStudy}</span>
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
              {aboutInfo?.objectives.map((objective, index) => (
                <p 
                  key={index} 
                  className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'} ${
                    index === aboutInfo.objectives.length - 1 ? '' : 'mb-6'
                  }`}
                >
                  {objective}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default About;