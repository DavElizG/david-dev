import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { usePersonalInfo } from '../../../hooks';
import { useTheme, useLanguage } from '../../../context';
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowUp } from 'react-icons/fa';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

type LenisScrollTo = { scrollTo: (target: HTMLElement | number, opts: object) => void };

const Footer = () => {
  const { personalInfo, loading } = usePersonalInfo();
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const displayName = loading ? 'David Guadamuz' : personalInfo?.name || 'David Guadamuz';
  const displayEmail = loading ? '' : personalInfo?.email || '';

  const footerRef = useRef<HTMLElement>(null);
  const splitsRef = useRef<Record<string, SplitText>>({});
  const ctxRef    = useRef<gsap.Context | null>(null);

  const getSocialUrl = (platform: string) =>
    personalInfo?.socialLinks?.find(
      (l) => l.platform.toLowerCase() === platform.toLowerCase(),
    )?.url || '#';

  const navigateTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: LenisScrollTo }).__lenis;
    if (lenis) {
      lenis.scrollTo(el, { offset: -64, duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    const lenis = (window as unknown as { __lenis?: LenisScrollTo }).__lenis;
    if (lenis) {
      lenis.scrollTo(0 as unknown as HTMLElement, { duration: 1.6 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /* ── GSAP: entrance + scroll-triggered reveal ── */
  useEffect(() => {
    if (!footerRef.current) return;
    ctxRef.current?.revert();
    const footer = footerRef.current;

    ctxRef.current = gsap.context(() => {
      /* Split every nav-row label into chars */
      footer.querySelectorAll<HTMLElement>('.footer-row__text').forEach((el) => {
        const rowId = el.dataset.rowId;
        if (!rowId) return;
        splitsRef.current[rowId] = new SplitText(el, {
          type: 'chars',
          charsClass: 'footer-char',
        });
        gsap.set(splitsRef.current[rowId].chars, {
          opacity: 0,
          filter: 'blur(10px)',
          y: 25,
        });
      });

      /* Entrance on scroll */
      ScrollTrigger.create({
        trigger: footer,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          /* HUD corners */
          gsap.fromTo('.footer-hud__corner',
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.8, stagger: 0.06, ease: 'back.out(2)' },
          );
          /* HUD lines */
          gsap.fromTo('.footer-hud__line--h',
            { scaleX: 0 },
            { scaleX: 1, duration: 1.4, stagger: 0.15, ease: 'power2.out' },
          );
          gsap.fromTo('.footer-hud__line--v',
            { scaleY: 0 },
            { scaleY: 1, duration: 1.4, stagger: 0.15, ease: 'power2.out' },
          );

          /* Nav chars stagger per row */
          navRows.forEach((row, i) => {
            const split = splitsRef.current[row.id];
            if (!split) return;
            gsap.to(split.chars, {
              opacity: 1,
              filter: 'blur(0px)',
              y: 0,
              duration: 0.7,
              stagger: 0.03,
              ease: 'power3.out',
              delay: 0.12 * i,
            });
          });

          /* Index numbers scramble in */
          footer.querySelectorAll<HTMLElement>('.footer-row__index').forEach((el, i) => {
            const original = el.dataset.original || '';
            gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.12 * i });
            gsap.to(el, {
              delay: 0.12 * i,
              duration: 0.8,
              scrambleText: {
                text: original,
                chars: '0123456789',
                revealDelay: 0.3,
                speed: 0.5,
              },
            });
          });

          /* Info panel blocks */
          gsap.fromTo('.footer-info__label',
            { opacity: 0, x: 15 },
            { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out', delay: 0.45 },
          );
          gsap.fromTo('.footer-social__link',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.55 },
          );
          gsap.fromTo('.footer-info__detail',
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.65 },
          );
          gsap.fromTo('.footer-bottom',
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.8 },
          );
        },
      });
    }, footer);

    /* Parallax on ghost watermark — mouse + touch */
    const ghost = footer.querySelector<HTMLElement>('.footer-ghost');
    const applyParallax = (clientX: number, clientY: number) => {
      if (!ghost) return;
      const rect = footer.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((clientY - rect.top) / rect.height - 0.5) * 2;
      gsap.to(ghost, {
        x: nx * 30,
        y: ny * 15,
        duration: 1,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };
    const onMouse = (e: MouseEvent) => applyParallax(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) applyParallax(t.clientX, t.clientY);
    };
    footer.addEventListener('mousemove', onMouse);
    footer.addEventListener('touchmove', onTouch, { passive: true });

    return () => {
      footer.removeEventListener('mousemove', onMouse);
      footer.removeEventListener('touchmove', onTouch);
      ctxRef.current?.revert();
      splitsRef.current = {};
    };
  }, []);

  const { darkMode } = useTheme();

  const navRows = [
    { id: 'hero',       label: t.nav.home.toUpperCase() },
    { id: 'skills',     label: t.nav.skills.toUpperCase() },
    { id: 'projects',   label: t.nav.projects.toUpperCase() },
    { id: 'experience', label: t.nav.experience.toUpperCase() },
    { id: 'contact',    label: t.nav.contact.toUpperCase() },
  ];

  /* ── Row hover handlers ── */
  const handleRowEnter = (rowId: string) => {
    const split = splitsRef.current[rowId];
    if (!split?.chars) return;

    // Per-char random y scatter — the chars fly up unique amounts
    split.chars.forEach((c) => {
      gsap.to(c, { y: -(8 + Math.random() * 18), duration: 0.35, ease: 'power2.out' });
    });

    const textEl = footerRef.current?.querySelector<HTMLElement>(`[data-row-id="${rowId}"]`);
    if (textEl) {
      const hoverColor      = darkMode ? '#fff' : '#111';
      const hoverShadow      = darkMode
        ? '0 0 40px rgba(255,255,255,0.12), 0 0 80px rgba(255,255,255,0.04)'
        : '0 0 30px rgba(0,0,0,0.08), 0 0 60px rgba(0,0,0,0.03)';
      gsap.to(textEl, {
        color: hoverColor,
        textShadow: hoverShadow,
        duration: 0.4,
      });
    }

    const indexEl = footerRef.current?.querySelector<HTMLElement>(`[data-index-id="${rowId}"]`);
    if (indexEl) {
      gsap.to(indexEl, {
        duration: 0.5,
        color: darkMode ? '#fff' : '#111',
        scrambleText: {
          text: indexEl.dataset.original || '',
          chars: '▪▫■□▬░▒▓',
          revealDelay: 0.2,
        },
      });
    }
  };

  const handleRowLeave = (rowId: string) => {
    const split = splitsRef.current[rowId];
    if (!split?.chars) return;

    gsap.to(split.chars, {
      y: 0,
      duration: 0.4,
      stagger: { amount: 0.2, from: 'start' },
      ease: 'power2.inOut',
    });

    const textEl = footerRef.current?.querySelector<HTMLElement>(`[data-row-id="${rowId}"]`);
    if (textEl) {
      gsap.to(textEl, { color: '', textShadow: 'none', duration: 0.4 });
    }

    const indexEl = footerRef.current?.querySelector<HTMLElement>(`[data-index-id="${rowId}"]`);
    if (indexEl) {
      gsap.to(indexEl, { color: '', duration: 0.3 });
    }
  };

  const handleSocialEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const span = e.currentTarget.querySelector<HTMLElement>('.footer-social__text');
    if (span) {
      gsap.to(span, {
        duration: 0.5,
        scrambleText: {
          text: span.dataset.label || '',
          chars: '■▪▌▐▬',
          revealDelay: 0.15,
          speed: 0.4,
        },
      });
    }
  };

  /* ── Render ── */
  return (
    <footer ref={footerRef} className="footer-kinetic">
      {/* Scan-line overlay */}
      <div className="footer-scanlines" aria-hidden="true" />

      {/* HUD frame */}
      <div className="footer-hud" aria-hidden="true">
        <span className="footer-hud__corner footer-hud__corner--tl" />
        <span className="footer-hud__corner footer-hud__corner--tr" />
        <span className="footer-hud__corner footer-hud__corner--bl" />
        <span className="footer-hud__corner footer-hud__corner--br" />
        <span className="footer-hud__line footer-hud__line--h footer-hud__line--top" />
        <span className="footer-hud__line footer-hud__line--h footer-hud__line--bottom" />
        <span className="footer-hud__line footer-hud__line--v footer-hud__line--left" />
        <span className="footer-hud__line footer-hud__line--v footer-hud__line--right" />
      </div>

      {/* ── Main content: two-column grid ── */}
      <div className="footer-main">
        {/* Left: nav rows */}
        <nav className="footer-nav" aria-label="Footer navigation">
          {navRows.map((row, i) => (
            <div
              key={row.id}
              className="footer-row"
              onMouseEnter={() => handleRowEnter(row.id)}
              onMouseLeave={() => handleRowLeave(row.id)}
              onTouchStart={() => handleRowEnter(row.id)}
              onTouchEnd={() => handleRowLeave(row.id)}
              onClick={() => navigateTo(row.id)}
              onKeyDown={(e) => { if (e.key === 'Enter') navigateTo(row.id); }}
              role="link"
              tabIndex={0}
            >
              <span
                className="footer-row__index"
                data-index-id={row.id}
                data-original={String(i + 1).padStart(2, '0')}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="footer-row__text"
                data-row-id={row.id}
                data-text={row.label}
              >
                {row.label}
              </span>
              <span className="footer-row__line" aria-hidden="true" />
            </div>
          ))}
        </nav>

        {/* Right: info panel */}
        <aside className="footer-info">
          {/* Social block */}
          <div className="footer-info__block">
            <span className="footer-info__label">{t.footer.social}</span>
            <div className="footer-info__links">
              <a
                href={getSocialUrl('github')}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social__link"
                onMouseEnter={handleSocialEnter}
              >
                <FaGithub className="footer-social__icon" />
                <span className="footer-social__text" data-label="GITHUB">GITHUB</span>
              </a>
              <a
                href={getSocialUrl('linkedin')}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social__link"
                onMouseEnter={handleSocialEnter}
              >
                <FaLinkedin className="footer-social__icon" />
                <span className="footer-social__text" data-label="LINKEDIN">LINKEDIN</span>
              </a>
            </div>
          </div>

          {/* Contact block */}
          <div className="footer-info__block">
            <span className="footer-info__label">{t.nav.contact}</span>
            <div className="footer-info__links">
              {displayEmail && (
                <a
                  href={`mailto:${displayEmail}`}
                  className="footer-social__link"
                  onMouseEnter={handleSocialEnter}
                >
                  <FaEnvelope className="footer-social__icon" />
                  <span className="footer-social__text" data-label="EMAIL">EMAIL</span>
                </a>
              )}
            </div>
            {displayEmail && (
              <p className="footer-info__detail">{displayEmail}</p>
            )}
          </div>

          {/* Location block */}
          {!loading && personalInfo?.location && (
            <div className="footer-info__block">
              <span className="footer-info__label">{t.hero.location}</span>
              <p className="footer-info__detail">{personalInfo.location}</p>
            </div>
          )}
        </aside>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <p className="footer-bottom__copy">&copy; {currentYear} {displayName}</p>
        <button
          className="footer-bottom__top"
          onClick={scrollToTop}
          aria-label={t.footer.backToTop}
        >
          <FaArrowUp />
          <span>TOP</span>
        </button>
      </div>

      {/* Ghost watermark — first + last name only */}
      <div className="footer-ghost" aria-hidden="true">
        {displayName.split(' ').slice(0, 2).join(' ').toUpperCase()}
      </div>
    </footer>
  );
};

export default Footer;