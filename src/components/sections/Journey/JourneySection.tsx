/**
 * JourneySection.tsx
 *
 * Horizontal-scroll timeline for Education + Experience.
 *
 * Layout (CodePen "labelsDirectional" style):
 *  - Each entry is a 100vw panel, panels slide left via GSAP ScrollTrigger pin+scrub
 *  - Galaxy fixed and centered behind all content (unchanged)
 *  - StarField background (unchanged)
 *
 * Cursor animation:
 *  - MotionPathPlugin animates a glowing orb left→right along horizontal markers
 *  - Scrubbed to the same ScrollTrigger that drives horizontal scroll
 *
 * Text animations:
 *  - SplitText chars — org names reveal letter-by-letter with rotationX
 *  - Gradient titles — gsap.from y + opacity
 *  - Meta row        — slides in from top
 *  - Tags            — scale + opacity pop with back easing
 *  - Description     — fade up
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
  const containerRef       = useRef<HTMLDivElement>(null);
  const cursorRef          = useRef<HTMLDivElement>(null);
  const trackRef           = useRef<HTMLDivElement>(null);
  const entryRefs          = useRef<(HTMLDivElement | null)[]>([]);
  const markerRefs         = useRef<(HTMLDivElement | null)[]>([]);
  const scrollProgressRef  = useRef<number>(0);
  const galaxyContainerRef = useRef<HTMLDivElement>(null);
  const ctxRef             = useRef<gsap.Context | null>(null);

  /* Total panels = 1 intro panel + N entry panels */
  const totalPanels = entries.length + 1;

  /* ── GSAP setup ───────────────────────────────────── */
  useEffect(() => {
    if (!entries.length || !sectionRef.current || !containerRef.current) return;

    let cancelled    = false;
    let handleResize: (() => void) | undefined;
    let resizeTimer: ReturnType<typeof setTimeout>;

    const setup = () => {
      ctxRef.current?.revert();
      if (cancelled || !sectionRef.current || !containerRef.current) return;

      ctxRef.current = gsap.context(() => {
        const panels = gsap.utils.toArray<HTMLElement>('.journey-panel');
        const count  = panels.length - 1;
        if (count < 1) return;

        /* ── Horizontal scroll timeline (CodePen style) ── */
        const mainTl = gsap.timeline({
          scrollTrigger: {
            trigger:             containerRef.current,
            pin:                 true,
            scrub:               1,
            snap:                'labelsDirectional',
            end:                 () => '+=' + containerRef.current!.offsetWidth,
            invalidateOnRefresh: true,
            onUpdate:            (self) => { scrollProgressRef.current = self.progress; },
          },
        });

        // Add labels at each panel position
        panels.forEach((_, i) => {
          mainTl.add('label' + i, i * (1 / count));
        });

        mainTl.to(panels, {
          xPercent: -100 * count,
          duration: 1,
          ease:     'none',
        });

        /* ── Cursor waypoint animation (horizontal) ── */
        const validMarkers = markerRefs.current.filter(Boolean) as HTMLDivElement[];
        if (validMarkers.length && cursorRef.current && trackRef.current) {
          const cursor = cursorRef.current;
          const track  = trackRef.current;

          gsap.set(cursor, { xPercent: -50, yPercent: -50, x: 0, y: 0, opacity: 0 });

          const trackRect = track.getBoundingClientRect();
          const originX   = trackRect.left;
          const originY   = trackRect.top;

          const points = validMarkers.map(marker => {
            const r = marker.getBoundingClientRect();
            return {
              x: (r.left + r.width  / 2) - originX,
              y: (r.top  + r.height / 2) - originY,
            };
          });

          gsap.set(cursor, { x: points[0].x, y: points[0].y, opacity: 1 });

          /* Continuous pulse */
          gsap.to(cursor, {
            scale:    1.4,
            duration: 1.1,
            repeat:   -1,
            yoyo:     true,
            ease:     'sine.inOut',
          });

          /* Cursor follows markers via MotionPath, scrubbed to main timeline */
          if (points.length > 1) {
            const cursorTl = gsap.timeline({
              scrollTrigger: {
                trigger: containerRef.current,
                start:   'top top',
                end:     () => '+=' + containerRef.current!.offsetWidth,
                scrub:   1.5,
              },
            });

            cursorTl.to(cursor, {
              duration:   1,
              ease:       'none',
              motionPath: {
                path:      points.slice(1),
                curviness: 0.5,
              },
            });
          }

          /* Marker activation — pulse on active panel */
          validMarkers.forEach((marker, i) => {
            const progress     = i / count;
            const progressEnd  = (i + 1) / count;
            ScrollTrigger.create({
              trigger:     containerRef.current,
              start:       'top top',
              end:         () => '+=' + containerRef.current!.offsetWidth,
              onUpdate:    (self) => {
                const p = self.progress;
                if (p >= progress && p < progressEnd) {
                  gsap.to(marker, { scale: 1.7, opacity: 1, duration: 0.35 });
                } else {
                  gsap.to(marker, { scale: 1, opacity: 0.35, duration: 0.35 });
                }
              },
            });
          });
        }

        /* ── Galaxy visibility — only while Journey section is pinned ── */
        const galaxyEl = galaxyContainerRef.current;
        if (galaxyEl) {
          gsap.set(galaxyEl, { autoAlpha: 0 });
          ScrollTrigger.create({
            trigger:     containerRef.current,
            start:       'top top',
            end:         () => '+=' + containerRef.current!.offsetWidth,
            onEnter:     () => gsap.to(galaxyEl, { autoAlpha: 1, duration: 0.8 }),
            onLeave:     () => gsap.to(galaxyEl, { autoAlpha: 0, duration: 0.4 }),
            onEnterBack: () => gsap.to(galaxyEl, { autoAlpha: 1, duration: 0.8 }),
            onLeaveBack: () => gsap.to(galaxyEl, { autoAlpha: 0, duration: 0.4 }),
          });
        }

        /* ── Per-panel text reveal animations ── */
        entryRefs.current.forEach((entry) => {
          if (!entry) return;

          const orgEl   = entry.querySelector<HTMLElement>('.jt-org');
          const descEl  = entry.querySelector<HTMLElement>('.jt-desc');
          const titleEl = entry.querySelector<HTMLElement>('.jt-title');
          const tagsEl  = entry.querySelector<HTMLElement>('.jt-tags');
          const metaEl  = entry.querySelector<HTMLElement>('.jt-meta');

          /* We use containerScrollTrigger-based progress checks.
             Since all panels are visible at mount, we trigger text animations
             when each panel is centered in the viewport. We use toggleActions
             with the entry as trigger within the horizontal scroll context.   */

          if (metaEl) {
            gsap.from(metaEl, {
              y: -40, opacity: 0, duration: 0.7, ease: 'power3.out',
              scrollTrigger: {
                trigger: entry,
                containerAnimation: mainTl,
                start: 'left 80%',
                toggleActions: 'play none none reverse',
              },
            });
          }

          if (titleEl) {
            gsap.from(titleEl, {
              y: 60, opacity: 0, duration: 1, ease: 'expo.out',
              scrollTrigger: {
                trigger: entry,
                containerAnimation: mainTl,
                start: 'left 75%',
                toggleActions: 'play none none reverse',
              },
            });
          }

          if (orgEl) {
            const split = new SplitText(orgEl, { type: 'chars,words' });
            gsap.from(split.chars, {
              opacity: 0, y: 18, rotationX: -70,
              stagger: 0.018, duration: 0.5, ease: 'back.out(1.5)',
              scrollTrigger: {
                trigger: entry,
                containerAnimation: mainTl,
                start: 'left 70%',
                toggleActions: 'play none none reverse',
              },
            });
          }

          if (descEl) {
            gsap.from(descEl, {
              y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
              scrollTrigger: {
                trigger: entry,
                containerAnimation: mainTl,
                start: 'left 65%',
                toggleActions: 'play none none reverse',
              },
            });
          }

          if (tagsEl) {
            gsap.from(tagsEl.children, {
              scale: 0.4, opacity: 0, y: 10,
              stagger: 0.06, duration: 0.45, ease: 'back.out(2.2)',
              scrollTrigger: {
                trigger: entry,
                containerAnimation: mainTl,
                start: 'left 55%',
                toggleActions: 'play none none reverse',
              },
            });
          }
        });

      }, sectionRef);
    };

    document.fonts.ready.then(() => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      setup();

      handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setup, 250);
      };
      window.addEventListener('resize', handleResize);
    });

    return () => {
      cancelled = true;
      clearTimeout(resizeTimer);
      if (handleResize) window.removeEventListener('resize', handleResize);
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries.length]);

  const isLoading = eduLoading || expLoading;

  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => ScrollTrigger.refresh(), 200);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  /* Galaxy initial hidden state — visibility now managed by main GSAP context */
  useEffect(() => {
    const container = galaxyContainerRef.current;
    if (container) gsap.set(container, { autoAlpha: 0 });
  }, []);

  /* ════════════════════════════════════════════════════
     RENDER
     ═════════════════════════════════════════════════ */
  return (
    <>
      {/* ── Galaxy — fixed, centered, large ── */}
      <div
        ref={galaxyContainerRef}
        className="journey-galaxy-container"
        style={{
          position:      'fixed',
          top:           '50%',
          left:          '50%',
          transform:     'translate(-50%, -50%)',
          width:         'min(90vw, 960px)',
          height:        '80vh',
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

      {/* ── Section wrapper ── */}
      <section
        ref={sectionRef}
        id="journey"
        style={{ position: 'relative', background: 'var(--space-bg)', overflow: 'hidden' }}
      >
        {/* Starfield background */}
        <Suspense fallback={null}>
          <StarField />
        </Suspense>

        {/* Horizontal container — pinned, panels flex side by side */}
        <div
          ref={containerRef}
          style={{
            width:      `${totalPanels * 100}vw`,
            height:     '100vh',
            display:    'flex',
            flexWrap:   'nowrap',
            position:   'relative',
          }}
        >
          {/* ── Waypoint track — spans full container width, holds cursor + markers ── */}
          <div
            ref={trackRef}
            style={{
              position:      'absolute',
              bottom:        '6vh',
              left:          '10vw',
              right:         '10vw',
              height:        '40px',
              zIndex:        20,
              pointerEvents: 'none',
              display:       isLoading ? 'none' : 'block',
            }}
          >
            {/* Horizontal track line */}
            <div style={{
              position:   'absolute',
              top:        '50%',
              left:       0,
              right:      0,
              height:     '1px',
              background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.15) 10%, rgba(255,255,255,0.15) 90%, transparent 100%)',
            }} />

            {/* Cursor orb */}
            <div
              ref={cursorRef}
              style={{
                position:      'absolute',
                top:           '50%',
                left:          0,
                width:         '22px',
                height:        '22px',
                borderRadius:  '50%',
                background:    'radial-gradient(circle, #ffffff 0%, #d4d4d4 55%, transparent 100%)',
                boxShadow:     '0 0 10px 3px rgba(255,255,255,0.55), 0 0 28px 8px rgba(255,255,255,0.2)',
                opacity:       0,
                pointerEvents: 'none',
                zIndex:        25,
              }}
            />

            {/* Marker dots — evenly spaced along the track */}
            {entries.map((entry, i) => {
              const isEdu    = entry.type === 'education';
              const dotColor = isEdu ? ACCENT : ACCENT2;
              // Distribute markers evenly: offset by 1 to skip intro panel
              const leftPct  = ((i + 1) / totalPanels) * 100;

              return (
                <div
                  key={entry.id}
                  ref={el => { markerRefs.current[i] = el; }}
                  style={{
                    position:      'absolute',
                    left:          `${leftPct}%`,
                    top:           '50%',
                    transform:     'translate(-50%, -50%)',
                    width:         '12px',
                    height:        '12px',
                    borderRadius:  '50%',
                    background:     dotColor,
                    boxShadow:     `0 0 10px 2px ${isEdu ? 'rgba(220,220,220,0.5)' : 'rgba(140,140,140,0.5)'}`,
                    border:        `2px solid ${isEdu ? 'rgba(210,210,210,0.4)' : 'rgba(130,130,130,0.4)'}`,
                    opacity:       0.35,
                    zIndex:        5,
                    pointerEvents: 'none',
                  }}
                />
              );
            })}
          </div>

          {/* ── Panel 0: Intro / Section header ── */}
          <div
            className="journey-panel"
            style={{
              width:          '100vw',
              height:         '100vh',
              flexShrink:     0,
              display:        'flex',
              flexDirection:  'column',
              justifyContent: 'center',
              padding:        '0 8vw',
              position:       'relative',
              zIndex:         10,
            }}
          >
            <span style={{
              display:       'block',
              fontSize:      '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.24em',
              color:          ACCENT,
              marginBottom:  '1.5rem',
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
              lineHeight:           1.1,
              margin:               0,
            }}>
              Educación &amp; Experiencia
            </h2>
            <p style={{
              marginTop:  '2rem',
              fontSize:   '1rem',
              color:       TEXT_DIM,
              maxWidth:   '38ch',
              lineHeight: 1.7,
            }}>
              Scroll para explorar mi trayectoria académica y profesional.
            </p>
            {/* Scroll hint arrow */}
            <div style={{
              marginTop:  '4rem',
              display:    'flex',
              alignItems: 'center',
              gap:        '0.6rem',
              color:       ACCENT2,
              fontSize:   '0.8rem',
            }}>
              <span>→</span>
              <span style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
            </div>
          </div>

          {/* ── Entry panels ── */}
          {!isLoading && entries.map((entry, i) => {
            const isEdu    = entry.type === 'education';
            const dotColor = isEdu ? ACCENT : ACCENT2;

            return (
              <div
                key={entry.id}
                ref={el => { entryRefs.current[i] = el; }}
                className="journey-panel"
                style={{
                  width:          '100vw',
                  height:         '100vh',
                  flexShrink:     0,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  position:       'relative',
                  zIndex:         10,
                }}
              >
                {/* Content card with dark veil */}
                <div style={{
                  width:           'min(72vw, 700px)',
                  background:     'linear-gradient(135deg, rgba(0,0,5,0.78) 0%, rgba(0,0,5,0.55) 100%)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border:         '1px solid rgba(255,255,255,0.06)',
                  borderRadius:   '16px',
                  padding:        'clamp(2rem, 4vw, 3.5rem)',
                }}>

                  {/* Meta row: category tag + period */}
                  <div
                    className="jt-meta"
                    style={{
                      display:      'flex',
                      alignItems:   'center',
                      flexWrap:     'wrap',
                      gap:          '0.75rem',
                      marginBottom: '1.8rem',
                    }}
                  >
                    <span style={{
                      fontSize:      '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color:          dotColor,
                      background:    isEdu ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)',
                      border:        `1px solid ${isEdu ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.12)'}`,
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
                      fontSize:     'clamp(0.9rem, 1.4vw, 1.05rem)',
                      color:         TEXT_DIM,
                      fontWeight:   500,
                      marginBottom: '0.6rem',
                      margin:       0,
                    }}
                    dangerouslySetInnerHTML={{ __html: entry.org }}
                  />

                  {/* Title */}
                  <h3
                    className="jt-title"
                    style={{
                      fontSize:             'clamp(1.6rem, 3vw, 2.8rem)',
                      fontWeight:           700,
                      lineHeight:           1.1,
                      margin:               '0.8rem 0 1.4rem',
                      background:          'linear-gradient(135deg, var(--space-text) 0%, var(--space-accent) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor:  'transparent',
                      backgroundClip:       'text',
                    }}
                  >
                    {entry.title}
                  </h3>

                  {/* Location */}
                  <p style={{
                    fontSize:     '0.85rem',
                    color:         TEXT_DIM,
                    marginBottom: '1.2rem',
                    display:      'flex',
                    alignItems:   'center',
                    gap:          '0.4rem',
                  }}>
                    <span aria-hidden>📍</span>
                    <span>{entry.location}</span>
                  </p>

                  {/* Description */}
                  <p
                    className="jt-desc"
                    style={{
                      fontSize:     'clamp(0.9rem, 1.3vw, 1rem)',
                      lineHeight:   1.8,
                      color:         TEXT,
                      opacity:      0.85,
                      marginBottom: '1.2rem',
                    }}
                    dangerouslySetInnerHTML={{ __html: entry.description }}
                  />

                  {/* Tech tags */}
                  {entry.tags.length > 0 && (
                    <div
                      className="jt-tags"
                      style={{
                        display:   'flex',
                        flexWrap:  'wrap',
                        gap:       '8px',
                        marginTop: '1rem',
                      }}
                    >
                      {entry.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize:     '0.78rem',
                            padding:      '4px 13px',
                            borderRadius: '999px',
                            background:   'rgba(255,255,255,0.05)',
                            color:          ACCENT,
                            border:       '1px solid rgba(255,255,255,0.14)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Panel number indicator */}
                <span style={{
                  position:   'absolute',
                  top:        '3vh',
                  right:      '4vw',
                  fontSize:   'clamp(6rem, 18vw, 14rem)',
                  fontWeight: 700,
                  color:      'rgba(255,255,255,0.03)',
                  lineHeight: 1,
                  pointerEvents: 'none',
                  zIndex:     -1,
                }}>
                  {i + 1}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default JourneySection;
