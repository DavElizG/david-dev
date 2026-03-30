/**
 * Contact.tsx — ScrambleText + SplitText reveal
 *
 * Floating scramble quotes drift across the background.
 * Heading flies in with SplitText. Info and form fade up
 * with staggered ScrambleText reveals on scroll.
 */
import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { usePersonalInfo } from '../../../hooks';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import ContactForm from '../../common/ContactForm';
import ShootingStars from '../../3d/ShootingStars';
import { useLanguage } from '../../../context';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const SCRAMBLE_CHARS = 'upperAndLowerCase';

const Contact = () => {
  const { personalInfo, loading } = usePersonalInfo();
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const ctxRef     = useRef<gsap.Context | null>(null);
  const hasEntered = useRef(false);

  /** Launch a single quote's infinite scramble loop */
  const scrambleQuote = useCallback((el: HTMLElement, text: string) => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
    const section = sectionRef.current;
    if (!section) return tl;

    tl.call(() => {
      const rect = section.getBoundingClientRect();
      const x = Math.random() * (rect.width - 220);
      const y = Math.random() * (rect.height - 60);
      gsap.set(el, { x, y });
    })
      .to(el, {
        delay: Math.random() * 4,
        duration: 1,
        opacity: 1,
        scrambleText: { text, chars: SCRAMBLE_CHARS, revealDelay: 0.5, speed: 1 },
        ease: 'power2.out',
      })
      .to(el, {
        delay: 0.6,
        duration: 1,
        scrambleText: { text: '', chars: SCRAMBLE_CHARS },
        opacity: 0,
        ease: 'power2.in',
      });

    return tl;
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    let cancelled = false;

    const setup = () => {
      ctxRef.current?.revert();
      if (cancelled || !sectionRef.current) return;

      ctxRef.current = gsap.context(() => {
        const section = sectionRef.current!;

        /* ── Floating scramble quotes ── */
        section.querySelectorAll<HTMLElement>('.contact-quote').forEach((q) => {
          gsap.set(q, { position: 'absolute', opacity: 0, whiteSpace: 'nowrap' });
          scrambleQuote(q, q.dataset.text || '');
        });

        /* ── Reveal all content ── */
        const reveal = () => {
          if (hasEntered.current) return;
          hasEntered.current = true;

          /* ScrambleText + SplitText heading */
          const titleEl = section.querySelector<HTMLElement>('.contact-panel__title');
          if (titleEl) {
            const original = titleEl.textContent || '';
            // First scramble in, then fly chars from random positions
            gsap.to(titleEl, {
              duration: 0.8,
              scrambleText: { text: original, chars: SCRAMBLE_CHARS, revealDelay: 0, speed: 1.2 },
              onComplete: () => {
                titleEl.textContent = original;
                const split = new SplitText(titleEl, { type: 'chars,words' });
                gsap.fromTo(split.chars, {
                  x: 'random([-600, 600])',
                  y: 'random([-400, 400])',
                  opacity: 0,
                }, {
                  x: 0,
                  y: 0,
                  opacity: 1,
                  ease: 'expo.out',
                  duration: 1.2,
                  stagger: 0.04,
                  onComplete: () => split.revert(),
                });
              },
            });
          }

          /* Tag scramble */
          const tagEl = section.querySelector<HTMLElement>('.contact-panel__tag');
          if (tagEl) {
            const original = tagEl.textContent || '';
            gsap.set(tagEl, { opacity: 1 });
            gsap.to(tagEl, {
              duration: 1.2,
              scrambleText: { text: original, chars: SCRAMBLE_CHARS, revealDelay: 0.3, speed: 0.8 },
            });
          }

          /* Subtitle scramble */
          const subEl = section.querySelector<HTMLElement>('.contact-panel__sub');
          if (subEl) {
            const original = subEl.textContent || '';
            gsap.set(subEl, { opacity: 1 });
            gsap.to(subEl, {
              delay: 0.3,
              duration: 1.5,
              scrambleText: { text: original, chars: SCRAMBLE_CHARS, revealDelay: 0.4, speed: 0.6 },
            });
          }

          /* Info items fade up */
          gsap.fromTo(
            section.querySelectorAll('.contact-info-item'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, delay: 0.6, ease: 'power2.out' },
          );

          /* Form panel slide up */
          const formPanel = section.querySelector('.contact-panel--form');
          if (formPanel) {
            gsap.fromTo(formPanel,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' },
            );
          }

          /* HUD corners scale in */
          gsap.fromTo(section.querySelectorAll('.contact-hud__corner'),
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.7, stagger: 0.08, ease: 'back.out(2)' },
          );

          /* HUD lines draw in */
          gsap.fromTo(section.querySelectorAll('.contact-hud__line--h'),
            { scaleX: 0 },
            { scaleX: 1, duration: 1.2, stagger: 0.12, ease: 'power2.out' },
          );
          gsap.fromTo(section.querySelectorAll('.contact-hud__line--v'),
            { scaleY: 0 },
            { scaleY: 1, duration: 1.2, stagger: 0.12, ease: 'power2.out' },
          );

          /* Status indicator */
          gsap.fromTo(section.querySelector('.contact-status'),
            { opacity: 0, x: -15 },
            { opacity: 1, x: 0, duration: 0.8, delay: 0.8, ease: 'power2.out' },
          );

          /* Data stream cascade */
          gsap.fromTo(section.querySelectorAll('.contact-datastream__line'),
            { opacity: 0, y: -8 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, delay: 0.6, ease: 'power1.out' },
          );

          /* Grid overlay fade */
          gsap.fromTo(section.querySelector('.contact-grid-overlay'),
            { opacity: 0 },
            { opacity: 1, duration: 1.5, delay: 0.3, ease: 'power1.inOut' },
          );
        };

        /* ── ScrollTrigger fires reveal on scroll ── */
        ScrollTrigger.create({
          trigger: section,
          start: 'top 70%',
          once: true,
          onEnter: reveal,
        });

        /* Safety: if section is already in view or ST doesn't fire, reveal after 2s */
        setTimeout(reveal, 2000);
      }, sectionRef);
    };

    const timer = setTimeout(() => {
      if (!cancelled) { ScrollTrigger.refresh(); setup(); }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="contact" className="contact-section" ref={sectionRef}>
      <ShootingStars />

      {/* ── Scan-line overlay ── */}
      <div className="contact-scanlines" />

      {/* ── HUD frame corners + lines ── */}
      <div className="contact-hud" aria-hidden="true">
        <span className="contact-hud__corner contact-hud__corner--tl" />
        <span className="contact-hud__corner contact-hud__corner--tr" />
        <span className="contact-hud__corner contact-hud__corner--bl" />
        <span className="contact-hud__corner contact-hud__corner--br" />
        <span className="contact-hud__line contact-hud__line--h contact-hud__line--top" />
        <span className="contact-hud__line contact-hud__line--h contact-hud__line--bottom" />
        <span className="contact-hud__line contact-hud__line--v contact-hud__line--left" />
        <span className="contact-hud__line contact-hud__line--v contact-hud__line--right" />
      </div>

      {/* ── Status indicators ── */}
      <div className="contact-status" aria-hidden="true">
        <div className="contact-status__row">
          <span className="contact-status__dot" />
          <span className="contact-status__label">{t.contact.signalActive}</span>
        </div>
        <span className="contact-status__coord">27.0° N — 85.5° W</span>
      </div>

      {/* ── Data stream column ── */}
      <div className="contact-datastream" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="contact-datastream__line">
            {`0x${(Math.random() * 0xFFFF | 0).toString(16).padStart(4, '0').toUpperCase()}`}
          </span>
        ))}
      </div>

      {/* ── Grid overlay ── */}
      <div className="contact-grid-overlay" aria-hidden="true" />

      {/* Floating scramble quotes */}
      {t.contact.quotes.map((q: string, i: number) => (
        <div key={i} className="contact-quote" data-text={q}>
          {q}
        </div>
      ))}

      {/* Content grid */}
      <div className="contact-content">
        <div className="contact-panel contact-panel--info">
          <span className="contact-panel__tag">{t.contact.tag}</span>
          <h2 className="contact-panel__title">{t.contact.heading}</h2>
          <p className="contact-panel__sub">
            {t.contact.subtitle}
          </p>
          {!loading && personalInfo && (
            <div className="contact-info-list">
              <a href={`mailto:${personalInfo.email}`} className="contact-info-item">
                <FaEnvelope />
                <span>{personalInfo.email}</span>
              </a>
              <a href="tel:+50685707955" className="contact-info-item">
                <FaPhone />
                <span>+506 8570 7955</span>
              </a>
              <div className="contact-info-item">
                <FaMapMarkerAlt />
                <span>{personalInfo.location}</span>
              </div>
            </div>
          )}
        </div>

        <div className="contact-panel contact-panel--form">
          <ContactForm darkMode={true} />
        </div>
      </div>
    </section>
  );
};

export default Contact;