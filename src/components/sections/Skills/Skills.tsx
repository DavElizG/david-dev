/**
 * Skills.tsx
 *
 * Marquee + 3D fold effect for Tech Stack section.
 * Adapted from CodePen fold-marquee pattern:
 *  - Each skill category is a marquee row with tech icons scrolling horizontally
 *  - Alternating scroll directions driven by GSAP ScrollTrigger scrub
 *  - 3D fold panels (top/center/bottom) with perspective
 *  - Dark space theme
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSkills } from '../../../hooks';
import { getTechIcon, getTechDocUrl } from '../../../utils/iconUtils';
import './Skills.css';

gsap.registerPlugin(ScrollTrigger);

/* Build a long repeating string of items for a marquee row */
const REPEATS = 6;

const Skills = () => {
  const { skills, loading } = useSkills();
  const sectionRef    = useRef<HTMLElement>(null);
  const centerFoldRef = useRef<HTMLDivElement>(null);
  const contentRefs   = useRef<HTMLDivElement[]>([]);
  const ctxRef        = useRef<gsap.Context | null>(null);
  const rafRef        = useRef<number>(0);

  /* Flatten all items for a single long marquee, or group by category for multiple rows */
  const allItems = skills?.flatMap(cat => cat?.items || []) || [];

  /* Build marquee rows: one per category + one "all" row for variety */
  const rows = [
    ...(skills?.map(cat => ({
      label: cat.category,
      items: cat.items,
    })) || []),
    { label: 'Stack', items: allItems },
  ];

  useEffect(() => {
    if (loading || !sectionRef.current || !rows.length) return;

    let cancelled = false;

    const setup = () => {
      ctxRef.current?.revert();
      cancelAnimationFrame(rafRef.current);
      if (cancelled || !sectionRef.current) return;

      ctxRef.current = gsap.context(() => {
        /* ── Marquee scroll ── */
        gsap.utils.toArray<HTMLElement>('.skills-marquee').forEach((el, index) => {
          const track = el.querySelector<HTMLElement>('.skills-track');
          if (!track) return;

          const [x, xEnd] = index % 2 === 0 ? [0, -track.scrollWidth / 2] : [-track.scrollWidth / 2, 0];

          gsap.fromTo(track, { x }, {
            x: xEnd,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start:   'top bottom',
              end:     'bottom top',
              scrub:   1,
            },
          });
        });

        /* ── 3D fold smooth scroll ── */
        const centerContent = document.getElementById('skills-center-content');
        const centerFold    = centerFoldRef.current;
        const foldContents  = Array.from(document.querySelectorAll<HTMLElement>('.skills-fold-content'));

        if (centerContent && centerFold && foldContents.length) {
          let targetY  = 0;
          let currentY = 0;

          const tick = () => {
            const overflowH = centerContent.clientHeight - centerFold.clientHeight;
            const section   = sectionRef.current;
            if (!section) { rafRef.current = requestAnimationFrame(tick); return; }

            const rect   = section.getBoundingClientRect();
            const progress = -rect.top / (section.scrollHeight - window.innerHeight);
            targetY = -progress * overflowH;
            currentY += (targetY - currentY) * 0.1;

            foldContents.forEach(c => {
              c.style.transform = `translateY(${currentY}px)`;
            });
            rafRef.current = requestAnimationFrame(tick);
          };
          rafRef.current = requestAnimationFrame(tick);
        }
      }, sectionRef);
    };

    const timer = setTimeout(() => {
      if (!cancelled) {
        ScrollTrigger.refresh();
        setup();
      }
    }, 100);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, rows.length]);

  /* ── Render a single marquee row ── */
  const renderMarqueeRow = (
    items: typeof allItems,
    label: string,
    isFocus: boolean,
  ) => (
    <div className="skills-marquee" key={label}>
      <div className="skills-track">
        {Array.from({ length: REPEATS }).map((_, repIdx) => (
          <span className="skills-track__segment" key={repIdx}>
            {/* Category label */}
            <span className={`skills-track__label ${isFocus ? '-focus' : ''}`}>
              {label}.
            </span>
            {/* Tech items */}
            {items.map((item, idx) => (
              <a
                key={`${repIdx}-${idx}`}
                href={item.url || getTechDocUrl(item.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="skills-track__item"
                title={item.name}
              >
                <span className="skills-track__icon">
                  {getTechIcon(item.name, true, 28)}
                </span>
                <span className="skills-track__name">{item.name}</span>
              </a>
            ))}
          </span>
        ))}
      </div>
    </div>
  );

  /* ── Render fold content (all marquee rows) ── */
  const renderFoldContent = (id?: string, refCb?: (el: HTMLDivElement | null) => void) => (
    <div className="skills-fold-content" id={id} ref={refCb}>
      {rows.map((row, i) =>
        renderMarqueeRow(row.items, row.label, i === rows.length - 1)
      )}
    </div>
  );

  if (loading) {
    return (
      <section id="skills" className="skills-section" ref={sectionRef}>
        <div className="skills-loader">
          <div
            className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2"
            style={{ borderColor: 'var(--space-accent)' }}
          />
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="skills-section" ref={sectionRef}>
      {/* Section header */}
      <div className="skills-header">
        <span className="skills-header__tag">Tech Stack</span>
        <h2 className="skills-header__title">
          Tecnologías &amp; Herramientas
        </h2>
        <p className="skills-header__sub">
          Las herramientas con las que construyo soluciones.
        </p>
      </div>

      {/* 3D Fold screen */}
      <div className="skills-screen">
        <div className="skills-wrapper-3d">
          {/* Top fold */}
          <div className="skills-fold skills-fold--top">
            <div className="skills-fold__align">
              {renderFoldContent(undefined, el => { if (el) contentRefs.current[0] = el; })}
            </div>
          </div>

          {/* Center fold */}
          <div
            className="skills-fold skills-fold--center"
            ref={centerFoldRef}
          >
            <div className="skills-fold__align">
              {renderFoldContent('skills-center-content', el => { if (el) contentRefs.current[1] = el; })}
            </div>
          </div>

          {/* Bottom fold */}
          <div className="skills-fold skills-fold--bottom">
            <div className="skills-fold__align">
              {renderFoldContent(undefined, el => { if (el) contentRefs.current[2] = el; })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;