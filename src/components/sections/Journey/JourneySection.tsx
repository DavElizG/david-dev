/**
 * JourneySection.tsx
 *
 * Vertical-scroll timeline for Education + Experience.
 *
 * Techniques:
 *  - GSAP Flip waypoints: a glowing cursor element is animated between
 *    per-entry dot markers using Flip.fit() inside a scrubbed timeline,
 *    exactly as in https://demos.gsap.com/demo/threejs-scroll-waypoints/
 *  - GSAP SplitText: organization names and descriptions are split into
 *    lines with a mask, then each line slides up on scroll (scrubbed),
 *    matching https://demos.gsap.com/demo/responsive-line-splits-on-scroll/
 *  - Large gradient titles use a plain gsap.from (opacity + y) so that
 *    webkit-background-clip: text does not conflict with SplitText wrappers.
 */
import { useEffect, useRef, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { useEducation } from '../../../hooks';
import { useExperience } from '../../../hooks';

const Atom = lazy(() => import('../../3d/Atom'));

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
const BORDER   = 'var(--space-border)';

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
  const sectionRef        = useRef<HTMLElement>(null);
  const cursorRef         = useRef<HTMLDivElement>(null);
  const entryRefs         = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs           = useRef<(HTMLDivElement | null)[]>([]);
  const scrollProgressRef = useRef<number>(0);

  /* ── GSAP setup ───────────────────────────────────── */
  useEffect(() => {
    const n = entries.length;
    if (!n || !sectionRef.current || !cursorRef.current) return;

    let cancelled = false;
    let ctx: gsap.Context | undefined;

    /* Wait for fonts before splitting text */
    document.fonts.ready.then(() => {
      if (cancelled || !sectionRef.current) return;

      ctx = gsap.context(() => {

        /* ────────────────────────────────────────────────
           1. FLIP WAYPOINTS
           ──────────────────────────────────────────────── */
        const validDots  = dotRefs.current.filter(Boolean) as HTMLDivElement[];
        const dotStates  = validDots.map(d => Flip.getState(d));

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
            onUpdate: (self) => {
              scrollProgressRef.current = self.progress;
            },
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

        /* Dot activation */
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
           2. SPLITTEXT — org name + description
           Uses dangerouslySetInnerHTML in JSX so React
           doesn't manage children that SplitText rewrites.
           ──────────────────────────────────────────────── */
        entryRefs.current.forEach((entry) => {
          if (!entry) return;

          const orgEl   = entry.querySelector<HTMLElement>('.jt-org');
          const descEl  = entry.querySelector<HTMLElement>('.jt-desc');
          const titleEl = entry.querySelector<HTMLElement>('.jt-title');
          const tagsEl  = entry.querySelector<HTMLElement>('.jt-tags');

          if (titleEl) {
            gsap.from(titleEl, {
              opacity: 0,
              y:       40,
              duration: 0.8,
              ease:    'power3.out',
              scrollTrigger: {
                trigger:       entry,
                start:         'clamp(top 75%)',
                toggleActions: 'play none none reverse',
              },
            });
          }

          if (orgEl) {
            const split = new SplitText(orgEl, { type: 'lines', mask: 'lines' });
            gsap.from(split.lines, {
              yPercent: 120,
              stagger:  0.06,
              scrollTrigger: {
                trigger: entry,
                scrub:   true,
                start:   'clamp(top 72%)',
                end:     'clamp(top 45%)',
              },
            });
          }

          if (descEl) {
            const split = new SplitText(descEl, { type: 'lines', mask: 'lines' });
            gsap.from(split.lines, {
              yPercent: 120,
              stagger:  0.04,
              scrollTrigger: {
                trigger: entry,
                scrub:   true,
                start:   'clamp(top 68%)',
                end:     'clamp(top 30%)',
              },
            });
          }

          if (tagsEl) {
            gsap.from(tagsEl.children, {
              opacity:  0,
              y:        12,
              stagger:  0.05,
              duration: 0.4,
              scrollTrigger: {
                trigger:       entry,
                start:         'clamp(top 50%)',
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

  /* ════════════════════════════════════════════════════
     RENDER — the <section> MUST always be in the DOM so
     React doesn't try to insert/remove siblings of the
     GSAP pin-spacer that wraps the pinned HeroSection.
     ═════════════════════════════════════════════════ */
  return (
    <section
      ref={sectionRef}
      id="journey"
      style={{ position: 'relative', background: 'var(--space-bg)', padding: isLoading ? 0 : '15vh 0 20vh' }}
    >
      {!isLoading && (
        <>
      {/* ── Section header with 3D Atom ── */}
      <div style={{
        position:     'relative',
        textAlign:    'center',
        marginBottom: '12vh',
        padding:      '0 1.5rem',
        minHeight:    '340px',
        display:      'flex',
        flexDirection: 'column',
        alignItems:   'center',
        justifyContent: 'center',
      }}>
        {/* Atom canvas — behind text */}
        <Suspense fallback={null}>
          <Atom scrollProgressRef={scrollProgressRef} />
        </Suspense>

        <span style={{
          position:      'relative',
          zIndex:        1,
          display:       'block',
          fontSize:      '0.72rem',
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          color:          ACCENT,
          marginBottom:  '1rem',
        }}>
          Mi historia
        </span>
        <h2 style={{
          position:             'relative',
          zIndex:               1,
          fontSize:             'clamp(2.5rem, 6vw, 5rem)',
          fontWeight:           700,
          background:          'linear-gradient(135deg, var(--space-text) 0%, var(--space-accent) 60%, var(--space-accent-2) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor:  'transparent',
          backgroundClip:       'text',
        }}>
          Educación &amp; Experiencia
        </h2>
      </div>

      {/* ── Timeline ── */}
      <div style={{
        position:     'relative',
        maxWidth:     '900px',
        margin:       '0 auto',
        paddingLeft:  '4rem',   /* space for the gutter */
        paddingRight: '1.5rem',
      }}>
        {/* Vertical line */}
        <div style={{
          position:   'absolute',
          left:       '1.5rem',
          top:        0,
          bottom:     0,
          width:      '2px',
          background: `linear-gradient(to bottom, ${ACCENT}, ${ACCENT2})`,
          opacity:    0.35,
        }} />

        {/* Flip cursor — the moving waypoint indicator */}
        <div
          ref={cursorRef}
          style={{
            position:     'absolute',
            left:         'calc(1.5rem - 11px)',  /* center on the line */
            top:          0,
            width:        '22px',
            height:       '22px',
            borderRadius: '50%',
            background:    ACCENT,
            boxShadow:    `0 0 14px ${ACCENT}, 0 0 32px rgba(168,85,247,0.45)`,
            zIndex:       10,
          }}
        />

        {/* ── Entries ── */}
        {entries.map((entry, i) => {
          const isEdu   = entry.type === 'education';
          const dotColor = isEdu ? ACCENT : ACCENT2;

          return (
            <div
              key={entry.id}
              ref={el => { entryRefs.current[i] = el; }}
              style={{
                position:     'relative',
                minHeight:    '70vh',
                paddingTop:   '6vh',
                paddingBottom: '10vh',
                borderBottom: i < entries.length - 1
                  ? `1px solid ${BORDER}`
                  : 'none',
              }}
            >
              {/* Dot waypoint marker */}
              <div
                ref={el => { dotRefs.current[i] = el; }}
                style={{
                  position:     'absolute',
                  left:         'calc(-4rem + 1.5rem - 5px)', /* aligns w/ line center */
                  top:          '6vh',
                  width:        '10px',
                  height:       '10px',
                  borderRadius: '50%',
                  background:    dotColor,
                  border:       `2px solid ${isEdu ? 'rgba(168,85,247,0.4)' : 'rgba(6,182,212,0.4)'}`,
                  opacity:      0.4,
                  zIndex:       5,
                }}
              />

              {/* Category tag + date */}
              <div style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                flexWrap:       'wrap',
                gap:            '0.5rem',
                marginBottom:   '2rem',
              }}>
                <span style={{
                  fontSize:      '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
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

              {/* Org — SplitText target (dangerouslySetInnerHTML prevents React/SplitText DOM conflict) */}
              <p
                className="jt-org"
                style={{
                  fontSize:     'clamp(0.9rem, 1.8vw, 1.1rem)',
                  color:         TEXT_DIM,
                  fontWeight:   500,
                  marginBottom: '0.75rem',
                }}
                dangerouslySetInnerHTML={{ __html: entry.org }}
              />

              {/* Title — gradient, fades in (no SplitText) */}
              <h3
                className="jt-title"
                style={{
                  fontSize:             'clamp(1.8rem, 4vw, 3.5rem)',
                  fontWeight:           700,
                  lineHeight:           1.1,
                  marginBottom:         '2rem',
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
                fontSize:     '0.88rem',
                color:         TEXT_DIM,
                marginBottom: '1.5rem',
                display:      'flex',
                alignItems:   'center',
                gap:          '0.4rem',
              }}>
                <span aria-hidden>📍</span>
                <span>{entry.location}</span>
              </p>

              {/* Description — SplitText target */}
              <p
                className="jt-desc"
                style={{
                  fontSize:     'clamp(1rem, 1.8vw, 1.1rem)',
                  lineHeight:   1.75,
                  color:         TEXT,
                  opacity:      0.82,
                  maxWidth:     '65ch',
                  marginBottom: '1.5rem',
                }}
                dangerouslySetInnerHTML={{ __html: entry.description }}
              />

              {/* Tech tags */}
              {entry.tags.length > 0 && (
                <div
                  className="jt-tags"
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1rem' }}
                >
                  {entry.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize:     '0.8rem',
                        padding:      '4px 14px',
                        borderRadius: '999px',
                        background:   'rgba(168,85,247,0.08)',
                        color:          ACCENT,
                        border:       '1px solid rgba(168,85,247,0.25)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
        </>
      )}
    </section>
  );
};

export default JourneySection;
