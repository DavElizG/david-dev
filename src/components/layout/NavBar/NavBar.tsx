import { useState, useEffect } from 'react';
import { useTheme } from '../../../context';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { darkMode } = useTheme();

  // Menú de navegación
  const navItems = [
    { name: 'Inicio', href: '#hero' },
    { name: 'Sobre mí', href: '#about' },
    { name: 'Habilidades', href: '#skills' },
    { name: 'Proyectos', href: '#projects' },
    { name: 'Contacto', href: '#contact' }
  ];

  // Detectar sección activa en el scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      // Ajustamos el scrollPosition para tener en cuenta la altura de la barra de navegación fija (aprox. 64px)
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute('id') || '';

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Llamamos a handleScroll al inicio para establecer la sección activa inicial
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para manejar la navegación suave
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Ajustamos el desplazamiento para tener en cuenta la barra de navegación fija
      const targetPosition = targetElement.offsetTop - 64; // 64px es aproximadamente la altura del header
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      setActiveSection(targetId);
    }
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
              <a
                key={item.name}
                href={item.href}
                className={`block px-4 py-2 text-sm ${
                  activeSection === item.href.substring(1)
                    ? `${darkMode ? 'bg-gray-800 text-blue-300' : 'bg-gray-100 text-blue-600'}`
                    : `${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}`
                }`}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.name}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Menú para escritorio */}
      <div className="hidden md:flex space-x-8">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`text-sm font-medium ${
              activeSection === item.href.substring(1)
                ? `${darkMode ? 'text-blue-300' : 'text-blue-600'}`
                : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`
            } transition-colors`}
            onClick={(e) => handleNavClick(e, item.href)}
          >
            {item.name}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;