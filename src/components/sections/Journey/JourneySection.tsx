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
 * Animations (GSAP):
 *  1. Flip waypoints  — cursor tracks down left gutter (scrubbed)
 *  2. SplitText chars — org names reveal letter-by-letter with rotationX
 *  3. SplitText lines — description lines scrub-masked in
 *  4. Gradient titles — gsap.from y + opacity (no SplitText — webkit-clip conflict)
 *  5. Meta row        — slides in from the correct side per entry alignment
 *  6. Tags            — scale + opacity pop with back easing
 */
import { useEffect, useRef, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { useEducation } from '../../../hooks';
import { useExperience } from '../../../hooks';

const Galaxy    = lazy(() => import('../../3d/Galaxy'));
const StarField = lazy(() => import('../../3d/StarField'));

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

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
  const dotRefs            = useRef<(HTMLDivElement | null)[]>([]);
  const scrollProgressRef  = useRef<number>(0);
  const galaxyContainerRef = useRef<HTMLDivElement>(null);

  /* ── GSAP setup ───────────────────────────────────── */
  useEffect(() => {
    const n = entries.length;
    if (!n || !sectionRef.current || !cursorRef.current) return;

    let cancelled = false;
    let ctx: gsap.Context | undefined;

    document.fonts.ready.then(() => {
      if (cancelled || !sectionRef.current) return;

      ctx = gsap.context(() => {

        /* ────────────────────────────────────────────────
           1. FLIP WAYPOINTS — cursor tracks gutter dots
           ──────────────────────────────────────────────── */
        const validDots = dotRefs.current.filter(Boolean) as HTMLDivElement[];
        const dotStates = validDots.map(d => Flip.getState(d));

        if (dotStates[0]) {
          Flip.fit(cursorRef.current!, dotStates[0], { duration: 0, scale: false });
        }

        const flipTl = gsap.timeline({
          scrollTrigger: {
            trigger:             sectionRef.current,
            start:               'top top',
            end:                 'bottom bottom',
            scrub:               1.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => { scrollProgressRef.current = self.progress; },
          },
        });

        dotStates.forEach((state, i) => {
          if (i === 0) return;
          const fit = Flip.fit(cursorRef.current!, state, {
            duration: 1,
            ease:     'power1.inOut',
            scale:    false,
          });
          if (fit) flipTl.add(fit as gsap.core.Tween);
        });

        /* Dot activation pulse */
        validDots.forEach((dot, i) => {
          const entry = entryRefs.current[i];
          if (!entry) return;
          ScrollTrigger.create({
            trigger:     entry,
            start:       'top 60%',
            end:         'bottom 40%',
            onEnter:     () => gsap.to(dot, { scale: 1.6, opacity: 1,   duration: 0.35 }),
            onLeave:     () => gsap.to(dot, { scale: 1,   opacity: 0.4, duration: 0.35 }),
            onEnterBack: () => gsap.to(dot, { scale: 1.6, opacity: 1,   duration: 0.35 }),
            onLeaveBack: () => gsap.to(dot, { scale: 1,   opacity: 0.4, duration: 0.35 }),
          });
        });

        /* ────────────────────────────────────────────────
           2. TEXT ANIMATIONS per entry
           ──────────────────────────────────────────────── */
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

          /* Title — large gradient, plain y+opacity (no SplitText — webkit-clip conflict) */
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
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries.length]);

  const isLoading = eduLoading || expLoading;

  /* Refresh ScrollTrigger once content loads */
  useEffect(() => {
    if (!isLoading) ScrollTrigger.refresh();
  }, [isLoading]);

  /* Galaxy visibility — fades in/out as section enters/leaves viewport */
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
     RENDER — <section> always in DOM (GSAP pin-spacer safety)
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

      {/* ── Section — always in DOM ── */}
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

            {/* ── Timeline ── */}
            <div style={{ position: 'relative' }}>

              {/* Vertical gutter line */}
              <div style={{
                position:   'absolute',
                left:       '2.5rem',
                top:        0,
                bottom:     0,
                width:      '2px',
                background: `linear-gradient(to bottom, ${ACCENT}, ${ACCENT2})`,
                opacity:    0.28,
              }} />

              {/* Flip cursor */}
              <div
                ref={cursorRef}
                style={{
                  position:     'absolute',
                  left:         'calc(2.5rem - 11px)',
                  top:          0,
                  width:        '22px',
                  height:       '22px',
                  borderRadius: '50%',
                  background:    ACCENT,
                  boxShadow:    `0 0 14px ${ACCENT}, 0 0 36px rgba(168,85,247,0.45)`,
                  zIndex:       10,
                }}
              />

              {/* ── Entries ── */}
              {entries.map((entry, i) => {
                const isLeft   = i % 2 === 0;
                const isEdu    = entry.type === 'education';
                const dotColor = isEdu ? ACCENT : ACCENT2;

                /* Gradient veil: fades dark on text side → transparent toward center */
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
                    {/* Dot waypoint */}
                    <div
                      ref={el => { dotRefs.current[i] = el; }}
                      style={{
                        position:     'absolute',
                        left:         'calc(2.5rem - 5px)',
                        top:          '7vh',
                        width:        '10px',
                        height:       '10px',
                        borderRadius: '50%',
                        background:    dotColor,
                        border:       `2px solid ${isEdu ? 'rgba(168,85,247,0.4)' : 'rgba(6,182,212,0.4)'}`,
                        boxShadow:    `0 0 8px ${isEdu ? 'rgba(168,85,247,0.5)' : 'rgba(6,182,212,0.5)'}`,
                        opacity:      0.4,
                        zIndex:       5,
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
