/**
 * JourneySection.tsx
 *
 * Vertical-scroll timeline for Education + Experience.
 *
 * Layout:
 *  - Entries alternate left ↔ right (even indices left, odd right)
 *  - Galaxy fixed and centered behind all content
 *  - Content blocks have a subtle gradient dark veil for readability
 *
 * Cursor animation (inspired by GSAP CodePen raerLaK):
 *  - MotionPathPlugin animates a glowing orb along a curved zigzag path
 *  - Path points are computed from each marker's getBoundingClientRect()
 *  - Recreated on window resize (same pattern as the CodePen)
 *
 * Other animations (GSAP):
 *  - SplitText chars — org names reveal letter-by-letter with rotationX
 *  - SplitText lines — description lines scrub-masked in
 *  - Gradient titles — gsap.from y + opacity (no SplitText — webkit-clip conflict)
 *  - Meta row        — slides in from the correct side
 *  - Tags            — scale + opacity pop with back easing
 */
import { useEffect, useRef, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger }    from 'gsap/ScrollTrigger';
import { SplitText }        from 'gsap/SplitText';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useEducation }     from '../../../hooks';
import { useExperience }    from '../../../hooks';

const Galaxy    = lazy(() => import('../../3d/Galaxy'));
const StarField = lazy(() => import('../../3d/StarField'));

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin);

/* ── Merged entry type ─────────────────────────────── */
interface JourneyEntry {
  id: string;
  type: 'education' | 'experience';
  title: string;
  org: string;
  location: string;
  period: string;
  description: string;
  tags: string[];
}

const ACCENT   = 'var(--space-accent)';
const ACCENT2  = 'var(--space-accent-2)';
const TEXT     = 'var(--space-text)';
const TEXT_DIM = 'var(--space-text-dim)';

/* ══════════════════════════════════════════════════════════════════════ */

const JourneySection = () => {
  const { education, loading: eduLoading } = useEducation();
  const { experience, loading: expLoading } = useExperience();

  /* ── Merge entries: education first, then experience ── */
  const entries: JourneyEntry[] = [
    ...(education?.map(ed => ({
      id:          `edu-${ed.id_education}`,
      type:        'education' as const,
      title:       ed.degree,
      org:         ed.institution,
      location:    ed.location,
      period:      `${ed.startDate} — ${ed.endDate}`,
      description: ed.description,
      tags:        [] as string[],
    })) ?? []),
    ...(experience?.map(ex => ({
      id:          `exp-${ex.id_experience}`,
      type:        'experience' as const,
      title:       ex.role,
      org:         ex.company,
      location:    ex.location,
      period:      `${ex.startDate} — ${ex.endDate}`,
      description: ex.description,
      tags:        ex.technologies ?? [],
    })) ?? []),
  ];

  /* ── Refs ─────────────────────────────────────────── */
  const sectionRef         = useRef<HTMLElement>(null);
  const cursorRef          = useRef<HTMLDivElement>(null);
  const entryRefs          = useRef<(HTMLDivElement | null)[]>([]);
  const markerRefs         = useRef<(HTMLDivElement | null)[]>([]);
  const scrollProgressRef  = useRef<number>(0);
  const galaxyContainerRef = useRef<HTMLDivElement>(null);

  /* ── GSAP setup ───────────────────────────────────── */
  useEffect(() => {
    if (!entries.length || !sectionRef.current || !cursorRef.current) return;

    let cancelled     = false;
    let ctx: gsap.Context | undefined;
    let handleResize: (() => void) | undefined;
    let resizeTimer:  ReturnType<typeof setTimeout>;

    /* ─────────────────────────────────────────────────────
       setup() — mirrors the CodePen pattern:
       revert previous context, recompute BoundingClientRects,
       rebuild MotionPath + all scroll animations fresh.
       Called once on init and again on every resize.
       ───────────────────────────────────────────────────── */
    const setup = () => {
      ctx?.revert();
      if (cancelled || !sectionRef.current || !cursorRef.current) return;

      const validMarkers = markerRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!validMarkers.length) return;

      ctx = gsap.context(() => {
        const cursor = cursorRef.current!;

        /* Reset cursor to origin before measuring */
        gsap.set(cursor, { x: 0, y: 0, opacity: 0 });
        const cursorRect = cursor.getBoundingClientRect();

        /* Compute {x, y} offsets from cursor origin to each marker center
           (identical to the CodePen getBoundingClientRect approach)       */
        const points = validMarkers.map(marker => {
          const r = marker.getBoundingClientRect();
          return {
            x: r.left + r.width  / 2 - (cursorRect.left + cursorRect.width  / 2),
            y: r.top  + r.height / 2 - (cursorRect.top  + cursorRect.height / 2),
          };
        });

        /* Snap cursor to first marker, make it visible */
        gsap.set(cursor, { x: points[0].x, y: points[0].y, opacity: 1 });

        /* Continuous pulse (independent of scroll) */
        gsap.to(cursor, {
          scale:    1.4,
          duration: 1.1,
          repeat:   -1,
          yoyo:     true,
          ease:     'sine.inOut',
        });

        /* ── MotionPath scroll timeline ─────────────────
           Cursor travels along a curved zigzag path
           scrubbed to the full section scroll (top → bottom).
           curviness: 1.5 gives smooth S-curves between markers.
           ─────────────────────────────────────────────── */
        if (points.length > 1) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger:  sectionRef.current,
              start:    'top top',
              end:      'bottom bottom',
              scrub:    1.5,
              onUpdate: (self) => { scrollProgressRef.current = self.progress; },
            },
          });

          tl.to(cursor, {
            duration:   1,
            ease:       'none',
            motionPath: {
              path:      points.slice(1), // skip first — cursor is already there
              curviness: 1.5,
            },
          });
        }

        /* ── Marker activation — pulse glow on active entry ── */
        validMarkers.forEach((marker, i) => {
          const entry = entryRefs.current[i];
          if (!entry) return;
          ScrollTrigger.create({
            trigger:     entry,
            start:       'top 60%',
            end:         'bottom 40%',
            onEnter:     () => gsap.to(marker, { scale: 1.7, opacity: 1,    duration: 0.35 }),
            onLeave:     () => gsap.to(marker, { scale: 1,   opacity: 0.35, duration: 0.35 }),
            onEnterBack: () => gsap.to(marker, { scale: 1.7, opacity: 1,    duration: 0.35 }),
            onLeaveBack: () => gsap.to(marker, { scale: 1,   opacity: 0.35, duration: 0.35 }),
          });
        });

        /* ── Text animations per entry ──────────────────── */
        entryRefs.current.forEach((entry) => {
          if (!entry) return;

          const isRight = entry.dataset.align === 'right';
          const orgEl   = entry.querySelector<HTMLElement>('.jt-org');
          const descEl  = entry.querySelector<HTMLElement>('.jt-desc');
          const titleEl = entry.querySelector<HTMLElement>('.jt-title');
          const tagsEl  = entry.querySelector<HTMLElement>('.jt-tags');
          const metaEl  = entry.querySelector<HTMLElement>('.jt-meta');

          /* Meta row — slides in from the content side */
          if (metaEl) {
            gsap.from(metaEl, {
              x:        isRight ? 80 : -80,
              opacity:  0,
              duration: 0.75,
              ease:     'power3.out',
              scrollTrigger: {
                trigger:       entry,
                start:         'clamp(top 82%)',
                toggleActions: 'play none none reverse',
              },
            });
          }

          /* Title — gradient, plain y+opacity (no SplitText — webkit-clip conflict) */
          if (titleEl) {
            gsap.from(titleEl, {
              y:        80,
              opacity:  0,
              duration: 1.1,
              ease:     'expo.out',
              scrollTrigger: {
                trigger:       entry,
                start:         'clamp(top 78%)',
                toggleActions: 'play none none reverse',
              },
            });
          }

          /* Org name — SplitText chars with 3D flip-in */
          if (orgEl) {
            const split = new SplitText(orgEl, { type: 'chars,words' });
            gsap.from(split.chars, {
              opacity:   0,
              y:         18,
              rotationX: -70,
              stagger:   0.018,
              duration:  0.5,
              ease:      'back.out(1.5)',
              scrollTrigger: {
                trigger:       entry,
                start:         'clamp(top 74%)',
                toggleActions: 'play none none reverse',
              },
            });
          }

          /* Description — scrubbed line mask */
          if (descEl) {
            const split = new SplitText(descEl, { type: 'lines', mask: 'lines' });
            gsap.from(split.lines, {
              yPercent: 120,
              stagger:  0.04,
              scrollTrigger: {
                trigger: entry,
                scrub:   true,
                start:   'clamp(top 68%)',
                end:     'clamp(top 28%)',
              },
            });
          }

          /* Tags — scale pop with back easing */
          if (tagsEl) {
            gsap.from(tagsEl.children, {
              scale:    0.4,
              opacity:  0,
              y:        10,
              stagger:  0.06,
              duration: 0.45,
              ease:     'back.out(2.2)',
              scrollTrigger: {
                trigger:       entry,
                start:         'clamp(top 48%)',
                toggleActions: 'play none none reverse',
              },
            });
          }
        });

      }, sectionRef);
    };

    /* ─── Init after fonts, attach resize handler (CodePen pattern) ─── */
    document.fonts.ready.then(() => {
      if (cancelled) return;
      setup();

      handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setup, 200);
      };
      window.addEventListener('resize', handleResize);
    });

    return () => {
      cancelled = true;
      clearTimeout(resizeTimer);
      if (handleResize) window.removeEventListener('resize', handleResize);
      ctx?.revert();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries.length]);

  const isLoading = eduLoading || expLoading;

  /* Refresh ScrollTrigger once content loads */
  useEffect(() => {
    if (!isLoading) ScrollTrigger.refresh();
  }, [isLoading]);

  /* Galaxy visibility */
  useEffect(() => {
    const container = galaxyContainerRef.current;
    const section   = sectionRef.current;
    if (!container) return;

    gsap.set(container, { autoAlpha: 0 });
    if (isLoading || !section) return;

    const st = ScrollTrigger.create({
      trigger:     section,
      start:       'top 30%',
      end:         'bottom 50%',
      onEnter:     () => gsap.to(container, { autoAlpha: 1, duration: 0.6 }),
      onLeave:     () => gsap.to(container, { autoAlpha: 0, duration: 0.6 }),
      onEnterBack: () => gsap.to(container, { autoAlpha: 1, duration: 0.6 }),
      onLeaveBack: () => gsap.to(container, { autoAlpha: 0, duration: 0.6 }),
    });

    return () => st.kill();
  }, [isLoading]);

  /* ════════════════════════════════════════════════════
     RENDER
     ═════════════════════════════════════════════════ */
  return (
    <>
      {/* ── Galaxy — fixed, centered, large ── */}
      <div
        ref={galaxyContainerRef}
        style={{
          position:      'fixed',
          top:           '50%',
          left:          '50%',
          transform:     'translate(-50%, -50%)',
          width:         '74vw',
          maxWidth:      '960px',
          height:        '74vh',
          pointerEvents: 'none',
          zIndex:        3,
        }}
      >
        {!isLoading && (
          <Suspense fallback={null}>
            <Galaxy scrollProgressRef={scrollProgressRef} />
          </Suspense>
        )}
      </div>

      {/* ── Section — always in DOM (GSAP pin-spacer safety) ── */}
      <section
        ref={sectionRef}
        id="journey"
        style={{ position: 'relative', background: 'var(--space-bg)', overflow: 'hidden' }}
      >
        {/* Starfield background */}
        <Suspense fallback={null}>
          <StarField />
        </Suspense>

        {!isLoading && (
          <div style={{ position: 'relative', zIndex: 10, padding: '15vh 0 22vh' }}>

            {/* ── Section header ── */}
            <div style={{ padding: '4vh 6vw 0', marginBottom: '14vh' }}>
              <span style={{
                display:       'block',
                fontSize:      '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.24em',
                color:          ACCENT,
                marginBottom:  '1rem',
              }}>
                Mi historia
              </span>
              <h2 style={{
                fontSize:             'clamp(2.5rem, 6vw, 5rem)',
                fontWeight:           700,
                background:          'linear-gradient(135deg, var(--space-text) 0%, var(--space-accent) 55%, var(--space-accent-2) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
                maxWidth:             '14ch',
              }}>
                Educación &amp; Experiencia
              </h2>
            </div>

            {/* ── Timeline container — cursor is absolute inside here ── */}
            <div style={{ position: 'relative' }}>

              {/* MotionPath cursor — glowing orb that zigzags between markers */}
              <div
                ref={cursorRef}
                style={{
                  position:      'absolute',
                  top:           0,
                  left:          0,
                  width:         '22px',
                  height:        '22px',
                  borderRadius:  '50%',
                  background:    'radial-gradient(circle, #e879f9 0%, #a855f7 55%, transparent 100%)',
                  boxShadow:     '0 0 10px 3px rgba(168,85,247,0.75), 0 0 28px 8px rgba(168,85,247,0.35)',
                  opacity:       0,
                  pointerEvents: 'none',
                  zIndex:        20,
                  transform:     'translate(-50%, -50%)',
                }}
              />

              {/* ── Entries ── */}
              {entries.map((entry, i) => {
                const isLeft   = i % 2 === 0;
                const isEdu    = entry.type === 'education';
                const dotColor = isEdu ? ACCENT : ACCENT2;

                /* Gradient veil: dark on the text side, transparent toward center */
                const veilBg = isLeft
                  ? 'linear-gradient(to right, rgba(0,0,5,0.82) 0%, rgba(0,0,5,0.55) 60%, transparent 100%)'
                  : 'linear-gradient(to left,  rgba(0,0,5,0.82) 0%, rgba(0,0,5,0.55) 60%, transparent 100%)';

                return (
                  <div
                    key={entry.id}
                    ref={el => { entryRefs.current[i] = el; }}
                    data-align={isLeft ? 'left' : 'right'}
                    style={{
                      position:       'relative',
                      minHeight:      '90vh',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: isLeft ? 'flex-start' : 'flex-end',
                      paddingTop:     '7vh',
                      paddingBottom:  '10vh',
                      borderBottom:   i < entries.length - 1
                        ? '1px solid rgba(255,255,255,0.04)'
                        : 'none',
                    }}
                  >
                    {/* Marker dot — MotionPath cursor travels to these */}
                    <div
                      ref={el => { markerRefs.current[i] = el; }}
                      style={{
                        position:     'absolute',
                        ...(isLeft ? { left: '24vw' } : { right: '24vw' }),
                        top:          '50%',
                        transform:    'translateY(-50%)',
                        width:        '12px',
                        height:       '12px',
                        borderRadius: '50%',
                        background:    dotColor,
                        boxShadow:    `0 0 10px 2px ${isEdu ? 'rgba(168,85,247,0.6)' : 'rgba(6,182,212,0.6)'}`,
                        border:       `2px solid ${isEdu ? 'rgba(168,85,247,0.5)' : 'rgba(6,182,212,0.5)'}`,
                        opacity:      0.35,
                        zIndex:       5,
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Content block with gradient veil */}
                    <div style={{
                      width:         'min(46vw, 600px)',
                      background:     veilBg,
                      paddingTop:    '2.5rem',
                      paddingBottom: '2.5rem',
                      paddingLeft:   isLeft ? '5rem' : '3rem',
                      paddingRight:  isLeft ? '3rem' : '5rem',
                    }}>

                      {/* Meta row: category tag + period */}
                      <div
                        className="jt-meta"
                        style={{
                          display:        'flex',
                          alignItems:     'center',
                          flexWrap:       'wrap',
                          gap:            '0.75rem',
                          marginBottom:   '2.2rem',
                          justifyContent: isLeft ? 'flex-start' : 'flex-end',
                        }}
                      >
                        <span style={{
                          fontSize:      '0.7rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.2em',
                          color:          dotColor,
                          background:    isEdu ? 'rgba(168,85,247,0.1)' : 'rgba(6,182,212,0.1)',
                          border:        `1px solid ${isEdu ? 'rgba(168,85,247,0.3)' : 'rgba(6,182,212,0.3)'}`,
                          padding:       '4px 14px',
                          borderRadius:  '999px',
                        }}>
                          {isEdu ? 'Educación' : 'Experiencia'}
                        </span>
                        <span style={{
                          fontSize:           '0.85rem',
                          color:               TEXT_DIM,
                          fontVariantNumeric: 'tabular-nums',
                        }}>
                          {entry.period}
                        </span>
                      </div>

                      {/* Org name */}
                      <p
                        className="jt-org"
                        style={{
                          fontSize:     'clamp(0.9rem, 1.6vw, 1.05rem)',
                          color:         TEXT_DIM,
                          fontWeight:   500,
                          marginBottom: '0.8rem',
                          textAlign:     isLeft ? 'left' : 'right',
                        }}
                        dangerouslySetInnerHTML={{ __html: entry.org }}
                      />

                      {/* Title */}
                      <h3
                        className="jt-title"
                        style={{
                          fontSize:             'clamp(1.6rem, 3.2vw, 3rem)',
                          fontWeight:           700,
                          lineHeight:           1.1,
                          marginBottom:         '1.8rem',
                          background:          'linear-gradient(135deg, var(--space-text) 0%, var(--space-accent) 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor:  'transparent',
                          backgroundClip:       'text',
                          textAlign:             isLeft ? 'left' : 'right',
                        }}
                      >
                        {entry.title}
                      </h3>

                      {/* Location */}
                      <p style={{
                        fontSize:       '0.85rem',
                        color:           TEXT_DIM,
                        marginBottom:   '1.5rem',
                        display:        'flex',
                        alignItems:     'center',
                        gap:            '0.4rem',
                        justifyContent: isLeft ? 'flex-start' : 'flex-end',
                      }}>
                        <span aria-hidden>📍</span>
                        <span>{entry.location}</span>
                      </p>

                      {/* Description */}
                      <p
                        className="jt-desc"
                        style={{
                          fontSize:     'clamp(0.95rem, 1.5vw, 1.05rem)',
                          lineHeight:   1.85,
                          color:         TEXT,
                          opacity:      0.85,
                          marginBottom: '1.5rem',
                          textAlign:     isLeft ? 'left' : 'right',
                        }}
                        dangerouslySetInnerHTML={{ __html: entry.description }}
                      />

                      {/* Tech tags */}
                      {entry.tags.length > 0 && (
                        <div
                          className="jt-tags"
                          style={{
                            display:        'flex',
                            flexWrap:       'wrap',
                            gap:            '8px',
                            marginTop:      '1.2rem',
                            justifyContent: isLeft ? 'flex-start' : 'flex-end',
                          }}
                        >
                          {entry.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize:     '0.78rem',
                                padding:      '4px 13px',
                                borderRadius: '999px',
                                background:   'rgba(168,85,247,0.08)',
                                color:          ACCENT,
                                border:       '1px solid rgba(168,85,247,0.22)',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </section>
    </>
  );
};

export default JourneySection;
