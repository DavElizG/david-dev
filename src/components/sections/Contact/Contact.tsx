import { usePersonalInfo } from '../../../hooks';
import { useTheme } from '../../../context';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import ContactForm from '../../../components/common/ContactForm';

const Contact = () => {
  const { personalInfo, loading } = usePersonalInfo();
  const { darkMode } = useTheme();

  return (
    <section id="contact" className={`py-16 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Contacto
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Información de contacto */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow-md`}>
            <h3 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Información de contacto
            </h3>
            {loading ? (
              <p className="text-center">Cargando información...</p>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start">
                  <FaEnvelope className={`text-xl mt-1 mr-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div>
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Correo electrónico</h4>
                    <a 
                      href={`mailto:${personalInfo?.email}`} 
                      className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} hover:underline transition-colors`}
                    >
                      {personalInfo?.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaPhone className={`text-xl mt-1 mr-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div>
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Teléfono</h4>
                    <a 
                      href="tel:+50685707955" 
                      className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} hover:underline transition-colors`}
                    >
                      +506 8570 7955
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaMapMarkerAlt className={`text-xl mt-1 mr-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div>
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Ubicación</h4>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {personalInfo?.location}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Formulario de contacto */}
          <ContactForm darkMode={darkMode} />
        </div>
      </div>
    </section>
  );
};

export default Contact;