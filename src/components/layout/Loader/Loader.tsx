import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LoaderProps {
  onComplete: () => void;
}

const NUM_POINTS     = 8;
const NUM_PATHS      = 2;
const DELAY_PTS_MAX  = 0.3;
const DELAY_PER_PATH = 0.22;
const MORPH_DURATION = 0.95;

const Loader = ({ onComplete }: LoaderProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const countRef   = useRef<HTMLSpanElement>(null);
  const barRef     = useRef<HTMLDivElement>(null);
  const statusRef  = useRef<HTMLSpanElement>(null);
  const c1Ref      = useRef<HTMLDivElement>(null);
  const c2Ref      = useRef<HTMLDivElement>(null);
  const c3Ref      = useRef<HTMLDivElement>(null);
  const c4Ref      = useRef<HTMLDivElement>(null);
  const pathRefs   = useRef<(SVGPathElement | null)[]>([null, null]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    /* ── SVG morphing data ─────────────────────────────────── */
    // Each path has NUM_POINTS control points, starting at 100 (full coverage)
    const allPoints: number[][] = Array.from(
      { length: NUM_PATHS },
      () => Array(NUM_POINTS).fill(100),
    );

    // Build SVG path "d" from the current control points
    // Shape: wavy bottom edge at ~points[j], top edge at y=0 → covers top portion of screen
    // points[j]=100 → full screen covered | points[j]=0 → nothing visible
    const renderPaths = () => {
      for (let i = 0; i < NUM_PATHS; i++) {
        const path = pathRefs.current[i];
        if (!path) continue;
        const pts = allPoints[i];
        let d = `M 0 ${pts[0]} C`;
        for (let j = 0; j < NUM_POINTS - 1; j++) {
          const p  = (j + 1) / (NUM_POINTS - 1) * 100;
          const cp = p - (1 / (NUM_POINTS - 1) * 100) / 2;
          d += ` ${cp} ${pts[j]} ${cp} ${pts[j + 1]} ${p} ${pts[j + 1]}`;
        }
        d += ' V 0 H 0';
        path.setAttribute('d', d);
      }
    };

    renderPaths(); // init paths in full-screen state

    /* ── Counter + entrance ───────────────────────────────── */
    const ctx = gsap.context(() => {
      const counter = { val: 0 };
      const corners = [c1Ref.current, c2Ref.current, c3Ref.current, c4Ref.current];

      const updateDisplay = () => {
        if (countRef.current)
          countRef.current.textContent = String(Math.floor(counter.val)).padStart(2, '0');
        if (barRef.current)
          barRef.current.style.transform = `scaleX(${counter.val / 100})`;
      };

      /* ── Morph exit ──────────────────────────────────────── */
      const startMorph = () => {
        // Drop the solid bg — SVG paths (still at 100) now provide visual coverage
        if (overlayRef.current) overlayRef.current.style.background = 'transparent';

        // Random per-point delays for organic wave
        const pointsDelay = Array.from(
          { length: NUM_POINTS },
          () => Math.random() * DELAY_PTS_MAX,
        );

        const morphTl = gsap.timeline({
          onUpdate: renderPaths,
          onComplete: () => {
            document.body.style.overflow = '';
            onComplete();
          },
          defaults: { ease: 'power2.inOut', duration: MORPH_DURATION },
        });

        for (let i = 0; i < NUM_PATHS; i++) {
          const points   = allPoints[i];
          // Reverse order: last path sweeps first, first path (on top) sweeps last
          const pathDelay = DELAY_PER_PATH * (NUM_PATHS - i - 1);
          for (let j = 0; j < NUM_POINTS; j++) {
            morphTl.to(points, { [j]: 0 }, pointsDelay[j] + pathDelay);
          }
        }
      };

      /* ── Main timeline ───────────────────────────────────── */
      gsap.timeline({
        onComplete: () => {
          if (statusRef.current) statusRef.current.textContent = 'READY';

          gsap.timeline()
            .to(contentRef.current, { opacity: 0, y: -8, duration: 0.3, ease: 'power2.in' })
            .to(corners,            { opacity: 0, duration: 0.2, stagger: 0.04 }, '<')
            .to(barRef.current,     { opacity: 0, duration: 0.2 }, '<+=0.1')
            .add(startMorph);
        },
      })
        .fromTo(corners,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 0.5, stagger: 0.07, ease: 'power2.out' },
        )
        .fromTo(contentRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.3',
        )
        .to(counter, { val: 70,  duration: 1.1,  ease: 'power1.out', onUpdate: updateDisplay })
        .to(counter, { val: 93,  duration: 0.95, ease: 'sine.in',    onUpdate: updateDisplay })
        .to({}, { duration: 0.25 })
        .to(counter, { val: 100, duration: 0.3,  ease: 'power3.out', onUpdate: updateDisplay })
        .to({}, { duration: 0.4 });
    }, overlayRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  /* ── Corner bracket styles ──────────────────────────────── */
  const cornerStyle = (pos: 'tl' | 'tr' | 'bl' | 'br'): React.CSSProperties => ({
    position: 'absolute',
    [pos.includes('t') ? 'top' : 'bottom']: '1.75rem',
    [pos.includes('l') ? 'left' : 'right']: '1.75rem',
    width: 22, height: 22, opacity: 0,
    zIndex: 2,
  });
  const hBar: React.CSSProperties = {
    position: 'absolute', height: '1px',
    width: '100%', background: 'rgba(255,255,255,0.3)',
  };
  const vBar: React.CSSProperties = {
    position: 'absolute', width: '1px',
    height: '100%', background: 'rgba(255,255,255,0.3)',
  };

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed', inset: 0,
        background: '#000000',
        zIndex: 9999,
        userSelect: 'none', pointerEvents: 'all',
      }}
    >
      {/* ── Morphing SVG — black curtain that sweeps away on exit ── */}
      {/* During loading: fill="#000" is invisible against black bg  */}
      {/* During morph:   bg → transparent, these paths provide coverage */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 1,
        }}
      >
        <path ref={el => { pathRefs.current[0] = el; }} fill="#000000" />
        <path ref={el => { pathRefs.current[1] = el; }} fill="#080808" />
      </svg>

      {/* ── Corner brackets ── */}
      <div ref={c1Ref} style={cornerStyle('tl')}>
        <div style={{ ...hBar, top: 0, left: 0 }} />
        <div style={{ ...vBar, top: 0, left: 0 }} />
      </div>
      <div ref={c2Ref} style={cornerStyle('tr')}>
        <div style={{ ...hBar, top: 0, right: 0 }} />
        <div style={{ ...vBar, top: 0, right: 0 }} />
      </div>
      <div ref={c3Ref} style={cornerStyle('bl')}>
        <div style={{ ...hBar, bottom: 0, left: 0 }} />
        <div style={{ ...vBar, bottom: 0, left: 0 }} />
      </div>
      <div ref={c4Ref} style={cornerStyle('br')}>
        <div style={{ ...hBar, bottom: 0, right: 0 }} />
        <div style={{ ...vBar, bottom: 0, right: 0 }} />
      </div>

      {/* ── Center content ── */}
      <div
        ref={contentRef}
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: 0, zIndex: 2,
        }}
      >
        <div style={{
          width: 'clamp(180px, 28vw, 340px)', height: '1px',
          background: 'rgba(255,255,255,0.08)', marginBottom: '1.8rem',
        }} />

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
          <span
            ref={countRef}
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 'clamp(5rem, 13vw, 10rem)',
              fontWeight: 300, color: '#ffffff',
              lineHeight: 1, letterSpacing: '-0.03em',
              fontVariantNumeric: 'tabular-nums',
              textShadow: '0 0 80px rgba(255,255,255,0.13)',
            }}
          >
            00
          </span>
          <span style={{
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 'clamp(1.4rem, 2.8vw, 2.4rem)',
            fontWeight: 300, color: 'rgba(255,255,255,0.2)', lineHeight: 1,
          }}>
            %
          </span>
        </div>

        <div style={{
          width: 'clamp(180px, 28vw, 340px)', height: '1px',
          background: 'rgba(255,255,255,0.08)',
          marginTop: '1.8rem', marginBottom: '1.1rem',
        }} />

        <div style={{
          display: 'flex', alignItems: 'center', gap: '1.5rem',
          fontSize: '0.52rem', letterSpacing: '0.6em', textTransform: 'uppercase',
          fontFamily: '"Courier New", Courier, monospace',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.18)' }}>David Guadamuz</span>
          <div style={{ width: '1px', height: '9px', background: 'rgba(255,255,255,0.15)' }} />
          <span ref={statusRef} style={{ color: 'rgba(255,255,255,0.1)' }}>LOADING</span>
        </div>
      </div>

      {/* ── Bottom progress line ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '1px', background: 'rgba(255,255,255,0.06)',
        overflow: 'hidden', zIndex: 2,
      }}>
        <div
          ref={barRef}
          style={{
            height: '100%', width: '100%',
            background: 'rgba(255,255,255,0.4)',
            transformOrigin: 'left center', transform: 'scaleX(0)',
          }}
        />
      </div>
    </div>
  );
};

export default Loader;
