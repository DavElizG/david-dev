import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { FormData, FormStatus } from '../../../types/contact.types';
import HoverButton from '../HoverButton';
import { useLanguage } from '../../../context';

gsap.registerPlugin(ScrambleTextPlugin);

interface ContactFormProps {
  darkMode: boolean;
}

const ContactForm = ({ darkMode }: ContactFormProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<FormStatus | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const original = el.textContent || '';
    const timer = setTimeout(() => {
      gsap.to(el, {
        duration: 1.4,
        scrambleText: {
          text: original,
          chars: 'upperAndLowerCase',
          revealDelay: 0.4,
          speed: 0.9,
        },
      });
    }, 700);
    return () => clearTimeout(timer);
  }, []);

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
      newErrors.name = t.form.errorNameRequired;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t.form.errorEmailRequired;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.form.errorEmailInvalid;
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t.form.errorMessageRequired;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t.form.errorMessageLength;
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
        message: t.form.errorGeneral
      });
      return;
    }

    setFormStatus({
      success: undefined,
      message: t.form.sendingMessage
    });

    setTimeout(() => {
      setFormStatus({
        success: true,
        message: t.form.successMessage
      });
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow-md`}>
      <h3 ref={headingRef} className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {t.form.heading}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className={`block mb-2 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.form.name}
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
            placeholder={t.form.namePlaceholder}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className={`block mb-2 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.form.email}
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
            placeholder={t.form.emailPlaceholder}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="message" className={`block mb-2 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.form.message}
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
            placeholder={t.form.messagePlaceholder}
          />
          {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
        </div>
        
        {formStatus?.message === t.form.sendingMessage ? (
          <button
            type="submit"
            disabled
            className="w-full px-6 py-3 text-xs uppercase tracking-widest font-bold rounded-lg"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'var(--space-text-dim)', opacity: 0.5, cursor: 'not-allowed' }}
          >
            {t.form.sending}
          </button>
        ) : (
          <HoverButton
            type="submit"
            label={t.form.send}
            className="w-full"
          />
        )}

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