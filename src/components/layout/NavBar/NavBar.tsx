import { useRef, useState } from 'react';
import SoundToggle from '../../ui/SoundToggle/SoundToggle';
import ThemeToggle from '../../ui/ThemeToggle/ThemeToggle';
import LanguageToggle from '../../ui/LanguageToggle/LanguageToggle';
import { useHoverSplitText } from '../../../hooks';
import { useTheme, useLanguage } from '../../../context';

/** Desktop-only nav link with SplitText per-char hover scatter. */
const NavItem = ({
  item,
  onClick,
}: {
  item: { name: string; href: string };
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  useHoverSplitText(linkRef, { amplitude: 10, duration: 0.35 });

  return (
    <a
      ref={linkRef}
      href={item.href}
      className="nav-link text-[11px] uppercase tracking-[0.2em] font-medium"
      style={{ color: 'var(--space-text-dim)', position: 'relative', cursor: 'pointer' }}
      onClick={(e) => onClick(e, item.href)}
    >
      <span className="hover-split__text">{item.name}</span>
    </a>
  );
};

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode } = useTheme();
  const { t } = useLanguage();

  const navItems = [
    { name: t.nav.home,       href: '#hero' },
    { name: t.nav.skills,     href: '#skills' },
    { name: t.nav.projects,   href: '#projects' },
    { name: t.nav.experience, href: '#experience' },
    { name: t.nav.contact,    href: '#contact' },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (!el) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(el, { offset: -64, duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="relative">
      {/* Mobile hamburger */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 focus:outline-none"
          style={{ color: 'var(--space-text-dim)' }}
          aria-label="Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {isOpen && (
          <div
            className="absolute right-0 mt-3 w-44 rounded-sm py-2 z-50"
            style={{
              background: darkMode ? 'rgba(0,0,0,0.9)' : 'rgba(240,240,240,0.95)',
              backdropFilter: 'blur(24px)',
              border: darkMode ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.08)',
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="nav-link block px-5 py-3 text-[11px] uppercase tracking-[0.2em]"
                style={{ color: 'var(--space-text-dim)' }}
                onClick={(e) => handleClick(e, item.href)}
              >
                {item.name}
              </a>
            ))}
            <div style={{ height: '1px', background: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)', margin: '4px 20px' }} />
            <div className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SoundToggle />
                <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--space-text-dim)' }}>{t.navbar.sound}</span>
              </div>
              <div style={{ width: '1px', height: '12px', background: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.12)' }} />
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--space-text-dim)' }}>{t.navbar.theme}</span>
              </div>
            </div>
            <div style={{ height: '1px', background: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)', margin: '4px 20px' }} />
            <div className="px-5 py-3 flex justify-center">
              <LanguageToggle />
            </div>
          </div>
        )}
      </div>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-10">
        {navItems.map((item) => (
          <NavItem key={item.name} item={item} onClick={handleClick} />
        ))}

        {/* Separator + controls */}
        <div style={{ width: '1px', height: '12px', background: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)' }} />
        <SoundToggle />
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </nav>
  );
};

export default NavBar;