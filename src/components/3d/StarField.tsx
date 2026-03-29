/**
 * StarField.tsx — Lightweight 2D canvas starfield background.
 *
 * Renders once (+ on resize). Stars have slight color tinting (purple / cyan / white)
 * to match the aurora theme. No animation loop — fully static for near-zero CPU cost.
 */
import { useEffect, useRef } from 'react';
import { useTheme } from '../../context';

const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);

    /* Pre-generate star data once */
    const STAR_COUNT = 600;
    const stars = Array.from({ length: STAR_COUNT }, () => {
      const rand = Math.random();
      // 15% purple-tinted, 10% cyan-tinted, 75% white
      const tint =
        rand > 0.90 ? 'rgba(200,200,210,' :
        rand > 0.80 ? 'rgba(155,155,165,' :
                       'rgba(255,255,255,';
      return {
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.3 + 0.2,
        o: Math.random() * 0.6 + 0.06,
        tint,
      };
    });

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `${s.tint}${s.o})`;
        ctx.fill();
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'absolute',
        inset:         0,
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',
        display:       'block',
        filter:        darkMode ? 'none' : 'invert(1)',
      }}
    />
  );
};

export default StarField;
