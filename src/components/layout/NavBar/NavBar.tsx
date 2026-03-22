import { useState } from 'react';

const navItems = [
  { name: 'Home',       href: '#hero' },
  { name: 'Skills',     href: '#skills' },
  { name: 'Projects',   href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact',    href: '#contact' },
];

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
              background: 'rgba(0,0,0,0.9)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.07)',
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
          </div>
        )}
      </div>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-10">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="nav-link text-[11px] uppercase tracking-[0.2em] font-medium"
            style={{ color: 'var(--space-text-dim)' }}
            onClick={(e) => handleClick(e, item.href)}
          >
            {item.name}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;