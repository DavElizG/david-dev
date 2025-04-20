import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  direction?: 'vertical' | 'horizontal';
  gestureDirection?: 'vertical' | 'horizontal' | 'both';
  smooth?: boolean;
  mouseMultiplier?: number;
  smoothTouch?: boolean;
  touchMultiplier?: number;
  infinite?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

/**
 * Hook para implementar el scroll suave con Lenis
 * @param options - Opciones de configuración para Lenis
 * @returns La instancia de Lenis
 */
export function useLenis(options: LenisOptions = {}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Configuración predeterminada para Lenis
    const defaultOptions = {
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical' as const,
      gestureDirection: 'vertical' as const,
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    };

    // Fusionar opciones predeterminadas con las proporcionadas
    const lenisOptions = { ...defaultOptions, ...options };

    // Crear instancia de Lenis
    lenisRef.current = new Lenis(lenisOptions);
    
    // Función para actualizar Lenis en cada frame de animación
    function raf(time: number) {
      if (lenisRef.current) {
        lenisRef.current.raf(time);
      }
      requestAnimationFrame(raf);
    }

    // Iniciar el loop de animación
    requestAnimationFrame(raf);

    return () => {
      // Limpiar Lenis al desmontar el componente
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [options]);

  return lenisRef.current;
}