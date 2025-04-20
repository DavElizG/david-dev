import React, { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';
import { useLocation } from 'react-router-dom';

interface SmoothScrollProps {
  children: ReactNode;
  options?: {
    duration?: number;
    easing?: (t: number) => number;
    smooth?: boolean;
    direction?: 'vertical' | 'horizontal';
    mouseMultiplier?: number;
    smoothTouch?: boolean;
    touchMultiplier?: number;
  };
}

/**
 * Componente que aplica scrolling suave usando Lenis a toda la aplicación
 * y maneja la navegación entre rutas
 */
const SmoothScroll: React.FC<SmoothScrollProps> = ({ children, options = {} }) => {
  const location = useLocation();
  
  // Inicialización de Lenis
  useEffect(() => {
    // Configuración predeterminada para Lenis
    const defaultOptions = {
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      mouseMultiplier: 1,
      touchMultiplier: 2,
    };

    // Fusionar opciones predeterminadas con las proporcionadas
    const lenisOptions = { ...defaultOptions, ...options };

    // Crear instancia de Lenis
    const lenis = new Lenis(lenisOptions);
    
    // Función para actualizar Lenis en cada frame
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // Iniciar el loop de animación
    requestAnimationFrame(raf);

    // Resetear el scroll cuando cambia la ruta principal
    if (!location.hash) {
      lenis.scrollTo(0, { immediate: true });
    }

    // Manejar scroll a secciones con hash
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      
      if (element) {
        // Dar tiempo para que se renderice el DOM
        setTimeout(() => {
          // Scroll a la sección con animación suave
          lenis.scrollTo(element, {
            offset: -64, // Ajuste para header fijo
            duration: 1.2
          });
        }, 100);
      }
    }

    // Manejar scrollTo desde sessionStorage (para navegación entre páginas)
    const scrollToId = sessionStorage.getItem('scrollToId');
    if (scrollToId) {
      const element = document.getElementById(scrollToId);
      if (element) {
        // Dar tiempo para que se renderice el DOM
        setTimeout(() => {
          lenis.scrollTo(element, {
            offset: -64, // Ajuste para header fijo
            duration: 1.2
          });
          sessionStorage.removeItem('scrollToId');
        }, 100);
      }
    }

    return () => {
      // Limpiar Lenis al desmontar el componente
      lenis.destroy();
    };
  }, [location.pathname, location.hash, options]);
  
  return <>{children}</>;
};

export default SmoothScroll;