import { useEffect, useRef } from 'react';
import WebGLFluidEnhanced from 'webgl-fluid-enhanced';

const FluidBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const simulation = new WebGLFluidEnhanced(el);

    simulation.setConfig({
      simResolution: 128,
      dyeResolution: 1024,
      densityDissipation: 0.97,
      velocityDissipation: 0.98,
      pressure: 0.8,
      pressureIterations: 20,
      curl: 30,
      splatRadius: 0.25,
      splatForce: 6000,
      shading: true,
      colorful: true,
      colorUpdateSpeed: 10,
      colorPalette: [
        '#a855f7', // purple
        '#06b6d4', // cyan
        '#7c3aed', // violet
        '#ec4899', // pink
        '#6366f1', // indigo
        '#38bdf8', // sky
      ],
      hover: false, // We handle mouse events manually via document listener
      backgroundColor: '#06050f',
      transparent: false,
      brightness: 0.4,
      bloom: true,
      bloomIterations: 8,
      bloomResolution: 256,
      bloomIntensity: 0.4,
      bloomThreshold: 0.6,
      bloomSoftKnee: 0.7,
      sunrays: true,
      sunraysResolution: 196,
      sunraysWeight: 0.6,
    });

    simulation.start();

    // Initial burst of splats for ambient color
    simulation.multipleSplats(Math.floor(Math.random() * 5) + 5);

    // Periodic auto-splats to keep the fluid alive
    const autoSplatInterval = setInterval(() => {
      simulation.multipleSplats(Math.floor(Math.random() * 2) + 1);
    }, 4000);

    // Forward document mouse events to the fluid canvas
    // This way the fluid reacts to mouse even though content sits on top
    let lastX = 0;
    let lastY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      // Only splat if there's meaningful mouse movement
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        simulation.splatAtLocation(
          e.clientX,
          e.clientY,
          dx * 2,
          dy * 2,
        );
      }
    };

    document.addEventListener('pointermove', onPointerMove);

    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      clearInterval(autoSplatInterval);
      simulation.stop();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default FluidBackground;
