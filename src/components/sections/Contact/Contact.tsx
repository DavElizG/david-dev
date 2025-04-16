import { useState } from 'react';
import { usePersonalInfo } from '../../../hooks';
import { useTheme } from '../../../context';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  const { personalInfo, loading } = usePersonalInfo();
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpia el error específico cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del correo electrónico no es válido';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es obligatorio';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación completa del formulario
    if (!validateForm()) {
      setFormStatus({
        success: false,
        message: 'Por favor corrige los errores en el formulario.'
      });
      return;
    }

    // Mostrar estado de "enviando"
    setFormStatus({
      success: undefined,
      message: 'Enviando mensaje...'
    });

    // Simular envío de formulario (aquí implementarías la lógica real)
    setTimeout(() => {
      setFormStatus({
        success: true,
        message: '¡Mensaje enviado correctamente! Te responderé pronto.'
      });
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

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
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow-md`}>
            <h3 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Envíame un mensaje
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className={`block mb-2 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                  } ${errors.name ? 'border-red-500' : 'border'}`}
                  placeholder="Tu nombre"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className={`block mb-2 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                  } ${errors.email ? 'border-red-500' : 'border'}`}
                  placeholder="tu@email.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              
              <div>
                <label htmlFor="message" className={`block mb-2 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                  } ${errors.message ? 'border-red-500' : 'border'}`}
                  placeholder="Escribe tu mensaje aquí..."
                />
                {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
              </div>
              
              <button
                type="submit"
                className={`w-full px-6 py-3 text-white rounded-lg transition-colors ${
                  formStatus?.message === 'Enviando mensaje...' 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={formStatus?.message === 'Enviando mensaje...'}
              >
                {formStatus?.message === 'Enviando mensaje...' ? 'Enviando...' : 'Enviar mensaje'}
              </button>

              {/* Mensaje de estado */}
              {formStatus && (
                <div className={`mt-4 p-3 rounded-lg ${
                  formStatus.success === undefined
                    ? `${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-800'}`
                    : formStatus.success 
                      ? `${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}` 
                      : `${darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'}`
                }`}>
                  {formStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;