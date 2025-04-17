import { useState } from 'react';
import { useTheme } from '../../../context';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode } = useTheme();
  const location = useLocation();
  
  // Estructura de navegación actualizada (quitando Contacto)
  const navItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Sobre mí', href: '/about' },
    { name: 'CV', href: '/resume' }
  ];

  // Función para manejar la navegación
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Si el enlace es un ancla dentro de la página home, realizamos scroll suave
    if (href.includes('#')) {
      // Solo hacemos scroll si estamos en la página de inicio
      if (location.pathname === '/') {
        e.preventDefault();
        const targetId = href.substring(href.indexOf('#') + 1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Ajustamos el desplazamiento para tener en cuenta la barra de navegación fija
          const targetPosition = targetElement.offsetTop - 64;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    }
    
    setIsOpen(false);
  };

  // Función para determinar si un enlace está activo
  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="relative">
      {/* Menú para dispositivos móviles */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 focus:outline-none ${darkMode ? 'text-white' : 'text-gray-800'}`}
          aria-label="Menú"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Menú desplegable en móvil */}
        {isOpen && (
          <div 
            className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
              darkMode 
                ? 'bg-gray-700 text-white' 
                : 'bg-white text-gray-900'
            } ring-1 ring-black ring-opacity-5 z-50`}
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-4 py-2 text-sm ${
                  isActive(item.href)
                    ? `${darkMode ? 'bg-gray-800 text-blue-300' : 'bg-gray-100 text-blue-600'}`
                    : `${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}`
                }`}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Menú para escritorio */}
      <div className="hidden md:flex space-x-8">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`text-sm font-medium ${
              isActive(item.href)
                ? `${darkMode ? 'text-blue-300' : 'text-blue-600'}`
                : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`
            } transition-colors`}
            onClick={(e) => handleNavClick(e, item.href)}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;