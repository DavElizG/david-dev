/**
 * JourneySection.tsx
 *
 * Horizontal-scroll timeline for Education + Experience.
 *
 * Layout (CodePen "labelsDirectional" style):
 *  - Each entry is a 100vw panel, panels slide left via GSAP ScrollTrigger pin+scrub
 *  - Galaxy fixed and centered behind all content
 *  - StarField background
 *
 * Cursor animation:
 *  - MotionPathPlugin animates a glowing orb leftâ†’right along horizontal markers
 *  - Scrubbed to the same ScrollTrigger that drives horizontal scroll
 *
 * Text animations:
 *  - SplitText chars â€” org names reveal letter-by-letter with rotationX
 *  - Gradient titles â€” gsap.from y + opacity
 *  - Meta row        â€” slides in from top
 *  - Tags            â€” scale + opacity pop with back easing
 *  - Description     â€” fade up
 */
import { useEffect, useRef, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger }    from 'gsap/ScrollTrigger';
import { SplitText }        from 'gsap/SplitText';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useEducation, useExperience } from '../../../hooks';
import { useTheme } from '../../../context';
import type { JourneyEntry } from './journey.types';
import TrackLine  from './TrackLine';
import IntroPanel from './IntroPanel';
import EntryPanel from './EntryPanel';

const Galaxy    = lazy(() => import('../../3d/Galaxy'));
const StarField = lazy(() => import('../../3d/StarField'));

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin);

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

const JourneySection = () => {
  const { darkMode } = useTheme();
  const { education, loading: eduLoading } = useEducation();
  const { experience, loading: expLoading } = useExperience();

  /* â”€â”€ Merge entries: education first, then experience â”€â”€ */
  const entries: JourneyEntry[] = [
    ...(education?.map(ed => ({
      id:          `edu-${ed.id_education}`,
      type:        'education' as const,
      title:       ed.degree,
      org:         ed.institution,
      location:    ed.location,
      period:      `${ed.startDate} \u2013 ${ed.endDate}`,
      description: ed.description,
      tags:        [] as string[],
    })) ?? []),
    ...(experience?.map(ex => ({
      id:          `exp-${ex.id_experience}`,
      type:        'experience' as const,
      title:       ex.role,
      org:         ex.company,
      location:    ex.location,
      period:      `${ex.startDate} \u2013 ${ex.endDate}`,
      description: ex.description,
      tags:        ex.technologies ?? [],
    })) ?? []),
  ];

  /* â”€â”€ Refs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const sectionRef         = useRef<HTMLElement>(null);
  const containerRef       = useRef<HTMLDivElement>(null);
  const cursorRef          = useRef<HTMLDivElement>(null);
  const trackRef           = useRef<HTMLDivElement>(null);
  const entryRefs          = useRef<(HTMLDivElement | null)[]>([]);
  const markerRefs         = useRef<(HTMLDivElement | null)[]>([]);
  const scrollProgressRef  = useRef<number>(0);
  const galaxyContainerRef = useRef<HTMLDivElement>(null);
  const ctxRef             = useRef<gsap.Context | null>(null);

  const totalPanels = entries.length + 1;

  /* â”€â”€ GSAP setup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

        /* â”€â”€ Horizontal scroll â”€â”€ */
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

        panels.forEach((_, i) => { mainTl.add('label' + i, i * (1 / count)); });

        mainTl.to(panels, { xPercent: -100 * count, duration: 1, ease: 'none' });

        /* â”€â”€ Cursor waypoint animation â”€â”€ */
        const validMarkers = markerRefs.current.filter(Boolean) as HTMLDivElement[];
        if (validMarkers.length && cursorRef.current && trackRef.current) {
          const cursor    = cursorRef.current;
          const track     = trackRef.current;
          const trackRect = track.getBoundingClientRect();

          gsap.set(cursor, { xPercent: -50, yPercent: -50, x: 0, y: 0, opacity: 0 });

          const points = validMarkers.map(marker => {
            const r = marker.getBoundingClientRect();
            return {
              x: (r.left + r.width  / 2) - trackRect.left,
              y: (r.top  + r.height / 2) - trackRect.top,
            };
          });

          gsap.set(cursor, { x: points[0].x, y: points[0].y, opacity: 1 });
          gsap.to(cursor, { scale: 1.4, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut' });

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
              duration: 1, ease: 'none',
              motionPath: { path: points.slice(1), curviness: 0.5 },
            });
          }

          validMarkers.forEach((marker, i) => {
            const progress    = i / count;
            const progressEnd = (i + 1) / count;
            ScrollTrigger.create({
              trigger:  containerRef.current,
              start:    'top top',
              end:      () => '+=' + containerRef.current!.offsetWidth,
              onUpdate: (self) => {
                const p = self.progress;
                const isActive = p >= progress && p < progressEnd;
                gsap.to(marker, { scale: isActive ? 1.7 : 1, opacity: isActive ? 1 : 0.35, duration: 0.35 });
              },
            });
          });
        }

        /* â”€â”€ Galaxy visibility â”€â”€ */
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

        /* â”€â”€ Per-panel text reveal â”€â”€ */
        entryRefs.current.forEach((entry) => {
          if (!entry) return;
          const metaEl  = entry.querySelector<HTMLElement>('.jt-meta');
          const titleEl = entry.querySelector<HTMLElement>('.jt-title');
          const orgEl   = entry.querySelector<HTMLElement>('.jt-org');
          const descEl  = entry.querySelector<HTMLElement>('.jt-desc');
          const tagsEl  = entry.querySelector<HTMLElement>('.jt-tags');

          const stOpts = (start: string) => ({
            trigger: entry,
            containerAnimation: mainTl,
            start,
            toggleActions: 'play none none reverse' as const,
          });

          if (metaEl)  gsap.from(metaEl,  { y: -40, opacity: 0, duration: 0.7, ease: 'power3.out',  scrollTrigger: stOpts('left 80%') });
          if (titleEl) gsap.from(titleEl, { y: 60,  opacity: 0, duration: 1,   ease: 'expo.out',    scrollTrigger: stOpts('left 75%') });
          if (descEl)  gsap.from(descEl,  { y: 40,  opacity: 0, duration: 0.9, ease: 'power3.out',  scrollTrigger: stOpts('left 65%') });

          if (orgEl) {
            const split = new SplitText(orgEl, { type: 'chars,words' });
            gsap.from(split.chars, {
              opacity: 0, y: 18, rotationX: -70,
              stagger: 0.018, duration: 0.5, ease: 'back.out(1.5)',
              scrollTrigger: stOpts('left 70%'),
            });
          }
          if (tagsEl) {
            gsap.from(tagsEl.children, {
              scale: 0.4, opacity: 0, y: 10,
              stagger: 0.06, duration: 0.45, ease: 'back.out(2.2)',
              scrollTrigger: stOpts('left 55%'),
            });
          }
        });

      }, sectionRef);
    };

    document.fonts.ready.then(() => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      setup();
      handleResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(setup, 250); };
      window.addEventListener('resize', handleResize);
    });

    return () => {
      cancelled = true;
      clearTimeout(resizeTimer);
      if (handleResize) window.removeEventListener('resize', handleResize);
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, [entries.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const isLoading = eduLoading || expLoading;

  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => ScrollTrigger.refresh(), 200);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  useEffect(() => {
    const container = galaxyContainerRef.current;
    if (container) gsap.set(container, { autoAlpha: 0 });
  }, []);

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     RENDER
     â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
  return (
    <>
      {/* Galaxy â€” fixed, centered */}
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

      <section
        ref={sectionRef}
        id="journey"
        style={{ position: 'relative', background: 'var(--space-bg)', overflow: 'hidden' }}
      >
        <Suspense fallback={null}>
          <StarField />
        </Suspense>

        <div
          ref={containerRef}
          style={{
            width:    `${totalPanels * 100}vw`,
            height:   '100vh',
            display:  'flex',
            flexWrap: 'nowrap',
            position: 'relative',
          }}
        >
          <TrackLine
            ref={trackRef}
            entries={entries}
            totalPanels={totalPanels}
            darkMode={darkMode}
            isLoading={isLoading}
            cursorRef={cursorRef}
            onMarkerMount={(i, el) => { markerRefs.current[i] = el; }}
          />

          <IntroPanel />

          {!isLoading && entries.map((entry, i) => (
            <EntryPanel
              key={entry.id}
              ref={el => { entryRefs.current[i] = el; }}
              entry={entry}
              index={i}
              darkMode={darkMode}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default JourneySection;
