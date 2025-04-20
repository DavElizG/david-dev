import React, { useEffect, useRef, ReactNode } from 'react';
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
  const lenisRef = useRef<Lenis | null>(null);
  const prevPathRef = useRef<string>(location.pathname);
  
  // Inicialización de Lenis (solo se ejecuta una vez al montar el componente)
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
    lenisRef.current = lenis;
    
    // Función para actualizar Lenis en cada frame
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // Iniciar el loop de animación
    requestAnimationFrame(raf);

    return () => {
      // Limpiar Lenis al desmontar el componente
      window.cancelAnimationFrame(0); // Cancelar cualquier animación pendiente
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []); // Solo se ejecuta una vez al montar el componente
  
  // Manejo de cambio de ruta
  useEffect(() => {
    if (!lenisRef.current) return;
    
    // Si ha cambiado la ruta (no solo el hash), scroll al inicio
    if (location.pathname !== prevPathRef.current) {
      console.log('Cambio de ruta detectado:', prevPathRef.current, '->', location.pathname);
      lenisRef.current.scrollTo(0, { immediate: true });
      prevPathRef.current = location.pathname;
      return;
    }

    // Manejar scroll a secciones con hash
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      
      if (element) {
        // Dar tiempo para que se renderice el DOM
        setTimeout(() => {
          if (lenisRef.current) {
            // Scroll a la sección con animación suave
            lenisRef.current.scrollTo(element, {
              offset: -64, // Ajuste para header fijo
              duration: 1.2
            });
          }
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
          if (lenisRef.current) {
            lenisRef.current.scrollTo(element, {
              offset: -64, // Ajuste para header fijo
              duration: 1.2
            });
            sessionStorage.removeItem('scrollToId');
          }
        }, 100);
      } else {
        sessionStorage.removeItem('scrollToId');
      }
    }
    
    prevPathRef.current = location.pathname;
  }, [location.pathname, location.hash]); // Se ejecuta cuando cambia la ruta o el hash
  
  return <>{children}</>;
};

export default SmoothScroll;