import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que maneja el scroll en la aplicación:
 * - Hace scroll al inicio cuando se navega a una página sin hash
 * - Hace scroll a una sección específica cuando se navega con hash
 * - Maneja la navegación entre páginas con secciones específicas
 */
const ScrollToSection = () => {
  const { pathname, hash } = useLocation();
  
  // Manejar el scroll basado en el hash de la URL
  useEffect(() => {
    // Si no hay un hash en la URL, hacer scroll al inicio
    if (!hash) {
      window.scrollTo(0, 0);
    } 
    // Si hay un hash, scrollear a la sección
    else {
      const id = hash.substring(1);
      const element = document.getElementById(id);
      
      if (element) {
        setTimeout(() => {
          window.scrollTo({
            top: element.offsetTop - 64, // Ajustar por el header
            behavior: "smooth"
          });
        }, 100);
      }
    }
  }, [pathname, hash]);
  
  // Manejar scroll desde sessionStorage (para navegación entre páginas)
  useEffect(() => {
    const scrollToId = sessionStorage.getItem('scrollToId');
    if (scrollToId) {
      const element = document.getElementById(scrollToId);
      if (element) {
        setTimeout(() => {
          window.scrollTo({
            top: element.offsetTop - 64, // Ajustar por el header
            behavior: "smooth"
          });
          sessionStorage.removeItem('scrollToId');
        }, 100);
      }
    }
  }, [pathname]);
  
  return null;
};

export default ScrollToSection;