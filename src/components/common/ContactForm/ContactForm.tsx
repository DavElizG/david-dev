import { useState } from 'react';
import { FormData, FormStatus } from '../../../types/contact.types';

interface ContactFormProps {
  darkMode: boolean;
}

const ContactForm = ({ darkMode }: ContactFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<FormStatus | null>(null);
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
  );
};

export default ContactForm;