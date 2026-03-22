import { useState } from 'react';

const navItems = [
  { name: 'Home',       href: '#hero' },
  { name: 'Skills',     href: '#skills' },
  { name: 'Projects',   href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact',    href: '#contact' },
];

const linkBase = 'text-sm font-medium transition-colors duration-200';
const linkIdle = 'hover:text-[var(--space-accent)]';

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
    <nav className="relative" style={{ color: 'var(--space-text)' }}>
      {/* Mobile hamburger */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 focus:outline-none"
          style={{ color: 'var(--space-text)' }}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-44 rounded-lg py-2 z-50"
            style={{
              background: 'var(--space-surface)',
              border: '1px solid var(--space-border)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`${linkBase} ${linkIdle} block px-4 py-2`}
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
      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`${linkBase} ${linkIdle}`}
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