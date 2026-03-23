/**
 * Skills.tsx
 *
 * Marquee + 3D fold effect for Tech Stack section.
 *  - Each skill category is a marquee row with tech icons scrolling horizontally
 *  - Alternating scroll directions driven by GSAP ScrollTrigger scrub
 *  - Each marquee track is also Draggable (drag + inertia throw)
 *  - 3D fold panels (top/center/bottom) with perspective
 *  - Dark space theme
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { useSkills } from '../../../hooks';
import { getTechIcon, getTechDocUrl } from '../../../utils/iconUtils';
import ShootingStars from '../../3d/ShootingStars';
import './Skills.css';

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);

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

      const section = sectionRef.current;

      ctxRef.current = gsap.context(() => {
        /* ── Marquee scroll + Draggable ── */
        gsap.utils.toArray<HTMLElement>('.skills-marquee').forEach((el, index) => {
          const track = el.querySelector<HTMLElement>('.skills-track');
          if (!track) return;

          const halfWidth = track.scrollWidth / 2;
          if (halfWidth <= 0) return;
          const isEven = index % 2 === 0;
          // Slower — 0.25 factor vs previous 0.35
          const travel = halfWidth * 0.25;

          // Separate accumulators: scroll drives one, drag drives the other
          let scrollProgress = 0;
          let dragOffset     = 0;

          const applyTransform = () => {
            // Scroll contrib: even rows go 0→−travel, odd rows go −travel→0
            const scrollX = isEven ? -scrollProgress * travel : -(1 - scrollProgress) * travel;
            // Combine and wrap to [−halfWidth, 0] for seamless loop
            const raw     = scrollX + dragOffset;
            const wrapped = ((raw % halfWidth) + halfWidth) % halfWidth - halfWidth;
            gsap.set(track, { x: wrapped });
          };

          // Set correct initial position immediately (no flash on entry)
          {
            const rect   = section.getBoundingClientRect();
            const scrollH = section.scrollHeight - window.innerHeight;
            if (scrollH > 0) {
              scrollProgress = Math.max(0, Math.min(1, -rect.top / scrollH));
            }
            applyTransform();
          }

          // Scroll drives only the progress value — never touches track directly
          ScrollTrigger.create({
            trigger: section,
            start:   'top bottom',
            end:     'bottom top',
            scrub:   1.5,
            onUpdate(self) {
              scrollProgress = self.progress;
              applyTransform();
            },
            onRefresh(self) {
              scrollProgress = self.progress;
              applyTransform();
            },
          });

          // Invisible drag layer on top of the marquee row
          const dragProxy = document.createElement('div');
          el.appendChild(dragProxy);
          gsap.set(dragProxy, {
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            opacity: 0,
            zIndex: 5,
          });

          Draggable.create(dragProxy, {
            type:           'x',
            inertia:        true,
            cursor:         'grab',
            activeCursor:   'grabbing',
            edgeResistance: 0,
            onDrag() {
              dragOffset += this.deltaX;
              applyTransform();
            },
            onThrowUpdate() {
              dragOffset += this.deltaX;
              applyTransform();
            },
            onThrowComplete() {
              // Reset proxy so deltaX stays accurate on the next drag
              gsap.set(dragProxy, { x: 0 });
            },
          });
        });

        /* ── 3D fold smooth scroll ── */
        const centerContent = document.getElementById('skills-center-content');
        const centerFold    = centerFoldRef.current;
        const foldContents  = Array.from(
          section.querySelectorAll<HTMLElement>('.skills-fold-content')
        );

        if (centerContent && centerFold && foldContents.length) {
          let targetY  = 0;
          let currentY = 0;

          const tick = () => {
            const overflowH = centerContent.clientHeight - centerFold.clientHeight;
            const rect      = section.getBoundingClientRect();
            const progress  = -rect.top / (section.scrollHeight - window.innerHeight);
            targetY   = -progress * overflowH;
            currentY += (targetY - currentY) * 0.1;
            foldContents.forEach(c => {
              c.style.transform = `translateY(${currentY}px)`;
            });
            rafRef.current = requestAnimationFrame(tick);
          };
          rafRef.current = requestAnimationFrame(tick);
        }
      }, section);
    };

    const timer = setTimeout(() => {
      if (!cancelled) setup();
    }, 150);

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
      <ShootingStars />

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